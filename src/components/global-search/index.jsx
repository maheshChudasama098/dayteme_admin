import React, { useState, useEffect, useRef } from "react";
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
import { useTheme, alpha } from "@mui/material/styles";
import Iconify from "src/components/common/iconify";
import { useNavigate } from "react-router-dom";

// Mock global search data
const mockSearchData = [
	{ id: "u1", category: "Users", title: "Mahesh Chudasama", description: "mahesh@example.com • User ID: 98721", icon: "solar:user-bold", color: "#6C4CF1", path: "/users" },
	{ id: "u2", category: "Users", title: "Mahesh Patel", description: "+91 9876543210 • Verified", icon: "solar:user-check-bold", color: "#6C4CF1", path: "/users" },
	{ id: "p1", category: "Payments", title: "PAY-8829-MAHESH", description: "$45.00 • Premium Subscription", icon: "solar:wallet-money-bold", color: "#10b981", path: "/payments" },
	{ id: "e1", category: "Events", title: "Speed Dating - Mumbai", description: "Hosted by Mahesh • 45 attendees", icon: "solar:ticket-bold", color: "#f43f5e", path: "/events" },
	{ id: "v1", category: "Venues", title: "Mahesh's Lounge", description: "Premium Partner • 4.8 Rating", icon: "solar:map-point-bold", color: "#f59e0b", path: "/venues" },
	{ id: "s1", category: "Safety Reports", title: "REP-4921", description: "Reported by Mahesh P. • High Priority", icon: "solar:danger-triangle-bold", color: "#ef4444", path: "/safety" },
	{ id: "c1", category: "Verification Cases", title: "VER-902", description: "Mahesh C. • Pending Manual Review", icon: "solar:shield-check-bold", color: "#8b5cf6", path: "/verification" },
	{ id: "d1", category: "Dates", title: "Date #4021", description: "Mahesh & Priya • Scheduled for Tomorrow", icon: "solar:calendar-date-bold", color: "#0ea5e9", path: "/dates" },
];

export default function GlobalSearch({ open, onClose }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		if (!open) {
			setQuery("");
			setResults([]);
			setSelectedIndex(0);
		}
	}, [open]);

	useEffect(() => {
		if (query.length > 0) {
			const lowerQuery = query.toLowerCase();
			const filtered = mockSearchData.filter(
				(item) =>
					item.title.toLowerCase().includes(lowerQuery) ||
					item.description.toLowerCase().includes(lowerQuery) ||
					item.category.toLowerCase().includes(lowerQuery)
			);
			setResults(filtered);
			setSelectedIndex(0);
		} else {
			setResults([]);
		}
	}, [query]);

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
		onClose();
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
			onClose={onClose}
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
					mt: { xs: 2, md: 10 },
				},
			}}
		>
			<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
				<TextField
					fullWidth
					autoFocus
					placeholder="Search users, events, payments, venues..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					variant="standard"
					InputProps={{
						disableUnderline: true,
						startAdornment: (
							<InputAdornment position="start">
								<Iconify icon="solar:rounded-magnifer-linear" width={24} sx={{ color: "text.disabled", mr: 1 }} />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position="end">
								{query && (
									<IconButton size="small" onClick={() => setQuery("")}>
										<Iconify icon="solar:close-circle-bold" width={20} />
									</IconButton>
								)}
								<Chip label="ESC" size="small" sx={{ ml: 1, borderRadius: 1, fontWeight: 600, color: "text.secondary" }} />
							</InputAdornment>
						),
						sx: { fontSize: "1.1rem", fontWeight: 500 },
					}}
				/>
			</Box>

			<DialogContent sx={{ p: 0, maxHeight: "60vh", overflowY: "auto" }}>
				{query.length === 0 ? (
					<Box sx={{ p: 5, textAlign: "center" }}>
						<Iconify icon="solar:magnifer-linear" width={48} sx={{ color: "text.disabled", mb: 2, opacity: 0.5 }} />
						<Typography variant="body1" color="text.secondary" fontWeight={500}>
							Start typing to search across the platform
						</Typography>
						<Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}>
							{["Users", "Payments", "Events", "Reports"].map((term) => (
								<Chip key={term} label={term} onClick={() => setQuery(term)} sx={{ cursor: "pointer", '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" } }} />
							))}
						</Stack>
					</Box>
				) : results.length === 0 ? (
					<Box sx={{ p: 5, textAlign: "center" }}>
						<Typography variant="body1" color="text.secondary">
							No results found for "<strong>{query}</strong>"
						</Typography>
					</Box>
				) : (
					<List disablePadding>
						{Object.entries(groupedResults).map(([category, items]) => (
							<Box key={category} sx={{ mb: 1 }}>
								<Typography variant="overline" sx={{ px: 3, py: 1.5, display: "block", color: "text.secondary", fontWeight: 700, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
									{category}
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
												'&.Mui-selected': { bgcolor: alpha(item.color, 0.08) },
												'&.Mui-selected:hover': { bgcolor: alpha(item.color, 0.12) },
											}}
										>
											<ListItemIcon>
												<Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(item.color, 0.1), color: item.color }}>
													<Iconify icon={item.icon} width={24} />
												</Box>
											</ListItemIcon>
											<ListItemText
												primary={item.title}
												secondary={item.description}
												primaryTypographyProps={{ fontWeight: 600, color: isSelected ? item.color : "text.primary" }}
												secondaryTypographyProps={{ variant: "caption", mt: 0.5 }}
											/>
											{isSelected && <Iconify icon="solar:arrow-right-linear" width={20} sx={{ color: item.color }} />}
										</ListItemButton>
									);
								})}
							</Box>
						))}
					</List>
				)}
			</DialogContent>
			
			<Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: alpha(theme.palette.background.default, 0.5) }}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Chip label="↑↓" size="small" sx={{ borderRadius: 1, height: 20, fontSize: '0.7rem' }} />
						<Typography variant="caption" color="text.secondary">to navigate</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Chip label="Enter" size="small" sx={{ borderRadius: 1, height: 20, fontSize: '0.7rem' }} />
						<Typography variant="caption" color="text.secondary">to select</Typography>
					</Stack>
				</Stack>
				<Typography variant="caption" color="primary.main" fontWeight={600}>DayteMe Admin Search</Typography>
			</Box>
		</Dialog>
	);
}
