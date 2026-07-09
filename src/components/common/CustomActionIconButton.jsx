import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {useTheme} from "@mui/material/styles";

export const CustomActionIconButton = ({color = "primary", tooltip = "", children, ...props}) => {
	const theme = useTheme();

	return (
		<Tooltip title={tooltip}>
			<IconButton
				{...props}
				sx={{
					width: 28,
					height: 28,
					minWidth: 28,
					borderRadius: 1.5,
					color: theme.palette[color].main,
					backgroundColor: theme.palette.mode === "light" ? theme.palette[color].lighter : theme.palette[color].darker,
					fontSize: 20,
					p: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					// '&:hover': {
					//   backgroundColor:
					//     theme.palette.mode === 'light' ? theme.palette[color].light : theme.palette[color].dark,
					// },
				}}>
				{children}
			</IconButton>
		</Tooltip>
	);
};
