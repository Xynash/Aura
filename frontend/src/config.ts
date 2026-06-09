export const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "https://aura-backend-33nm.onrender.com";

export const WS_URL = import.meta.env.PROD
  ? import.meta.env.VITE_WS_URL
  : "wss://aura-backend-33nm.onrender.com";

export const AURA_KEY = import.meta.env.VITE_AURA_KEY || "";