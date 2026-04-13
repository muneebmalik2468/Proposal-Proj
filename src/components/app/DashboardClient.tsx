"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { TOOLS } from "@/lib/tools.config";

type View = "dashboard" | "history" | "upwork" | "linkedin-inmail" | "linkedin-conn" | "cold-email" | "settings" | "billing";

// Helper function: Truncate text to 10 words with "..." if longer
function truncateToPreview(text: string): string {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length > 10) {
    return words.slice(0, 10).join(" ") + "...";
  }
  return text;
}

interface DashboardClientProps {
  user: any;
  userRow: any;
}

export function DashboardClient({ user, userRow }: DashboardClientProps) {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Activity data states
  const [monthlyStats, setMonthlyStats] = useState({ proposals: 0, linkedInInMails: 0, connectionNotes: 0, coldEmails: 0, total: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  
  // Keep for backward compatibility but won't use for display
  const [upworkEntries] = useState<any[]>([]);
  const [liEntries] = useState<any[]>([]);
  const [emailEntries] = useState<any[]>([]);
  const [generatedOutput, setGeneratedOutput] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
      setIsTablet(typeof window !== "undefined" && window.innerWidth < 1024);
    };
    
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  // Fetch activity data
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const res = await fetch("/api/user/activity");
        if (res.ok) {
          const data = await res.json();
          setMonthlyStats(data.monthlyStats);
          setRecentActivity(data.recentActivity);
          setHistory(data.history);
        } else {
          console.error("Failed to fetch activity data");
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchActivityData();
  }, []);

  // Provide safe defaults for user data
  const displayName = userRow?.full_name || user?.user_metadata?.full_name || user?.email || "User";
  const displayEmail = userRow?.email || user?.email || "";
  const isPro = userRow?.plan === "pro";
  const isProMax = userRow?.plan === "promax";
  const isBasic = userRow?.plan === "basic";
  const isPaid = isPro || isProMax || isBasic;
  const usageCount = userRow?.usage_count ?? 0;
  const credits = userRow?.credits ?? 5;
  const creditsLimit = userRow?.credits_limit ?? 0;
  const activeTools = TOOLS.filter((t) => t.active && t.phase === 1);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const toolColorMap: Record<string, { bg: string; text: string; dot: string }> = {
    upwork: { bg: "#F0FDF4", text: "#0D6B00", dot: "#14A800" },
    "linkedin-inmail": { bg: "#EBF5FF", text: "#084E94", dot: "#0A66C2" },
    "linkedin-conn": { bg: "#EBF5FF", text: "#084E94", dot: "#0A66C2" },
    "cold-email": { bg: "#FEF2F2", text: "#991B1B", dot: "#DC2626" },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F8FAFC", color: "#0F172A" }}>

      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          overflowY: "auto",
          transform: isTablet ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          transition: "transform 0.3s",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: "'Sora', sans-serif",
              fontSize: "16px",
              fontWeight: 800,
            }}
          >
            CP
          </div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>
            ClientPitcher
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "14px 12px", flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px 6px", marginTop: "8px" }}>
            Overview
          </div>
          <SidebarItem
            icon="🏠"
            label="Dashboard"
            active={currentView === "dashboard"}
            onClick={() => handleViewChange("dashboard")}
          />
          <SidebarItem
            icon="🕒"
            label="History"
            active={currentView === "history"}
            onClick={() => handleViewChange("history")}
          />

          <div style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px 6px", marginTop: "14px" }}>
            Tools
          </div>
          <SidebarItem
            icon="📋"
            label="Upwork Proposals"
            color="green"
            active={false}
            onClick={() => window.location.href = "/app/upwork"}
          />
          <SidebarItem
            icon="✉️"
            label="LinkedIn InMail"
            color="blue"
            active={false}
            onClick={() => window.location.href = "/app/linkedin-inmail"}
          />
          <SidebarItem
            icon="🤝"
            label="Connection Note"
            color="blue"
            active={false}
            onClick={() => window.location.href = "/app/linkedin-connection"}
          />
          <SidebarItem
            icon="📧"
            label="Cold Email"
            color="red"
            active={false}
            onClick={() => window.location.href = "/app/cold-email"}
          />

          <div style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px 6px", marginTop: "14px" }}>
            Account
          </div>
          <SidebarItem
            icon="⚙️"
            label="Settings"
            active={currentView === "settings"}
            onClick={() => handleViewChange("settings")}
          />
        </nav>

        {/* Plan Box */}
        <div style={{ margin: "14px", padding: "14px", background: "#0F172A", borderRadius: "12px", color: "#FFFFFF" }}>
          <div style={{ fontSize: "10px", opacity: 0.6, marginBottom: "2px" }}>Current plan</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
            {userRow?.plan === "pro" ? "Pro" : userRow?.plan === "promax" ? "ProMax" : userRow?.plan === "basic" ? "Basic" : "Free"} {isPaid ? `— ${credits} / ${creditsLimit} credits` : `— ${usageCount} of 5 used`}
          </div>
          {/* <Link href="/upgrade">
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                background: "#FFFFFF",
                color: "#0F172A",
                border: "none",
                borderRadius: "8px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Upgrade to Pro →
            </button>
          </Link> */}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: isTablet ? "0" : "240px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.3s",
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            height: "64px",
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 40,
            gap: "12px",
          }}
        >
          {/* Mobile Menu Toggle Button - Inside Header */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                cursor: "pointer",
                fontSize: "18px",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
              title="Toggle menu"
            >
              ☰
            </button>
          )}
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>
              {currentView === "dashboard"
                ? "Dashboard"
                : currentView === "history"
                  ? "History"
                  : currentView === "upwork"
                    ? "Upwork Proposals"
                    : currentView === "linkedin-inmail"
                      ? "LinkedIn InMail"
                      : currentView === "linkedin-conn"
                        ? "Connection Note"
                        : currentView === "cold-email"
                          ? "Cold Email"
                          : currentView === "settings"
                            ? "Settings"
                            : "Billing"}
            </div>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "1px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {(userRow?.plan === "free" || userRow?.plan === "basic") && (
              <Link href="/upgrade">
                <button
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    border: "1px solid #E2E8F0",
                    background: "transparent",
                    color: "#475569",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Upgrade
                </button>
              </Link>
            )}
            {!isMobile && (
              <button
                onClick={() => setShowHelpModal(true)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "1px solid #E2E8F0",
                  background: "transparent",
                  color: "#475569",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Help
              </button>
            )}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#EBF5FF",
                color: "#084E94",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Sora', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title={displayName}
            >
              {displayName.split(" ").map((n: string) => n[0]).join("")}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: isMobile ? "16px" : "28px", flex: 1 }}>
          {currentView === "dashboard" && <DashboardView monthlyStats={monthlyStats} recentActivity={recentActivity} isPaid={isPaid} usageCount={usageCount} credits={credits} creditsLimit={creditsLimit} activeTools={activeTools} isMobile={isMobile} isTablet={isTablet} handleViewChange={handleViewChange} />}
          {currentView === "history" && <HistoryView history={history} />}
          {currentView === "settings" && <SettingsView userRow={userRow} />}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 50,
            padding: "16px",
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>Help & Support</div>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  fontSize: "24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  fontWeight: 700,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", marginBottom: "8px" }}>📧 Getting Started</div>
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                  Welcome to ClientPitcher! Select any tool from the sidebar to start generating proposals, LinkedIn messages, or cold emails.
                </div>
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", marginBottom: "8px" }}>💡 Tips & Tricks</div>
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                  • Paste job postings for better proposal results<br />
                  • Use personalization for LinkedIn messages<br />
                  • View your usage history in the History tab
                </div>
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", marginBottom: "8px" }}>🎯 Need More Help?</div>
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                  Contact us on WhatsApp at <strong>+92 302 149 6945</strong> or email <strong>support@clientpitcher.com</strong>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "16px", marginTop: "16px" }}>
                <div style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center" }}>
                  We're here to help! Response time: Usually within 2 hours (9am-11pm PKT)
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "10px 16px",
                background: "#0F172A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  color,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  color?: "green" | "blue" | "red";
  active: boolean;
  onClick: () => void;
}) {
  const colorStyles = {
    green: { bg: "#F0FDF4", text: "#0D6B00", dot: "#14A800" },
    blue: { bg: "#EBF5FF", text: "#084E94", dot: "#0A66C2" },
    red: { bg: "#FEF2F2", text: "#991B1B", dot: "#DC2626" },
  };

  const style = color ? colorStyles[color] : { bg: "#0F172A", text: "#FFFFFF", dot: "#0F172A" };

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 10px",
        borderRadius: "9px",
        fontSize: "13.5px",
        fontWeight: 500,
        color: active ? style.text : "#475569",
        cursor: "pointer",
        border: "none",
        background: active ? style.bg : "#FFFFFF",
        width: "100%",
        textAlign: "left",
        marginBottom: "2px",
        transition: "all 0.15s",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#F8FAFC";
          e.currentTarget.style.color = "#0F172A";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#FFFFFF";
          e.currentTarget.style.color = "#475569";
        }
      }}
    >
      {color && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: style.dot, flexShrink: 0 }} />}
      <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function DashboardView({ monthlyStats, recentActivity, isPaid, usageCount, credits, creditsLimit, activeTools, isMobile, isTablet, handleViewChange }: any) {
  return (
    <div>
      {/* Banner - Only show for Free/Basic tiers */}
      {(isPaid) && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FCD34D",
            borderRadius: "12px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "13.5px", color: "#0F172A" }}>
            <strong style={{ fontWeight: 600 }}>
              {!isPaid
                ? `${5 - usageCount} free generations left this month.`
                : `${credits} credits remaining.`}
            </strong>{" "}
            Upgrade to Pro for unlimited access — 1,400 PKR/month.
          </div>
          <Link href="/upgrade">
            <button
              style={{
                padding: "8px 16px",
                background: "#0F172A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Upgrade Now →
            </button>
          </Link>
        </div>
      )}

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: "14px", marginBottom: "24px" }}>
        <MetricCard label="Proposals written" value={monthlyStats.proposals} sub="This month" />
        <MetricCard label="LinkedIn DMs" value={monthlyStats.linkedInInMails} sub="This month" />
        <MetricCard label="Cold emails" value={monthlyStats.coldEmails} sub="This month" />
        <MetricCard label="Connection Note" value={monthlyStats.connectionNotes} sub="This month" />
        <MetricCard label="Total generated" value={monthlyStats.total} sub="This month" />
      </div>

      {/* Quick Actions Grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        <QuickActionCard
          icon="📋"
          label="Write Proposal"
          sub="Paste job post → instant proposal"
          bgColor="#F0FDF4"
          onClick={() => window.location.href = "/app/upwork"}
        />
        <QuickActionCard
          icon="💼"
          label="LinkedIn InMail"
          sub="Personalised outreach message"
          bgColor="#EBF5FF"
          onClick={() => window.location.href = "/app/linkedin-inmail"}
        />
        <QuickActionCard
          icon="📧"
          label="Cold Email"
          sub="3 subject lines + full body"
          bgColor="#FEF2F2"
          onClick={() => window.location.href = "/app/cold-email"}
        />
        <QuickActionCard
          icon="🤝"
          label="Connection Note"
          sub="Personalised connection message"
          bgColor="#FFFBEB"
          onClick={() => window.location.href = "/app/linkedin-connection"}
        />
      </div>

      {/* Two Column Layout - Tool Usage and Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "2fr 1fr", gap: "18px" }}>
        {/* Tool Usage Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>Tool usage</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>this month</div>
          </div>
          <ToolUsageRow label="Upwork proposals" count={monthlyStats.proposals} color="#14A800" />
          <ToolUsageRow label="LinkedIn InMail" count={monthlyStats.linkedInInMails} color="#0A66C2" />
          <ToolUsageRow label="Connection notes" count={monthlyStats.connectionNotes} color="#d9d506" />
          <ToolUsageRow label="Cold emails" count={monthlyStats.coldEmails} color="#DC2626" />
        </div>

        {/* Recent Activity Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>Recent activity</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>last 5 actions</div>
          </div>
          {recentActivity.length === 0 ? (
            <div style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", padding: "16px 0" }}>
              No recent activity
            </div>
          ) : (
            recentActivity.slice(0, 5).map((activity: any, idx: number) => {
              const toolIcons: Record<string, string> = {
                upwork: "📋",
                "linkedin-inmail": "💼",
                "linkedin-connection": "🤝",
                "cold-email": "📧",
              };
              const toolBgs: Record<string, string> = {
                upwork: "#F0FDF4",
                "linkedin-inmail": "#EBF5FF",
                "linkedin-connection": "#FFFBEB",
                "cold-email": "#FEF2F2",
              };
              const toolNames: Record<string, string> = {
                upwork: "Proposal",
                "linkedin-inmail": "InMail",
                "linkedin-connection": "Connection",
                "cold-email": "Email",
              };
              const icon = toolIcons[activity.tool_type] || "📋";
              const bg = toolBgs[activity.tool_type] || "#F0FDF4";
              const toolName = toolNames[activity.tool_type] || "Content";
              const date = new Date(activity.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    paddingBottom: "12px",
                    borderBottom: idx < recentActivity.slice(0, 5).length - 1 ? "1px solid #F8FAFC" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                      background: bg,
                    }}
                  >
                    {icon}
                  </div>
                  <div style={{ flex: 1, marginTop: "1px" }}>
                    <div style={{ fontSize: "13px", color: "#0F172A", fontWeight: 500 }}>
                      {toolName} — {truncateToPreview(activity.title)}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "2px" }}>{date}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryView({ history }: any) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
        {history.length === 0 ? "No history available" : "Recent Generations"}
      </div>
      {history.length === 0 ? (
        <div style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", padding: "20px" }}>
          No history available
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Tool
            </th>
            <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Entry
            </th>
            <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Style
            </th>
            <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry: any, i: number) => {
            const toolNames: Record<string, string> = {
              upwork: "Upwork",
              "linkedin-inmail": "LinkedIn",
              "linkedin-connection": "Connection",
              "cold-email": "Email",
            };
            const toolName = toolNames[entry.tool_type] || "Unknown";
            const toolColorMap: Record<string, string> = {
              upwork: "#14A800",
              "linkedin-inmail": "#0A66C2",
              "linkedin-connection": "#0A66C2",
              "cold-email": "#DC2626",
            };
            const toolColor = toolColorMap[entry.tool_type] || "#0F172A";
            const date = new Date(entry.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: entry.created_at.startsWith(new Date().getFullYear().toString()) ? undefined : "numeric",
            });

            return (
              <tr key={entry.id}>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#0F172A", verticalAlign: "middle" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "100px",
                      fontWeight: 600,
                      background: toolColor,
                      color: "#FFFFFF",
                    }}
                  >
                    {toolName}
                  </span>
                </td>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#0F172A", verticalAlign: "middle", fontWeight: 500 }}>
                  {truncateToPreview(entry.title)}
                </td>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#0F172A", verticalAlign: "middle" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 9px",
                      borderRadius: "100px",
                      background: "#F8FAFC",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    {entry.prompt_key || "standard"}
                  </span>
                </td>
                <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "12px", color: "#94A3B8", verticalAlign: "middle" }}>
                  {date}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
    </div>
  );
}

function ToolView({ tool, entries, setEntries, generatedOutput, setGeneratedOutput, isTablet }: any) {
  const toolInfo: Record<string, { color: string; icon: string; title: string }> = {
    upwork: { color: "#14A800", icon: "📋", title: "Upwork Proposals" },
    "linkedin-inmail": { color: "#0A66C2", icon: "✉️", title: "LinkedIn InMail" },
    "linkedin-conn": { color: "#0A66C2", icon: "🤝", title: "Connection Note" },
    "cold-email": { color: "#DC2626", icon: "📧", title: "Cold Email" },
  };

  const info = toolInfo[tool] || toolInfo.upwork;

  const handleGenerate = () => {
    setGeneratedOutput({ ...generatedOutput, [tool]: "Generated content..." });
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "2fr 1fr", gap: "18px", alignItems: "start" }}>
        {/* Tracker */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>{info.icon}</span>
            {info.title} Tracker
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Entry
                </th>
                <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Style
                </th>
                <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Date
                </th>
                <th style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textAlign: "right", paddingBottom: "10px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Outcome
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#0F172A" }}>
                    <div style={{ fontWeight: 500 }}>{entry.name}</div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{entry.date}</div>
                  </td>
                  <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#0F172A" }}>
                    <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "100px", background: "#F8FAFC", color: "#475569", fontWeight: 500 }}>
                      {entry.style}
                    </span>
                  </td>
                  <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "12px", color: "#94A3B8" }}>
                    {entry.date}
                  </td>
                  <td style={{ padding: "11px 0", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#0F172A", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
                      {["✅", "💬", "👁️", "❌"].map((icon, idx) => (
                        <button
                          key={idx}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            background: "#FFFFFF",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            transition: "all 0.15s",
                          }}
                          onClick={() => {
                            const newEntries = [...entries];
                            newEntries[i].outcome = ["won", "replied", "seen", "lost"][idx];
                            setEntries(newEntries);
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generator */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "6px" }}>
              Style
            </label>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#FFFFFF",
              }}
            >
              <option>Problem Mirror</option>
              <option>Proof Closer</option>
              <option>Diagnostic Hook</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "6px" }}>
              Additional Notes
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                minHeight: "80px",
                resize: "vertical",
              }}
              placeholder="Any additional context..."
            />
          </div>

          <button
            onClick={handleGenerate}
            style={{
              padding: "10px 16px",
              background: info.color,
              color: "#FFFFFF",
              border: "none",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Generate ✨
          </button>
        </div>
      </div>

      {/* Output */}
      {generatedOutput[tool] && (
        <div style={{ marginTop: "24px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "12px" }}>Generated Output</div>
          <div
            style={{
              padding: "16px",
              background: "#F8FAFC",
              borderRadius: "9px",
              border: "1px solid #E2E8F0",
              fontSize: "13.5px",
              color: "#475569",
              lineHeight: "1.75",
              whiteSpace: "pre-wrap",
              marginBottom: "12px",
            }}
          >
            {generatedOutput[tool]}
          </div>
          <button
            style={{
              padding: "8px 16px",
              background: "#0F172A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onClick={() => {
              navigator.clipboard.writeText(generatedOutput[tool]);
              alert("Copied!");
            }}
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  );
}

function QuickActionCard({ icon, label, sub, bgColor, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "18px",
        padding: "18px 16px",
        cursor: "pointer",
        transition: "all 0.18s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.09)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "17px",
          marginBottom: "12px",
          background: bgColor,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "12px", color: "#94A3B8" }}>{sub}</div>
    </div>
  );
}

function ToolUsageRow({ label, count, color }: any) {
  const max = 30; // max for the bar
  const percentage = Math.min((count / max) * 100, 100);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #F8FAFC" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ fontSize: "13px", color: "#0F172A", flex: 1, fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, height: "5px", background: "#F8FAFC", borderRadius: "3px", overflow: "hidden", margin: "0 8px" }}>
        <div style={{ height: "100%", borderRadius: "3px", background: color, width: `${percentage}%` }} />
      </div>
      <div style={{ fontSize: "13px", color: "#94A3B8", minWidth: "28px", textAlign: "right", fontWeight: 500 }}>
        {count}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub }: any) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "8px", fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "5px" }}>{sub}</div>}
    </div>
  );
}

function SettingsView({ userRow }: any) {
  const [editName, setEditName] = useState((userRow?.full_name || "").toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async () => {
    if (!editName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: editName.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Name updated successfully");
      } else {
        toast.error(data.error || "Failed to update name");
        setEditName(userRow?.full_name || "");
      }
    } catch (error) {
      toast.error("Failed to update name");
      setEditName(userRow?.full_name || "");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "18px",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
          Account Settings
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "6px" }}>
              Full Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", display: "flex", gap: "8px" }}>
              {editName !== userRow?.full_name && (
                <>
                  <button
                    onClick={handleSaveName}
                    disabled={isSaving}
                    style={{
                      background: "none",
                      border: "none",
                      color: isSaving ? "#94A3B8" : "#0A66C2",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      textDecoration: "underline",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      opacity: isSaving ? 0.6 : 1,
                    }}
                  >
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    onClick={() => setEditName(userRow?.full_name || "")}
                    disabled={isSaving}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94A3B8",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              defaultValue={userRow?.email || ""}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
              }}
              disabled
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "6px" }}>
              Current Plan
            </label>
            <input
              type="text"
              defaultValue={userRow?.plan === "pro" ? "Pro" : userRow?.plan === "promax" ? "ProMax" : userRow?.plan === "basic" ? "Basic" : "Free"}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
              }}
              disabled
            />
          </div>

          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "16px", marginTop: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8", marginBottom: "12px" }}>Account Actions</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
