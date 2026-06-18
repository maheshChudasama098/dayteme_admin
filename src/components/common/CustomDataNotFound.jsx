import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/common/iconify";

import {Empty} from "antd";

const CustomDataNotFound = ({title = "No Data Found!", width, message = ""}) => (
	<Box sx={{textAlign: "center", p: 3, m: "auto", py: 10}}>
		<Empty
			image={<Iconify icon="lets-icons:box-open-fill-duotone" width={width} sx={{color: "primary.main"}} />}
			description={
				<Box>
					<Typography variant="subtitle2" color="text.secondary">
						{title}
					</Typography>
					{message && (
						<Typography variant="caption" color="text.secondary" sx={{mt: 0.5}}>
							{message}
						</Typography>
					)}
				</Box>
			}
		/>
	</Box>
);

CustomDataNotFound.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
};

export default CustomDataNotFound;
