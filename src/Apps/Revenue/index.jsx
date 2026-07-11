import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useTheme, alpha } from "@mui/material/styles";
import { Table } from "antd";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Papa from "papaparse";
import { jsPDF } from "jspdf";

import Iconify from "src/components/common/iconify";
import CustomPagination from "src/components/common/CustomPagination";
import CustomSearchInput from "src/components/common/CustomSearchInput";
import CustomTooltip from "src/components/common/CustomTooltip";
import { sweetAlerts, sweetAlertSuccess } from "src/utils/sweet-alerts";

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

// Mock Gift Purchase Dataset Generator
const generateMockGiftPurchases = () => {
	const gifts = [
		{ name: "Red Rose", price: 1.99, sparks: 10, emoji: "🌹", color: "#F44336" },
		{ name: "Heart Balloon", price: 2.99, sparks: 15, emoji: "🎈", color: "#FF5722" },
		{ name: "Chocolate Box", price: 5.99, sparks: 30, emoji: "🍫", color: "#795548" },
		{ name: "Teddy Bear", price: 9.99, sparks: 50, emoji: "🧸", color: "#FF9800" },
		{ name: "Champagne Bottle", price: 19.99, sparks: 100, emoji: "🍾", color: "#4CAF50" },
		{ name: "Diamond Ring", price: 39.99, sparks: 200, emoji: "💍", color: "#00BCD4" },
	];

	const users = [
		{ name: "Emma Watson", email: "emma.watson@gmail.com" },
		{ name: "Liam Neeson", email: "liam.neeson@yahoo.com" },
		{ name: "Sophia Loren", email: "sophia.loren@hotmail.com" },
		{ name: "Noah Carter", email: "noah.carter@outlook.com" },
		{ name: "Olivia Wilde", email: "olivia.wilde@gmail.com" },
		{ name: "Jackson Pollock", email: "jackson@pollock.org" },
		{ name: "Ava Gardner", email: "ava.gardner@gmail.com" },
		{ name: "Lucas Hedges", email: "lucas.hedges@yahoo.com" },
		{ name: "Isabella Rossellini", email: "isabella@rossellini.it" },
		{ name: "Ethan Hawke", email: "ethan.hawke@gmail.com" },
		{ name: "Mia Farrow", email: "mia.farrow@outlook.com" },
		{ name: "Oliver Stone", email: "oliver.stone@gmail.com" },
		{ name: "Charlotte Gainsbourg", email: "charlotte@gainsbourg.fr" },
		{ name: "Aiden Gallagher", email: "aiden.gal@gmail.com" },
		{ name: "Amelia Earhart", email: "amelia@flyhigh.org" },
	];

	const providers = ["stripe", "apple", "google"];
	const txns = [];
	let idCounter = 3514;
	
	const totalDays = 60;
	// Generate 150 transactions from 2026-05-11 to 2026-07-10
	for (let i = 0; i < 150; i++) {
		const gift = gifts[i % gifts.length];
		const user = users[Math.floor((i * 11) % users.length)];
		const provider = providers[Math.floor((i * 3) % providers.length)];
		
		const amount = gift.price;
		const fee = parseFloat((amount * 0.029 + 0.30).toFixed(2));
		const net = parseFloat((amount - fee).toFixed(2));
		
		let status = "succeeded";
		if (i % 15 === 0) status = "failed";
		else if (i % 22 === 0) status = "pending";
		
		const daysAgo = Math.floor((i * 0.4) % totalDays);
		const date = dayjs("2026-07-10").subtract(daysAgo, "day").format("YYYY-MM-DD");
		
		txns.push({
			id: `TXN-${idCounter--}`,
			date,
			gift,
			user,
			amount,
			fee,
			net,
			provider,
			status
		});
	}
	
	return txns.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
};

// Mini Sparkline component
const SparklineChart = ({ data, color }) => {
	const series = [{ data }];
	const options = {
		chart: {
			type: "line",
			sparkline: { enabled: true },
			animations: { enabled: false }
		},
		stroke: { curve: "smooth", width: 2 },
		colors: [color],
		tooltip: { enabled: false }
	};
	return <ReactApexChart options={options} series={series} type="line" height={32} width={75} />;
};

const Revenue = () => {
	const theme = useTheme();
	
	// State variables
	const [dateFilter, setDateFilter] = useState("last_30_days");
	const [customStartDate, setCustomStartDate] = useState(dayjs("2026-06-10").format("YYYY-MM-DD"));
	const [customEndDate, setCustomEndDate] = useState(dayjs("2026-07-10").format("YYYY-MM-DD"));
	
	const [searchQuery, setSearchQuery] = useState("");
	const [giftFilter, setGiftFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [providerFilter, setProviderFilter] = useState("all");
	
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	// Get all transactions
	const allTransactions = useMemo(() => generateMockGiftPurchases(), []);

	// Active date range boundaries
	const dateRange = useMemo(() => {
		const end = dayjs("2026-07-10"); // Reference current local date
		let start = end.subtract(30, "day");
		
		if (dateFilter === "today") {
			start = end;
		} else if (dateFilter === "last_7_days") {
			start = end.subtract(6, "day");
		} else if (dateFilter === "last_30_days") {
			start = end.subtract(29, "day");
		} else if (dateFilter === "month_to_date") {
			start = end.startOf("month");
		} else if (dateFilter === "custom") {
			return {
				start: dayjs(customStartDate),
				end: dayjs(customEndDate),
				prevStart: dayjs(customStartDate).subtract(dayjs(customEndDate).diff(dayjs(customStartDate), "day") + 1, "day"),
				prevEnd: dayjs(customStartDate).subtract(1, "day")
			};
		}
		
		const diffDays = end.diff(start, "day") + 1;
		return {
			start,
			end,
			prevStart: start.subtract(diffDays, "day"),
			prevEnd: start.subtract(1, "day")
		};
	}, [dateFilter, customStartDate, customEndDate]);

	// Filter and compute statistics
	const filteredTransactions = useMemo(() => {
		return allTransactions.filter((txn) => {
			const txnDate = dayjs(txn.date);
			const inDateRange = txnDate.isBetween(dateRange.start, dateRange.end, "day", "[]");
			
			const matchesSearch = searchQuery
				? txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				  txn.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				  txn.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				  txn.gift.name.toLowerCase().includes(searchQuery.toLowerCase())
				: true;
				
			const matchesGift = giftFilter === "all" ? true : txn.gift.name === giftFilter;
			const matchesStatus = statusFilter === "all" ? true : txn.status === statusFilter;
			const matchesProvider = providerFilter === "all" ? true : txn.provider === providerFilter;
			
			return inDateRange && matchesSearch && matchesGift && matchesStatus && matchesProvider;
		});
	}, [allTransactions, dateRange, searchQuery, giftFilter, statusFilter, providerFilter]);

	// Compute summaries
	const metrics = useMemo(() => {
		const calculateForPeriod = (start, end) => {
			const txns = allTransactions.filter((t) => 
				dayjs(t.date).isBetween(start, end, "day", "[]") && t.status === "succeeded"
			);
			
			let rev = 0;
			let count = 0;
			let sparks = 0;
			
			txns.forEach((t) => {
				rev += t.amount;
				count += 1;
				sparks += t.gift.sparks;
			});
			
			return { rev, count, sparks };
		};

		const current = calculateForPeriod(dateRange.start, dateRange.end);
		const previous = calculateForPeriod(dateRange.prevStart, dateRange.prevEnd);
		
		const getGrowth = (curr, prev) => {
			if (prev === 0) return curr > 0 ? 100 : 0;
			return parseFloat((((curr - prev) / prev) * 100).toFixed(1));
		};

		// Generate trend data arrays for sparklines
		const getTrendData = () => {
			const dayMap = {};
			let tempDate = dateRange.start;
			while (tempDate.isBefore(dateRange.end) || tempDate.isSame(dateRange.end)) {
				dayMap[tempDate.format("YYYY-MM-DD")] = 0;
				tempDate = tempDate.add(1, "day");
			}

			allTransactions
				.filter(t => 
					dayjs(t.date).isBetween(dateRange.start, dateRange.end, "day", "[]") && 
					t.status === "succeeded"
				)
				.forEach(t => {
					dayMap[t.date] = (dayMap[t.date] || 0) + t.amount;
				});

			return Object.values(dayMap);
		};

		const trend = getTrendData();
		
		return {
			revenue: {
				val: parseFloat(current.rev.toFixed(2)),
				growth: getGrowth(current.rev, previous.rev),
				trend
			},
			purchases: {
				val: current.count,
				growth: getGrowth(current.count, previous.count)
			},
			sparks: {
				val: current.sparks,
				growth: getGrowth(current.sparks, previous.sparks)
			},
			avgValue: {
				val: current.count > 0 ? parseFloat((current.rev / current.count).toFixed(2)) : 0,
				growth: getGrowth(
					current.count > 0 ? current.rev / current.count : 0,
					previous.count > 0 ? previous.rev / previous.count : 0
				)
			}
		};
	}, [allTransactions, dateRange]);

	// Table columns configurations
	const columns = [
		{
			title: "Transaction ID",
			key: "id",
			render: (_, record) => (
				<Box>
					<Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
						{record.id}
					</Typography>
					<Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
						{record.date}
					</Typography>
				</Box>
			),
		},
		{
			title: "User Details",
			key: "user",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
					<Avatar sx={{ width: 34, height: 34, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 700 }}>
						{record.user.name.charAt(0)}
					</Avatar>
					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
							{record.user.name}
						</Typography>
						<Typography variant="caption" sx={{ color: "text.secondary" }}>
							{record.user.email}
						</Typography>
					</Box>
				</Stack>
			),
		},
		{
			title: "Gift Purchased",
			key: "gift",
			render: (_, record) => (
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Box
						sx={{
							width: 32,
							height: 32,
							borderRadius: "50%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							bgcolor: alpha(record.gift.color, 0.12),
							fontSize: "1.1rem"
						}}
					>
						{record.gift.emoji}
					</Box>
					<Box>
						<Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
							{record.gift.name}
						</Typography>
						<Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 600 }}>
							Value: {record.gift.sparks} Sparks
						</Typography>
					</Box>
				</Stack>
			)
		},
		{
			title: "Amount Paid",
			key: "amount",
			render: (_, record) => (
				<Box>
					<Typography variant="subtitle2" sx={{ fontWeight: 800, color: record.status === "failed" ? "error.main" : "success.main" }}>
						${record.amount.toFixed(2)}
					</Typography>
					<Typography variant="caption" sx={{ color: "text.disabled" }}>
						Fee: ${record.fee.toFixed(2)}
					</Typography>
				</Box>
			),
		},
		{
			title: "Gateway",
			dataIndex: "provider",
			key: "provider",
			render: (provider) => {
				let icon = "solar:card-bold-duotone";
				let color = "primary.main";
				if (provider === "stripe") {
					icon = "logos:stripe";
					color = "inherit";
				} else if (provider === "apple") {
					icon = "cib:apple-pay";
					color = "inherit";
				} else if (provider === "google") {
					icon = "logos:google-pay";
					color = "inherit";
				}

				return (
					<Stack direction="row" alignItems="center" spacing={1}>
						<Iconify icon={icon} width={20} sx={{ color }} />
						<Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "capitalize" }}>
							{provider}
						</Typography>
					</Stack>
				);
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				let color = "default";
				if (status === "succeeded") color = "success";
				else if (status === "pending") color = "warning";
				else if (status === "failed") color = "error";

				return (
					<Chip
						label={status}
						size="small"
						sx={{
							bgcolor: alpha(theme.palette[color]?.main || theme.palette.grey[500], 0.1),
							color: color === "default" ? "text.primary" : `${color}.main`,
							fontWeight: 800,
							borderRadius: 1.5,
							textTransform: "capitalize",
							border: "none"
						}}
					/>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			width: 80,
			render: (_, record) => (
				<CustomTooltip label="View Details">
					<Box
						onClick={() => {
							setSelectedTransaction(record);
							setIsDetailsOpen(true);
						}}
						sx={{
							display: "inline-flex",
							justifyContent: "center",
							alignItems: "center",
							p: 0.8,
							borderRadius: 2,
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							color: "primary.main",
							cursor: "pointer",
							transition: "background 0.2s",
							"&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
						}}>
						<Iconify icon="solar:document-text-bold-duotone" width={18} />
					</Box>
				</CustomTooltip>
			),
		},
	];

	// Prepare data for the main trend chart
	const chartData = useMemo(() => {
		const dates = [];
		let temp = dateRange.start;
		while (temp.isBefore(dateRange.end) || temp.isSame(dateRange.end)) {
			dates.push(temp.format("YYYY-MM-DD"));
			temp = temp.add(1, "day");
		}

		// Calculate total revenue series
		const points = dates.map((d) => {
			const daySum = allTransactions
				.filter(t => t.date === d && t.status === "succeeded")
				.reduce((sum, t) => sum + t.amount, 0);
			return parseFloat(daySum.toFixed(2));
		});

		// Calculate transaction count series
		const countPoints = dates.map((d) => {
			return allTransactions.filter(t => t.date === d && t.status === "succeeded").length;
		});

		return {
			categories: dates.map(d => dayjs(d).format("MMM DD")),
			series: [
				{ name: "Gift Revenue ($)", data: points },
				{ name: "Gift Purchases (Qty)", data: countPoints }
			]
		};
	}, [allTransactions, dateRange]);

	const mainChartOptions = {
		chart: {
			type: "area",
			toolbar: { show: false },
			fontFamily: theme.typography.fontFamily,
		},
		dataLabels: { enabled: false },
		stroke: { curve: "smooth", width: [3.5, 2.5] },
		xaxis: {
			categories: chartData.categories,
			labels: { style: { colors: theme.palette.text.secondary } },
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: [
			{
				title: { text: "Revenue ($)", style: { color: theme.palette.primary.main } },
				labels: {
					formatter: (val) => `$${val}`,
					style: { colors: theme.palette.text.secondary }
				}
			},
			{
				opposite: true,
				title: { text: "Purchases Count", style: { color: theme.palette.success.main } },
				labels: {
					style: { colors: theme.palette.text.secondary }
				}
			}
		],
		colors: [
			theme.palette.primary.main,
			theme.palette.success.main
		],
		fill: {
			type: "gradient",
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.35,
				opacityTo: 0.02,
				stops: [0, 100]
			}
		},
		legend: {
			position: "top",
			horizontalAlign: "center",
			labels: { colors: theme.palette.text.primary }
		},
		grid: {
			borderColor: theme.palette.divider,
			strokeDashArray: 3
		},
		tooltip: {
			shared: true,
			y: [
				{ formatter: (val) => `$${val.toFixed(2)}` },
				{ formatter: (val) => `${val} Purchases` }
			]
		}
	};

	// Popular gifts distribution chart
	const donutData = useMemo(() => {
		const giftCounts = {};
		allTransactions
			.filter(t => dayjs(t.date).isBetween(dateRange.start, dateRange.end, "day", "[]") && t.status === "succeeded")
			.forEach(t => {
				giftCounts[t.gift.name] = (giftCounts[t.gift.name] || 0) + t.amount;
			});

		const labels = Object.keys(giftCounts);
		const series = Object.values(giftCounts).map(val => parseFloat(val.toFixed(2)));
		
		return { series, labels };
	}, [allTransactions, dateRange]);

	const donutChartOptions = {
		chart: {
			type: "donut",
			fontFamily: theme.typography.fontFamily,
		},
		labels: donutData.labels,
		colors: ["#F44336", "#FF5722", "#795548", "#FF9800", "#4CAF50", "#00BCD4"],
		legend: {
			position: "bottom",
			labels: { colors: theme.palette.text.primary }
		},
		stroke: { show: false },
		plotOptions: {
			pie: {
				donut: {
					size: "72%",
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: "14px",
							fontWeight: 600,
							color: theme.palette.text.secondary
						},
						value: {
							show: true,
							fontSize: "20px",
							fontWeight: 800,
							color: theme.palette.text.primary,
							formatter: (val) => `$${parseFloat(val).toLocaleString()}`
						},
						total: {
							show: true,
							label: "Total Sales",
							color: theme.palette.text.secondary,
							formatter: (w) => {
								const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
								return `$${sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
							}
						}
					}
				}
			}
		},
		dataLabels: { enabled: false },
		tooltip: {
			y: { formatter: (val) => `$${val.toFixed(2)}` }
		}
	};

	// Export CSV handler
	const handleExportCSV = () => {
		setLoading(true);
		
		const dataToExport = filteredTransactions.map((t) => ({
			"Transaction ID": t.id,
			"Date": t.date,
			"Gift Name": t.gift.name,
			"Sparks Value": t.gift.sparks,
			"Gross Price": t.amount,
			"Processing Fee": t.fee,
			"Net Amount": t.net,
			"Customer": t.user.name,
			"Email": t.user.email,
			"Gateway": t.provider,
			"Status": t.status
		}));

		setTimeout(() => {
			try {
				const csv = Papa.unparse(dataToExport);
				const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.setAttribute("href", url);
				link.setAttribute("download", `gift_revenue_report_${dayjs().format("YYYY-MM-DD")}.csv`);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				sweetAlertSuccess("Gift Revenue CSV Report downloaded successfully!", "Export Success");
			} catch (err) {
				sweetAlerts("error", "Failed to generate CSV export.");
			} finally {
				setLoading(false);
			}
		}, 600);
	};

	// Export PDF statement handler
	const handleExportPDF = () => {
		setLoading(true);
		
		setTimeout(() => {
			try {
				const doc = new jsPDF();
				
				// Header
				doc.setFillColor(233, 30, 99); 
				doc.rect(0, 0, 210, 40, "F");
				
				doc.setTextColor(255, 255, 255);
				doc.setFont("helvetica", "bold");
				doc.setFontSize(22);
				doc.text("DAYTEME ADMIN PANEL", 15, 20);
				
				doc.setFont("helvetica", "normal");
				doc.setFontSize(12);
				doc.text("Gift Purchase Revenue Financial Report", 15, 28);
				
				// Meta details
				doc.setTextColor(50, 50, 50);
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10);
				doc.text("Date Generated:", 15, 52);
				doc.setFont("helvetica", "normal");
				doc.text(dayjs().format("MMMM DD, YYYY HH:mm"), 48, 52);
				
				doc.setFont("helvetica", "bold");
				doc.text("Reporting Period:", 15, 58);
				doc.setFont("helvetica", "normal");
				doc.text(`${dateRange.start.format("YYYY-MM-DD")} to ${dateRange.end.format("YYYY-MM-DD")} (${dateFilter.replace(/_/g, " ").toUpperCase()})`, 50, 58);
				
				doc.setDrawColor(220, 220, 220);
				doc.line(15, 65, 195, 65);
				
				// Summary section
				doc.setFont("helvetica", "bold");
				doc.setFontSize(14);
				doc.text("Gift Revenue Performance metrics", 15, 76);
				
				doc.setFillColor(245, 245, 245);
				doc.rect(15, 82, 180, 8, "F");
				doc.setFontSize(10);
				doc.text("Financial Metric", 18, 87);
				doc.text("Performance Values", 150, 87);
				
				doc.setFont("helvetica", "normal");
				doc.text("Total Gross Earnings", 18, 97);
				doc.text(`$${metrics.revenue.val.toLocaleString()}`, 150, 97);
				
				doc.text("Number of Gifts Purchased", 18, 105);
				doc.text(`${metrics.purchases.val.toLocaleString()} Purchases`, 150, 105);
				
				doc.text("Total Sparks Redeemed", 18, 113);
				doc.text(`${metrics.sparks.val.toLocaleString()} Sparks`, 150, 113);
				
				doc.text("Average Transaction Value", 18, 121);
				doc.text(`$${metrics.avgValue.val.toFixed(2)}`, 150, 121);
				
				doc.line(15, 128, 195, 128);
				
				// Top items breakdown
				doc.setFont("helvetica", "bold");
				doc.setFontSize(14);
				doc.text("Popular Gifts Sold Preview", 15, 138);
				
				let gy = 146;
				const giftList = ["Red Rose", "Heart Balloon", "Chocolate Box", "Teddy Bear", "Champagne Bottle", "Diamond Ring"];
				giftList.forEach((giftName) => {
					const totalAmount = allTransactions
						.filter(t => t.gift.name === giftName && dayjs(t.date).isBetween(dateRange.start, dateRange.end, "day", "[]") && t.status === "succeeded")
						.reduce((sum, t) => sum + t.amount, 0);
						
					const count = allTransactions
						.filter(t => t.gift.name === giftName && dayjs(t.date).isBetween(dateRange.start, dateRange.end, "day", "[]") && t.status === "succeeded")
						.length;
						
					doc.setFont("helvetica", "normal");
					doc.text(`${giftName}`, 18, gy);
					doc.text(`${count} Qty Sold`, 100, gy);
					doc.text(`$${totalAmount.toFixed(2)} Total`, 150, gy);
					gy += 8;
				});
				
				doc.setFontSize(8);
				doc.setTextColor(130, 130, 130);
				doc.text("Confidential document. Produced automatically by Dayteme Admin Financial System.", 15, 280);
				doc.text(`Page 1 of 1`, 180, 280);

				doc.save(`dayteme_gift_revenue_statement_${dayjs().format("YYYY-MM-DD")}.pdf`);
				sweetAlertSuccess("PDF Financial Statement downloaded successfully!", "PDF Report Downloaded");
			} catch (err) {
				sweetAlerts("error", "Failed to generate PDF download.");
			} finally {
				setLoading(false);
			}
		}, 800);
	};

	// Reset filter helper
	const handleResetFilters = () => {
		setSearchQuery("");
		setGiftFilter("all");
		setStatusFilter("all");
		setProviderFilter("all");
		setPage(1);
	};

	// Active filters count
	const activeFiltersCount = useMemo(() => {
		let count = 0;
		if (giftFilter !== "all") count++;
		if (statusFilter !== "all") count++;
		if (providerFilter !== "all") count++;
		return count;
	}, [giftFilter, statusFilter, providerFilter]);

	// Table Pagination slice math
	const tableData = useMemo(() => {
		const startIdx = (page - 1) * pageSize;
		return filteredTransactions.slice(startIdx, startIdx + pageSize);
	}, [filteredTransactions, page, pageSize]);

	return (
		<Stack spacing={4}>
			{/* Top Header */}
			<Stack spacing={2} direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
				<Box>
					<Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
						Revenue Overview
					</Typography>
					<Typography variant="body1" sx={{ color: "text.secondary" }}>
						Monitor earnings generated from user gift purchases, sparks redemption, and download statements.
					</Typography>
				</Box>

				<Stack spacing={1.5} direction="row">
					<Button
						onClick={handleExportCSV}
						disabled={loading || filteredTransactions.length === 0}
						variant="outlined"
						color="primary"
						startIcon={<Iconify icon="solar:download-bold-duotone" />}
						sx={{ borderRadius: 2, fontWeight: 800 }}
					>
						Export CSV
					</Button>
					<Button
						onClick={handleExportPDF}
						disabled={loading || filteredTransactions.length === 0}
						variant="contained"
						color="primary"
						startIcon={<Iconify icon="solar:document-text-bold-duotone" />}
						sx={{ borderRadius: 2, fontWeight: 800 }}
					>
						Export PDF
					</Button>
				</Stack>
			</Stack>

			{/* Timeframe Selectors Bar */}
			<Card sx={{ p: 2.5, borderRadius: 3, boxShadow: theme.shadows[1] }}>
				<Stack spacing={2.5} direction={{ xs: "column", md: "row" }} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{[
							{ id: "today", label: "Today" },
							{ id: "last_7_days", label: "7 Days" },
							{ id: "last_30_days", label: "30 Days" },
							{ id: "month_to_date", label: "This Month" },
							{ id: "custom", label: "Custom Range" },
						].map((item) => (
							<Button
								key={item.id}
								onClick={() => setDateFilter(item.id)}
								variant={dateFilter === item.id ? "contained" : "outlined"}
								color={dateFilter === item.id ? "primary" : "inherit"}
								sx={{
									borderRadius: 2,
									fontWeight: 700,
									px: 2.5,
									py: 0.8,
									border: dateFilter === item.id ? "none" : `1px solid ${theme.palette.divider}`,
									bgcolor: dateFilter === item.id ? "primary.main" : "transparent",
									color: dateFilter === item.id ? "common.white" : "text.secondary",
									"&:hover": {
										bgcolor: dateFilter === item.id ? "primary.dark" : alpha(theme.palette.text.primary, 0.04),
									}
								}}
							>
								{item.label}
							</Button>
						))}
					</Stack>

					{dateFilter === "custom" && (
						<Stack direction="row" spacing={1.5} alignItems="center">
							<TextField
								type="date"
								label="Start Date"
								size="small"
								InputLabelProps={{ shrink: true }}
								value={customStartDate}
								onChange={(e) => setCustomStartDate(e.target.value)}
								sx={{ width: 150 }}
							/>
							<Typography variant="body2" color="text.secondary" fontWeight={600}>to</Typography>
							<TextField
								type="date"
								label="End Date"
								size="small"
								InputLabelProps={{ shrink: true }}
								value={customEndDate}
								onChange={(e) => setCustomEndDate(e.target.value)}
								sx={{ width: 150 }}
							/>
						</Stack>
					)}

					<Box>
						<Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 700 }}>
							ACTIVE PERIOD: {dateRange.start.format("MMM DD, YYYY")} – {dateRange.end.format("MMM DD, YYYY")}
						</Typography>
					</Box>
				</Stack>
			</Card>

			{/* Gift Revenue Summaries Grid */}
			<Grid container spacing={2}>
				{/* Total Revenue */}
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
						<Stack spacing={1.5}>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Avatar sx={{ width: 38, height: 38, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
									<Iconify icon="solar:wad-of-money-bold-duotone" width={22} />
								</Avatar>
								<Chip
									label={`${metrics.revenue.growth >= 0 ? "+" : ""}${metrics.revenue.growth}%`}
									size="small"
									color={metrics.revenue.growth >= 0 ? "success" : "error"}
									sx={{ fontWeight: 800, borderRadius: 1 }}
								/>
							</Stack>
							
							<Box>
								<Typography variant="h4" fontWeight={800} color="text.primary">
									${metrics.revenue.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</Typography>
								<Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mt: 0.5 }}>
									Total Gift Revenue
								</Typography>
							</Box>
							
							<Divider sx={{ borderStyle: "dashed" }} />
							
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="caption" color="text.disabled" fontWeight={700}>
									Earnings Trend
								</Typography>
								<SparklineChart data={metrics.revenue.trend} color={theme.palette.primary.main} />
							</Stack>
						</Stack>
					</Card>
				</Grid>

				{/* Total Purchases */}
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
						<Stack spacing={1.5}>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Avatar sx={{ width: 38, height: 38, bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main" }}>
									<Iconify icon="solar:gift-bold-duotone" width={22} />
								</Avatar>
								<Chip
									label={`${metrics.purchases.growth >= 0 ? "+" : ""}${metrics.purchases.growth}%`}
									size="small"
									color={metrics.purchases.growth >= 0 ? "success" : "error"}
									sx={{ fontWeight: 800, borderRadius: 1 }}
								/>
							</Stack>
							
							<Box>
								<Typography variant="h4" fontWeight={800} color="text.primary">
									{metrics.purchases.val.toLocaleString()}
								</Typography>
								<Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mt: 0.5 }}>
									Gifts Purchased
								</Typography>
							</Box>
							
							<Divider sx={{ borderStyle: "dashed" }} />
							
							<Typography variant="caption" color="text.disabled" fontWeight={700}>
								Transaction Volume
							</Typography>
						</Stack>
					</Card>
				</Grid>

				{/* Sparks Redeemed */}
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
						<Stack spacing={1.5}>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Avatar sx={{ width: 38, height: 38, bgcolor: alpha(theme.palette.warning.main, 0.1), color: "warning.main" }}>
									<Iconify icon="solar:crown-star-bold-duotone" width={22} />
								</Avatar>
								<Chip
									label={`${metrics.sparks.growth >= 0 ? "+" : ""}${metrics.sparks.growth}%`}
									size="small"
									color={metrics.sparks.growth >= 0 ? "success" : "error"}
									sx={{ fontWeight: 800, borderRadius: 1 }}
								/>
							</Stack>
							
							<Box>
								<Typography variant="h4" fontWeight={800} color="text.primary">
									{metrics.sparks.val.toLocaleString()}
								</Typography>
								<Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mt: 0.5 }}>
									Total Sparks Spent
								</Typography>
							</Box>
							
							<Divider sx={{ borderStyle: "dashed" }} />
							
							<Typography variant="caption" color="text.disabled" fontWeight={700}>
								In-app Spark Flow
							</Typography>
						</Stack>
					</Card>
				</Grid>

				{/* Average Purchase Value */}
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
						<Stack spacing={1.5}>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Avatar sx={{ width: 38, height: 38, bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main" }}>
									<Iconify icon="solar:card-bold-duotone" width={22} />
								</Avatar>
								<Chip
									label={`${metrics.avgValue.growth >= 0 ? "+" : ""}${metrics.avgValue.growth}%`}
									size="small"
									color={metrics.avgValue.growth >= 0 ? "success" : "error"}
									sx={{ fontWeight: 800, borderRadius: 1 }}
								/>
							</Stack>
							
							<Box>
								<Typography variant="h4" fontWeight={800} color="text.primary">
									${metrics.avgValue.val.toFixed(2)}
								</Typography>
								<Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mt: 0.5 }}>
									Average Order Value
								</Typography>
							</Box>
							
							<Divider sx={{ borderStyle: "dashed" }} />
							
							<Typography variant="caption" color="text.disabled" fontWeight={700}>
								Revenue per transaction
							</Typography>
						</Stack>
					</Card>
				</Grid>
			</Grid>

			{/* Charts Block */}
			<Grid container spacing={3}>
				{/* Gift Revenue Trend line */}
				<Grid size={{ xs: 12, md: 8 }}>
					<Card variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%" }}>
						<Typography variant="h5" fontWeight={700} gutterBottom>
							Gift Earnings History
						</Typography>
						<Typography variant="body2" color="text.secondary" mb={3.5}>
							Tracking daily gross gift earnings alongside transaction volume.
						</Typography>
						<Box sx={{ height: 330 }}>
							<ReactApexChart options={mainChartOptions} series={chartData.series} type="area" height="100%" />
						</Box>
					</Card>
				</Grid>

				{/* Popular Gift Share */}
				<Grid size={{ xs: 12, md: 4 }}>
					<Card variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
						<Typography variant="h5" fontWeight={700} gutterBottom>
							Gift Share Breakdown
						</Typography>
						<Typography variant="body2" color="text.secondary" mb={4}>
							Contribution of different gifts to the overall platform revenue.
						</Typography>
						<Box sx={{ height: 260, display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
							<ReactApexChart options={donutChartOptions} series={donutData.series} type="donut" width="100%" />
						</Box>
					</Card>
				</Grid>
			</Grid>

			{/* Detailed Transaction Report Table Card */}
			<Card sx={{ borderRadius: 4, boxShadow: theme.shadows[2], overflow: "hidden" }}>
				<Stack spacing={2}>
					{/* Table Filters Header */}
					<Box sx={{ p: 3, pb: 1 }}>
						<Grid container spacing={2} alignItems="center">
							<Grid size={{ xs: 12, md: 4 }}>
								<CustomSearchInput
									loading={loading}
									defaultValue={searchQuery}
									callBack={setSearchQuery}
									placeholder="Search Txn ID, name, or gift..."
									width="100%"
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6, md: 2.2 }}>
								<FormControl fullWidth size="small">
									<InputLabel id="gift-filter-label">Gift Type</InputLabel>
									<Select
										labelId="gift-filter-label"
										value={giftFilter}
										label="Gift Type"
										onChange={(e) => {
											setGiftFilter(e.target.value);
											setPage(1);
										}}
									>
										<MenuItem value="all">All Gifts</MenuItem>
										<MenuItem value="Red Rose">🌹 Red Rose</MenuItem>
										<MenuItem value="Heart Balloon">🎈 Heart Balloon</MenuItem>
										<MenuItem value="Chocolate Box">🍫 Chocolate Box</MenuItem>
										<MenuItem value="Teddy Bear">🧸 Teddy Bear</MenuItem>
										<MenuItem value="Champagne Bottle">🍾 Champagne Bottle</MenuItem>
										<MenuItem value="Diamond Ring">💍 Diamond Ring</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid size={{ xs: 12, sm: 6, md: 2.2 }}>
								<FormControl fullWidth size="small">
									<InputLabel id="status-filter-label">Status</InputLabel>
									<Select
										labelId="status-filter-label"
										value={statusFilter}
										label="Status"
										onChange={(e) => {
											setStatusFilter(e.target.value);
											setPage(1);
										}}
									>
										<MenuItem value="all">All Statuses</MenuItem>
										<MenuItem value="succeeded">Succeeded</MenuItem>
										<MenuItem value="pending">Pending</MenuItem>
										<MenuItem value="failed">Failed</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid size={{ xs: 12, sm: 6, md: 2.2 }}>
								<FormControl fullWidth size="small">
									<InputLabel id="provider-filter-label">Gateway</InputLabel>
									<Select
										labelId="provider-filter-label"
										value={providerFilter}
										label="Gateway"
										onChange={(e) => {
											setProviderFilter(e.target.value);
											setPage(1);
										}}
									>
										<MenuItem value="all">All Gateways</MenuItem>
										<MenuItem value="stripe">Stripe</MenuItem>
										<MenuItem value="apple">Apple Pay</MenuItem>
										<MenuItem value="google">Google Pay</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid size={{ xs: 12, sm: 6, md: 1.4 }}>
								{activeFiltersCount > 0 || searchQuery !== "" ? (
									<Button
										fullWidth
										variant="outlined"
										color="error"
										startIcon={<Iconify icon="solar:trash-bin-trash-bold-duotone" />}
										onClick={handleResetFilters}
										sx={{ height: 40, fontWeight: 700 }}
									>
										Reset
									</Button>
								) : (
									<Button
										fullWidth
										disabled
										variant="outlined"
										startIcon={<Iconify icon="solar:filter-bold-duotone" />}
										sx={{ height: 40 }}
									>
										Filter
									</Button>
								)}
							</Grid>
						</Grid>
					</Box>

					{/* Ant Design Table */}
					<Box
						sx={{
							"& .ant-table-wrapper": { borderRadius: 0 },
							"& .ant-table": { background: "transparent" },
							"& .ant-table-thead > tr > th": {
								background: alpha(theme.palette.text.primary, 0.02),
								fontWeight: 800,
								color: "text.secondary",
								borderBottom: `1px dashed ${theme.palette.divider}`,
								textTransform: "uppercase",
								fontSize: "0.75rem",
							},
							"& .ant-table-tbody > tr > td": {
								borderBottom: `1px dashed ${theme.palette.divider}`,
							},
							"& .ant-table-tbody > tr:hover > td": {
								background: alpha(theme.palette.primary.main, 0.01),
							},
							"& .ant-table-tbody > tr:last-child > td": {
								borderBottom: "none",
							},
						}}>
						<Table
							className="custom-ant-table"
							showSorterTooltip={false}
							columns={columns}
							dataSource={tableData}
							scroll={{ x: "max-content" }}
							pagination={false}
							rowKey="id"
						/>
					</Box>

					<CustomPagination
						current={page}
						pageSize={pageSize}
						total={filteredTransactions.length}
						onShowSizeChange={(p, ps) => {
							setPage(p);
							setPageSize(ps);
						}}
						onChange={(e) => setPage(e)}
					/>
				</Stack>
			</Card>

			{/* Invoice Dialog */}
			<Dialog open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} maxWidth="xs" fullWidth>
				{selectedTransaction && (
					<>
						<DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="h5" fontWeight={800}>Transaction Invoice</Typography>
							<Chip
								label={selectedTransaction.status}
								size="small"
								color={selectedTransaction.status === "succeeded" ? "success" : selectedTransaction.status === "pending" ? "warning" : "error"}
								sx={{ fontWeight: 800 }}
							/>
						</DialogTitle>
						<DialogContent dividers sx={{ p: 3 }}>
							<Stack spacing={3}>
								<Card sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 3, border: `1px dashed ${theme.palette.primary.main}`, textAlign: "center" }}>
									<Typography variant="caption" color="text.secondary" fontWeight={700}>AMOUNT PAID</Typography>
									<Typography variant="h3" fontWeight={900} color="primary.main" sx={{ mt: 1 }}>
										${selectedTransaction.amount.toFixed(2)}
									</Typography>
									<Typography variant="caption" color="text.disabled">
										Sparks equivalent: {selectedTransaction.gift.sparks} Sparks
									</Typography>
								</Card>

								<Stack spacing={1.5}>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="body2" color="text.secondary" fontWeight={500}>Transaction ID:</Typography>
										<Typography variant="body2" color="text.primary" fontWeight={700}>{selectedTransaction.id}</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="body2" color="text.secondary" fontWeight={500}>Date & Time:</Typography>
										<Typography variant="body2" color="text.primary" fontWeight={700}>{selectedTransaction.date}</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2" color="text.secondary" fontWeight={500}>Gift Item:</Typography>
										<Stack direction="row" spacing={1} alignItems="center">
											<Typography variant="body2" color="text.primary" fontWeight={700}>
												{selectedTransaction.gift.emoji} {selectedTransaction.gift.name}
											</Typography>
										</Stack>
									</Stack>
								</Stack>

								<Divider sx={{ borderStyle: "dashed" }} />

								<Box>
									<Typography variant="subtitle2" fontWeight={800} color="text.primary" gutterBottom>Customer Details</Typography>
									<Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.5 }}>
										<Avatar sx={{ width: 38, height: 38, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 700 }}>
											{selectedTransaction.user.name.charAt(0)}
										</Avatar>
										<Box>
											<Typography variant="subtitle2" fontWeight={700}>{selectedTransaction.user.name}</Typography>
											<Typography variant="caption" color="text.secondary">{selectedTransaction.user.email}</Typography>
										</Box>
									</Stack>
								</Box>

								<Divider sx={{ borderStyle: "dashed" }} />

								<Stack spacing={1}>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="body2" color="text.secondary">Gross amount:</Typography>
										<Typography variant="body2" color="text.primary" fontWeight={600}>${selectedTransaction.amount.toFixed(2)}</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="body2" color="text.secondary">Gateway processing fee (2.9% + $0.30):</Typography>
										<Typography variant="body2" color="error.main" fontWeight={600}>-${selectedTransaction.fee.toFixed(2)}</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between" sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
										<Typography variant="subtitle2" color="text.primary" fontWeight={700}>Net settlement:</Typography>
										<Typography variant="subtitle2" color="success.main" fontWeight={800}>${selectedTransaction.net.toFixed(2)}</Typography>
									</Stack>
								</Stack>
							</Stack>
						</DialogContent>
						<DialogActions sx={{ p: 2 }}>
							<Button fullWidth onClick={() => setIsDetailsOpen(false)} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
								Close Invoice
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</Stack>
	);
};

export default Revenue;
