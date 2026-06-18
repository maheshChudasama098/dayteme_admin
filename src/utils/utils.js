import moment from "moment";
import {alpha} from "@mui/material";

import {imageUlr, apiURL} from "src/constance";

export function lightenColor(hexColor, factor) {
	// Remove '#' if present
	hexColor = hexColor.replace("#", "");

	// Parse the color into RGB components
	const red = parseInt(hexColor.slice(0, 2), 16);
	const green = parseInt(hexColor.slice(2, 4), 16);
	const blue = parseInt(hexColor.slice(4, 6), 16);

	// Calculate the new RGB values by blending towards white
	const newRed = Math.round(red + (255 - red) * factor);
	const newGreen = Math.round(green + (255 - green) * factor);
	const newBlue = Math.round(blue + (255 - blue) * factor);

	// Convert RGB values back to HEX
	const newHexColor = `#${[newRed, newGreen, newBlue]
		.map((val) => val.toString(16).padStart(2, "0"))
		.join("")
		.toUpperCase()}`;

	return newHexColor;
}

export function defaultImageUrl(url) {
	if (imageUlr === undefined || imageUlr === "undefined") {
		// Use relative paths that work with Vite's base configuration
		const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
		return `${import.meta.env.BASE_URL}${cleanUrl}`;
	}
	return imageUlr + url;
}

export function defaultFile(url) {
	if (apiURL === undefined || apiURL === "undefined") {
		const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
		return `${import.meta.env.BASE_URL}${cleanUrl}`;
	}
	return apiURL + url;
}

export function calculatePercentageChange(c, p) {
	const current = Number(c);
	const previous = Number(p);
	if (!previous || previous === 0) return current ? 100 : 0;
	return ((current - previous) / previous) * 100;
}

export const getDisplayData = ({list = [], value, valueKey = "value", labelKey = "label", textColorKey = "text_color", bgColorKey = "bg_color"}) => {
	const item = list.find((i) => i[valueKey] === value);

	if (!item) {
		return {
			label: "-",
			textColor: "#000",
			bgColor: "#eee",
		};
	}

	return {
		label: item[labelKey],
		textColor: item[textColorKey] || "#000",
		bgColor: item[bgColorKey] || "#eee",
	};
};

export function bgBlur(props) {
	const color = props?.color || "#000000";
	const blur = props?.blur || 6;
	const opacity = props?.opacity || 0.8;
	const imgUrl = props?.imgUrl;

	if (imgUrl) {
		return {
			position: "relative",
			backgroundImage: `url(${imgUrl})`,
			"&:before": {
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: 9,
				content: '""',
				width: "100%",
				height: "100%",
				backdropFilter: `blur(${blur}px)`,
				WebkitBackdropFilter: `blur(${blur}px)`,
				backgroundColor: alpha(color, opacity),
			},
		};
	}

	return {
		backdropFilter: `blur(${blur}px)`,
		WebkitBackdropFilter: `blur(${blur}px)`,
		backgroundColor: alpha(color, opacity),
	};
}

export function getErrorMessage(res) {
	if (Array.isArray(res?.errors) && res.errors.length > 0) {
		return res.errors[0]?.message || res?.message || "Please try again.";
	} else if (res?.errors && typeof res.errors === "object" && Object.keys(res.errors).length > 0) {
		return Object.values(res.errors)[0] || res?.message || "Please try again.";
	} else {
		return res?.message || "Please try again.";
	}
}

// ----------------------------------------------------------------------

export function fDateTime(date) {
	return date ? moment(date).format("DD/MM/YYYY - HH:mm A") : "N/A";
}

export function fDate(date) {
	return date ? moment(date).format("MMM DD") : "N/A";
}

export function fTruncateWords(text, maxChars = 30) {
	if (text?.length <= maxChars) return text;
	return (text?.substring(0, maxChars) ?? "") + "...";
}
