import {alpha} from "@mui/material/styles";
import {customShadows} from "./custom-shadows";
import {shadows} from "./shadows";

const GLOBAL_RADIUS = 4;

const borderRadius = {
	MuiButton: 3.5 * GLOBAL_RADIUS,
	MuiCard: 5 * GLOBAL_RADIUS,
	MuiAvatar: 3 * GLOBAL_RADIUS,
	MuiTextField: 3 * GLOBAL_RADIUS,
	lg: 4 * GLOBAL_RADIUS,
	xl: 5 * GLOBAL_RADIUS,
	MuiTabs: 10,
	MuiTab: 10,
};

export const overrides = {
	MuiButton: {
		styleOverrides: {
			root: () => ({
				fontSize: 12,
				borderRadius: borderRadius.MuiButton,
				fontWeight: 600,
				padding: "8px 20px",
			}),
		},
	},
	MuiCard: {
		styleOverrides: {
			root: ({theme}) => ({
				boxShadow: shadows(theme?.palette?.shadows?.primary)?.[3],
				backgroundColor: theme?.palette?.background?.paper, // light blue
				borderRadius: borderRadius.MuiCard,
			}),
		},
	},
	MuiAlert: {
		styleOverrides: {
			root: {
				fontSize: 12,
				boxShadow: customShadows()?.z1,
				borderRadius: borderRadius.MuiCard,
			},
		},
	},
	MuiDrawer: {
		styleOverrides: {
			paper: ({theme}) => ({
				// boxShadow: customShadows()?.z1,
				backgroundColor: theme?.palette?.background?.paper,
				backgroundImage: "none",
			}),
		},
	},
	MuiChip: {
		styleOverrides: {
			root: ({theme}) => ({
				fontSize: 11,
				fontWeight: 600,
				boxShadow: "none",
				borderRadius: Number(theme.shape.borderRadius) * 5,
				height: "auto",
			}),
			label: {
				padding: "4px 12px",
			},
		},
	},
	MuiAvatar: {
		styleOverrides: {
			rounded: {
				borderRadius: borderRadius.MuiAvatar,
			},
		},
	},
	MuiContainer: {
		styleOverrides: {
			root: ({theme}) => ({
				paddingLeft: theme.spacing(2),
				paddingRight: theme.spacing(2),
				[theme.breakpoints.up("md")]: {
					maxWidth: 900,
				},
				[theme.breakpoints.up("lg")]: {
					maxWidth: 1000,
				},
				[theme.breakpoints.up("xl")]: {
					maxWidth: 1300,
				},
			}),
		},
		defaultProps: {
			maxWidth: "lg", // default if unspecified
		},
	},
	MuiInputLabel: {
		styleOverrides: {
			root: {
				position: "static",
				transform: "none",
				marginBottom: 1.5,
				// marginLeft: 8,
				fontSize: 14,
				fontWeight: 700,
				textTransform: "unset",
				// color: theme.palette.muiFormField.color,
				// textTransform: "uppercase",
				// "&.Mui-focused": {
				// 	color: theme.palette.muiFormField.colorFocused,
				// },
				// "&.Mui-error": {
				// 	color: theme.palette.muiFormField.colorError,
				// },
				// "&.Mui-error.Mui-focused": {
				// 	color: theme.palette.muiFormField.colorError,
				// },
			},
		},
	},
	MuiFormLabel: {
		styleOverrides: {
			root: ({theme}) => ({
				// marginLeft: 3,
				fontSize: 12,
				fontWeight: 500,
				"&.MuiFormLabel-root": {
					textTransform: "unset",
					position: "static",
					transform: "none",
					marginBottom: 3.5,
					fontSize: 12,
					fontWeight: 500,
					color: theme.palette.text.secondary,
				},
			}),
		},
	},
	MuiTextField: {
		styleOverrides: {
			root: ({theme}) => ({
				"& .MuiOutlinedInput-root": {
					fontSize: 13,
					borderRadius: 16,
					minHeight: 36,
					border: "1px solid #ededed",
					borderColor: theme.palette.grey[300],
					backgroundColor: theme.palette.background.default,
					"& .MuiOutlinedInput-input": {
						padding: "10px 15px",
						height: "auto",
						"&::placeholder": {
							textAlign: "left",
							opacity: 1,
							color: theme.palette.text.disabled,
						},
					},
					"& .MuiOutlinedInput-notchedOutline": {
						border: "none",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						border: "none",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						border: "none",
					},
					"&.Mui-error .MuiOutlinedInput-notchedOutline": {
						border: "none",
					},
					// ✅ Disabled state
					"&.Mui-disabled": {
						backgroundColor: "#e0e0e0",
						opacity: 1,
					},
					"&.Mui-disabled .MuiOutlinedInput-input": {
						WebkitTextFillColor: "#8d8b8b",
					},
				},
			}),
		},
	},
	MuiAutocomplete: {
		styleOverrides: {
			root: () => ({
				"& .MuiOutlinedInput-root": {
					fontSize: 14,
					borderRadius: 16,
					minHeight: 36,
					padding: 0,
					margin: 0,
					textTransform: "unset",
					"& .MuiAutocomplete-input": {
						padding: "10px 12px",
						height: "auto",
						border: "none",
						// 👉 Placeholder alignment
						"&::placeholder": {
							textAlign: "right", // 🔁 change to 'center' or 'left'
							opacity: 1,
						},
					},
					"& fieldset": {
						border: `none`,
					},
					"&:hover fieldset": {
						border: `none`,
					},
					"&.Mui-focused fieldset": {
						border: `none`,
					},
					"&.Mui-error fieldset": {
						border: `none`,
					},
					"&.Mui-error.Mui-focused fieldset": {
						border: `none`,
					},
				},
			}),
		},
	},
	MuiFormControlLabel: {
		styleOverrides: {
			root: {
				fontSize: 14,
				fontWeight: 600,

				// textTransform: "uppercase",
				"&.MuiFormControlLabel-root": {
					textTransform: "unset",
					position: "static",
					transform: "none",
					marginBottom: 3.5,
					fontSize: 14,
					fontWeight: 600,
				},
			},
		},
	},
	MuiPopper: {
		styleOverrides: {
			root: ({theme}) => ({
				"& .MuiAutocomplete-paper": {
					backdropFilter: "blur(100px)",
					padding: "5px 5px 0px 5px",
					margin: 0,
					boxShadow: 1,
					borderRadius: Number(theme.shape.borderRadius) * 1.3,
				},
				"& .MuiAutocomplete-listbox": {
					padding: 0,
				},
				"& .MuiAutocomplete-option": {
					borderRadius: Number(theme.shape.borderRadius) * 1.3,
					fontSize: 14,
					fontWeight: 600,
					textTransform: "unset",
					transition: "all 0.2s ease",
					padding: "8px 12px",
					marginBottom: 5,
					boxShadow: 0,
					"&:hover": {
						backgroundColor: alpha(theme.palette.darker.main, 0.1), // light blue
					},
					"&.Mui-focused": {
						backgroundColor: alpha(theme.palette.darker.main, 0.1), // light blue
					},
					'&[aria-selected="true"]': {
						backgroundColor: alpha(theme.palette.darker.main, 0.2), // light blue
					},
					'&[aria-selected="true"]:hover': {
						backgroundColor: alpha(theme.palette.darker.main, 0.1), // light blue
					},
				},
			}),
		},
	},
	MuiMenu: {
		styleOverrides: {
			paper: () => ({
				backdropFilter: "blur(30px)",
				padding: "1px 1px 0px 1px",
				marginTop: 2,
				borderRadius: 10,
				"& .MuiList-root.MuiMenu-list": {
					padding: "5px 5px 0px 5px",
				},
			}),
		},
	},
	MuiMenuItem: {
		styleOverrides: {
			root: ({theme}) => ({
				borderRadius: 7,
				fontSize: 12,
				fontWeight: 500,
				transition: "all 0.2s ease",
				padding: "5px 8px",
				// margin: '0px 5px',
				marginBottom: 4,
				textTransform: "unset",
				"&:hover": {
					backgroundColor: alpha(theme.palette.darker.main, 0.1),
				},
				"&.Mui-focusVisible": {
					backgroundColor: alpha(theme.palette.darker.main, 0.1),
				},
				"&.Mui-selected": {
					backgroundColor: alpha(theme.palette.darker.main, 0.2),
				},
				"&.Mui-selected:hover": {
					backgroundColor: alpha(theme.palette.darker.main, 0.1),
				},
			}),
		},
	},
	MuiSelect: {
		styleOverrides: {
			root: (theme) => ({
				fontSize: 12,
				textTransform: "unset",
				"& .MuiOutlinedInput-notchedOutline": {
					borderRadius: 18,
					border: `1px solid ${theme?.palette?.info?.main}`,
					// borderColor: theme.palette.grey[800],
				},
				"&:hover .MuiOutlinedInput-notchedOutline": {},
				"&.Mui-focused .MuiOutlinedInput-notchedOutline": {},
			}),
			select: {
				borderRadius: 50,
				padding: "8px 12px",
			},
		},
	},

	MuiTabs: {
		styleOverrides: {
			root: ({theme}) => ({
				backgroundColor: theme.palette.grey[300],
				borderRadius: theme.shape.borderRadius * borderRadius.MuiTabs,
				padding: "0px",
				lineHeight: 0,
				minHeight: 35,
				width: "fit-content",
				transition: "all 0.3s ease",
				"& .MuiTabs-indicator": {
					height: "calc(100% - 8px)",
					bottom: "50%",
					transform: "translateY(50%)",
					backgroundColor: theme.palette.primary.main,
					zIndex: 0,
					transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
					boxShadow: theme.shadows[3],
					borderRadius: theme.shape.borderRadius * borderRadius.MuiTab,
				},
			}),
		},
	},
	MuiTab: {
		styleOverrides: {
			root: ({theme}) => ({
				position: "relative",
				margin: 4,
				borderRadius: theme.shape.borderRadius * borderRadius.MuiTab,
				minHeight: 30,
				fontSize: 12,
				zIndex: 1,
				color: theme.palette.text.secondary,
				"&.Mui-selected": {
					transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
					color: theme.palette.background.paper,
					fontWeight: 700,
				},
			}),
		},
	},
};
