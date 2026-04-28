"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = async () => {
  setError("");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      setError("Invalid email or password");
      return;
    }

    const data = await res.json();

    // store token
    localStorage.setItem("token", data.access_token);

    // redirect to dashboard
    router.push("/dashboard");
  } catch (err) {
    console.error(err);
    setError("Login failed. Please try again later.");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background:
          "radial-gradient(circle at top, #1f3b73 0%, #0b1220 45%, #050814 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          LogSight AI
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#cbd5e1",
            maxWidth: "420px",
            lineHeight: "1.7",
          }}
        >
          Monitor logs, detect anomalies, and understand system behavior with
          AI-powered insights.
        </p>

        <div style={{ marginTop: "40px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Built for modern engineering teams 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "380px",
            padding: "32px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Login</h2>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
            }}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(37,99,235,0.4)",
            }}
          >
            Login
          </button>

        <p
  style={{
    marginTop: "16px",
    fontSize: "14px",
    color: "#94a3b8",
    textAlign: "center",
  }}
>
  Don’t have an account?{" "}
  <a href="/register" style={{ color: "#60a5fa" }}>
    Register
  </a>
</p> 
        </div>
      </div>
    </div>
  );
}