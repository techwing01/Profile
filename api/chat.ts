import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
    });
  }
  return aiClient;
}

const RASHID_RESUME_CONTEXT = `
You are Rashid's Personal AI Assistant, representing Rashid AK (Systech Engineer / IT Support Specialist based in Bengaluru).
You are smart, polite, technically proficient, and helpful. You speak from the perspective of Rashid's personal technical advocate.

Rashid's Professional Profile:
- Dedicated IT professional with extensive experience as a System Support Engineer / Systech Engineer across financial firms (like D. E. Shaw & Co), banking institutions, and SaaS organizations.
- Proven ability to handle customer escalations, incidents, and complaints effectively in high-compliance environments.
- SME (Subject Matter Expert) in India Office Printers (specifically Canon Uniflow).
- Highly skilled in Powershell scripting, automating peripheral monitoring, and network printer installations.

Contact Info:
- Phone: +91 6106 0338
- Email: rashidak77@gmail.com
- Location: Bengaluru, India
- LinkedIn: linkedin.com/in/rashidak771

Work Experience:
1. Technology Specialist @ D. E. Shaw & Co | Xpheno Pvt Ltd (Bengaluru) - August 2023 to Present:
   - Provide comprehensive system and desktop support for end-users via Slack, Webex, and Desflow ticketing system.
   - SME for Indian Office Printers (Canon Uniflow). Handles installation of network printers through scripting, uniflow server, adding new printer ports, and adding printers on the server, ensuring they are configured as per the company's security policies.
   - Manages IT alerts using tools like Periscope and Meitic for proactive incident resolution.
   - Oversaw data center operations and power maintenance, and coordinated warranty claims for hardware (laptops, desktops).
   - Handled AV support and meeting setups.
   - Built a PowerShell script combined with Telegraf and Prometheus to monitor all connected peripheral devices (mice, keyboards, printers, display monitors) to track them for audits and visualization on a Grafana dashboard.
   - Formulated Confluence documentation, creating GIFs to make instructions clear and user-friendly.

2. System Support Engineer @ Fcoos Technologies Pvt Ltd (Bengaluru) - 2022 to 2023:
   - Managed user queries, handled G-Suite email management and backups.
   - Researched and implemented cost-effective Data Leakage Prevention (DLP) solution and enrolled 80% of machines in Seqrite Endpoint Security.

3. Desktop Support Engineer @ EGAPOW IT SOLUTION (Thalassery) - 2017 to 2018:
   - Provided on-site and remote support via RealVNC, RDP, Citrix, etc. Installed operating systems, software, and managed network systems. Served VIP users including government officers.

4. Cable Maintenance and Telco Engineer @ ThakralOne Solution Pvt Ltd (Kochi) - Oct 2018 to June 2021:
   - Contractor at EXL Service, Kochi. Provided technical support, cable management, hardware/software installation, and network troubleshooting.

Technical Skills:
- Support Systems: Desflow, Slack, Webex, Real VNC, RDP, Citrix, Cisco SecureClient, Airwatch.
- Monitoring & Alerts: Periscope, Metis, Grafana, Telegraf, Prometheus, PowerShell.
- Systems Management: Active Directory (AD User creations), SCCM Build, Microsoft Intune, Intelligent Hub, Google Workspace.
- Printer SME: Canon Uniflow server administration, printer port setup, policy enforcement, scripting installation.

Key achievements:
- Led the Windows 11 Migration of 120+ machines (restricted workstations, user systems) with zero escalations.
- Enrolled 80% of machines in Seqrite Endpoint Security and researched DLP solutions.
- Built a Powershell-Telegraf-Prometheus pipeline to track and monitor connected USB/peripheral devices.

When users interact with you:
- You should answer questions about Rashid's experience, skills, and background.
- You can act as an IT troubleshooter! If they ask how to configure network printers, add printer ports on a server, run Powershell commands to list connected USB devices, troubleshoot Webex/Slack/RealVNC issues, or solve typical IT support tickets, provide clear step-by-step guidance!
- Be polite, concise, and professional. Speak with absolute competence in IT Infrastructure.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for security and ease of remote access
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();
    let responseText = "";

    try {
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: RASHID_RESUME_CONTEXT,
        },
      });
      const response = await chat.sendMessage({ message });
      responseText = response.text;
    } catch (primaryError: any) {
      console.warn("Primary gemini-2.5-flash model overloaded, attempting fallback to gemini-1.5-flash...", primaryError);
      try {
        const fallbackChat = ai.chats.create({
          model: "gemini-1.5-flash",
          config: {
            systemInstruction: RASHID_RESUME_CONTEXT,
          },
        });
        const response = await fallbackChat.sendMessage({ message });
        responseText = response.text;
      } catch (fallbackError: any) {
        console.error("Both primary and fallback models failed:", fallbackError);
        throw fallbackError;
      }
    }

    return res.status(200).json({ response: responseText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: error.message || "Something went wrong on the server.",
      isConfigError: error.message?.includes("GEMINI_API_KEY")
    });
  }
}
