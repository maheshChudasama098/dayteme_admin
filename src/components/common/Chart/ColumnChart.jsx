import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import Chart, {useChart} from "./index";

// ----------------------------------------------------------------------

export default function ColumnCharts({chart, height}) {
	const {labels, colors, series, options} = chart;

	const chartOptions = useChart({
		colors,
		labels,
		plotOptions: {
			bar: {
				distributed: true,
			},
		},
		// xaxis: {
		// 	categories: labels,
		// 	labels: {
		// 		// rotate: 0,
		// 		hideOverlappingLabels: false,
		// 		trim: false,
		// 		style: {
		// 			colors: "#637381",
		// 			fontWeight: 500,
		// 		},
		// 	},
		// },
		yaxis: {
			labels: {
				show: true,
			},
		},
		grid: {
			padding: {
				bottom: 0,
			},
			strokeDashArray: 2.5,
		},
		legend: {
			position: "bottom",
			horizontalAlign: "center",
			fontSize: "12px",
			markers: {
				radius: 40,
			},
			onItemClick: {
				toggleDataSeries: true,
			},
			onItemHover: {
				highlightDataSeries: true,
			},
		},
		...options,
	});

	return <Chart dir="ltr" type="bar" series={series} options={chartOptions} width="100%" height={height} />;
}

ColumnCharts.propTypes = {
	chart: PropTypes.object,
	height: PropTypes.number,
};
