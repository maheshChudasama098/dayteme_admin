import PropTypes from "prop-types";

import {styled, useTheme} from "@mui/material/styles";

import Chart, {useChart} from "./index";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 320;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({theme}) => ({
	height: CHART_HEIGHT,
	"& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject": {
		height: `100% !important`,
	},
	"& .apexcharts-legend": {
		height: LEGEND_HEIGHT,
		borderTop: `dashed 1px ${theme.palette.divider}`,
		top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
	},
}));

// ----- ||  || ----- //

export default function PiChar({chart}) {
	const theme = useTheme();

	const {colors, series, options} = chart;

	const chartSeries = series.map((i) => i.value);

	const chartOptions = useChart({
		chart: {
			sparkline: {
				enabled: true,
			},
		},
		colors,
		labels: series.map((i) => i.label),
		stroke: {
			colors: [theme.palette.background.paper],
		},
		legend: {
			floating: true,
			position: "bottom",
			horizontalAlign: "center",
		},
		dataLabels: {
			enabled: false,
			dropShadow: {
				enabled: true,
			},
			title: {
				formatter: (seriesName) => `${seriesName}`,
			},
		},
		// tooltip: {
		// 	fillSeriesColor: false,
		// 	y: {
		// 		formatter: (value) => fNumber(value),
		// 		title: {
		// 			formatter: (seriesName) => `${seriesName}`,
		// 		},
		// 	},
		// },
		plotOptions: {
			radialBar: {
				dataLabels: {
					name: {
						fontSize: "200px",
					},
					value: {
						show: true,
						fontSize: "16px",
						label: "Total",
						formatter: (w) => w?.toLocaleString("en-IN") || w || "0", // Arrow function
					},
					total: {
						show: true,
						label: "Total",
					},
				},
			},
		},
		...options,
	});

	return <StyledChart dir="ltr" type="donut" series={chartSeries} options={chartOptions} width="100%" height={240} />;
}

PiChar.propTypes = {
	chart: PropTypes.object,
};
