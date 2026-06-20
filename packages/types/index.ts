// Shared Types for DevPro
// This file will hold types shared between the API and the Web app.
export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

export interface User {
  id: string;
  email: string | null;
  created_at: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
