import React, {useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {useTheme, alpha} from "@mui/material/styles";
import Iconify from "src/components/common/iconify";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

// Import services
import {GetAdminUsersListServices} from "src/services/Users.Services";
import {GetAdminPaymentsListServices} from "src/services/Payments.Services";
import {GetAdminTasksListServices} from "src/services/Tasks.Services";
import {GetAdminReportsListServices} from "src/services/Reports.Services";
import {GetAdminDatesListServices} from "src/services/Dates.Services";
import {GetAdminPromptsListServices} from "src/services/Prompts.Services";
import {GetAdminGiftsListServices} from "src/services/Gift.Services";
import {GetAdminNotesListServices} from "src/services/Notes.Services";
import {GetAdminVenuesListServices} from "src/services/Venues.Services";

const CATEGORIES = [
	{label: "All", value: "All", icon: "solar:globus-linear"},
	{label: "Users", value: "Users", icon: "solar:user-bold-duotone"},
	{label: "Payments", value: "Payments", icon: "solar:card-bold-duotone"},
	{label: "Tasks", value: "Tasks", icon: "solar:checklist-minimalistic-bold-duotone"},
	{label: "Safety Queue", value: "Safety Queue", icon: "solar:shield-warning-bold-duotone"},
	{label: "Dates", value: "Dates", icon: "solar:calendar-date-bold-duotone"},
	{label: "Questions", value: "Questions", icon: "solar:document-text-bold-duotone"},
	{label: "Gifts", value: "Gifts", icon: "solar:gift-bold-duotone"},
	{label: "Notes", value: "Notes", icon: "solar:notes-bold-duotone"},
	{label: "Venues", value: "Venues", icon: "solar:buildings-2-bold-duotone"},
];

export default function GlobalSearch({open, onClose}) {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [searching, setSearching] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [activeFilter, setActiveFilter] = useState(null);

	const handleClose = () => {
		setQuery("");
		setResults([]);
		setSelectedIndex(0);
		setSearching(false);
		setActiveFilter(null);
		onClose();
	};

	const handleQueryChange = (e) => {
		const val = e.target.value;
		setQuery(val);
		if (val.trim().length >= 2) {
			setSearching(true);
		} else {
			setSearching(false);
			setResults([]);
		}
	};

	const handleTabChange = (event, newValue) => {
		setActiveFilter(newValue === "All" ? null : newValue);
		if (query.trim().length >= 2) {
			setSearching(true);
		}
	};

	useEffect(() => {
		if (query.trim().length < 2) {
			return;
		}

		const delayDebounceFn = setTimeout(() => {
			const q = query.trim();
			const fetchPromises = [];

			// Conditionally push API promises based on activeFilter
			if (!activeFilter || activeFilter === "Users") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminUsersListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.users || [] : []).map((item) => ({
										id: `user-${item.id}`,
										category: "Users",
										title: item.name || "Unknown User",
										description: `${item.email || "No Email"} • ID: ${item.id}`,
										icon: "solar:user-bold-duotone",
										color: theme.palette.primary.main,
										path: `/user/details?id=${item.id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Payments") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminPaymentsListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.payments || [] : []).map((item) => ({
										id: `payment-${item.id}`,
										category: "Payments",
										title: item.payment_intent_id || `ID: ${item.id}`,
										description: `${item.amount_received} ${item.currency?.toUpperCase()} • User: ${item.user?.name || "N/A"}`,
										icon: "solar:card-bold-duotone",
										color: theme.palette.success.main,
										path: `/payments?search=${item.id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Tasks") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminTasksListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.tasks || [] : []).map((item) => ({
										id: `task-${item.task_id}`,
										category: "Tasks",
										title: item.title,
										description: `Priority: ${item.priority_label || "N/A"} • Status: ${item.status_label || "N/A"}`,
										icon: "solar:checklist-minimalistic-bold-duotone",
										color: theme.palette.info.main,
										path: `/tasks/details?id=${item.task_id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Safety Queue") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminReportsListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.reports || [] : []).map((item) => ({
										id: `report-${item.id}`,
										category: "Safety Queue",
										title: item.report_type?.name || "Report",
										description: `Reporter: ${item.reporter_user?.name || "N/A"} • Reported: ${item.reported_user?.name || "N/A"}`,
										icon: "solar:shield-warning-bold-duotone",
										color: theme.palette.error.main,
										path: `/user-reports/details?id=${item.id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Dates") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminDatesListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.dates || [] : []).map((item) => ({
										id: `date-${item.id}`,
										category: "Dates",
										title: item.host?.name && item.invitee?.name ? `${item.host?.name} & ${item.invitee?.name}` : "Date Event",
										description: `Venue: ${item.venue?.name || "N/A"} • Status: ${item.status || "N/A"}`,
										icon: "solar:calendar-date-bold-duotone",
										color: theme.palette.warning.main,
										path: `/dates/details?id=${item.id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Questions") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminPromptsListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.prompts || [] : []).map((item) => ({
										id: `prompt-${item.id}`,
										category: "Questions",
										title: item.question,
										description: `Sort Order: ${item.sort_order || 0} • Status: ${item.is_active ? "Active" : "Inactive"}`,
										icon: "solar:document-text-bold-duotone",
										color: "#8b5cf6",
										path: `/questions?search=${encodeURIComponent(item.question)}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Gifts") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminGiftsListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.gifts || [] : []).map((item) => ({
										id: `gift-${item.id}`,
										category: "Gifts",
										title: item.name,
										description: `Cost: ${item.spark_cost || 0} Sparks • Type: ${item.type || "N/A"}`,
										icon: "solar:gift-bold-duotone",
										color: theme.palette.secondary.main,
										path: `/gifts/details?id=${item.id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Notes") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminNotesListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.notes || [] : []).map((item) => ({
										id: `note-${item.id}`,
										category: "Notes",
										title: item.title,
										description: `Target: ${item.target_type || "N/A"} • Created At: ${item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}`,
										icon: "solar:notes-bold-duotone",
										color: "#6366f1",
										path: `/notes?search=${encodeURIComponent(item.title)}`,
									})),
								);
							}),
						);
					}),
				);
			}

			if (!activeFilter || activeFilter === "Venues") {
				fetchPromises.push(
					new Promise((resolve) => {
						dispatch(
							GetAdminVenuesListServices({search: q, per_page: 5}, (res) => {
								resolve(
									(res?.success ? res.data?.venues || [] : []).map((item) => ({
										id: `venue-${item.id}`,
										category: "Venues",
										title: item.name,
										description: `${item.address || "No Address"} • Capacity: ${item.capacity || "N/A"}`,
										icon: "solar:buildings-2-bold-duotone",
										color: "#eab308",
										path: `/venues/details?id=${item.id}`,
									})),
								);
							}),
						);
					}),
				);
			}

			Promise.all(fetchPromises).then((groupedResults) => {
				const flat = groupedResults.flat();
				setResults(flat);
				setSelectedIndex(0);
				setSearching(false);
			});
		}, 400);

		return () => clearTimeout(delayDebounceFn);
	}, [query, activeFilter, dispatch, theme]);

	const handleKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
		} else if (e.key === "Enter" && results.length > 0) {
			e.preventDefault();
			handleSelect(results[selectedIndex]);
		}
	};

	const handleSelect = (item) => {
		handleClose();
		navigate(item.path);
	};

	// Group results by category
	const groupedResults = results.reduce((acc, item) => {
		if (!acc[item.category]) acc[item.category] = [];
		acc[item.category].push(item);
		return acc;
	}, {});

	let currentIndex = 0;

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: {
					borderRadius: 3,
					boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
					overflow: "hidden",
					bgcolor: "background.paper",
					m: 2,
					alignSelf: "flex-start",
					mt: {xs: 2, md: 10},
				},
			}}>
			<Box sx={{p: 2, borderBottom: 1, borderColor: "divider"}}>
				<TextField
					fullWidth
					autoFocus
					placeholder={activeFilter ? `Search in ${activeFilter}...` : "Search users, payments, tasks, dates, questions..."}
					value={query}
					onChange={handleQueryChange}
					onKeyDown={handleKeyDown}
					variant="standard"
					InputProps={{
						disableUnderline: true,
						startAdornment: (
							<InputAdornment position="start">
								<Iconify icon="solar:rounded-magnifer-linear" width={24} sx={{color: "text.disabled", mr: 1}} />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position="end" sx={{gap: 1}}>
								{searching && <CircularProgress size={16} color="primary" />}
								{query && (
									<IconButton
										size="small"
										onClick={() => {
											setQuery("");
											setResults([]);
											setSearching(false);
										}}>
										<Iconify icon="solar:close-circle-bold" width={20} />
									</IconButton>
								)}
								<Chip
									label="ESC"
									size="small"
									sx={{
										borderRadius: 1,
										fontWeight: 600,
										color: "text.secondary",
									}}
								/>
							</InputAdornment>
						),
						sx: {fontSize: "1.1rem", fontWeight: 500},
					}}
				/>
			</Box>

			<Box
				sx={{
					px: 2.5,
					py: 1.75,
					borderBottom: 1,
					borderColor: "divider",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 1,
					bgcolor: "background.paper",
				}}>
				{CATEGORIES.map((cat) => {
					const isSelected = (activeFilter || "All") === cat.value;
					return (
						<Box
							key={cat.value}
							onClick={(e) => handleTabChange(e, cat.value)}
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: 0.75,
								px: 2,
								py: 0.85,
								borderRadius: "20px",
								cursor: "pointer",
								typography: "subtitle2",
								fontWeight: isSelected ? 600 : 500,
								fontSize: "0.825rem",
								whiteSpace: "nowrap",
								userSelect: "none",
								transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
								...(isSelected
									? {
											bgcolor: "primary.main",
											color: "primary.contrastText",
											boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
											transform: "translateY(-1px)",
										}
									: {
											bgcolor: alpha(theme.palette.divider, 0.05),
											color: "text.secondary",
											"&:hover": {
												bgcolor: alpha(theme.palette.primary.main, 0.08),
												color: "primary.main",
												transform: "translateY(-1px)",
												"& .MuiSvgIcon-root": {
													color: "primary.main",
												},
											},
										}),
							}}>
							<Iconify
								icon={cat.icon}
								width={14}
								sx={{
									color: isSelected ? "inherit" : "text.secondary",
									transition: "color 0.2s",
								}}
							/>
							{cat.label}
						</Box>
					);
				})}
			</Box>

			<DialogContent sx={{p: 0, maxHeight: "60vh", overflowY: "auto"}}>
				{query.trim().length < 2 ? (
					<Box sx={{p: 5, textAlign: "center"}}>
						<Iconify icon="solar:magnifer-linear" width={48} sx={{color: "text.disabled", mb: 2, opacity: 0.5}} />
						<Typography variant="body1" color="text.secondary" fontWeight={500}>
							{activeFilter ? `Type at least 2 characters to search in ${activeFilter}` : "Type at least 2 characters to search across all modules"}
						</Typography>
						{activeFilter && (
							<Button variant="text" color="primary" size="small" onClick={() => setActiveFilter(null)} sx={{mt: 2}} startIcon={<Iconify icon="solar:close-circle-bold" width={16} />}>
								Clear filter and search all
							</Button>
						)}
					</Box>
				) : results.length === 0 && !searching ? (
					<Box sx={{p: 5, textAlign: "center"}}>
						<Typography variant="body1" color="text.secondary">
							No results found for "<strong>{query}</strong>"{activeFilter ? ` in ${activeFilter}` : ""}
						</Typography>
						{activeFilter && (
							<Button variant="text" color="primary" size="small" onClick={() => setActiveFilter(null)} sx={{mt: 2}} startIcon={<Iconify icon="solar:close-circle-bold" width={16} />}>
								Clear filter to search all modules
							</Button>
						)}
					</Box>
				) : (
					<List disablePadding sx={{pb: 1}}>
						{Object.entries(groupedResults).map(([category, items]) => (
							<Box key={category}>
								<Typography
									variant="overline"
									sx={{
										px: 3,
										py: 1,
										display: "block",
										color: "text.secondary",
										fontWeight: 700,
										bgcolor: alpha(theme.palette.background.default, 0.7),
										borderBottom: `1px solid ${theme.palette.divider}`,
										borderTop: `1px solid ${theme.palette.divider}`,
									}}>
									{category} ({items.length})
								</Typography>
								{items.map((item) => {
									const isSelected = currentIndex === selectedIndex;
									const itemIndex = currentIndex++;

									return (
										<ListItemButton
											key={item.id}
											selected={isSelected}
											onClick={() => handleSelect(item)}
											onMouseEnter={() => setSelectedIndex(itemIndex)}
											sx={{
												px: 3,
												py: 1.5,
												"&.Mui-selected": {bgcolor: alpha(item.color, 0.08)},
												"&.Mui-selected:hover": {
													bgcolor: alpha(item.color, 0.12),
												},
											}}>
											<ListItemIcon>
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: 2,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														bgcolor: alpha(item.color, 0.1),
														color: item.color,
													}}>
													<Iconify icon={item.icon} width={24} />
												</Box>
											</ListItemIcon>
											<ListItemText
												primary={item.title}
												secondary={item.description}
												primaryTypographyProps={{
													fontWeight: 600,
													color: isSelected ? item.color : "text.primary",
												}}
												secondaryTypographyProps={{
													variant: "caption",
													mt: 0.5,
												}}
											/>
											{isSelected && <Iconify icon="solar:arrow-right-linear" width={20} sx={{color: item.color}} />}
										</ListItemButton>
									);
								})}
							</Box>
						))}
					</List>
				)}
			</DialogContent>

			<Box
				sx={{
					p: 1.5,
					borderTop: 1,
					borderColor: "divider",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					bgcolor: alpha(theme.palette.background.default, 0.5),
				}}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Chip label="↑↓" size="small" sx={{borderRadius: 1, height: 20, fontSize: "0.7rem"}} />
						<Typography variant="caption" color="text.secondary">
							to navigate
						</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Chip label="Enter" size="small" sx={{borderRadius: 1, height: 20, fontSize: "0.7rem"}} />
						<Typography variant="caption" color="text.secondary">
							to select
						</Typography>
					</Stack>
				</Stack>
				<Typography variant="caption" color="primary.main" fontWeight={600}>
					DayteMe Admin Search
				</Typography>
			</Box>
		</Dialog>
	);
}
