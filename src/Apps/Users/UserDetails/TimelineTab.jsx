import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from "@mui/lab";
import Iconify from "src/components/common/iconify";

const TIMELINE_DATA = [
  { id: 1, title: "Account Created", date: "Jan 12, 2026, 10:30 AM", type: "system", icon: "solar:user-rounded-bold", color: "primary.main" },
  { id: 2, title: "Phone Verified", date: "Jan 12, 2026, 10:35 AM", type: "verification", icon: "solar:smartphone-bold", color: "success.main" },
  { id: 3, title: "Selfie Verification Approved", date: "Jan 13, 2026, 09:15 AM", type: "verification", icon: "solar:camera-bold", color: "success.main" },
  { id: 4, title: "Date Requested", date: "Jan 15, 2026, 08:20 PM", type: "date", icon: "solar:heart-bold", color: "info.main" },
  { id: 5, title: "Date Completed", date: "Jan 18, 2026, 11:00 PM", type: "date", icon: "solar:calendar-date-bold", color: "success.main" },
  { id: 6, title: "Premium Subscription Purchased", date: "Feb 01, 2026, 12:00 PM", type: "payment", icon: "solar:wallet-money-bold", color: "warning.main" },
  { id: 7, title: "Admin Action: Warning Sent", date: "Mar 05, 2026, 02:15 PM", type: "admin", icon: "solar:danger-triangle-bold", color: "error.main" },
];

export default function TimelineTab() {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 4 }}>Activity Timeline</Typography>
      
      <Timeline position="alternate">
        {TIMELINE_DATA.map((item, index) => (
          <TimelineItem key={item.id}>
            <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
              {item.date}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: item.color + '20', color: item.color }}>
                  <Iconify icon={item.icon} width={20} />
                </Box>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="subtitle2" fontWeight="700" component="span">
                {item.title}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
