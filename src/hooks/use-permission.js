import {useSelector} from "react-redux";

export const useHasPermission = () => {
	const permissions = useSelector((state) => state.auth?.permissions || []);

	const hasPermission = (permissionSlug) => {
		if (!permissionSlug) return true;

		if (Array.isArray(permissionSlug)) {
			if (permissionSlug.length === 0) return true;
			return permissionSlug.some((slug) => hasPermission(slug));
		}

		return permissions.some((perm) => {
			const target = typeof perm === "string" ? perm : (perm?.slug || perm?.name || "");
			return target.toLowerCase() === permissionSlug.toLowerCase();
		});
	};

	return {hasPermission, permissions};
};
