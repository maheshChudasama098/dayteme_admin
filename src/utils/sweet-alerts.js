import Swal from "sweetalert2";

import theme from "../theme";

// export function sweetAlerts(icon, message) {
// 	const Toast = Swal.mixin({
// 		toast: true,
// 		position: "top-end",
// 		showConfirmButton: false,
// 		timer: 3000,
// 		timerProgressBar: true,
// 		customClass: {
// 			container: "custom-swal-container",
// 		},
// 		didOpen: (toast) => {
// 			toast.onmouseenter = Swal.stopTimer;
// 			toast.onmouseleave = Swal.resumeTimer;
// 		},
// 	});

// 	Toast.fire({
// 		icon,
// 		title: message,
// 	});
// }

const getSwalTheme = () => {
	const root = getComputedStyle(document.documentElement);
	return {
		bg: root.getPropertyValue("--swal-background").trim(),
		text: root.getPropertyValue("--swal-text").trim(),
		textSecondary: root.getPropertyValue("--swal-text-secondary").trim(),
		success: root.getPropertyValue("--swal-success").trim(),
		radius: root.getPropertyValue("--swal-radius").trim(),
		shadow: root.getPropertyValue("--swal-shadow").trim(),
	};
};

export function sweetAlerts(icon, message) {
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",

		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,

		customClass: {
			container: "custom-swal-container",
		},

		didOpen: (toast) => {
			// const swalTitle = Swal.getTitle();
			const swalIcon = Swal.getIcon();

			// Toast container
			toast.style.minWidth = "320px";
			toast.style.maxWidth = "450px";

			toast.style.background = theme.palette.background.paper;
			toast.style.color = theme.palette.text.primary;
			toast.style.borderRadius = `${theme.shape.borderRadius * 3}px`;
			toast.style.boxShadow = theme.shadows[8];
			toast.style.fontFamily = theme.typography.fontFamily;
			// toast.style.padding = theme.spacing(1.5, 2);

			// Title
			// if (swalTitle) {
			// 	swalTitle.style.fontSize = theme.typography.body2.fontSize;
			// 	swalTitle.style.fontWeight = "600";
			// 	swalTitle.style.color = theme.palette.text.primary;
			// 	swalTitle.style.alignItems = "center";
			// 	swalTitle.style.justifyContent = "center";
			// 	swalTitle.style.alignContent = "center";
			// 	swalTitle.style.margin = "0";
			// }

			// Icon
			if (swalIcon) {
				// swalIcon.style.width = "32px";
				// swalIcon.style.height = "32px";
				// swalIcon.style.marginRight = "12px";

				if (icon === "success") {
					swalIcon.style.borderColor = theme.palette.success.lighter;
					swalIcon.style.color = theme.palette.success.lighter;
					swalIcon.style.background = theme.palette.success.main;
				}

				if (icon === "error") {
					swalIcon.style.borderColor = theme.palette.error.lighter;
					swalIcon.style.color = theme.palette.error.lighter;
					swalIcon.style.background = theme.palette.error.main;
				}

				if (icon === "warning") {
					swalIcon.style.borderColor = theme.palette.warning.lighter;
					swalIcon.style.color = theme.palette.warning.lighter;
					swalIcon.style.background = theme.palette.warning.main;
				}

				if (icon === "info") {
					swalIcon.style.borderColor = theme.palette.info.lighter;
					swalIcon.style.color = theme.palette.info.lighter;
					swalIcon.style.background = theme.palette.info.main;
				}

				// swalIcon.style.borderRadius = "50%";
				// swalIcon.style.display = "flex";
				// swalIcon.style.alignItems = "center";
				// swalIcon.style.justifyContent = "center";
			}

			// Pause timer on hover
			toast.onmouseenter = Swal.stopTimer;
			toast.onmouseleave = Swal.resumeTimer;
		},
	});

	Toast.fire({
		icon,
		title: message,
		iconColor: theme.palette[icon].lighter,
	});
}

export const sweetAlertSuccess = (message, title) => {
	const theme = getSwalTheme();

	return Swal.fire({
		title: title || "Success",
		text: message || "Operation completed successfully",

		icon: "success",
		iconColor: theme.success,

		timer: 2000,
		showConfirmButton: false,
		timerProgressBar: true,

		didOpen: () => {
			const popup = Swal.getPopup();
			const icon = Swal.getIcon();
			const swalTitle = Swal.getTitle();
			const swalText = Swal.getHtmlContainer();

			popup.style.backgroundColor = theme.bg;
			// Popup
			popup.style.width = "90vw";
			popup.style.minWidth = "320px";
			popup.style.maxWidth = "500px";
			// popup.style.background = theme.bg;
			popup.style.borderRadius = theme.radius || "24px";
			popup.style.boxShadow = theme.shadow;
			popup.style.padding = "30px";

			// Title
			// icon.style.backgroundColor = theme.text;
			swalTitle.style.color = theme.text;
			swalTitle.style.fontSize = "1.5rem";
			swalTitle.style.fontWeight = "700";

			// Text
			swalText.style.color = theme.textSecondary;
			swalText.style.fontSize = "0.95rem";
			swalText.style.fontWeight = "400";
		},
	});
};

export const sweetAlertQuestion = (text, title) =>
	Swal.fire({
		title: title || "Are you sure?",
		text: text || "You won't be able to revert this!",
		icon: "question",

		showCancelButton: true,
		confirmButtonText: "Yes",
		cancelButtonText: "Cancel",

		confirmButtonColor: theme.palette.error.main,
		// cancelButtonColor: theme.palette.success.main,
		// cancelButtonColor: theme.palette.error.main,

		reverseButtons: true,

		didOpen: () => {
			const popup = Swal.getPopup();

			// Popup
			popup.style.width = "90vw";
			popup.style.minWidth = "320px";
			popup.style.maxWidth = "600px";

			popup.style.background = theme.palette.background.paper;
			popup.style.color = theme.palette.text.primary;
			popup.style.borderRadius = `${theme.shape.borderRadius * 4}px`;
			popup.style.boxShadow = theme.shadows[10];
			popup.style.fontFamily = theme.typography.fontFamily;
			popup.style.padding = theme.spacing(3);

			// Buttons
			const confirmBtn = Swal.getConfirmButton();
			const cancelBtn = Swal.getCancelButton();
			const icon = Swal.getIcon();
			const swalTitle = Swal.getTitle();
			const swalText = Swal.getHtmlContainer();

			// Title
			swalTitle.style.fontSize = "20px";
			swalTitle.style.fontWeight = "600";
			swalTitle.style.color = theme.palette.text.primary;
			swalTitle.style.fontFamily = theme.typography.fontFamily;

			// Text
			swalText.style.fontSize = "14px";
			swalText.style.fontWeight = "400";
			swalText.style.color = theme.palette.text.secondary;
			swalText.style.fontFamily = theme.typography.fontFamily;

			confirmBtn.style.borderRadius = `${theme.shape.borderRadius * 2.5}px`;
			confirmBtn.style.fontFamily = theme.typography.button.fontFamily;
			confirmBtn.style.fontSize = "12px";
			confirmBtn.style.fontWeight = theme.typography.button.fontWeight;
			confirmBtn.style.lineHeight = theme.typography.button.lineHeight;
			confirmBtn.style.textTransform = theme.typography.button.textTransform;
			confirmBtn.style.padding = theme.spacing(1.2, 3);
			confirmBtn.style.boxShadow = theme.shadows[3];

			cancelBtn.style.borderRadius = `${theme.shape.borderRadius * 2.5}px`;
			cancelBtn.style.fontFamily = theme.typography.button.fontFamily;
			cancelBtn.style.fontSize = "12px";
			cancelBtn.style.fontWeight = theme.typography.button.fontWeight;
			cancelBtn.style.lineHeight = theme.typography.button.lineHeight;
			cancelBtn.style.textTransform = theme.typography.button.textTransform;
			cancelBtn.style.padding = theme.spacing(1.2, 3);
			// cancelBtn.style.boxShadow = theme.shadows[3];

			cancelBtn.style.boxShadow = "none";
			cancelBtn.style.background = "transparent";
			cancelBtn.style.color = theme.palette.primary.main;
			cancelBtn.style.border = `1px solid ${theme.palette.primary.main}`;

			// Icon like your MUI Box
			if (icon) {
				icon.style.width = "80px";
				icon.style.height = "80px";
				// 	icon.style.borderRadius = "50%";
				// icon.style.color = theme.palette.error.main;
				// icon.style.background = theme.palette.error.lighter;
				icon.style.color = theme.palette.error.lighter;
				icon.style.background = theme.palette.error.main;
				// 	icon.style.display = "flex";
				// 	icon.style.alignItems = "center";
				// 	icon.style.justifyContent = "center";
				// 	icon.style.margin = "16px auto 32px";
				icon.style.border = `8px solid ${theme.palette.error.lighter}`;
				// 	icon.style.boxSizing = "border-box";
				// 	// remove default swal border
				// 	icon.style.borderColor = "transparent";
			}
		},
	}).then((result) => result.isConfirmed);

// export const sweetAlertSuccess = (message, title) => {
// 	const swalTheme = getSwalTheme();

// 	return Swal.fire({
// 		title: title || "Success",
// 		text: message || "Operation completed successfully",

// 		icon: "success",
// 		iconColor: theme.palette.success.main,

// 		timer: 20000,
// 		showConfirmButton: false,
// 		timerProgressBar: true,

// 		didOpen: () => {
// 			const popup = Swal.getPopup();
// 			const icon = Swal.getIcon();
// 			const swalTitle = Swal.getTitle();
// 			const swalText = Swal.getHtmlContainer();
// 			// Popup
// 			popup.style.width = "90vw";
// 			popup.style.minWidth = "320px";
// 			popup.style.maxWidth = "500px";
// 			popup.style.background = swalTheme.bg;
// 			popup.style.borderRadius = `${theme.shape.borderRadius * 4}px`;
// 			popup.style.boxShadow = theme.shadows[10];
// 			popup.style.fontFamily = theme.typography.fontFamily;
// 			popup.style.padding = theme.spacing(3);
// 			// Title
// 			swalTitle.style.fontSize = theme.typography.h3.fontSize;
// 			swalTitle.style.fontWeight = theme.typography.h6.fontWeight;
// 			swalTitle.style.color = theme.palette.text.primary;
// 			// Text
// 			swalText.style.fontSize = theme.typography.body2.fontSize;
// 			swalText.style.fontWeight = theme.typography.body2.fontWeight;
// 			swalText.style.color = theme.palette.text.secondary;
// 		},
// 	});
// };
