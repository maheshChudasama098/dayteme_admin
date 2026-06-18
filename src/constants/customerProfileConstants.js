// Style maps from the provided code
export const PRIORITY_STYLES = {
  "High Priority": "text-red-500",
  "Medium Priority": "text-orange-500",
  "Low Priority": "text-slate-400",
};

export const STATUS_STYLES = {
  "In Progress": { color: "text-[#EA580C] bg-[#FFF7ED]", showDot: true },
  Closed: { color: "text-slate-500 bg-slate-50", showDot: false },
  Open: { color: "text-blue-600 bg-blue-50", showDot: true },
};

export const STAGE_STYLES = {
  VIP: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", dot: "bg-orange-500" },
  ACTIVE: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  LEAD: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  CHURNED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

export const CHAT_STATUS_STYLES = {
  Open: {
    text: "text-[#16A34A]",
    bg: "bg-[#DCFCE7]",
    dot: "bg-green-500",
    icon: "text-[#22C55E]",
  },
  Closed: {
    text: "text-[#64748B]",
    bg: "bg-[#F1F5F9]",
    dot: "bg-slate-400",
    icon: "text-slate-400",
  },
};

export const DOC_TYPE_STYLES = {
  pdf: { bg: "bg-red-50", text: "text-red-500" },
  img: { bg: "bg-[#FEF9C3]", text: "text-[#CA8A04]" },
  doc: { bg: "bg-green-50", text: "text-green-500" },
};

export const CUSTOMER_PROFILE_TABS = {
  OVERVIEW: "Overview",
  TICKETS: "Tickets",
  CHATS: "Chats",
  DOCUMENTS: "Documents",
  ACTIVITY: "Activity",
};

export const MOCK_TICKETS = [
  {
    id: "#TKT-212",
    title: "KYC Document Verification",
    date: "Feb 19, 2026",
    priority: "High Priority",
    status: "In Progress",
  },
  {
    id: "#TKT-045",
    title: "Premium Payment Query",
    date: "Oct 12, 2025",
    priority: "Low Priority",
    status: "Closed",
  },
  {
    id: "#TKT-067",
    title: "Address Update",
    date: "Dec 5, 2025",
    priority: "Low Priority",
    status: "Closed",
  },
  {
    id: "#TKT-045",
    title: "Premium Payment Query",
    date: "Oct 12, 2025",
    priority: "Low Priority",
    status: "Closed",
  },
  {
    id: "#TKT-012",
    title: "Initial Registration",
    date: "Aug 1, 2025",
    priority: "Low Priority",
    status: "Closed",
  },
];

export const MOCK_CHATS = [
  {
    id: "#TKT-212",
    message: "Hi, I need help with my KYC document. It was rejected last week.",
    date: "FEB 19, 2026",
    count: 12,
    status: "Open",
  },
  {
    id: "#TKT-098",
    message: "Thank you for resolving my policy issue so quickly!",
    date: "JAN 10, 2026",
    count: 5,
    status: "Closed",
  },
  {
    id: "#TKT-067",
    message: "Policy renewal query — need clarification on premium",
    date: "DEC 5, 2025",
    count: 8,
    status: "Closed",
  },
];

export const MOCK_DOCUMENTS = [
  {
    id: 1,
    name: "ID-Proof.pdf",
    size: "234 KB",
    date: "Feb 19, 2024",
    type: "pdf",
  },
  {
    id: 2,
    name: "Policy-Aggrement.pdf",
    size: "512 KB",
    date: "Jan 10, 2024",
    type: "pdf",
  },
  {
    id: 3,
    name: "Photo-ID.jpg",
    size: "1.4 MB",
    date: "Jan 10, 2024",
    type: "img",
  },
  {
    id: 4,
    name: "Signed_Contract_2024.docx",
    size: "89 KB",
    date: "Dec 22, 2023",
    type: "doc",
  },
];

export const MOCK_ACTIVITY = [
  {
    type: "ticket_created",
    title: "New ticket #TKT-123 created — KYC Document Verification",
    description:
      "Automatic system verification failed. Ticket assigned to agent 'Sarah Johnson' for manual review.",
    date: "Feb 19, 2024",
    time: "09:15 AM",
    extra: "",
  },
  {
    type: "whatsapp_chat",
    title: "WhatsApp conversation started — 12 messages exchanged",
    description:
      "Customer inquired about the status of their identity proof documents. Response time: 2 mins.",
    date: "Feb 19, 2024",
    time: "09:10 AM",
    extra: "2 mins",
  },
  {
    type: "document_uploaded",
    title: "Document uploaded — ID_Proof.pdf",
    description:
      "Customer uploaded a government-issued ID card. File size: 2.4 MB. Security scan: Passed.",
    date: "Feb 19, 2024",
    time: "09:22 AM",
    extra: "Date",
  },
  {
    type: "ticket_escalated",
    title: "Ticket #TKT-098 escalated to manager",
    description:
      "Issue regarding billing discrepancy required senior level approval. Assigned to 'Mark Thompson'.",
    date: "Jan 12, 2024",
    time: "11:30 PM",
    extra: "",
  },
  {
    type: "ticket_resolved",
    title: "Ticket #TKT-098 resolved and closed",
    description:
      "Refund processed and confirmation sent to the user via email.",
    date: "Jan 10, 2024",
    time: "01:00 PM",
    extra: "",
  },
  {
    type: "profile_updated",
    title: "Contact profile updated — address changed",
    description:
      "Address updated from 'Old Delhi' to 'South Mumbai' as per document verification.",
    date: "Dec 05, 2023",
    time: "11:45 AM",
    extra: "",
  },
];

export const MOCK_PROFILE_DB = {
  1: {
    id: "1",
    name: "Arjun Shah",
    email: "arjun.shah@example.com",
    phone: "+91 98765 43210",
    location: "Ahmedabad, Gujarat",
    role: "Policy",
    stage: "VIP",
    tickets: 5,
    open: 2,
    esc: 1,
    sat: "4.8",
    res: "12h",
    completion: 90,
  },
  2: {
    id: "2",
    name: "Divya Nair",
    email: "divya.nair@email.com",
    phone: "+91 99887 76655",
    location: "Kochi, Kerala",
    role: "Support",
    stage: "ACTIVE",
    tickets: 12,
    open: 4,
    esc: 0,
    sat: "4.5",
    res: "14h",
    completion: 100,
  },
  default: {
    id: "default",
    name: "John Deo",
    email: "john.deo@email.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    role: "KYC",
    stage: "ACTIVE",
    tickets: 5,
    open: 2,
    esc: 1,
    sat: "4.2",
    res: "19h",
    completion: 85,
  },
};

export const CUSTOMER_DIVISIONS = ["KYC", "Support", "Legal", "Sales"];
export const CUSTOMER_STAGES = ["ACTIVE", "VIP", "LEAD", "CHURNED"];
