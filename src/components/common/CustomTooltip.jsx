import React from "react";
import PropTypes from "prop-types";

import {Tooltip} from "antd";

const CustomTooltip = ({label, placement, children, ...props}) => {
	// const theme = useTheme();
	// Check if label is a string or JSX
	const renderLabel = typeof label === "string" ? <span>{label}</span> : label;

	return (
		<Tooltip placement={placement} title={renderLabel} overlayInnerStyle={{fontSize: "12px"}} {...props}>
			{children}
		</Tooltip>
	);
};

CustomTooltip.propTypes = {
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	Placement: PropTypes.string,
};

export default CustomTooltip;
