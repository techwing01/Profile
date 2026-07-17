import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  Printer, 
  Cpu, 
  Headphones, 
  User, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Send, 
  RefreshCw, 
  Play, 
  Check, 
  Activity, 
  MessageSquare, 
  PhoneCall, 
  Server, 
  Monitor as MonitorIcon, 
  Plus, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  Settings, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Laptop,
  Usb,
  Globe
} from "lucide-react";
import Workspace3D from "./components/Workspace3D";
import { Peripheral, Ticket, NetworkPrinter, InterviewQuestion, ChatMessage } from "./types";
import { INITIAL_PERIPHERALS, INITIAL_TICKETS, INITIAL_PRINTERS, INTERVIEW_QUESTIONS } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // App States
  const [peripherals, setPeripherals] = useState<Peripheral[]>(INITIAL_PERIPHERALS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [printers, setPrinters] = useState<NetworkPrinter[]>(INITIAL_PRINTERS);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(INTERVIEW_QUESTIONS);
  
  // PowerShell Console States
  const [psCommand, setPsCommand] = useState<string>("");
  const [psLogs, setPsLogs] = useState<string[]>([
    "Windows PowerShell",
    "Copyright (C) Microsoft Corporation. All rights reserved.",
    "",
    "PS C:\\Users\\rashid_blr> # Ready to scan peripheral devices",
    "PS C:\\Users\\rashid_blr> Get-CimInstance Win32_PnPEntity | Where-Object { $_.Status -eq 'OK' }",
    "Type 'help' or click 'Run Device Scan' to list devices."
  ]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanCount, setScanCount] = useState<number>(1);
  const [selectedPeripheral, setSelectedPeripheral] = useState<Peripheral | null>(INITIAL_PERIPHERALS[0]);

  // Canon UniFLOW Wizard States
  const [newPrinterName, setNewPrinterName] = useState<string>("BLR_Finance_Secured_Canon_Temp");
  const [newPrinterIP, setNewPrinterIP] = useState<string>("192.168.45.235");
  const [newPrinterPort, setNewPrinterPort] = useState<string>("LPR_192.168.45.235_Uniflow");
  const [uniflowStep, setUniflowStep] = useState<number>(1); // 1: Port, 2: Server Queue, 3: Policies
  const [printingLog, setPrintingLog] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [policyGrayscale, setPolicyGrayscale] = useState<boolean>(true);
  const [policyBadgeAuth, setPolicyBadgeAuth] = useState<boolean>(true);

  // VNC Simulator States
  const [activeVNCTicket, setActiveVNCTicket] = useState<Ticket | null>(null);
  const [vncConnected, setVncConnected] = useState<boolean>(false);
  const [vncLog, setVncLog] = useState<string[]>([]);
  const [vncSpoolerStatus, setVncSpoolerStatus] = useState<"stopped" | "running">("stopped");
  const [vncSeqriteInstalled, setVncSeqriteInstalled] = useState<boolean>(false);
  const [vncIsSolving, setVncIsSolving] = useState<boolean>(false);

  // Interview QA states
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(INTERVIEW_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isSimulatingAnswer, setIsSimulatingAnswer] = useState<boolean>(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<{ score: number; text: string } | null>(null);

  // AI Troubleshooter Chatbot States
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello! I am Rashid's AI Portfolio Representative & IT Troubleshooting Assistant. Ask me anything about Rashid's experience at D. E. Shaw, how he manages Canon UniFLOW servers, his PowerShell automation dashboards, or ask me to troubleshoot general IT infrastructure issues!",
      timestamp: new Date()
    }
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Execute Powershell Simulator Command
  const handlePsCommand = (cmdText?: string) => {
    const text = (cmdText || psCommand).trim();
    if (!text) return;
    
    let newLogs = [...psLogs, `PS C:\\Users\\rashid_blr> ${text}`];
    const cmdLower = text.toLowerCase();

    if (cmdLower === "help") {
      newLogs.push(
        "Available commands:",
        "  Get-Peripheral          - Query connected keyboard, mouse, monitor, etc.",
        "  Scan-Devices            - Perform standard Telegraf/Prometheus hardware inventory scan.",
        "  Clear-Host (or 'cls')   - Clear the console.",
        "  Get-Printer             - List all mapped office printers.",
        "  Get-Service Spooler     - Check local spooler service status."
      );
    } else if (cmdLower === "cls" || cmdLower === "clear-host" || cmdLower === "clear") {
      newLogs = ["Windows PowerShell (Cleared)"];
    } else if (cmdLower === "get-peripheral" || cmdLower.includes("win32_pnpentity")) {
      newLogs.push(
        `Scanning CIM instance... Found ${peripherals.filter(p => p.status === "Connected").length} connected USB/Peripheral devices.`,
        "----------------------------------------------------------------------------------",
        "DeviceID      Manufacturer  Name                                      Status",
        "--------      ------------  ----                                      ------",
        ...peripherals.map(p => `${p.id.padEnd(13)} ${p.manufacturer.padEnd(13)} ${p.name.substring(0, 40).padEnd(41)} ${p.status}`)
      );
    } else if (cmdLower === "scan-devices" || cmdLower === "scan") {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setScanCount(prev => prev + 1);
        setPeripherals(prev => 
          prev.map(p => p.id === "DEV-ST-06" ? { ...p, status: "Connected", lastActive: "Just now" } : p)
        );
        setPsLogs(prev => [
          ...prev,
          "Scanning nodes via Telegraf daemon...",
          "Prometheus poll triggered successfully.",
          "SUCCESS: Re-mapped connected peripheral storage 'SanDisk Extreme Pro' (DEV-ST-06)!",
          "Grafana dashboard telemetry updated."
        ]);
      }, 1500);
      return;
    } else if (cmdLower === "get-printer") {
      newLogs.push(
        "Name                                 ComputerName     PortName                       Shared",
        "----                                 ------------     --------                       ------",
        ...printers.map(p => `${p.name.padEnd(36)} ${p.server.padEnd(16)} ${p.portName.padEnd(30)} ${p.uniflowConfigured ? "True" : "False"}`)
      );
    } else if (cmdLower.includes("spooler")) {
      newLogs.push(
        "Status   Name               DisplayName",
        "------   ----               -----------",
        "Running  Spooler            Print Spooler Service"
      );
    } else {
      newLogs.push(`Command '${text}' not recognized. Type 'help' for available diagnostic commands.`);
    }

    setPsLogs(newLogs);
    setPsCommand("");
  };

  // Setup Network Printer SME UniFLOW Steps
  const handleInstallPrinterStep = () => {
    if (uniflowStep === 1) {
      setIsInstalling(true);
      setTimeout(() => {
        setIsInstalling(false);
        setUniflowStep(2);
        setPrintingLog(prev => [
          ...prev,
          `[STEP 1 SUCCESS] Created Standard TCP/IP Print Port: ${newPrinterPort}`,
          `[STEP 1 SUCCESS] Network socket bound to target node IP ${newPrinterIP}:9100`
        ]);
      }, 1200);
    } else if (uniflowStep === 2) {
      setIsInstalling(true);
      setTimeout(() => {
        setIsInstalling(false);
        setUniflowStep(3);
        setPrintingLog(prev => [
          ...prev,
          `[STEP 2 SUCCESS] Registered queue on server 'BLR-UNIFLOW-SVR01'`,
          `[STEP 2 SUCCESS] UniFLOW driver bound: 'Canon PS3 v30.45' (PCL6 Spooler configuration set)`
        ]);
      }, 1200);
    } else if (uniflowStep === 3) {
      setIsInstalling(true);
      setTimeout(() => {
        setIsInstalling(false);
        setPrinters(prev => 
          prev.map(p => p.id === "PR-BLR-NEW" ? {
            ...p,
            name: newPrinterName,
            ipAddress: newPrinterIP,
            portName: newPrinterPort,
            server: "BLR-UNIFLOW-SVR01",
            uniflowConfigured: true,
            policyEnforced: true,
            status: "Idle"
          } : p)
        );
        // Force the connected peripheral status as well
        setPeripherals(prev =>
          prev.map(p => p.id === "DEV-PR-04" ? { ...p, status: "Connected", lastActive: "Just now" } : p)
        );
        setUniflowStep(1);
        setPrintingLog([]);
        alert("Success! Canon UniFLOW printer installed, secure ports added, and corporate policies applied.");
      }, 1500);
    }
  };

  // Launch RealVNC remote session simulation
  const handleVNCLaunch = (ticket: Ticket) => {
    setActiveVNCTicket(ticket);
    setVncConnected(true);
    setVncLog([
      `RealVNC Viewer Enterprise v7.11`,
      `Connecting to ${ticket.user}'s workstation...`,
      `Session established via secure gateway.`,
      `Diagnostic status: Host computer screen shared.`
    ]);
    if (ticket.id === "INC-2026-9081") {
      setVncSpoolerStatus("stopped");
    } else if (ticket.id === "INC-2026-9083") {
      setVncSeqriteInstalled(false);
    }
  };

  const handleVNCSolve = () => {
    setVncIsSolving(true);
    setTimeout(() => {
      setVncIsSolving(false);
      if (activeVNCTicket?.id === "INC-2026-9081") {
        setVncSpoolerStatus("running");
        setVncLog(prev => [...prev, "SUCCESS: Executed 'net start spooler'. Spooler service is now Running."]);
      } else if (activeVNCTicket?.id === "INC-2026-9083") {
        setVncSeqriteInstalled(true);
        setVncLog(prev => [
          ...prev, 
          "SUCCESS: Enrolled client in Seqrite Endpoint Security client management panel.",
          "Policy update pushed. System enrolled successfully!"
        ]);
      }

      // Mark Ticket as resolved
      setTickets(prev =>
        prev.map(t => t.id === activeVNCTicket?.id ? { ...t, status: "Resolved" } : t)
      );

      // Add a follow-up chat notification
      const userMessage = activeVNCTicket?.user || "End User";
      alert(`VNC Session Complete: Issue resolved! ${userMessage} sent a confirmation on Slack: "Thanks Rashid! The printer and client work perfectly now. Excellent quick resolution."`);
      setVncConnected(false);
      setActiveVNCTicket(null);
    }, 1800);
  };

  // Interview Simulator answers
  const handlePlayCandidateAnswer = () => {
    if (!selectedQuestion) return;
    setIsSimulatingAnswer(true);
    setUserAnswer(selectedQuestion.answerHint);
    
    // Simulate candidate speaking / streaming transcript
    setTimeout(() => {
      setIsSimulatingAnswer(false);
      // Give automated expert score
      setEvaluationFeedback({
        score: 98,
        text: "Exceptional explanation! Demonstrates comprehensive domain knowledge as a true SME. Directly mentions LPR/RAW ports, spoolers, UniFLOW queues, and AD security policies."
      });
    }, 2000);
  };

  const handleEvaluateCustomAnswer = () => {
    if (!userAnswer) return;
    setIsSimulatingAnswer(true);
    setTimeout(() => {
      setIsSimulatingAnswer(false);
      setEvaluationFeedback({
        score: 85,
        text: "Strong answer. Incorporates practical troubleshooting keywords. To elevate to SME status, elaborate on specific server architecture (such as print port parameters, uniflow secure-release release queues, and policies)."
      });
    }, 1500);
  };

  // AI Assistant Chat Route
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || chatInput).trim();
    if (!promptToSend) return;

    // Append User Message
    const userMsg: ChatMessage = { sender: "user", text: promptToSend, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with server");
      }

      const botMsg: ChatMessage = { sender: "bot", text: data.response, timestamp: new Date() };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      // Fallback response with beautiful helpful instructions
      let errMsg = "I encountered an issue connecting to my live Gemini engine.";
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("Secrets")) {
        errMsg = "I am ready to power Rashid's Live Gemini AI Engine! To activate my real-time responses, please add your **GEMINI_API_KEY** in the **Settings > Secrets** panel in the Google AI Studio UI.\n\nIn the meantime, let me act as Rashid's pre-configured IT system and present the answer from my cache: \n\n*Rashid is fully trained as an IT Support Specialist. His key roles include Canon UniFLOW server setup (port mappings, secure card releases), Webex/Slack ticket queue diagnostics, Powershell USB peripheral monitors, and Windows 11 upgrades. Speak to him or schedule an interview at rashidak77@gmail.com!*";
      } else {
        errMsg = `Note: To enable live Gemini responses, please make sure to add your GEMINI_API_KEY inside the Secrets panel. Here is a stored summary of Rashid's specialized printer SME background: Rashid administers Canon imageRUNNER DX printers by mapping custom LPR/RAW TCP ports, linking security releases with company badges, and writing PowerShell scripts to query endpoint assets.`;
      }
      
      const botMsg: ChatMessage = { 
        sender: "system", 
        text: errMsg, 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, botMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-800 border-2 border-blue-500/30 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/10">
              <Terminal className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-1.5 font-mono">
              RASHID_AK.sys <span className="text-xs text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded font-normal border border-blue-900/30">v1.4</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              SYSTECH ENGINEER <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> PORTFOLIO CONSOLE
            </p>
          </div>
        </div>

        {/* Quick Tech Specs Strip */}
        <div className="hidden lg:flex items-center gap-6 text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-6">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetry: <strong className="text-slate-200">99.8% OK</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>SME Printer: <strong className="text-slate-200">Canon UniFLOW</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>VNC: <strong className="text-slate-200">RealVNC Remote Engaged</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>USB Script: <strong className="text-slate-200">Active</strong></span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex items-center gap-3">
          <a 
            href="mailto:rashidak77@gmail.com" 
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition text-slate-300"
          >
            Email Me
          </a>
          <a 
            href="https://www.linkedin.com/in/rashidak771" 
            target="_blank" 
            referrerPolicy="no-referrer"
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition inline-flex items-center gap-1 shadow-lg shadow-blue-900/20"
          >
            LinkedIn <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Studio Setup / Navigation Cards (lg:col-span-4) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Quick Bio Info Header Card */}
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-5 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-mono text-2xl font-bold text-white relative shadow-lg shadow-blue-900/20">
                RA
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Rashid AK</h2>
                <p className="text-xs text-blue-400 font-mono font-medium">Systech Support Engineer</p>
                <p className="text-xs text-slate-400 mt-1">Specialized in Corporate IT Infrastructure, End-User Troubleshooting, and Network Printer Architectures.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                <span className="text-slate-500 block">LOCATION</span>
                <span className="text-slate-200">Bengaluru, India</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                <span className="text-slate-500 block">CURRENT ROLE</span>
                <span className="text-slate-200">D. E. Shaw (via Xpheno)</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Canvas Portal */}
          <div className="flex-1 min-h-[380px] lg:h-[480px]">
            <Workspace3D 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              powershellQueryCount={scanCount}
              openTicketCount={tickets.filter(t => t.status === "Open").length}
              configuredPrintersCount={printers.filter(p => p.uniflowConfigured).length}
              vncConnected={vncConnected}
            />
          </div>

          {/* Tab Navigation Menu */}
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-2 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-1.5 backdrop-blur-md">
            {[
              { id: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
              { id: "powershell", label: "PowerShell", icon: <Terminal className="w-3.5 h-3.5" /> },
              { id: "printer", label: "Canon SME", icon: <Printer className="w-3.5 h-3.5" /> },
              { id: "tickets", label: "Support Queue", icon: <Headphones className="w-3.5 h-3.5" /> },
              { id: "interview", label: "Interview", icon: <Laptop className="w-3.5 h-3.5" /> },
              { id: "ai", label: "AI Troubleshoot", icon: <Sparkles className="w-3.5 h-3.5" /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive 
                      ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20 border border-blue-500/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: Console Details and Interactive Systems (lg:col-span-8) */}
        <div className="lg:col-span-7 bg-slate-900/40 rounded-2xl border border-slate-800/60 overflow-hidden flex flex-col min-h-[500px] backdrop-blur-md relative">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/5 blur-3xl pointer-events-none" />
          
          {/* Main Workspace Frame */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col">
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PROFESSIONAL PROFILE & EXPERIENCE */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      <h3 className="text-md font-bold tracking-wide text-slate-200">PROFESSIONAL TIMELINE</h3>
                    </div>
                    <span className="text-[10px] bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg font-mono">RESUME.md</span>
                  </div>

                  {/* Career Timeline */}
                  <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-800">
                    
                    {/* D. E. Shaw */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-950">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 font-mono">D. E. Shaw & Co | Xpheno Pvt Ltd</h4>
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono border border-blue-500/10">2023 - PRESENT</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300">Technology Specialist / Systech Support SME</p>
                      <ul className="text-slate-400 text-[11px] space-y-1.5 mt-2 list-disc pl-4 leading-relaxed">
                        <li>Comprehensive end-user tech support handling chat, calls, and tickets. Utilizing <strong className="text-slate-200">Webex</strong> and <strong className="text-slate-200">Slack</strong>.</li>
                        <li>Bengaluru office SME for <strong className="text-slate-200">Canon UniFLOW</strong>. Adding print ports, uniflow servers, policy configurations, and scripts.</li>
                        <li>Configured a powershell hardware tracker parsing device logs and sending telemetry to <strong className="text-slate-200">Telegraf, Prometheus, and Grafana</strong>.</li>
                        <li>Oversaw data center operations, redundancy cooling fan setups, and warranty laptop claim diagnostics.</li>
                        <li>Led <strong className="text-slate-200">Windows 11 upgrade execution</strong> for 120+ workstations with absolute zero downtime.</li>
                      </ul>
                    </div>

                    {/* Fcoos Technologies */}
                    <div className="relative pl-8">
                      <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 font-mono">Fcoos Technologies Pvt Ltd</h4>
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded font-mono">2022 - 2023</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300">System Support Engineer</p>
                      <ul className="text-slate-400 text-[11px] space-y-1 mt-1 list-disc pl-4 leading-relaxed">
                        <li>Managed G-Suite admin systems, emails, backups, and user credentials.</li>
                        <li>Enrolled <strong className="text-slate-200">80% of corporate endpoints</strong> in Seqrite End Point Security.</li>
                        <li>Researched and deployed cost-efficient corporate DLP (Data Leakage Prevention).</li>
                      </ul>
                    </div>

                    {/* EGAPOW IT Solution */}
                    <div className="relative pl-8">
                      <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 font-mono">EGAPOW IT SOLUTION</h4>
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded font-mono">2017 - 2018</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300">Desktop Support Engineer (Thalassery)</p>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                        Delivered on-site and remote hardware solutions using <strong className="text-slate-200">RealVNC</strong> and RDP for private clients and VIP corporate entities.
                      </p>
                    </div>

                    {/* ThakralOne */}
                    <div className="relative pl-8">
                      <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 font-mono">ThakralOne Solution Pvt Ltd</h4>
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded font-mono">2018 - 2021</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300">Cable Maintenance and Telco Engineer (Kochi)</p>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                        Contracted at EXL Service. Executed server room fiber cable matrices, hardware/software installation, and physical telecom infrastructure troubleshooting.
                      </p>
                    </div>

                  </div>

                  {/* Education & Core Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1 mb-2 font-mono">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> EDUCATION
                      </h4>
                      <p className="text-xs font-semibold text-slate-300">Diploma in Computer Engineering</p>
                      <p className="text-[11px] text-slate-400">NTTF (Nettur Technical Training Foundation)</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1 mb-2 font-mono">
                        <Settings className="w-3.5 h-3.5 text-blue-400" /> STACK & SUITE
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["Canon UniFLOW", "RealVNC", "Webex / Slack", "PowerShell", "Telegraf", "Seqrite Endpoint", "Active Directory", "SCCM", "Prometheus", "Grafana"].map((s) => (
                          <span key={s} className="bg-slate-800/30 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/50 font-mono transition-colors hover:bg-slate-800/50 hover:border-slate-600">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 2: POWERSHELL PERIPHERAL DASHBOARD */}
              {activeTab === "powershell" && (
                <motion.div
                  key="powershell"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-blue-400" />
                      <h3 className="text-md font-bold tracking-wide">POWERSHELL & TELEMETRY MONITOR</h3>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg font-mono border border-blue-500/10">WMI / Telegraf Daemon</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Rashid built a script to poll connected USB/Peripheral endpoints and report metrics to Prometheus/Grafana. Experience the dashboard below:
                  </p>

                  {/* Top: Grafana style micro charts */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[10px]">
                    <div className="space-y-1">
                      <span className="text-slate-500">USB SCAN LATENCY</span>
                      <div className="text-xs text-blue-400 font-bold">14 ms (Optimized)</div>
                      <div className="flex items-end gap-0.5 h-6">
                        {[40, 20, 60, 30, 40, 20, 10, 50, 40, 15].map((h, i) => (
                          <div key={i} className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500">PROMETHEUS UPTIME</span>
                      <div className="text-xs text-emerald-400 font-bold">99.98% Running</div>
                      <div className="flex items-end gap-0.5 h-6">
                        {[90, 95, 99, 98, 99, 100, 100, 99, 100, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-emerald-500/30 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500">AUDITED ENDPOINTS</span>
                      <div className="text-xs text-purple-400 font-bold">120+ Workstations</div>
                      <div className="flex items-end gap-0.5 h-6">
                        {[50, 55, 60, 65, 75, 80, 90, 100, 110, 120].map((h, i) => (
                          <div key={i} className="flex-1 bg-purple-500/30 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Live peripheral List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    
                    {/* Device list */}
                    <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-3 flex flex-col max-h-[220px] overflow-y-auto">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-2">Connected CIM Hardware</span>
                      <div className="space-y-1.5 flex-1">
                        {peripherals.map((p) => (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedPeripheral(p)}
                            className={`p-2 rounded border transition cursor-pointer text-xs flex items-center justify-between ${
                              selectedPeripheral?.id === p.id 
                                ? "bg-slate-900 border-blue-500/50" 
                                : "bg-slate-950 border-slate-800/80 hover:bg-slate-900/60"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Usb className={`w-3.5 h-3.5 ${
                                p.status === "Connected" ? "text-blue-400" :
                                p.status === "Warning" ? "text-amber-400" : "text-slate-500"
                              }`} />
                              <span className="truncate max-w-[150px] font-medium">{p.name}</span>
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                              p.status === "Connected" ? "bg-emerald-500/10 text-emerald-400" :
                              p.status === "Warning" ? "bg-amber-500/10 text-amber-400 animate-pulse" : "bg-slate-800 text-slate-500"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Device properties */}
                    <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-3 text-xs font-mono space-y-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Device telemetry properties</span>
                      {selectedPeripheral ? (
                        <div className="space-y-1.5 text-[11px] leading-relaxed">
                          <div><span className="text-slate-500">DEVICE ID:</span> <span className="text-blue-400">{selectedPeripheral.id}</span></div>
                          <div><span className="text-slate-500">HARDWARE TYPE:</span> {selectedPeripheral.type}</div>
                          <div><span className="text-slate-500">MANUFACTURER:</span> {selectedPeripheral.manufacturer}</div>
                          <div><span className="text-slate-500">SERIAL NUMBER:</span> {selectedPeripheral.serialNumber}</div>
                          <div><span className="text-slate-500">CONNECTED PORT:</span> {selectedPeripheral.port}</div>
                          <div><span className="text-slate-500">DRIVER VERSION:</span> {selectedPeripheral.driverVersion}</div>
                          <div><span className="text-slate-500">LAST SYNCED:</span> {selectedPeripheral.lastActive}</div>
                        </div>
                      ) : (
                        <div className="text-slate-500 h-full flex items-center justify-center text-center">
                          Select a device to read WMI telemetry metrics.
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Bottom: Interactive Powershell Console */}
                  <div className="bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 flex flex-col h-[180px]">
                    <div className="flex-1 overflow-y-auto space-y-1 pr-2 mb-2" id="ps-logs-container">
                      {psLogs.map((log, i) => (
                        <div key={i} className="whitespace-pre-wrap">{log}</div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 border-t border-slate-800/80 pt-2">
                      <span className="text-blue-400">PS &gt;</span>
                      <input
                        type="text"
                        value={psCommand}
                        onChange={(e) => setPsCommand(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePsCommand()}
                        placeholder="Get-Peripheral, Get-Printer, scan, help..."
                        className="flex-1 bg-transparent border-none outline-none text-blue-200 caret-blue-400"
                      />
                      <button 
                        onClick={() => handlePsCommand("scan-devices")}
                        disabled={isScanning}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-lg shadow-blue-900/20"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Scanning...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" /> Run Device Scan
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: CANON UNIFLOW PRINTER SME */}
              {activeTab === "printer" && (
                <motion.div
                  key="printer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Printer className="w-5 h-5 text-blue-400" />
                      <h3 className="text-md font-bold tracking-wide text-slate-200">CANON UNIFLOW PRINT SME</h3>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg font-mono border border-blue-500/10">India Office Print Server</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    As India Office Printer SME, Rashid manages <strong className="text-slate-200">Canon UniFLOW</strong> server configurations, map network sockets, deploy drivers, and enforce corporate security and print limit policies.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* UniFLOW Printers Server Grid */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Active Printer Queues</span>
                      <div className="space-y-2.5">
                        {printers.map((p) => (
                          <div key={p.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Printer className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs font-bold font-mono">{p.name}</span>
                              </div>
                              <p className="text-[10px] text-slate-400">IP: {p.ipAddress} | Port: {p.portName}</p>
                              <p className="text-[10px] text-slate-500">Model: {p.model}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {p.uniflowConfigured ? (
                                  <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">UniFLOW Binded</span>
                                ) : (
                                  <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono border border-amber-500/20">Pending Server Register</span>
                                )}
                                {p.policyEnforced && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono border border-emerald-500/20">Policy OK</span>
                                )}
                              </div>
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                              p.status === "Idle" ? "bg-slate-800 text-slate-400" :
                              p.status === "Printing" ? "bg-emerald-500/10 text-emerald-400 animate-pulse" : "bg-red-500/10 text-red-400"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Printer setup wizard */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-2">Network Installation Wizard</span>
                      
                      {/* Step Indicator */}
                      <div className="grid grid-cols-3 gap-1.5 mb-4 text-center text-[10px] font-mono">
                        <div className={`p-1.5 rounded-lg transition-all ${uniflowStep === 1 ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/25" : "bg-slate-900 text-slate-500"}`}>1: Print Port</div>
                        <div className={`p-1.5 rounded-lg transition-all ${uniflowStep === 2 ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/25" : "bg-slate-900 text-slate-500"}`}>2: Register Queue</div>
                        <div className={`p-1.5 rounded-lg transition-all ${uniflowStep === 3 ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/25" : "bg-slate-900 text-slate-500"}`}>3: Policies</div>
                      </div>

                      <div className="flex-1 space-y-3 text-xs">
                        {uniflowStep === 1 && (
                          <div className="space-y-2">
                            <p className="text-slate-400 text-[11px]">Specify network print port configuration on print server:</p>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5 font-mono">PRINTER SERVER NAME</label>
                              <input 
                                type="text" 
                                value={newPrinterName} 
                                onChange={(e) => {
                                  setNewPrinterName(e.target.value);
                                  setNewPrinterPort(`LPR_${newPrinterIP}_Uniflow`);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5 font-mono">TCP IP ADDRESS</label>
                              <input 
                                type="text" 
                                value={newPrinterIP} 
                                onChange={(e) => {
                                  setNewPrinterIP(e.target.value);
                                  setNewPrinterPort(`LPR_${e.target.value}_Uniflow`);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5 font-mono font-bold">PORT ASSIGNMENT</label>
                              <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px] text-blue-400">{newPrinterPort}</div>
                            </div>
                          </div>
                        )}

                        {uniflowStep === 2 && (
                          <div className="space-y-2">
                            <p className="text-slate-400 text-[11px]">Map queue on Canon UniFLOW Secure Release Print Server:</p>
                            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                              <div><span className="text-slate-500">Uniflow Host:</span> BLR-UNIFLOW-SVR01</div>
                              <div><span className="text-slate-500">Queue Name:</span> {newPrinterName}</div>
                              <div><span className="text-slate-500">Driver Matrix:</span> Canon PS3 v30.45 (PCL6 Driver)</div>
                              <div><span className="text-slate-500">Spooler Mode:</span> Secured Pull Print (Release Queue)</div>
                            </div>
                            <p className="text-[10px] text-slate-500 italic">This links print jobs to corporate user profiles, preventing unauthorized document retrieval.</p>
                          </div>
                        )}

                        {uniflowStep === 3 && (
                          <div className="space-y-2.5">
                            <p className="text-slate-400 text-[11px]">Apply Indian Office Security & Quota Policies:</p>
                            
                            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-950/40 rounded border border-slate-800/80 hover:bg-slate-900/40">
                              <input 
                                type="checkbox" 
                                checked={policyGrayscale} 
                                onChange={(e) => setPolicyGrayscale(e.target.checked)}
                                className="accent-blue-500" 
                              />
                              <div>
                                <span className="font-semibold block text-[11px] text-slate-200">Force Mono/Grayscale by default</span>
                                <span className="text-[9px] text-slate-500 block">Restricts color prints to authorized departments.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-950/40 rounded border border-slate-800/80 hover:bg-slate-900/40">
                              <input 
                                type="checkbox" 
                                checked={policyBadgeAuth} 
                                onChange={(e) => setPolicyBadgeAuth(e.target.checked)}
                                className="accent-blue-500" 
                              />
                              <div>
                                <span className="font-semibold block text-[11px] text-slate-200">Require Corporate RFID Badge Release</span>
                                <span className="text-[9px] text-slate-500 block">Ensures papers only print when employee is physically present.</span>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Installation Logs console */}
                      {printingLog.length > 0 && (
                        <div className="mt-4 p-2 bg-black/80 rounded border border-slate-800/80 font-mono text-[9px] text-slate-400 space-y-0.5 max-h-[55px] overflow-y-auto">
                          {printingLog.map((log, idx) => (
                            <div key={idx} className="truncate">{log}</div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={handleInstallPrinterStep}
                        disabled={isInstalling}
                        className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-blue-900/20"
                      >
                        {isInstalling ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Provisioning Port Node...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> 
                            {uniflowStep === 1 && "Create Port & Connect Network"}
                            {uniflowStep === 2 && "Bind to UniFLOW Server Queue"}
                            {uniflowStep === 3 && "Apply Policies & Complete Setup"}
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 4: SUPPORT QUEUE & REAL VNC SIMULATOR */}
              {activeTab === "tickets" && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-blue-400" />
                      <h3 className="text-md font-bold tracking-wide text-slate-200">DESFLOW COMMUNICATIONS PORTAL</h3>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg font-mono border border-blue-500/10">Active Incident Support Queue</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Provide end-user support! This console aggregates incidents from Slack chat alerts, Webex AV room diagnostics, and local systems. Select a ticket to launch a remote VNC session.
                  </p>

                  {/* VNC session overlay if active */}
                  {vncConnected && activeVNCTicket ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-slate-950 rounded-xl border border-blue-500/30 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                          <span className="text-xs font-bold font-mono text-blue-400">REALVNC ENTERPRISE CONNECTION</span>
                        </div>
                        <button 
                          onClick={() => setVncConnected(false)}
                          className="text-xs text-slate-500 hover:text-slate-300 font-bold transition cursor-pointer"
                        >
                          [DISCONNECT]
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Remote screen render */}
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-between h-[180px] font-mono text-xs text-slate-300 relative">
                          <div className="absolute top-2 right-2 text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-blue-400 border border-slate-800">
                            Host: {activeVNCTicket.user.split(" ")[0]}-PC
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-slate-500 text-[10px] uppercase">User Workstation Diagnosis</div>
                            {activeVNCTicket.id === "INC-2026-9081" ? (
                              <div className="space-y-1.5">
                                <div className="text-red-400 flex items-center gap-1 font-bold">
                                  <AlertTriangle className="w-3.5 h-3.5" /> PRINT SPOOLER STUCK
                                </div>
                                <div className="text-slate-400 text-[10px]">
                                  Local print spooler service (spoolsv.exe) hung on secure pull printing release cache.
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Spooler Status: <strong className={vncSpoolerStatus === "running" ? "text-emerald-400" : "text-red-400"}>{vncSpoolerStatus.toUpperCase()}</strong>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <div className="text-red-400 flex items-center gap-1 font-bold">
                                  <ShieldAlert className="w-3.5 h-3.5" /> SEQRITE CLIENT INACTIVE
                                </div>
                                <div className="text-slate-400 text-[10px]">
                                  System is missing active security certificate enrollments for Seqrite Client Endpoint.
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Enrollment status: <strong className={vncSeqriteInstalled ? "text-emerald-400" : "text-red-400"}>{vncSeqriteInstalled ? "ENROLLED" : "MISSING"}</strong>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-800/80">
                            <button
                              onClick={handleVNCSolve}
                              disabled={vncIsSolving}
                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-lg shadow-blue-900/10"
                            >
                              {vncIsSolving ? "Running IT Administration scripts..." : (
                                activeVNCTicket.id === "INC-2026-9081" ? "Restart Print Spooler Service" : "Execute Seqrite Enrollment Script"
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Connection logs terminal */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[10px] text-slate-400 flex flex-col justify-between h-[180px]">
                          <div className="space-y-1 overflow-y-auto max-h-[120px]">
                            {vncLog.map((log, index) => (
                              <div key={index}>&gt; {log}</div>
                            ))}
                          </div>
                          <p className="text-[9px] text-slate-500 italic mt-auto">
                            Encrypted VNC Tunnel (AES-256). Operating system: Windows 11 Enterprise node.
                          </p>
                        </div>

                      </div>

                    </motion.div>
                  ) : (
                    /* Ticket Queue Grid */
                    <div className="space-y-2.5">
                      {tickets.map((t) => (
                        <div 
                          key={t.id} 
                          className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            t.status === "Resolved" 
                              ? "bg-slate-950/40 border-slate-900/60 opacity-60" 
                              : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="space-y-1.5 max-w-lg">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-slate-400">{t.id}</span>
                              <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full ${
                                t.priority === "Critical" ? "bg-red-500/10 text-red-400" :
                                t.priority === "High" ? "bg-amber-500/10 text-amber-400" : "bg-slate-800 text-slate-400"
                              }`}>
                                {t.priority.toUpperCase()} PRIORITY
                              </span>
                              <span className="text-slate-500 font-mono text-[10px]">via {t.channel}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-200">{t.title}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{t.description}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Opened: {t.createdAt} | Contact: <strong className="text-slate-300 font-normal">{t.user} ({t.department})</strong>
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-end gap-2 shrink-0">
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                              t.status === "Open" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                              t.status === "In_Progress" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {t.status.replace("_", " ")}
                            </span>
                            
                            {t.status !== "Resolved" && (t.id === "INC-2026-9081" || t.id === "INC-2026-9083") && (
                              <button
                                onClick={() => handleVNCLaunch(t)}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-lg shadow-blue-900/25"
                              >
                                <ExternalLink className="w-3 h-3" /> Connect VNC
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}

              {/* TAB 5: SYSTECH ENGINEER INTERVIEW SIMULATOR */}
              {activeTab === "interview" && (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-blue-400" />
                      <h3 className="text-md font-bold tracking-wide text-slate-200">SYSTECH SUPPORT INTERVIEW SIMULATOR</h3>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg font-mono border border-blue-500/10">Candidate Evaluation</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Rashid frequently acts as interviewer and is evaluated for major Systech roles. Experience how he expertly answers the core corporate IT infrastructure support questions:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* Left: Questions list */}
                    <div className="md:col-span-5 space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          onClick={() => {
                            setSelectedQuestion(q);
                            setUserAnswer("");
                            setEvaluationFeedback(null);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                            selectedQuestion?.id === q.id
                              ? "bg-slate-900 border-blue-500/50 text-slate-100 font-medium"
                              : "bg-slate-950/40 border-slate-800 hover:bg-slate-900/60"
                          }`}
                        >
                          <div className="text-[9px] font-mono text-blue-400 uppercase mb-1">{q.category}</div>
                          <p className="truncate font-semibold text-slate-200">{q.question}</p>
                        </div>
                      ))}
                    </div>

                    {/* Right: Answer Board */}
                    <div className="md:col-span-7 bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[250px]">
                      {selectedQuestion ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500">ACTIVE QUESTION: {selectedQuestion.id}</span>
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">{selectedQuestion.category}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-200 leading-snug">{selectedQuestion.question}</p>
                          
                          <div className="space-y-2">
                            <label className="block text-[10px] text-slate-500 font-mono uppercase">Your Response / Candidate Answer</label>
                            <textarea
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="Write a custom response, or click 'Simulate Rashid's SME Answer' to load Rashid's expert solutions..."
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 h-[80px] outline-none focus:border-blue-500 font-mono leading-relaxed"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={handlePlayCandidateAnswer}
                              disabled={isSimulatingAnswer}
                              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-blue-900/20"
                            >
                              <Sparkles className="w-3.5 h-3.5" /> Simulate Rashid's SME Answer
                            </button>
                            <button
                              onClick={handleEvaluateCustomAnswer}
                              disabled={!userAnswer || isSimulatingAnswer}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 text-slate-300 font-bold text-xs rounded-lg border border-slate-700 transition cursor-pointer"
                            >
                              Evaluate Answer
                            </button>
                          </div>

                          {/* Evaluation feedback block */}
                          {evaluationFeedback && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-blue-950/10 border border-blue-500/20 rounded-lg space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between font-mono">
                                <span className="font-bold text-blue-400">AUTOMATED AUDIT SCORE:</span>
                                <span className="text-emerald-400 font-bold text-sm">{evaluationFeedback.score} / 100</span>
                              </div>
                              <p className="text-slate-400 text-[11px] leading-relaxed italic">
                                "{evaluationFeedback.text}"
                              </p>
                            </motion.div>
                          )}

                        </div>
                      ) : (
                        <div className="text-slate-500 text-center flex items-center justify-center h-full text-xs">
                          Select an interview question to start candidate evaluation.
                        </div>
                      )}
                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 6: AI TROUBLESHOOTER CHATBOT */}
              {activeTab === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex flex-col h-full flex-1"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <h3 className="text-md font-bold tracking-wide text-slate-200">GEMINI AI TROUBLESHOOTING DESK</h3>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg font-mono border border-blue-500/10">Gemini 3.5 Flash Model</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Interact with Rashid's Personal AI Representative! You can query his professional work accomplishments or request actual IT support advice (e.g. printer spooler issues, Canon printer ports, SIM card roaming, Active Directory setups).
                  </p>

                  {/* Suggestion tags */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    {[
                      "Tell me about Rashid's experience at D. E. Shaw",
                      "How do you configure a Canon UniFLOW printer port?",
                      "How does your PowerShell dashboard track USBs?",
                      "How did you migrate 120+ systems to Windows 11?"
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded transition text-left cursor-pointer hover:border-blue-500/50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Chat Messages Frame */}
                  <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex flex-col h-[280px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-2">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                            msg.sender === "user" 
                              ? "bg-blue-600 text-white font-medium" 
                              : msg.sender === "system"
                              ? "bg-slate-900 border border-dashed border-amber-500/40 text-amber-200"
                              : "bg-slate-900 text-slate-300 border border-slate-800/80"
                          }`}>
                            {msg.sender === "system" && (
                              <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[10px] text-amber-400">
                                <AlertTriangle className="w-3.5 h-3.5" /> AI SYSTEM FALLBACK ENGAGED
                              </div>
                            )}
                            <div className="whitespace-pre-line font-sans">{msg.text}</div>
                            <span className="text-[9px] text-slate-500 block text-right mt-1 font-mono">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isGenerating && (
                        <div className="flex justify-start">
                          <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-400 flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                            AI Assistant is analyzing IT architecture...
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask about Rashid's experience, skills, or printer setups..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-200 text-xs caret-blue-500"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!chatInput.trim() || isGenerating}
                        className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-lg transition cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Footer of details */}
          <footer className="bg-slate-950/80 border-t border-slate-800 p-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Systech Dashboard: <strong className="text-slate-200 font-normal">Active & Synchronized</strong></span>
            </div>
            <span>© 2026 Rashid AK • Bengaluru</span>
          </footer>

        </div>

      </main>

    </div>
  );
}
