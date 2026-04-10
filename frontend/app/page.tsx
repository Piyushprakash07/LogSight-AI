export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1f3b73 0%, #0b1220 45%, #050814 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "30px",
          paddingBottom: "60px",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "80px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
            LogSight AI
          </h2>

          <div style={{ display: "flex", gap: "14px" }}>
  <a href="/login" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "10px 18px",
        borderRadius: "8px",
        border: "1px solid #3b82f6",
        background: "transparent",
        color: "white",
        cursor: "pointer",
      }}
    >
      Login
    </button>
  </a>

  <a href="/register" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "10px 18px",
        borderRadius: "8px",
        border: "1px solid #475569",
        background: "transparent",
        color: "white",
        cursor: "pointer",
      }}
    >
      Register
    </button>
  </a>

  <a href="/dashboard" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "10px 18px",
        borderRadius: "8px",
        border: "none",
        background: "#3b82f6",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Open Dashboard
    </button>
  </a>
</div>
        </nav>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "40px",
            alignItems: "center",
            marginBottom: "80px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: "999px",
                backgroundColor: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.35)",
                color: "#93c5fd",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              AI-powered observability for modern systems
            </div>

            <h1
              style={{
                fontSize: "58px",
                lineHeight: "1.1",
                margin: "0 0 20px 0",
                maxWidth: "700px",
              }}
            >
              Detect anomalies, assess risk, and understand logs in real time.
            </h1>

            <p
              style={{
                fontSize: "20px",
                lineHeight: "1.7",
                color: "#cbd5e1",
                maxWidth: "680px",
                marginBottom: "30px",
              }}
            >
              LogSight AI helps teams ingest logs, detect abnormal behavior,
              analyze incidents, and turn raw system events into actionable
              insights through a clean full-stack dashboard.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href="/dashboard" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "14px 24px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(37,99,235,0.35)",
                  }}
                >
                  Explore Dashboard
                </button>
              </a>

              <a href="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "14px 24px",
                    borderRadius: "10px",
                    border: "1px solid #475569",
                    background: "transparent",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Login to Continue
                </button>
              </a>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  background: "#111827",
                  padding: "16px",
                  borderRadius: "14px",
                }}
              >
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                  Total Logs
                </p>
                <h3 style={{ margin: "8px 0 0 0", fontSize: "28px" }}>12.4K</h3>
              </div>

              <div
                style={{
                  background: "#111827",
                  padding: "16px",
                  borderRadius: "14px",
                }}
              >
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                  Anomalies
                </p>
                <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#f87171" }}>
                  37
                </h3>
              </div>

              <div
                style={{
                  background: "#111827",
                  padding: "16px",
                  borderRadius: "14px",
                }}
              >
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                  Risk Score
                </p>
                <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#fbbf24" }}>
                  68/100
                </h3>
              </div>

              <div
                style={{
                  background: "#111827",
                  padding: "16px",
                  borderRadius: "14px",
                }}
              >
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                  Top Service
                </p>
                <h3 style={{ margin: "8px 0 0 0", fontSize: "24px" }}>
                  api-gateway
                </h3>
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                borderRadius: "14px",
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p style={{ margin: "0 0 10px 0", color: "#93c5fd", fontWeight: "bold" }}>
                Live Incident Insight
              </p>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: "1.6" }}>
                Critical spike detected in <strong>api-gateway</strong>. Multiple timeout
                and retry patterns suggest upstream latency issues. Immediate investigation
                recommended.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "50px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "36px",
              marginBottom: "14px",
            }}
          >
            Why LogSight AI?
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#cbd5e1",
              maxWidth: "760px",
              margin: "0 auto 40px auto",
              lineHeight: "1.7",
              fontSize: "18px",
            }}
          >
            Built for modern engineering teams that need more than raw logs —
            they need intelligence, prioritization, and product-quality visibility.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Smart Log Ingestion</h3>
              <p style={{ color: "#cbd5e1", lineHeight: "1.7" }}>
                Submit individual logs, upload bulk JSON, or ingest CSV files
                into a unified full-stack monitoring workflow.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>AI-Based Detection</h3>
              <p style={{ color: "#cbd5e1", lineHeight: "1.7" }}>
                Use anomaly detection to identify unusual log patterns and
                highlight risky events before they turn into incidents.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Operational Risk Visibility</h3>
              <p style={{ color: "#cbd5e1", lineHeight: "1.7" }}>
                Track severity, anomalies, trends, and recommendations through a
                dashboard designed like a real observability product.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}