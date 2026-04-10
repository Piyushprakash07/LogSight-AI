"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
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
        alert("Registration failed or user already exists");
        return;
      }

      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong during registration");
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          Create your LogSight AI account
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#cbd5e1",
            maxWidth: "420px",
            lineHeight: "1.7",
          }}
        >
          Sign up to access your log dashboard, upload data, detect anomalies,
          and monitor system risk in one place.
        </p>
      </div>

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
          <h2 style={{ marginBottom: "20px" }}>Register</h2>

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

          <button
            onClick={handleRegister}
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
            Create Account
          </button>

          <p
            style={{
              marginTop: "16px",
              fontSize: "14px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <a href="/login" style={{ color: "#60a5fa" }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}