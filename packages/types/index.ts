// Shared Types for DevPro
// This file will hold types shared between the API and the Web app.
export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}
