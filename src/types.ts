export interface Peripheral {
  id: string;
  name: string;
  type: "Keyboard" | "Mouse" | "Monitor" | "Printer" | "Headset" | "Storage" | "Camera";
  status: "Connected" | "Disconnected" | "Warning";
  port: string;
  driverVersion: string;
  lastActive: string;
  manufacturer: string;
  serialNumber: string;
}

export interface Ticket {
  id: string;
  title: string;
  user: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In_Progress" | "Resolved";
  channel: "Slack" | "Webex" | "Email";
  createdAt: string;
  description: string;
}

export interface NetworkPrinter {
  id: string;
  name: string;
  ipAddress: string;
  portName: string;
  model: string;
  server: string;
  uniflowConfigured: boolean;
  policyEnforced: boolean;
  status: "Idle" | "Printing" | "Offline" | "Error";
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answerHint: string;
  category: "Printer SME" | "Remote Support" | "Powershell & Automation" | "Troubleshooting" | "General Support";
  userAnswer?: string;
  score?: number;
  aiFeedback?: string;
}

export interface ChatMessage {
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: Date;
}
