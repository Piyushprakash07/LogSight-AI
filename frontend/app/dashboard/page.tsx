"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Log = {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  is_anomaly?: boolean;
};

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const [logs, setLogs] = useState<Log[]>([]);
  const [level, setLevel] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");

  const [newLevel, setNewLevel] = useState("INFO");
  const [newService, setNewService] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [bulkLogs, setBulkLogs] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeSection, setActiveSection] = useState("Dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, [authorized]);

  const displayedLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(searchText.toLowerCase())
  );

  const anomalyCount = displayedLogs.filter((log) => log.is_anomaly).length;
  const criticalCount = displayedLogs.filter((log) => log.level === "CRITICAL").length;
  const errorCount = displayedLogs.filter((log) => log.level === "ERROR").length;

  const serviceCounts = displayedLogs.reduce((acc: Record<string, number>, log) => {
    acc[log.service] = (acc[log.service] || 0) + 1;
    return acc;
  }, {});

  const topService =
    Object.keys(serviceCounts).length > 0
      ? Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  const levelData = ["INFO", "WARNING", "ERROR", "CRITICAL"].map((lvl) => ({
    level: lvl,
    count: displayedLogs.filter((log) => log.level === lvl).length,
  }));

  const serviceData = Object.entries(serviceCounts).map(([name, count]) => ({
    service: name,
    count,
  }));

  const anomalyData = [
    { name: "Normal", value: displayedLogs.filter((log) => !log.is_anomaly).length },
    { name: "Anomaly", value: displayedLogs.filter((log) => log.is_anomaly).length },
  ];

  const riskScore = Math.min(
    anomalyCount * 15 + criticalCount * 20 + errorCount * 10,
    100
  );

  const incidentStatus =
    riskScore >= 80
      ? "Critical"
      : riskScore >= 60
      ? "High"
      : riskScore >= 30
      ? "Medium"
      : "Low";

  const recommendation =
    incidentStatus === "Critical"
      ? "Immediate investigation required. Multiple high-risk signals detected."
      : incidentStatus === "High"
      ? "Prioritize log review and validate affected services."
      : incidentStatus === "Medium"
      ? "Monitor anomalies closely and investigate recurring failures."
      : "System appears stable. Continue routine monitoring.";

  const fetchLogs = async () => {
    try {
      setStatus("Loading logs...");
      let url = `${process.env.NEXT_PUBLIC_API_URL}/logs?limit=100`;

      if (level) {
        url += `&level=${encodeURIComponent(level)}`;
      }

      if (service) {
        url += `&service=${encodeURIComponent(service)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setLogs(data);
      setStatus("");
    } catch {
      setStatus("Failed to fetch logs");
    }
  };

  const fetchAnomalies = async () => {
    try {
      setStatus("Loading anomalies...");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs/anomalies`);
      const data = await res.json();
      setLogs(data);
      setStatus("");
    } catch {
      setStatus("Failed to fetch anomalies");
    }
  };

  const submitLog = async () => {
    if (!newService.trim() || !newMessage.trim()) {
      setStatus("Service and message are required");
      return;
    }

    try {
      setStatus("Submitting log...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: newLevel,
          service: newService,
          message: newMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit log");
      }

      setNewLevel("INFO");
      setNewService("");
      setNewMessage("");
      setStatus("Log submitted successfully");
      fetchLogs();
    } catch {
      setStatus("Failed to submit log");
    }
  };

  const submitBulkLogs = async () => {
    if (!bulkLogs.trim()) {
      setStatus("Bulk logs input is empty");
      return;
    }

    try {
      setStatus("Submitting bulk logs...");
      const parsedLogs = JSON.parse(bulkLogs);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedLogs),
      });

      if (!res.ok) {
        throw new Error("Failed to submit bulk logs");
      }

      setBulkLogs("");
      setStatus("Bulk logs submitted successfully");
      fetchLogs();
    } catch {
      setStatus("Invalid JSON or failed to submit bulk logs");
    }
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus("Reading CSV file...");

      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setStatus("CSV file is empty or invalid");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const parsedLogs = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        return {
          level: row.level || "INFO",
          service: row.service || "unknown-service",
          message: row.message || "empty message",
        };
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedLogs),
      });

      if (!res.ok) {
        throw new Error("Failed to upload CSV logs");
      }

      setStatus("CSV logs uploaded successfully");
      fetchLogs();
    } catch {
      setStatus("Failed to process CSV file");
    }
  };

  const exportLogsAsCSV = () => {
    if (displayedLogs.length === 0) {
      setStatus("No logs available to export");
      return;
    }

    const headers = ["timestamp", "level", "service", "message", "is_anomaly"];

    const rows = displayedLogs.map((log) => [
      log.timestamp,
      log.level,
      log.service,
      `"${log.message.replace(/"/g, '""')}"`,
      log.is_anomaly ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "logsight_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    setStatus("Logs exported successfully");
  };

  if (!authorized) {
    return <div style={{ padding: "20px", color: "white" }}>Checking authentication...</div>;
  }

  const primaryButtonStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
  };

  const sectionStyle: React.CSSProperties = {
    background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
    color: "white",
    padding: "18px",
    borderRadius: "16px",
    marginBottom: "24px",
    border: "1px solid #1f2937",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0b1220",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
          borderRight: "1px solid #1f2937",
          padding: "24px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "30px", fontSize: "24px" }}>
            LogSight AI
          </h2>

          <div style={{ display: "grid", gap: "10px" }}>
  {["Dashboard", "Logs", "Anomalies", "Risk Insights", "Upload Center", "Exports"].map(
    (item) => (
      <button
        key={item}
        onClick={() => setActiveSection(item)}
        style={{
          padding: "12px 14px",
          borderRadius: "10px",
          backgroundColor: activeSection === item ? "#1d4ed8" : "#111827",
          color: "white",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontWeight: activeSection === item ? "bold" : "normal",
        }}
      >
        {item}
      </button>
    )
  )}
</div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "28px",
          background:
            "radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent 35%)",
        }}
      >
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  }}
>
  <div>
    <h1 style={{ margin: 0, fontSize: "34px" }}>{activeSection}</h1>
    <p style={{ margin: "8px 0 0 0", color: "#94a3b8" }}>
      {activeSection === "Dashboard" && "Monitor logs, anomalies, risk signals, and service health in one place."}
      {activeSection === "Logs" && "Explore ingested logs with filters, search, and exports."}
      {activeSection === "Anomalies" && "Inspect unusual log patterns detected by the ML pipeline."}
      {activeSection === "Risk Insights" && "Track incident risk score and operational recommendations."}
      {activeSection === "Upload Center" && "Submit single logs, bulk JSON logs, and CSV uploads."}
      {activeSection === "Exports" && "Download current visible data for external reporting and sharing."}
    </p>
  </div>

  <div
    style={{
      backgroundColor: "#111827",
      border: "1px solid #1f2937",
      padding: "10px 14px",
      borderRadius: "12px",
      color: "#cbd5e1",
    }}
  >
    Live Monitoring Active
  </div>
</div>
{(activeSection === "Dashboard" || activeSection === "Risk Insights") && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "18px",
            marginBottom: "24px",
          }}
        >
          
          <div
            style={{
              background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
              color: "white",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #1f2937",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h3>Total Logs</h3>
            <p style={{ fontSize: "24px", margin: 0 }}>{displayedLogs.length}</p>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, #2a1a1a 0%, #1f1111 100%)",
              color: "white",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #3f1d1d",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h3>Anomalies</h3>
            <p style={{ fontSize: "24px", margin: 0 }}>{anomalyCount}</p>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, #2a2222 0%, #1f1717 100%)",
              color: "white",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #3a2b2b",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h3>Critical Logs</h3>
            <p style={{ fontSize: "24px", margin: 0 }}>{criticalCount}</p>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, #1a2a2a 0%, #122020 100%)",
              color: "white",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #213636",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h3>Top Service</h3>
            <p style={{ fontSize: "24px", margin: 0 }}>{topService}</p>
          </div>
        </div>
)}
{(activeSection === "Dashboard" || activeSection === "Risk Insights") && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Incident Risk Panel</h2>
          <p>Risk Score: {riskScore}/100</p>
          <p>Status: {incidentStatus}</p>
          <p>
            Signals: {anomalyCount} anomalies / {criticalCount} critical / {errorCount} errors
          </p>
          <p>
            <strong>Recommendation:</strong> {recommendation}
          </p>
        </div>
)}
{(activeSection === "Dashboard" || activeSection === "Upload Center") && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Submit Log</h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              style={{ padding: "10px", borderRadius: "10px", background: "#0f172a", color: "white", border: "1px solid #334155" }}
            >
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            <input
              type="text"
              placeholder="Service name"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              style={{ padding: "10px", width: "200px", borderRadius: "10px", background: "#0f172a", color: "white", border: "1px solid #334155" }}
            />

            <input
              type="text"
              placeholder="Log message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ padding: "10px", width: "320px", borderRadius: "10px", background: "#0f172a", color: "white", border: "1px solid #334155" }}
            />

            <button onClick={submitLog} style={primaryButtonStyle}>
              Submit Log
            </button>
          </div>
        </div>
)}
{(activeSection === "Dashboard" || activeSection === "Upload Center") && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Bulk Log Upload</h2>

          <textarea
            placeholder='Paste JSON array of logs here'
            value={bulkLogs}
            onChange={(e) => setBulkLogs(e.target.value)}
            rows={8}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "12px",
              backgroundColor: "#0f172a",
              color: "white",
              border: "1px solid #334155",
            }}
          />

          <button onClick={submitBulkLogs} style={primaryButtonStyle}>
            Submit Bulk Logs
          </button>
        </div>
)}
{(activeSection === "Dashboard" || activeSection === "Upload Center") && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>CSV Log Upload</h2>

          <p style={{ marginTop: 0, color: "#bbb" }}>
            CSV format: level,service,message
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ padding: "8px" }}
          />
        </div>
)}

        <div style={sectionStyle}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ padding: "10px", borderRadius: "10px", background: "#0f172a", color: "white", border: "1px solid #334155" }}
            >
              <option value="">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            <input
              type="text"
              placeholder="Filter by service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{ padding: "10px", width: "220px", borderRadius: "10px", background: "#0f172a", color: "white", border: "1px solid #334155" }}
            />

            <input
              type="text"
              placeholder="Search by message"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ padding: "10px", width: "220px", borderRadius: "10px", background: "#0f172a", color: "white", border: "1px solid #334155" }}
            />

            <button onClick={fetchLogs} style={primaryButtonStyle}>
              Apply Filters
            </button>

            <button
              onClick={fetchAnomalies}
              style={{ ...primaryButtonStyle, background: "#7c3aed" }}
            >
              Show Anomalies
            </button>

            <button
              onClick={exportLogsAsCSV}
              style={{ ...primaryButtonStyle, background: "#059669" }}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={sectionStyle}>
            <h3>Logs by Level</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={sectionStyle}>
            <h3>Logs by Service</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={sectionStyle}>
            <h3>Anomaly Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={anomalyData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {status && <p>{status}</p>}

        <div style={sectionStyle}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              color: "white",
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#111", color: "white", padding: "10px" }}>
                  Timestamp
                </th>
                <th style={{ backgroundColor: "#111", color: "white", padding: "10px" }}>
                  Level
                </th>
                <th style={{ backgroundColor: "#111", color: "white", padding: "10px" }}>
                  Service
                </th>
                <th style={{ backgroundColor: "#111", color: "white", padding: "10px" }}>
                  Message
                </th>
                <th style={{ backgroundColor: "#111", color: "white", padding: "10px" }}>
                  Anomaly
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedLogs.length > 0 ? (
                displayedLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      backgroundColor: log.is_anomaly ? "#5a1f1f" : "#2a2a2a",
                      color: "white",
                    }}
                  >
                    <td style={{ padding: "10px" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "white",
                          backgroundColor:
                            log.level === "INFO"
                              ? "blue"
                              : log.level === "WARNING"
                              ? "orange"
                              : log.level === "ERROR"
                              ? "red"
                              : log.level === "CRITICAL"
                              ? "black"
                              : "gray",
                        }}
                      >
                        {log.level}
                      </span>
                    </td>

                    <td style={{ padding: "10px" }}>{log.service}</td>
                    <td style={{ padding: "10px" }}>{log.message}</td>
                    <td style={{ padding: "10px" }}>
                      {log.is_anomaly ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: "10px" }}>
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}