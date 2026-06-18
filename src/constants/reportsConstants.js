// Reports Page Constants
// Centralized configuration for all report filters, KPIs, mock data, and styling

// ==========================================
// FILTER OPTIONS (for custom dropdowns)
// ==========================================
export const DATE_OPTIONS = [
  { value: "7days", label: "Last 7 Days", icon: "CalendarIcon" },
  { value: "30days", label: "Last 30 Days", icon: "ClockIcon" },
  { value: "all", label: "All Time", icon: "ListIcon" },
];

export const TYPE_OPTIONS = [
  { value: "all", label: "All Ticket Types", icon: "TicketIcon" },
  { value: "billing", label: "Billing", icon: "CreditCardIcon" },
  { value: "support", label: "Support", icon: "TicketIcon" },
  { value: "technical", label: "Technical", icon: "WrenchIcon" },
];

export const REPORTS_PRIORITIES = [
  { value: "all", label: "All Priorities", icon: "ListIcon" },
  { value: "high", label: "High Priority", icon: "ArrowUpCircleIcon" },
  { value: "normal", label: "Normal Priority", icon: "MinusCircleIcon" },
];

export const CHANNEL_OPTIONS = [
  { value: "all", label: "All Channels", icon: "ListIcon" },
  { value: "email", label: "Email Channel", icon: "MailIcon" },
  { value: "chat", label: "Chat Channel", icon: "ChatIcon" },
  { value: "phone", label: "Phone Channel", icon: "PhoneIcon" },
  { value: "api", label: "API integration", icon: "CodeIcon" },
];

// ==========================================
// STATUS THEME MAPPING
// ==========================================
export const STATUS_THEMES = {
  resolved: "bg-[#D1FAE5] text-[#047857]",
  in_progress: "bg-[#E0F2FE] text-[#0369A1]",
  open: "bg-[#FEF3C7] text-[#B45309]",
  escalated: "bg-[#F3E8FF] text-[#7E22CE]",
};

export const AVATAR_COLORS = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600",
  "bg-pink-100 text-pink-600",
];

// ==========================================
// PDF TEMPLATE STYLES (react-pdf)
// ==========================================
export const PDF_STYLES = {
  page: { padding: 40, backgroundColor: "#F8FAFC", fontFamily: "Helvetica" },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 15,
  },
  title: { fontSize: 24, color: "#0F172A", fontWeight: "bold" },
  subtitle: { fontSize: 10, color: "#64748B", marginTop: 4 },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  kpiBox: {
    width: "15%",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  kpiLabel: {
    fontSize: 8,
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: "bold",
  },
  kpiValue: { fontSize: 16, color: "#0F172A", fontWeight: "bold" },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  chartBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 180,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "bold",
    marginBottom: 12,
  },
  chartImage: { width: "100%", height: 130, objectFit: "contain" },
  slaRow: { marginBottom: 12 },
  slaLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  slaCat: { fontSize: 9, color: "#334155", fontWeight: "bold" },
  slaTotal: { fontSize: 9, color: "#94A3B8" },
  slaBarContainer: {
    width: "100%",
    height: 12,
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
  },
  slaText: { fontSize: 7, color: "#FFFFFF", fontWeight: "bold" },
  slaTextDark: { fontSize: 7, color: "#64748B", fontWeight: "bold" },
  table: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    padding: 10,
  },
  col1: { width: "15%", fontSize: 9, color: "#1DA1F2", fontWeight: "bold" },
  col2: { width: "20%", fontSize: 9, color: "#334155", fontWeight: "bold" },
  col3: { width: "35%", fontSize: 9, color: "#475569" },
  col4: { width: "15%", fontSize: 9, color: "#475569" },
  col5: { width: "15%", fontSize: 9, color: "#475569" },
  th: {
    fontSize: 8,
    color: "#64748B",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
};

// ==========================================
// MOCK API DATA BY DATE RANGE
// ==========================================
export const MOCK_API_DATA_STORE = {
  "7days": {
    kpis: {
      ticketsHandled: { value: 312, trendPercent: 4 },
      resolved: { value: 290, trendPercent: 6 },
      slaCompliance: { value: 99.1, trendPercent: 1.2 },
      avgResponseMinutes: { value: 9, trendValue: -4 },
      escalations: { value: 2, trendPercent: -1 },
      openTickets: { value: 15, trendPercent: -12 },
    },
    trendData: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [40, 55, 45, 60, 30, 20, 62],
    },
    slaPerformance: [
      {
        id: "l1",
        category: "L1 Support Tickets",
        withinCount: 200,
        breachedCount: 5,
        total: 205,
      },
      {
        id: "esc",
        category: "Escalated Inquiries",
        withinCount: 30,
        breachedCount: 2,
        total: 32,
      },
      {
        id: "bil",
        category: "Billing Support",
        withinCount: 70,
        breachedCount: 5,
        total: 75,
      },
    ],
    tickets: [
      {
        id: "#TK-98301",
        customerName: "Alice Johnson",
        subject: "Login issue on mobile",
        responseTimeSecs: 120,
        status: "resolved",
        csat: 5,
        channel: "chat",
        priority: "high",
        type: "technical",
      },
      {
        id: "#TK-98299",
        customerName: "Bob Smith",
        subject: "Invoice discrepancy",
        responseTimeSecs: 450,
        status: "in_progress",
        csat: null,
        channel: "email",
        priority: "normal",
        type: "billing",
      },
    ],
  },
  "30days": {
    kpis: {
      ticketsHandled: { value: 1284, trendPercent: 12 },
      resolved: { value: 1142, trendPercent: 8 },
      slaCompliance: { value: 98.2, trendPercent: 0.5 },
      avgResponseMinutes: { value: 14, trendValue: -2 },
      escalations: { value: 12, trendPercent: 2 },
      openTickets: { value: 45, trendPercent: -5 },
    },
    trendData: {
      categories: ["01 OCT", "07 OCT", "14 OCT", "21 OCT", "30 OCT"],
      series: [120, 105, 180, 160, 210],
    },
    slaPerformance: [
      {
        id: "l1",
        category: "L1 Support Tickets",
        withinCount: 809,
        breachedCount: 111,
        total: 920,
      },
      {
        id: "esc",
        category: "Escalated Inquiries",
        withinCount: 139,
        breachedCount: 6,
        total: 145,
      },
      {
        id: "bil",
        category: "Billing Support",
        withinCount: 179,
        breachedCount: 40,
        total: 219,
      },
    ],
    tickets: [
      {
        id: "#TK-98234",
        customerName: "Jane Smith",
        subject: "Refund request for Order #5542",
        responseTimeSecs: 502,
        status: "resolved",
        csat: 5,
        channel: "email",
        priority: "high",
        type: "billing",
      },
      {
        id: "#TK-98230",
        customerName: "Marcus Wright",
        subject: "API connection timeout issue",
        responseTimeSecs: 850,
        status: "in_progress",
        csat: null,
        channel: "api",
        priority: "high",
        type: "technical",
      },
      {
        id: "#TK-98228",
        customerName: "Emma Lewis",
        subject: "Cannot access premium features",
        responseTimeSecs: 345,
        status: "resolved",
        csat: 4,
        channel: "email",
        priority: "normal",
        type: "support",
      },
      {
        id: "#TK-98227",
        customerName: "Liam Carter",
        subject: "Password reset not working",
        responseTimeSecs: 120,
        status: "resolved",
        csat: 5,
        channel: "chat",
        priority: "high",
        type: "support",
      },
      {
        id: "#TK-98225",
        customerName: "Olivia Patel",
        subject: "Question about enterprise pricing",
        responseTimeSecs: 4000,
        status: "open",
        csat: null,
        channel: "email",
        priority: "normal",
        type: "sales",
      },
      {
        id: "#TK-98221",
        customerName: "Noah Kim",
        subject: "System down in EU-West",
        responseTimeSecs: 60,
        status: "escalated",
        csat: null,
        channel: "phone",
        priority: "high",
        type: "technical",
      },
    ],
  },
  all: {
    kpis: {
      ticketsHandled: { value: 15420, trendPercent: 24 },
      resolved: { value: 14900, trendPercent: 22 },
      slaCompliance: { value: 96.5, trendPercent: -1.5 },
      avgResponseMinutes: { value: 18, trendValue: 4 },
      escalations: { value: 340, trendPercent: 15 },
      openTickets: { value: 45, trendPercent: -5 },
    },
    trendData: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      series: [2100, 1950, 2400, 2800, 2600, 3570],
    },
    slaPerformance: [
      {
        id: "l1",
        category: "L1 Support Tickets",
        withinCount: 9500,
        breachedCount: 800,
        total: 10300,
      },
      {
        id: "esc",
        category: "Escalated Inquiries",
        withinCount: 1500,
        breachedCount: 120,
        total: 1620,
      },
      {
        id: "bil",
        category: "Billing Support",
        withinCount: 3000,
        breachedCount: 500,
        total: 3500,
      },
    ],
    tickets: [
      {
        id: "#TK-90001",
        customerName: "Global Corp",
        subject: "Enterprise Server Setup",
        responseTimeSecs: 3600,
        status: "resolved",
        csat: 5,
        channel: "phone",
        priority: "high",
        type: "technical",
      },
      {
        id: "#TK-85023",
        customerName: "Sarah Connor",
        subject: "Account locked permanently",
        responseTimeSecs: 1400,
        status: "resolved",
        csat: 3,
        channel: "email",
        priority: "high",
        type: "support",
      },
      {
        id: "#TK-81200",
        customerName: "John Doe",
        subject: "Feedback on new UI",
        responseTimeSecs: 8000,
        status: "resolved",
        csat: 4,
        channel: "chat",
        priority: "normal",
        type: "support",
      },
    ],
  },
};

// ==========================================
// INITIAL FILTER STATE
// ==========================================
export const INITIAL_FILTERS = {
  dateFilter: "30days",
  typeFilter: "all",
  priorityFilter: "all",
  topChannelFilter: "all",
  tableChannelFilter: "all",
};

// ==========================================
// CHART HIGHCHARTS CONFIGURATION TEMPLATE
// ==========================================
export const getHighchartsConfig = (trendData) => ({
  chart: {
    type: "areaspline",
    height: 250,
    backgroundColor: "transparent",
    spacing: [10, 0, 0, 0],
    style: { fontFamily: "inherit" },
  },
  title: { text: null },
  xAxis: {
    categories: trendData.categories,
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: { color: "#94A3B8", fontSize: "11px", fontWeight: "bold" },
    },
  },
  yAxis: { visible: false, min: 0 },
  legend: { enabled: false },
  credits: { enabled: false },
  plotOptions: {
    areaspline: {
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, "rgba(29, 161, 242, 0.25)"],
          [1, "rgba(29, 161, 242, 0)"],
        ],
      },
      lineWidth: 2,
      lineColor: "#1DA1F2",
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 4,
        fillColor: "#1DA1F2",
      },
      animation: false,
    },
  },
  tooltip: {
    backgroundColor: "#1E293B",
    style: { color: "#fff" },
    borderWidth: 0,
    borderRadius: 8,
    shadow: false,
    formatter: function () {
      return `<b>${this.y}</b> tickets`;
    },
  },
  series: [{ name: "Tickets", data: trendData.series }],
});

// ==========================================
// TOAST CONFIGURATION
// ==========================================
export const TOAST_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error",
};
