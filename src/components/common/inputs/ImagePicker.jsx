import PropTypes from "prop-types";
import React, {useRef} from "react";

import {Avatar, Box} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";

import {ErrorMessage} from "formik";

export function ImagePicker({formik, field, label, heightWidth = 180, imageReturn, defaultIcon = "fa-solid fa-user"}) {
	const fileInputRef = useRef(null);
	const IconHeightWidth = heightWidth / 1.5;

	const handleButtonClick = () => {
		fileInputRef.current.click();
	};

	return (
		<div style={{textAlign: "center"}}>
			<input
				type="file"
				ref={fileInputRef}
				id={field}
				name={field}
				accept="image/png, image/jpeg, image/jpg"
				style={{display: "none"}}
				onChange={(event) => {
					if (imageReturn) imageReturn(event.target.files[0]);
					formik.handleChange(event);
					formik.setFieldValue(field, URL.createObjectURL(event.target.files[0]));
				}}
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
				}}>
				<Box
					sx={{
						p: "3px",
						borderRadius: "50%",
						background: (theme) => `linear-gradient(135deg,${theme.palette.info.lighter} 0%,${theme.palette.warning.light} 100%)`,
					}}>
					<Avatar
						borderDashed
						imgDefault={false}
						icon={defaultIcon}
						sx={{
							width: {
								xs: IconHeightWidth,
								md: IconHeightWidth,
								lg: IconHeightWidth,
							},
							height: {
								xs: IconHeightWidth,
								md: IconHeightWidth,
								lg: IconHeightWidth,
							},
							border: (theme) => `solid 4px ${theme.palette.background.paper}`,
							bgcolor: "primary.main",
						}}
						onClick={handleButtonClick}
						src={formik?.values[field]}
						iconSize={heightWidth / 3}
						error={formik?.errors[field]}
					/>
				</Box>
			</Box>

			<ErrorMessage name={field}>
				{(msg) => (
					<FormHelperText style={{textAlign: "center"}} error>
						{msg}
					</FormHelperText>
				)}
			</ErrorMessage>
		</div>
	);
}

ImagePicker.propTypes = {
	formik: PropTypes.object,
	field: PropTypes.string,
	label: PropTypes.string,
};
