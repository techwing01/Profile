import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Monitor, 
  Printer, 
  Terminal, 
  HelpCircle, 
  Headphones, 
  Cpu, 
  RotateCcw, 
  Compass, 
  Maximize2,
  Usb,
  Network,
  Radio,
  Server as ServerIcon,
  Zap,
  CheckCircle,
  AlertTriangle,
  Database,
  Layers,
  ArrowRight,
  Lock,
  Activity,
  Wifi,
  Settings,
  RefreshCw,
  Sliders,
  Globe,
  ShieldAlert
} from "lucide-react";

interface Workspace3DProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  powershellQueryCount: number;
  openTicketCount: number;
  configuredPrintersCount: number;
  vncConnected: boolean;
}

export default function Workspace3D({
  activeTab,
  setActiveTab,
  powershellQueryCount,
  openTicketCount,
  configuredPrintersCount,
  vncConnected
}: Workspace3DProps) {
  // Navigation tabs for the 3D console
  const [workspaceMode, setWorkspaceMode] = useState<"desk" | "network" | "telemetry">("desk");
  
  // 3D Parameters for Manual Desk Rotation
  const [rotX, setRotX] = useState<number>(24);
  const [rotY, setRotY] = useState<number>(-32);
  const [zoom, setZoom] = useState<number>(0.95);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Peripheral Live Telemetry Scan States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [mousePollingRate, setMousePollingRate] = useState<number>(1000);
  const [selectedTelemetryDevice, setSelectedTelemetryDevice] = useState<string>("DEV-MN-03");

  // Selected Network Node for HUD Details
  const [selectedNetNode, setSelectedNetNode] = useState<string>("admin");

  // 3D Isometric View presets
  const presets = [
    { name: "Isometric", rx: 24, ry: -32, z: 0.95 },
    { name: "Frontal", rx: 10, ry: 0, z: 1.05 },
    { name: "Top Down", rx: 75, ry: -10, z: 0.85 }
  ];

  const handleReset = () => {
    setRotX(24);
    setRotY(-32);
    setZoom(0.95);
  };

  // Run a live peripheral audit simulation inside Telemetry tab
  const triggerActiveAudit = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([
      "PS C:\\Users\\rashid_blr> .\\Scan-TelegrafDevices.ps1",
      "[INFO] Launching WMI / CIM peripheral crawler...",
      "[INFO] Bound to Telegraf Daemon - Sending Prometheus metrics..."
    ]);

    const logs = [
      "[OK] Queried Win32_PnPEntity for category: Monitor -> U2723QE 4K",
      "[OK] Keyboard poll success -> Latency: 1.2ms (Excellent)",
      "[OK] Mouse polling rate confirmed at " + mousePollingRate + " Hz",
      "[WARN] SandDisk Extreme Portable SSD is UNPLUGGED",
      "[SUCCESS] 6/7 peripherals reported telemetry successfully.",
      "[INFO] Prometheus metric buffer scraped successfully on port 9100"
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setScanProgress(currentProgress);
      
      if (currentProgress === 30) {
        setScanLogs(prev => [...prev, logs[0], logs[1]]);
      } else if (currentProgress === 60) {
        setScanLogs(prev => [...prev, logs[2], logs[3]]);
      } else if (currentProgress === 90) {
        setScanLogs(prev => [...prev, logs[4], logs[5]]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 200);
  };

  // Static Network topology nodes
  const networkNodes = [
    { id: "gateway", name: "D. E. Shaw VPN Gateway", ip: "10.190.2.1", x: 250, y: 40, port: "443 (HTTPS)", status: "ONLINE", protocol: "Cisco SecureClient TLS", desc: "Corporate perimeter gateway enforcing multi-factor token authentication.", metric: "RTT < 12ms" },
    { id: "server", name: "BLR-UNIFLOW-SVR01", ip: "10.190.45.10", x: 130, y: 150, port: "515 (LPR), 9100 (RAW)", status: "ONLINE", protocol: "Canon UniFLOW Enterprise", desc: "Core printing spooler releasing secure badge/PIN authentication queries.", metric: "99.9% Uptime" },
    { id: "printer", name: "Canon imageRUNNER DX C5840i", ip: "192.168.45.220", x: 40, y: 280, port: "TCP LPR Queue", status: "HEALTHY", protocol: "Canon PostScript 3", desc: "Physical enterprise multi-function device releasing secure prints via card-reader.", metric: "Grayscale Enforced" },
    { id: "client", name: "Ananya-PC (INC-2026-9083)", ip: "10.190.81.45", x: 460, y: 280, port: "5900 (RealVNC RFB)", status: "WARNING", protocol: "RealVNC Enterprise Node", desc: "User PC requiring Seqrite Endpoint Security enrollment and DLP configuration.", metric: "AV Expired" },
    { id: "admin", name: "Rashid-Console-WS01", ip: "10.190.12.18", x: 370, y: 150, port: "Prometheus Exporter 9090", status: "ACTIVE", protocol: "Powershell Scraper v2.1", desc: "Rashid's primary monitoring terminal running Telegraf daemon to query CIM hardware devices.", metric: "Grafana Linked" }
  ];

  // Map to relate desk coordinates on desk view
  const deskItems = [
    {
      id: "monitor",
      name: "Desktop Workstation Monitor",
      description: "Dell 27\" UltraSharp 4K monitor. Renders the local Powershell dashboard capturing device states through Telegraf.",
      status: `Active (${powershellQueryCount + (isScanning ? 1 : 0)} scans run)`,
      tab: "powershell",
      glowColor: "rgba(59,130,246,0.5)",
      pos: "top-[25%] left-[30%]"
    },
    {
      id: "printer",
      name: "Canon UniFLOW Network Printer",
      description: "Indian Office enterprise network printer. Secured via pull-print card scanners and LPR port routing.",
      status: `${configuredPrintersCount} printer instances configured`,
      tab: "printer",
      glowColor: "rgba(16,185,129,0.5)",
      pos: "top-[20%] right-[18%]"
    },
    {
      id: "vnc",
      name: "Remote VNC Client Node",
      description: "Secure terminal requiring RealVNC support and Seqrite Endpoint enrollment. Host: ANANYA-PC.",
      status: vncConnected ? "VNC Active Diagnostic Session" : "Awaiting Connection",
      tab: "vnc",
      glowColor: "rgba(16,185,129,0.4)",
      pos: "bottom-[20%] left-[20%]"
    },
    {
      id: "av",
      name: "Webex & Slack AV Center",
      description: "Systech communications array. Diagnostic headphones and incident priority support queues.",
      status: `${openTicketCount} active tickets open`,
      tab: "tickets",
      glowColor: "rgba(245,158,11,0.4)",
      pos: "bottom-[25%] right-[25%]"
    },
    {
      id: "ai",
      name: "Gemini AI Speaker Node",
      description: "Rashid's AI assistant trained on his resume to provide interactive tech troubleshooting & background information.",
      status: "AI Representative Online",
      tab: "ai",
      glowColor: "rgba(59,130,246,0.6)",
      pos: "top-[5%] left-[50%] -translate-x-1/2"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 p-5 overflow-hidden relative">
      
      {/* 3D Console Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 z-10">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            INTERACTIVE SYSTEM MODELS
          </h2>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-lg font-mono border border-blue-500/20">
            {workspaceMode.toUpperCase()} VIEW
          </span>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setWorkspaceMode("desk")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
              workspaceMode === "desk" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 3D Workspace Desk
          </button>
          <button
            onClick={() => setWorkspaceMode("network")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
              workspaceMode === "network" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Network Topology
          </button>
          <button
            onClick={() => setWorkspaceMode("telemetry")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
              workspaceMode === "telemetry" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Peripheral Telemetry
          </button>
        </div>
      </div>

      {/* RENDER VIEW 1: INTERACTIVE 3D DESK */}
      {workspaceMode === "desk" && (
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Sliders and presets at top */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-[10px] text-slate-400 font-mono bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-bold">3D CONTROLS:</span>
              <div className="flex gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setRotX(p.rx);
                      setRotY(p.ry);
                      setZoom(p.z);
                    }}
                    className="px-2 py-0.5 text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
                <button
                  onClick={handleReset}
                  className="p-0.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 flex-1 justify-end max-w-md">
              <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                <span className="whitespace-nowrap">PITCH {rotX}°</span>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={rotX}
                  onChange={(e) => setRotX(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                <span className="whitespace-nowrap">YAW {rotY}°</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotY}
                  onChange={(e) => setRotY(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                <span className="whitespace-nowrap">ZOOM {Math.round(zoom * 100)}%</span>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Isometric Stage */}
          <div className="flex-1 flex items-center justify-center relative perspective-1000 min-h-[300px] overflow-visible select-none">
            
            <div className="absolute top-2 left-2 right-2 text-center pointer-events-none z-10">
              <span className="bg-slate-950/80 backdrop-blur text-slate-400 text-[10px] py-1 px-3 rounded-full border border-slate-800 shadow-md inline-flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-blue-400 animate-pulse" />
                Use top controls to rotate the desk. Click physical objects to load administration consoles!
              </span>
            </div>

            {/* Rotating 3D Container */}
            <div 
              className="w-[450px] h-[340px] relative preserve-3d transition-transform duration-300 ease-out flex items-center justify-center"
              style={{
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`
              }}
            >
              {/* Desk Surface Grid Plane */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border-2 border-slate-700 shadow-[0_40px_50px_rgba(0,0,0,0.8)] preserve-3d">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl" />
                <div className="absolute bottom-2 left-1/4 right-1/4 h-1 bg-blue-500/20 rounded blur-sm" />
                <div className="absolute top-2 left-1/4 right-1/4 h-1 bg-emerald-500/10 rounded blur-sm" />
                <div className="absolute bottom-3 right-6 text-[8px] text-slate-600 font-mono tracking-widest">
                  RASHID-BLR-WS01 // DESK COMPLIANT
                </div>
              </div>

              {/* RENDER 3D WORKSPACE DESK OBJECTS */}
              {deskItems.map((item) => {
                const isActive = activeTab === item.tab;
                const isHovered = hoveredItem === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`absolute ${item.pos} preserve-3d cursor-pointer`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setActiveTab(item.tab)}
                  >
                    <div 
                      className="preserve-3d transition-all duration-300 flex flex-col items-center justify-center"
                      style={{
                        transform: isHovered || isActive 
                          ? "translateZ(40px) scale(1.1)" 
                          : "translateZ(10px)",
                      }}
                    >
                      {/* PHYSICAL HTML/CSS REPRESENTATION OF THE OBJECTS */}
                      {item.id === "printer" && (
                        <div className="relative w-16 h-14 transform-style-3d mb-1 flex items-center justify-center">
                          {/* Printer block */}
                          <div className={`w-14 h-11 bg-slate-700 rounded border-2 ${isActive ? 'border-emerald-500' : 'border-slate-500'} relative flex flex-col justify-between p-1 shadow-[0_5px_15px_rgba(0,0,0,0.4)]`}>
                            {/* Paper feeder on top */}
                            <div className="w-10 h-1 bg-slate-800 mx-auto rounded" />
                            {/* Scanning Lid */}
                            <div className="w-full h-2 bg-slate-600 rounded-t border-b border-slate-500" />
                            {/* Status Panel Display */}
                            <div className="flex justify-between items-center mt-1">
                              <div className="w-4 h-3 bg-emerald-950 rounded flex items-center justify-center border border-emerald-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              </div>
                              <div className="w-6 h-1.5 bg-slate-800 rounded" />
                            </div>
                            {/* Paper release tray */}
                            <div className="absolute -bottom-2 inset-x-2 h-2.5 bg-slate-800 rounded-b flex items-center justify-center border-t border-slate-600">
                              {/* Sliding print paper sheet */}
                              <motion.div 
                                animate={{ y: [0, 2, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.8 }}
                                className="w-6 h-2 bg-white rounded-t-[1px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === "monitor" && (
                        <div className="relative w-16 h-12 transform-style-3d mb-1 flex flex-col items-center">
                          {/* Monitor frame */}
                          <div className={`w-16 h-11 bg-slate-950 border-2 ${isActive ? 'border-blue-500' : 'border-slate-800'} rounded p-0.5 flex flex-col justify-between shadow-[0_5px_15px_rgba(0,0,0,0.5)]`}>
                            <div className="w-full h-8 bg-blue-950/40 rounded border border-blue-900/60 flex flex-col justify-end p-0.5 overflow-hidden">
                              {/* PowerShell active metrics on screen */}
                              <div className="flex items-end gap-0.5 h-4">
                                {[30, 60, 40, 75, 20, 50, 90, 45, 60].map((h, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [`${h}%`, `${Math.max(15, Math.min(100, h + (Math.random() - 0.5) * 30))}%`] }}
                                    transition={{ repeat: Infinity, duration: 1.4, repeatType: "reverse" }}
                                    className="flex-1 bg-blue-500 rounded-t-[1px]"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="w-full flex justify-between items-center text-[6px] font-mono text-blue-400 px-0.5 leading-none">
                              <span>WMI: SCANS RUN</span>
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                          </div>
                          {/* Monitor stand */}
                          <div className="w-2 h-2.5 bg-slate-700 border-x border-slate-600" />
                          <div className="w-8 h-1 bg-slate-800 rounded-t border border-slate-600" />
                        </div>
                      )}

                      {item.id === "vnc" && (
                        <div className="relative w-11 h-14 transform-style-3d mb-1 flex items-center justify-center">
                          {/* Standing PC Tower */}
                          <div className={`w-9 h-13 bg-slate-900 rounded-md border-2 ${isActive ? 'border-emerald-500/80' : 'border-slate-700'} p-1.5 flex flex-col justify-between shadow-[0_5px_15px_rgba(0,0,0,0.5)]`}>
                            {/* Vent Grill and LED indicator */}
                            <div className="flex justify-between items-center">
                              <div className="w-4 h-1.5 bg-slate-800 rounded" />
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            </div>
                            {/* Seqrite secure lock tag */}
                            <div className="flex items-center justify-center my-1 bg-slate-950/80 py-0.5 rounded border border-slate-800">
                              <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                            {/* Server cooling fan spinning */}
                            <div className="flex items-center justify-center">
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-5 h-5 rounded-full border border-dashed border-emerald-500/30 flex items-center justify-center"
                              >
                                <div className="w-2.5 h-0.5 bg-slate-700 rounded transform rotate-45" />
                                <div className="w-2.5 h-0.5 bg-slate-700 rounded transform -rotate-45" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === "av" && (
                        <div className="relative w-12 h-12 transform-style-3d mb-1 flex flex-col items-center justify-center">
                          {/* Headphones on stand */}
                          <div className="relative w-10 h-10 flex items-center justify-between px-1">
                            {/* Arch stand */}
                            <div className="absolute inset-x-2 top-0 bottom-0 border-t-2 border-x-2 border-slate-700 rounded-t-full" />
                            {/* Earcups */}
                            <div className={`w-2.5 h-5 bg-slate-800 rounded-md border ${isActive ? 'border-amber-500' : 'border-slate-600'} shadow`} />
                            <div className={`w-2.5 h-5 bg-slate-800 rounded-md border ${isActive ? 'border-amber-500' : 'border-slate-600'} shadow`} />
                            {/* Microphone arm */}
                            <div className="absolute bottom-1 right-2 w-1.5 h-4 bg-slate-700 rounded transform -rotate-45">
                              <div className="absolute bottom-0 -right-0.5 w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                            </div>
                          </div>
                          {/* Base of support stack */}
                          <div className="w-7 h-1.5 bg-slate-800 rounded border border-slate-700 mt-1" />
                        </div>
                      )}

                      {item.id === "ai" && (
                        <div className="relative w-14 h-14 transform-style-3d mb-1 flex items-center justify-center">
                          {/* Gemini pulsating smart speaker orb */}
                          <motion.div
                            animate={{ scale: [0.92, 1.08, 0.92], rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-dashed border-blue-400/40"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg ${
                              isActive ? 'ring-2 ring-blue-400 shadow-blue-500/40' : 'shadow-slate-950'
                            } relative`}
                          >
                            <div className="absolute inset-0 rounded-full bg-blue-400/25 animate-ping" />
                            <Terminal className="w-4 h-4 text-white" />
                          </motion.div>
                        </div>
                      )}

                      {/* 3D Base Shadow Pedestal */}
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800/80 rounded-full blur-sm transition-all"
                        style={{
                          transform: "translateZ(-15px)",
                          boxShadow: isHovered || isActive 
                            ? `0 0 20px ${item.glowColor}` 
                            : "none"
                        }}
                      />

                      {/* Name tag with active flag */}
                      <div 
                        className="absolute -bottom-7 bg-slate-950/90 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-lg border border-slate-800 font-mono whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        style={{ transform: "rotateX(0deg) translateZ(12px)" }}
                      >
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                        {item.id === "printer" ? "Canon UniFLOW" : item.id === "monitor" ? "Powershell Svr" : item.name.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expanded detail box */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 min-h-[75px] z-10 transition-all duration-300">
            {hoveredItem ? (
              (() => {
                const item = deskItems.find((d) => d.id === hoveredItem);
                return item ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        {item.id === "printer" ? <Printer className="w-4 h-4 text-emerald-400" /> : 
                         item.id === "monitor" ? <Monitor className="w-4 h-4 text-blue-400" /> : 
                         item.id === "vnc" ? <Cpu className="w-4 h-4 text-emerald-400" /> : 
                         item.id === "av" ? <Headphones className="w-4 h-4 text-amber-400" /> : 
                         <Terminal className="w-4 h-4 text-blue-400" />}
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/10">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ) : null;
              })()
            ) : (
              <div className="text-xs text-slate-500 flex flex-col justify-center h-full text-center py-1">
                <p>Hover or drag sliders to rotate the 3D desk. Click any model node to access its diagnostics console.</p>
                <p className="text-[10px] mt-0.5 text-slate-600">Representing physical workplace structures handled by Rashid AK in Bengaluru office hubs.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* RENDER VIEW 2: INTERACTIVE NETWORK TOPOLOGY DIAGRAM */}
      {workspaceMode === "network" && (
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          
          {/* Main Network Diagram Area (SVG + Interactive nodes) */}
          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 relative min-h-[300px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_70%)]" />
            
            {/* SVG Network Connections (Laser Streams with Moving Packets) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="laser-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="laser-alert" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Connections */}
              {/* admin -> server */}
              <motion.path
                d="M 370 150 Q 250 150 130 150"
                fill="none"
                stroke="url(#laser-blue)"
                strokeWidth="2"
                strokeDasharray="5, 10"
                animate={{ strokeDashOffset: [-60, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />

              {/* gateway -> client */}
              <motion.path
                d="M 250 40 Q 355 160 460 280"
                fill="none"
                stroke="url(#laser-alert)"
                strokeWidth="2"
                strokeDasharray="6, 8"
                animate={{ strokeDashOffset: [-45, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />

              {/* server -> printer */}
              <motion.path
                d="M 130 150 Q 85 215 40 280"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5, 10"
                animate={{ strokeDashOffset: [-50, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              />

              {/* admin -> client (VNC) */}
              <motion.path
                d="M 370 150 Q 415 215 460 280"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeDasharray="4, 12"
                animate={{ strokeDashOffset: [-80, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />

              {/* gateway -> server */}
              <motion.path
                d="M 250 40 Q 190 95 130 150"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="5, 5"
                animate={{ strokeDashOffset: [-30, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
            </svg>

            {/* Network Nodes Elements */}
            {networkNodes.map((node) => {
              const isSelected = selectedNetNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNetNode(node.id)}
                  className="absolute p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all focus:outline-none cursor-pointer group"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {/* Glowing Node Circle */}
                  <div className={`p-2.5 rounded-full border-2 transition-all flex items-center justify-center ${
                    node.status === "WARNING" 
                      ? "bg-amber-950/80 border-amber-500 text-amber-400 ring-4 ring-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                      : isSelected
                      ? "bg-blue-950/80 border-blue-500 text-blue-400 ring-4 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}>
                    {node.id === "gateway" && <Globe className="w-4 h-4" />}
                    {node.id === "server" && <ServerIcon className="w-4 h-4" />}
                    {node.id === "printer" && <Printer className="w-4 h-4" />}
                    {node.id === "client" && <Cpu className="w-4 h-4" />}
                    {node.id === "admin" && <Monitor className="w-4 h-4" />}
                  </div>

                  {/* Node Labels */}
                  <span className={`text-[9px] font-bold font-mono tracking-wide ${
                    isSelected ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}>
                    {node.name.split(" ")[0]}
                  </span>
                  
                  <span className="text-[7px] text-slate-500 font-mono">
                    {node.ip}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Info Panel for Selected Node */}
          <div className="w-full lg:w-[250px] bg-slate-950 rounded-xl border border-slate-800 p-4.5 flex flex-col justify-between">
            {(() => {
              const node = networkNodes.find(n => n.id === selectedNetNode);
              if (!node) return null;
              return (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-2 h-2 rounded-full ${node.status === "WARNING" ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`} />
                      <span className="text-[10px] font-mono text-slate-500">NODE PROFILE</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-200">{node.name}</h3>
                    <p className="text-[10px] font-mono text-blue-400 mt-0.5">{node.ip}</p>
                  </div>

                  <div className="space-y-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[9px] font-mono">PRIMARY PROTOCOL / PORT:</span>
                      <span className="text-slate-300 font-medium">{node.protocol}</span>
                      <span className="text-slate-400 block font-mono text-[10px] mt-0.5">Port: {node.port}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[9px] font-mono">SUB-SYSTEM DESCRIPTION:</span>
                      <p className="text-slate-400 text-[10.5px] leading-relaxed mt-0.5 italic">{node.desc}</p>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-slate-400 font-mono text-[9px]">DIAGNOSTICS:</span>
                      </div>
                      <span className="text-slate-200 font-mono text-[10px] font-bold">{node.metric}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <button
                      onClick={() => {
                        if (node.id === "printer") setActiveTab("printer");
                        if (node.id === "client") setActiveTab("vnc");
                        if (node.id === "admin") setActiveTab("powershell");
                        if (node.id === "server") setActiveTab("printer");
                      }}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-[10px] font-bold tracking-wide transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Open Administrative Console <ArrowRight className="w-3 h-3 text-blue-400" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      )}

      {/* RENDER VIEW 3: POWERSHELL TELEGRAF PERIPHERAL TELEMETRY DASHBOARD */}
      {workspaceMode === "telemetry" && (
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Top Status Indicators & Scan Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Usb className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">WMI Device Scan Telemetry</span>
              </div>
              <span className="text-slate-600 font-mono">|</span>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span>Active pipeline:</span>
                <span className="text-emerald-400 font-bold">Powershell {"->"} Telegraf {"->"} Prometheus</span>
              </div>
            </div>

            <button
              onClick={triggerActiveAudit}
              disabled={isScanning}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition shadow-md shadow-blue-900/25 flex items-center gap-1.5 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Auditing Hardware... {scanProgress}%
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  Trigger Prometheus Poll Scan
                </>
              )}
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Box: Scrolling Audit Log Console */}
            <div className="lg:col-span-1 bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col justify-between h-[230px] lg:h-auto font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold text-slate-300">TELEGRAF AUDIT AGENT</span>
                </div>
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Scraper active</span>
              </div>

              {/* Scrolling logs content */}
              <div className="flex-1 overflow-y-auto text-[10px] space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {scanLogs.length > 0 ? (
                  scanLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`${
                        log.startsWith("PS") ? "text-slate-300 font-bold" :
                        log.includes("[OK]") ? "text-emerald-400" :
                        log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" :
                        log.includes("[WARN]") ? "text-amber-400" : "text-slate-400"
                      }`}
                    >
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600 italic text-[10.5px] h-full flex items-center justify-center text-center">
                    Click 'Trigger Prometheus Poll Scan' to run hardware audits and pipe telemetry logs.
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {isScanning && (
                <div className="mt-2 pt-2 border-t border-slate-900">
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                      className="bg-blue-500 h-full rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Box: Interactive Device Grids */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300">Live Device Registry Telemetry</span>
                
                {/* Mouse controller modifier */}
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-500">USB Polling Rate:</span>
                  <select
                    value={mousePollingRate}
                    onChange={(e) => setMousePollingRate(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-blue-400 text-[10px] rounded px-1 outline-none py-0.5"
                  >
                    <option value={125}>125 Hz (8ms)</option>
                    <option value={500}>500 Hz (2ms)</option>
                    <option value={1000}>1000 Hz (1ms)</option>
                  </select>
                </div>
              </div>

              {/* Grid of Peripheral Devices */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "DEV-KB-01", name: "Dell KB216 Keyboard", type: "Keyboard", status: "Connected", latency: "1.2ms", power: "50mA" },
                  { id: "DEV-MS-02", name: "Logitech G304 Mouse", type: "Mouse", status: "Connected", latency: "1.0ms", power: "Battery 84%" },
                  { id: "DEV-MN-03", name: "Dell UltraSharp Monitor", type: "Monitor", status: "Connected", latency: "8.5ms", power: "Active (DP)" },
                  { id: "DEV-PR-04", name: "Canon imageRUNNER Printer", type: "Printer", status: "Warning", latency: "120ms", power: "LPR Port active" },
                  { id: "DEV-HS-05", name: "Jabra Evolve2 Headset", type: "Headset", status: "Connected", latency: "12.0ms", power: "Bluetooth" },
                  { id: "DEV-ST-06", name: "SanDisk Portable SSD", type: "Storage", status: powershellQueryCount > 1 || scanProgress === 100 ? "Connected" : "Disconnected", latency: "0.8ms", power: "USB 3.2" }
                ].map((device) => {
                  const isTarget = selectedTelemetryDevice === device.id;
                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedTelemetryDevice(device.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isTarget 
                          ? "bg-blue-950/20 border-blue-500/70" 
                          : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{device.id}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          device.status === "Disconnected" ? "bg-slate-600" :
                          device.status === "Warning" ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
                        }`} />
                      </div>
                      <h4 className="text-[10px] font-bold text-slate-200 truncate">{device.name}</h4>
                      
                      <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-slate-500">
                        <span>LATENCY: {device.latency}</span>
                        <span className="text-blue-400 font-bold">{device.power}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic device detailed telemetry chart panel */}
              {(() => {
                const target = selectedTelemetryDevice;
                return (
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col justify-between h-[100px]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>WMI CIM ELEMENT DIAGNOSTIC SCOPE: <strong className="text-blue-400">{target}</strong></span>
                      <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-500">
                        Query latency: {target === "DEV-PR-04" ? "High (120ms)" : "Optimal (<12ms)"}
                      </span>
                    </div>

                    {/* Simulating real-time signal monitor via dynamic css wave bars */}
                    <div className="flex items-end justify-between gap-1.5 h-12 pt-2">
                      {[12, 18, 14, 25, 45, 30, 22, 55, 40, 15, 60, 48, 32, 70, 52, 28, 42, 65, 80, 45, 30, 55, 20].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: [`${h}%`, `${Math.max(10, Math.min(100, h + (Math.random() - 0.5) * 45))}%`],
                            backgroundColor: target === "DEV-PR-04" ? "#eab308" : "#3b82f6"
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1 + (i % 5) * 0.2, 
                            repeatType: "reverse" 
                          }}
                          className="flex-1 rounded-t-[1.5px]"
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
