// API Configuration
// In Docker, set VITE_API_URL environment variable to the backend service URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
