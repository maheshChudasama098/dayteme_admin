// Settings Page Constants

export const SETTINGS_DIVISIONS = [
  { value: "kyc", label: "KYC Division" },
  { value: "support", label: "General Support" },
  { value: "billing", label: "Billing & Finance" },
  { value: "technical", label: "Technical Support" },
];

export const MOCK_API_USER_PROFILE = {
  firstName: "Rahul",
  lastName: "Sharma",
  email: "rahulsharma@gmail.com",
  phone: "+91 12345 43210",
  division: "kyc",
  role: "Support Agent",
  employeeId: "EMP-2024-0142",
  avatarUrl: null, // Will be set from assets
};

export const MOCK_API_NOTIFICATION_SETTINGS = {
  alertTypes: {
    newTicket: true,
    slaWarning: true,
    slaBreach: true,
    escalation: true,
    whatsappReply: true,
    documentUpload: false,
  },
  deliveryMethod: {
    inAppBanner: true,
    auditorySignals: true,
    emailDigest: false,
    activeBadgeSync: true,
  },
};

export const SETTINGS_TABS = {
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
  SECURITY: "security",
  TICKET_LIMIT: "ticket_limit",
};
