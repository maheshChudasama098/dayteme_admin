import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {alpha, useTheme} from "@mui/material/styles";
import {Table} from "antd";

import Iconify from "src/components/common/iconify";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import {CustomActionIconButton} from "src/components/common/CustomActionIconButton";
import {sweetAlertQuestion, sweetAlerts, sweetAlertSuccess} from "src/utils/sweet-alerts";
import {getErrorMessage} from "src/utils/utils";

import {
	GetAdminPermissionsServices,
	GetAdminRolesServices,
	DeleteAdminRoleServices
} from "src/services/Roles.Services";

import RoleModel from "./RoleModel";
import RoleViewModel from "./RoleViewModel";

const RolesPermissions = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [currentTab, setCurrentTab] = useState("roles");
	const [rolesList, setRolesList] = useState([]);
	const [permissionsList, setPermissionsList] = useState([]);
	
	const [loadingRoles, setLoadingRoles] = useState(true);
	const [loadingPermissions, setLoadingPermissions] = useState(true);
	const [apiFlag, setApiFlag] = useState(false);

	// Search values
	const [searchRoles, setSearchRoles] = useState("");
	const [searchPermissions, setSearchPermissions] = useState("");

	// Modals State
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [selectedRoleData, setSelectedRoleData] = useState(null);

	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedViewRoleId, setSelectedViewRoleId] = useState(null);

	// Fetch Permissions List
	useEffect(() => {
		dispatch(
			GetAdminPermissionsServices((res) => {
				setLoadingPermissions(false);
				if (res?.success) {
					setPermissionsList(res?.data?.permissions || res?.data || []);
				} else {
					sweetAlerts("error", getErrorMessage(res) || "Failed to fetch permissions.");
				}
			})
		);
	}, [dispatch]);

	// Fetch Roles List
	useEffect(() => {
		Promise.resolve().then(() => {
			setLoadingRoles(true);
		});
		dispatch(
			GetAdminRolesServices((res) => {
				setLoadingRoles(false);
				if (res?.success) {
					setRolesList(res?.data?.roles || res?.data || []);
				} else {
					sweetAlerts("error", getErrorMessage(res) || "Failed to fetch roles.");
				}
			})
		);
	}, [dispatch, apiFlag]);

	// Handle Delete Role
	const handleDeleteRole = (id, name, isSystem) => {
		if (isSystem) {
			sweetAlerts("error", "System roles cannot be deleted.");
			return;
		}

		sweetAlertQuestion(
			`Are you sure you want to delete the role "${name}"? This action cannot be undone.`,
			"Delete Role?"
		)
			.then((result) => {
				if (result) {
					dispatch(
						DeleteAdminRoleServices(id, (res) => {
							if (res?.success) {
								setApiFlag(!apiFlag);
								sweetAlertSuccess("Role deleted successfully.");
							} else {
								sweetAlerts("error", getErrorMessage(res));
							}
						})
					);
				}
			})
			.catch((error) => {
				console.error("Delete Error: ", error);
			});
	};

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	// Local filtering for Roles
	const filteredRoles = rolesList.filter((role) => {
		const searchLower = searchRoles.toLowerCase();
		const nameMatch = role.name?.toLowerCase().includes(searchLower);
		const descMatch = role.description?.toLowerCase().includes(searchLower);
		const permissionsMatch = role.permissions?.some((p) =>
			p.name?.toLowerCase().includes(searchLower)
		);
		return nameMatch || descMatch || permissionsMatch;
	});

	// Local filtering for Permissions
	const filteredPermissions = permissionsList.filter((perm) => {
		const searchLower = searchPermissions.toLowerCase();
		const nameMatch = perm.name?.toLowerCase().includes(searchLower);
		const slugMatch = perm.slug?.toLowerCase().includes(searchLower);
		const descMatch = perm.description?.toLowerCase().includes(searchLower);
		return nameMatch || slugMatch || descMatch;
	});

	// Roles Columns
	const rolesColumns = [
		{
			title: "Role Name",
			dataIndex: "name",
			key: "name",
			width: 200,
			render: (_, record) => {
				const isSystem = record.is_system || record.system;
				return (
					<Stack spacing={0.5}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography variant="subtitle2" color="text.primary" fontWeight={700}>
								{record.name}
							</Typography>
							{isSystem && (
								<Chip
									label="System"
									size="small"
									color="warning"
									sx={{
										height: 18,
										fontSize: "0.65rem",
										fontWeight: 800,
										borderRadius: 1,
									}}
								/>
							)}
						</Stack>
						<Typography variant="caption" color="text.secondary">
							<code>{record.slug || record.name?.toLowerCase().replace(/\s+/g, "_")}</code>
						</Typography>
					</Stack>
				);
			},
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: 300,
			ellipsis: true,
			render: (desc) => (
				<Typography variant="body2" color="text.secondary">
					{desc || <Box sx={{fontStyle: "italic", color: "text.disabled"}}>No description</Box>}
				</Typography>
			),
		},
		{
			title: "Permissions",
			key: "permissions",
			width: 350,
			render: (_, record) => {
				const perms = record.permissions || [];
				if (perms.length === 0) {
					return (
						<Typography variant="caption" color="text.disabled" sx={{fontStyle: "italic"}}>
							No permissions assigned
						</Typography>
					);
				}

				const displayLimit = 3;
				const sliced = perms.slice(0, displayLimit);
				const remaining = perms.length - displayLimit;

				return (
					<Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{gap: 0.5}}>
						{sliced.map((p) => (
							<Chip
								key={p.id}
								label={p.name}
								size="small"
								sx={{
									bgcolor: alpha(theme.palette.primary.main, 0.06),
									color: "primary.main",
									fontSize: "0.72rem",
									fontWeight: 600,
									height: 22,
								}}
							/>
						))}
						{remaining > 0 && (
							<Tooltip title={perms.slice(displayLimit).map((p) => p.name).join(", ")}>
								<Chip
									label={`+${remaining} more`}
									size="small"
									color="secondary"
									variant="outlined"
									sx={{
										fontSize: "0.72rem",
										fontWeight: 700,
										height: 22,
										cursor: "help",
									}}
								/>
							</Tooltip>
						)}
					</Stack>
				);
			},
		},
		{
			title: "Actions",
			key: "action",
			fixed: "right",
			align: "center",
			width: 150,
			render: (_, record) => {
				const isSystem = record.is_system || record.system;
				return (
					<Stack spacing={1} direction="row" sx={{justifyContent: "center"}}>
						<CustomActionIconButton
							tooltip="View Role"
							color="info"
							onClick={() => {
								setSelectedViewRoleId(record.id);
								setIsViewModalOpen(true);
							}}
						>
							<Iconify icon="solar:eye-bold-duotone" width={16} />
						</CustomActionIconButton>

						<CustomActionIconButton
							tooltip="Edit Role"
							color="primary"
							onClick={() => {
								setSelectedRoleData(record);
								setIsRoleModalOpen(true);
							}}
						>
							<Iconify icon="solar:pen-bold-duotone" width={16} />
						</CustomActionIconButton>

						<CustomActionIconButton
							tooltip={isSystem ? "System role cannot be deleted" : "Delete Role"}
							color={isSystem ? "inherit" : "error"}
							disabled={isSystem}
							onClick={() => {
								if (!isSystem) {
									handleDeleteRole(record.id, record.name, isSystem);
								}
							}}
							sx={{
								...(isSystem && {
									opacity: 0.4,
									bgcolor: "action.disabledBackground",
									color: "text.disabled",
								}),
							}}
						>
							<Iconify icon="solar:trash-bin-trash-bold-duotone" width={16} />
						</CustomActionIconButton>
					</Stack>
				);
			},
		},
	];

	// Permissions Columns
	const permissionsColumns = [
		{
			title: "Permission Name",
			dataIndex: "name",
			key: "name",
			width: 250,
			render: (_, record) => (
				<Stack spacing={0.5}>
					<Typography variant="subtitle2" color="text.primary" fontWeight={700}>
						{record.name}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						<code>{record.slug || record.name?.toLowerCase().replace(/\s+/g, "_")}</code>
					</Typography>
				</Stack>
			),
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: 450,
			render: (desc) => (
				<Typography variant="body2" color="text.secondary">
					{desc || <Box sx={{fontStyle: "italic", color: "text.disabled"}}>No description available</Box>}
				</Typography>
			),
		},
		{
			title: "Module / Category",
			dataIndex: "module",
			key: "module",
			width: 180,
			render: (module) => (
				<Chip
					label={module || "System"}
					size="small"
					variant="outlined"
					sx={{
						textTransform: "capitalize",
						fontWeight: 600,
					}}
				/>
			),
		},
	];

	return (
		<Stack spacing={4}>
			{/* Header */}
			<Stack
				spacing={2}
				direction={{xs: "column", md: "row"}}
				sx={{justifyContent: "space-between", alignItems: {xs: "flex-start", md: "center"}}}
			>
				<Box>
					<Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
						Roles & Permissions
					</Typography>
					<Typography variant="body2" sx={{color: "text.secondary"}}>
						Configure security roles, access policies, and system capabilities.
					</Typography>
				</Box>

				{currentTab === "roles" && (
					<Button
						color="primary"
						variant="contained"
						startIcon={<Iconify icon="solar:shield-keyhole-bold" width={20} />}
						onClick={() => {
							setSelectedRoleData(null);
							setIsRoleModalOpen(true);
						}}
					>
						Add Role
					</Button>
				)}
			</Stack>

			{/* Tabs Section */}
			<Card sx={{p: 1}}>
				<Tabs
					value={currentTab}
					onChange={handleTabChange}
					sx={{
						"& .MuiTab-root": {fontWeight: 600, textTransform: "none"},
					}}
				>
					<Tab
						label="Roles"
						value="roles"
						icon={<Iconify icon="solar:shield-user-bold-duotone" width={20} />}
						iconPosition="start"
					/>
					<Tab
						label="Permissions"
						value="permissions"
						icon={<Iconify icon="solar:shield-check-bold-duotone" width={20} />}
						iconPosition="start"
					/>
				</Tabs>
			</Card>

			{/* Tab Panel contents */}
			{currentTab === "roles" ? (
				<Card>
					<Stack spacing={2}>
						{/* Search for Roles */}
						<Box sx={{m: 2, px: 2, pt: 2}}>
							<CustomSearchInput
								loading={loadingRoles}
								defaultValue={searchRoles}
								callBack={setSearchRoles}
								placeholder="Search roles by name or description..."
								width={{xs: "100%", md: 400}}
							/>
						</Box>

						{/* Roles Table */}
						<Table
							className="custom-ant-table"
							showSorterTooltip={false}
							columns={
								!loadingRoles
									? rolesColumns
									: rolesColumns.map((col) => ({
											...col,
											render: () => (
												<Skeleton
													variant="rounded"
													animation="wave"
													sx={{width: "100%", height: 32, borderRadius: 1}}
												/>
											),
									  }))
							}
							dataSource={
								!loadingRoles
									? filteredRoles
									: [...Array(5)].map((_, i) => ({key: i}))
							}
							scroll={{x: "max-content"}}
							pagination={false}
							rowKey="id"
						/>
					</Stack>
				</Card>
			) : (
				<Card>
					<Stack spacing={2}>
						{/* Search for Permissions */}
						<Box sx={{m: 2, px: 2, pt: 2}}>
							<CustomSearchInput
								loading={loadingPermissions}
								defaultValue={searchPermissions}
								callBack={setSearchPermissions}
								placeholder="Search permissions by name, slug or description..."
								width={{xs: "100%", md: 400}}
							/>
						</Box>

						{/* Permissions Table */}
						<Table
							className="custom-ant-table"
							showSorterTooltip={false}
							columns={
								!loadingPermissions
									? permissionsColumns
									: permissionsColumns.map((col) => ({
											...col,
											render: () => (
												<Skeleton
													variant="rounded"
													animation="wave"
													sx={{width: "100%", height: 32, borderRadius: 1}}
												/>
											),
									  }))
							}
							dataSource={
								!loadingPermissions
									? filteredPermissions
									: [...Array(5)].map((_, i) => ({key: i}))
							}
							scroll={{x: "max-content"}}
							pagination={false}
							rowKey="id"
						/>
					</Stack>
				</Card>
			)}

			{/* Add/Edit Role Modal */}
			{isRoleModalOpen && (
				<RoleModel
					open={isRoleModalOpen}
					data={selectedRoleData}
					permissionsList={permissionsList}
					handleClose={() => {
						setIsRoleModalOpen(false);
						setSelectedRoleData(null);
					}}
					cdSuccess={() => {
						setApiFlag(!apiFlag);
						setIsRoleModalOpen(false);
						setSelectedRoleData(null);
					}}
				/>
			)}

			{/* View Role Modal */}
			{isViewModalOpen && (
				<RoleViewModel
					open={isViewModalOpen}
					roleId={selectedViewRoleId}
					handleClose={() => {
						setIsViewModalOpen(false);
						setSelectedViewRoleId(null);
					}}
				/>
			)}
		</Stack>
	);
};

export default RolesPermissions;
