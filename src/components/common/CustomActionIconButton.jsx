import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import CustomTooltip from "./CustomTooltip";

export const CustomActionIconButton = ({color = "primary", tooltip = "", children, ...props}) => {
	const theme = useTheme();

	return (
		<CustomTooltip label={tooltip}>
			<IconButton
				{...props}
				sx={{
					width: 30,
					height: 30,
					minWidth: 30,
					borderRadius: 1.8,
					color: theme.palette[color].main,
					backgroundColor: theme.palette.mode === "light" ? theme.palette[color].lighter : theme.palette[color].darker,
					fontSize: 20,
					// '&:hover': {
					//   backgroundColor:
					//     theme.palette.mode === 'light' ? theme.palette[color].light : theme.palette[color].dark,
					// },

					p: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				{children}
			</IconButton>
		</CustomTooltip>
	);
};
