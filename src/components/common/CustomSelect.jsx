import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";

import {useTheme} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

const CustomSelect = ({defaultValue, label, menuList, valueKey, labelKey, callBackAction, customMenuList, ...props}) => {
	const theme = useTheme();
	const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");

	useEffect(() => {
		function fun() {
			setSelectedValue(defaultValue ?? "");
		}
		fun();
	}, [defaultValue]);

	const handleChange = (event) => {
		const selectedId = event.target.value;
		setSelectedValue(selectedId);

		if (typeof callBackAction === "function") {
			callBackAction(selectedId);
		}
	};

	return (
		<FormControl>
			<Select
				label={label}
				value={selectedValue}
				onChange={handleChange}
				displayEmpty
				IconComponent={() => null} // remove default dropdown icon
				startAdornment={
					<FilterListRoundedIcon
						sx={{
							fontSize: "16px",
							mr: 1,
						}}
					/>
				}
				MenuProps={{
					PaperProps: {
						sx: {
							background: theme?.palette?.background.paper,
							// border: `1px solid ${selectedValue !== -1 ? theme.palette.primary.main : theme.background.paper}`,
							overflow: "hidden",
						},
					},
					MenuListProps: {
						sx: {
							p: 0,
							background: theme?.palette?.background.paper,
						},
					},
				}}
				sx={{
					borderRadius: 2.5,
					border: `1px solid ${selectedValue !== -1 ? theme?.palette.primary.main : theme?.palette.grey[300]}`,
					color: selectedValue !== -1 ? theme?.palette.primary.main : theme?.palette.text.primary,
					background: theme?.palette?.background.default,
					height: "42px",
					boxShadow: 0,
					"& .MuiOutlinedInput-notchedOutline": {
						border: "none",
					},
					"& .MuiSelect-select": {
						display: "flex",
						alignItems: "center",
						fontSize: "12px",
						fontWeight: 600,
						p: 0,
					},
				}}
				{...props}>
				{customMenuList && customMenuList.length > 0
					? customMenuList
					: menuList?.map((item) => (
							<MenuItem
								key={item[valueKey]}
								value={item[valueKey]}
								sx={{
									fontSize: "12px",
									fontWeight: 600,
								}}>
								{item[labelKey]}
							</MenuItem>
						))}
			</Select>
		</FormControl>
	);
};

CustomSelect.propTypes = {
	defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.string,
	field: PropTypes.string,
	customMenuList: PropTypes.array,
	menuList: PropTypes.array.isRequired,
	valueKey: PropTypes.string.isRequired,
	labelKey: PropTypes.string.isRequired,
	required: PropTypes.bool,
	callBackAction: PropTypes.func,
};

export default CustomSelect;
