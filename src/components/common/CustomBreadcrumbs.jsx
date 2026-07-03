import {Link as RouterLink, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

export default function CustomBreadcrumbs({btnStr = "Back", backAction, links, sx}) {
	const navigate = useNavigate();

	return (
		<Stack spacing={1} direction="row" sx={{alignItems: "center"}}>
			{
				<Box
					sx={{
						display: "inline-flex",
						alignItems: "center",
						gap: 0,
						cursor: "pointer",
						color: "text.primary",
					}}
					onClick={() => {
						navigate(-1);
						if (backAction) {
							backAction();
						}
					}}>
					<i className="fa-solid fa-angle-left" style={{fontSize: 10, marginRight: 2}} />
					<Typography variant="subtitle2" color="text.primary" sx={{cursor: "pointer", textDecoration: "underline"}}>
						{btnStr}
					</Typography>
				</Box>
			}
			<Breadcrumbs
				separator="›"
				// separator="|"
				sx={{
					color: "text.primary",
					// textTransform: "uppercase",
					...sx,
				}}>
				{links.map((item, index) => {
					const isLast = index === links.length - 1;

					// Home icon
					if (index === 0) {
						return (
							<IconButton key={index} component={RouterLink} to={item.link || "/"} size="small" sx={{p: 0.5}} color="primary">
								<HomeIcon fontSize="small" />
							</IconButton>
						);
					}

					// Last item — non-clickable current page label
					if (isLast || (!item.link && !item.onClick)) {
						return (
							<Typography key={index} variant="body2" color="text.disabled">
								{item.name}
							</Typography>
						);
					}

					// Item with onClick handler — in-page navigation (no RouterLink needed)
					if (item.onClick) {
						return (
							<Link
								key={index}
								variant="body2"
								underline="hover"
								sx={{
									fontWeight: 700,
									color: "text.secondary",
									cursor: "pointer",
									"&:hover": {color: "text.primary"},
								}}
								onClick={item.onClick}>
								{item.name}
							</Link>
						);
					}

					// Normal router links
					return (
						<Link
							key={index}
							variant="body2"
							component={RouterLink}
							underline="none"
							sx={{
								color: "text.primary",
								"&:hover": {
									color: "primary.main",
								},
							}}
							to={item.link}>
							{item.name}
						</Link>
					);
				})}
			</Breadcrumbs>
		</Stack>
	);
}
