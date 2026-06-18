import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {MenuItem, Select} from "@mui/material";

const CustomPagination = ({
	current,
	total,
	pageSize,
	onChange,
	onShowSizeChange,
	// ...props
}) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				px: 1.5,
				pb: 1.5,
			}}>
			{/* Left side - Entry info and basic pagination */}
			<Box sx={{display: "flex", alignItems: "center", gap: 2}}>
				<Typography variant="body2" color="text.secondary" sx={{fontWeight: 500}}>
					Showing {total > 0 ? (current - 1) * pageSize + 1 : 0} to {Math.min(current * pageSize, total)} of {total} entries
				</Typography>
			</Box>

			{/* Right side - Custom pagination layout */}
			<Box sx={{display: "flex", alignItems: "center", gap: 2}}>
				<Typography variant="body2">
					Page {current} of {Math.max(1, Math.ceil(total / pageSize))}
				</Typography>

				{/* Custom pagination controls */}
				<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
					{/* Previous button */}
					<Button
						variant={current === 1 ? "outlined" : "contained"}
						size="small"
						disabled={current === 1}
						onClick={() => onChange(current - 1, pageSize)}
						color="primary"
						sx={{
							minWidth: "32px",
							height: "32px",
							p: 0,
							borderRadius: "60px",
						}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"
							/>
						</svg>
					</Button>

					{/* Next button */}
					<Button
						variant={current >= Math.ceil(total / pageSize) ? "outlined" : "contained"}
						size="small"
						color="primary"
						disabled={current >= Math.ceil(total / pageSize)}
						onClick={() => onChange(current + 1, pageSize)}
						sx={{
							minWidth: "32px",
							height: "32px",
							p: 0,
							borderRadius: "60px",
						}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
							<path fill="currentColor" d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82" />
						</svg>
					</Button>
				</Box>

				{/* Page size selector */}
				<Box sx={{display: "flex", alignItems: "center"}}>
					<Select
						size="small"
						value={pageSize}
						// onChange={(e) => onShowSizeChange(current, Number(e.target.value))}
						onChange={(e) => onShowSizeChange(1, Number(e.target.value))}
						sx={{
							height: 36,
							borderRadius: 2,
							minWidth: 100,
						}}>
						<MenuItem value={1}>1 / page</MenuItem>
						<MenuItem value={10}>10 / page</MenuItem>
						<MenuItem value={20}>20 / page</MenuItem>
						<MenuItem value={50}>50 / page</MenuItem>
						<MenuItem value={100}>100 / page</MenuItem>
					</Select>
				</Box>
			</Box>
		</Box>
	);
};

CustomPagination.propTypes = {
	current: PropTypes.number,
	total: PropTypes.number.isRequired,
	pageSize: PropTypes.number,
	showSizeChanger: PropTypes.bool,
	showQuickJumper: PropTypes.bool,
	showTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
	onChange: PropTypes.func,
	onShowSizeChange: PropTypes.func,
	size: PropTypes.oneOf(["default", "small"]),
	simple: PropTypes.bool,
	disabled: PropTypes.bool,
	hideOnSinglePage: PropTypes.bool,
	responsive: PropTypes.bool,
	className: PropTypes.string,
	style: PropTypes.object,
};

CustomPagination.defaultProps = {
	current: 1,
	pageSize: 10,
	showSizeChanger: true,
	showQuickJumper: true,
	showTotal: true,
	size: "default",
	simple: false,
	disabled: false,
	hideOnSinglePage: false,
	responsive: true,
	className: "",
	style: {},
};

export default CustomPagination;
