import { Peripheral, Ticket, NetworkPrinter, InterviewQuestion } from "./types";

export const INITIAL_PERIPHERALS: Peripheral[] = [
  {
    id: "DEV-KB-01",
    name: "Dell KB216 Wired Keyboard",
    type: "Keyboard",
    status: "Connected",
    port: "USB-01 (Port 1/2)",
    driverVersion: "10.0.19041.1",
    lastActive: "Just now",
    manufacturer: "Dell Inc.",
    serialNumber: "CN-0F2V3Y-71616-98A-0402"
  },
  {
    id: "DEV-MS-02",
    name: "Logitech G304 Wireless Mouse",
    type: "Mouse",
    status: "Connected",
    port: "USB-02 (Wireless Receiver)",
    driverVersion: "1.2.454.0",
    lastActive: "Just now",
    manufacturer: "Logitech",
    serialNumber: "LZ145A890F-2"
  },
  {
    id: "DEV-MN-03",
    name: "Dell UltraSharp U2723QE 4K Monitor",
    type: "Monitor",
    status: "Connected",
    port: "USB-C DP-Alt Mode (Port 3)",
    driverVersion: "1.0.0.0",
    lastActive: "2 min ago",
    manufacturer: "Dell Inc.",
    serialNumber: "MX-0H0W3Y-61234-23B-0192"
  },
  {
    id: "DEV-PR-04",
    name: "Canon imageRUNNER ADVANCE DX C5840i (Indian Office)",
    type: "Printer",
    status: "Warning",
    port: "TCP/IP: 192.168.45.220",
    driverVersion: "Canon PS3 v30.45",
    lastActive: "5 min ago",
    manufacturer: "Canon",
    serialNumber: "CN-CRN-5840-98822"
  },
  {
    id: "DEV-HS-05",
    name: "Jabra Evolve2 65 Headset",
    type: "Headset",
    status: "Connected",
    port: "Bluetooth LE Audio",
    driverVersion: "2.81.0",
    lastActive: "Just now",
    manufacturer: "Jabra",
    serialNumber: "JB-EV65-9921-A"
  },
  {
    id: "DEV-ST-06",
    name: "SanDisk Extreme Pro Portable SSD",
    type: "Storage",
    status: "Disconnected",
    port: "USB 3.2 Gen 2 (Port 4)",
    driverVersion: "10.0.22000.1",
    lastActive: "2 hours ago",
    manufacturer: "Western Digital",
    serialNumber: "SD-EXT-2TB-9018"
  },
  {
    id: "DEV-CM-07",
    name: "Logitech Brio 4K Web Camera",
    type: "Camera",
    status: "Connected",
    port: "USB 3.0 (Port 5)",
    driverVersion: "2.4.29",
    lastActive: "1 hour ago",
    manufacturer: "Logitech",
    serialNumber: "LT-BRIO-4K-2234"
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "INC-2026-9081",
    title: "Cannot print PDF - Canon Uniflow server timeout",
    user: "Siddharth Nair",
    department: "Fixed Income Research (D.E. Shaw)",
    priority: "High",
    status: "Open",
    channel: "Slack",
    createdAt: "10 min ago",
    description: "Trying to print financial reports for the Q3 planning meeting. Sending job to Indian_Office_Uniflow_Secure_Print but receiving timeout error. Please check port 9100 on the Uniflow server."
  },
  {
    id: "INC-2026-9082",
    title: "Webex Audio cuts out during meeting room AV call",
    user: "Sarah Jenkins",
    department: "Global Travel & SIM Provisioning",
    priority: "Medium",
    status: "In_Progress",
    channel: "Webex",
    createdAt: "30 min ago",
    description: "The AV system in Conference Room 4B Bengaluru is failing to output microphone audio to international Webex attendees. Tested the physical HDMI matrix, seems ok. Needs software/driver verification."
  },
  {
    id: "INC-2026-9083",
    title: "VNC Remote Session requested for software enrollment",
    user: "Ananya Rao",
    department: "SaaS Business Ops",
    priority: "Low",
    status: "Open",
    channel: "Slack",
    createdAt: "1 hour ago",
    description: "Need help enrolling this desktop machine in Seqrite Endpoint Security. I keep getting error: 'Installation failed: Host unrecognized'. Requesting RealVNC remote session."
  },
  {
    id: "INC-2026-9084",
    title: "SIM Card Provisioning for Singapore Business Trip",
    user: "David Miller",
    department: "Executive Strategy",
    priority: "Medium",
    status: "Resolved",
    channel: "Email",
    createdAt: "Yesterday",
    description: "Requesting a physical SIM or eSIM card provisioned for travel tomorrow to the Singapore office. Require global roaming data and standard international calling enabled."
  },
  {
    id: "INC-2026-9085",
    title: "Power Maintenance Log: Bengaluru Server Room B",
    user: "Alert: Periscope Alert Bot",
    department: "IT Infrastructure Monitoring",
    priority: "Critical",
    status: "Resolved",
    channel: "Slack",
    createdAt: "2 days ago",
    description: "CRITICAL ALERT: Temp sensor in Rack 3 reached 26°C. Power distribution unit (PDU) redundancy check triggered. Action taken: Switched cooling fan matrix, temp reduced to 21°C."
  }
];

export const INITIAL_PRINTERS: NetworkPrinter[] = [
  {
    id: "PR-BLR-01",
    name: "Indian_Office_Canon_Uniflow_Color",
    ipAddress: "192.168.45.220",
    portName: "LPR_192.168.45.220_Uniflow",
    model: "Canon imageRUNNER ADVANCE DX C5840i",
    server: "BLR-UNIFLOW-SVR01",
    uniflowConfigured: true,
    policyEnforced: true,
    status: "Idle"
  },
  {
    id: "PR-BLR-02",
    name: "Indian_Office_Canon_Uniflow_BW",
    ipAddress: "192.168.45.221",
    portName: "RAW_9100_192.168.45.221_BW",
    model: "Canon imageRUNNER 2625i",
    server: "BLR-UNIFLOW-SVR01",
    uniflowConfigured: true,
    policyEnforced: true,
    status: "Printing"
  },
  {
    id: "PR-BLR-NEW",
    name: "BLR_Finance_Secured_Canon_Temp",
    ipAddress: "192.168.45.235",
    portName: "LPR_PORT_PENDING",
    model: "Canon i-SENSYS LBP223dw",
    server: "Pending Installation",
    uniflowConfigured: false,
    policyEnforced: false,
    status: "Offline"
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "Q1",
    question: "How do you set up and configure a new Network Printer on a server and integrate it into the Canon UniFLOW server?",
    category: "Printer SME",
    answerHint: "Create a standard TCP/IP print port (LPR or RAW 9100) on the server, configure the driver, add it to the UniFLOW administrative queue, set spooling, and configure security policies like authenticated card printing."
  },
  {
    id: "Q2",
    question: "Explain how you troubleshoot an end-user ticket complaining that they cannot print securely via Slack or Webex chat.",
    category: "Troubleshooting",
    answerHint: "First verify user registration on the UniFLOW server. Next, check local printer spooler, ensure their print queue points to the UniFLOW Secure Print server, and verify they are authenticated to the printer with their badge or PIN."
  },
  {
    id: "Q3",
    question: "What is your process for managing a Windows 11 Migration for 120+ restricted workstations with zero downtime and zero escalations?",
    category: "Remote Support",
    answerHint: "Ensure robust pre-migration backups, test software compatibility, schedule upgrades during off-peak hours in batches, provide on-site/remote support via RealVNC, and establish immediate feedback channels on Slack."
  },
  {
    id: "Q4",
    question: "How does your PowerShell peripheral monitoring script track connected USB devices for audits?",
    category: "Powershell & Automation",
    answerHint: "Query WMI objects or CIM instances (e.g., Get-CimInstance Win32_PnPEntity), filter by peripheral categories (Keyboard, Mouse, Audio, Camera), extract serial numbers, and format the telemetry into a payload for Telegraf and Grafana."
  },
  {
    id: "Q5",
    question: "How do you coordinate with hardware vendors for warranty claims on laptops and AV meeting setups?",
    category: "General Support",
    answerHint: "Identify device serial or asset tag, diagnose hardware failure using built-in BIOS diagnostics, open vendor ticket (Dell, Lenovo, Logitech), schedule on-site technician, and track progress using asset manager."
  }
];
