import { alpha } from "@mui/material/styles";

import { palette } from "./palette";

// ----------------------------------------------------------------------

export function customShadows() {
  const transparent = alpha(palette?.palette?.grey[500], 0.16);

  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    card: `0 0 2px 0 ${alpha(palette?.palette?.grey[500], 0.08)}, 0 12px 24px -4px ${alpha(palette?.palette?.grey[500], 0.08)}`,
    dropdown: `0 0 2px 0 ${alpha(palette?.palette?.grey[500], 0.24)}, -20px 20px 40px -4px ${alpha(palette?.palette?.grey[500], 0.24)}`,
    dialog: `-40px 40px 80px -8px ${alpha(palette?.palette?.common.black, 0.24)}`,
    //
    primary: `0 8px 16px 0 ${alpha(palette?.palette?.primary.main, 0.24)}`,
    info: `0 8px 16px 0 ${alpha(palette?.palette?.info.main, 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha(palette?.palette?.secondary.main, 0.24)}`,
    success: `0 8px 16px 0 ${alpha(palette?.palette?.success.main, 0.24)}`,
    warning: `0 8px 16px 0 ${alpha(palette?.palette?.warning.main, 0.24)}`,
    error: `0 8px 16px 0 ${alpha(palette?.palette?.error.main, 0.24)}`,
  };
}
