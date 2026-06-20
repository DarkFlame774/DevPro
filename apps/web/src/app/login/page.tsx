"use client";

import { useState } from "react";
import { LoginRequest, SignupRequest } from "@devpro/types";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload: LoginRequest | SignupRequest = { email, password };

    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  const checkSession = async () => {
    try {
      // The credentials: "include" tells fetch to send our HTTP-only cookie!
      const res = await fetch("http://localhost:3001/api/auth/me", {
        credentials: "include", 
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`You are logged in as: ${data.user.email}`);
      } else {
        setError(data.error || "Not logged in");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "400px" }}>
      <h1>{isLogin ? "Log In" : "Sign Up"}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Email</label>
          <br />
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem", background: "#000", color: "#fff", cursor: "pointer" }}>
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>

      <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
        <h3>Test Session</h3>
        <button onClick={checkSession} style={{ padding: "0.5rem" }}>
          Check Current User (/me)
        </button>
      </div>

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
