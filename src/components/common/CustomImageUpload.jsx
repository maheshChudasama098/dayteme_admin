import {Button, useTheme} from "@mui/material";

export default function CustomImageUpload({onChange}) {
	const theme = useTheme();
	const handleImageChange = (e) => {
		const file = e.target.files?.[0];

		if (file) {
			if (onChange) {
				onChange(file);
			}
		}
	};

	return (
		<Button
			component="label"
			startIcon={<i className="fa-solid fa-cloud-arrow-up" />}
			color="darker"
			sx={{
				p: 2.5,
				borderRadius: 2,
				color: theme.palette.primary.main,
				background: theme.palette.grey[200],
				border: `1px dashed ${theme.palette.grey[400]}`,
			}}>
			Upload Document
			<input hidden type="file" accept="image/*" onChange={handleImageChange} />
		</Button>
	);
}
