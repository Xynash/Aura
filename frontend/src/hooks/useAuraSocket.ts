import { useEffect, useRef, useCallback } from "react";

export type AuraEvent =
  | { 
      type: "connected"; 
      message: string; 
      namespace: string; 
      nodes_online: number; 
      services: string[] 
    }
  | { 
      type: "incident_detected"; 
      pod: string; 
      reason: string; 
      message: string; 
      timestamp: string; 
      status: "analyzing" 
    }
  | { 
      type: "rca_complete"; 
      pod: string; 
      reason: string; 
      root_cause_analysis: string; 
      extracted_logic: string; 
      method: string; 
      source_file: string; 
      active_node: string; 
      timestamp: string; 
      status: "complete" 
    };

export function useAuraSocket(onEvent: (e: AuraEvent) => void) {
  const wsRef         = useRef<WebSocket | null>(null);
  const onEventRef    = useRef(onEvent);
  const reconnectRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef    = useRef(true);

  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    // Don't reconnect if component unmounted
    if (!mountedRef.current) return;

    try {
      const WS_URL =
        import.meta.env.VITE_WS_URL ??
        "wss://aura-backend-33nm.onrender.com/ws/incidents";

      console.log(`🔌 Connecting to: ${WS_URL}`);
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("✅ Aura WebSocket: Neural link established.");
        // Clear any pending reconnect
        if (reconnectRef.current) {
          clearTimeout(reconnectRef.current);
          reconnectRef.current = null;
        }
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data) as AuraEvent;
          onEventRef.current(data);
        } catch (e) {
          console.error("❌ WS parse error", e);
        }
      };

      ws.onclose = (event) => {
        console.warn(`⚠️ WS closed (code: ${event.code}). Reconnecting in 5s...`);
        if (mountedRef.current) {
          reconnectRef.current = setTimeout(connect, 5000);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WS error:", err);
        ws.close(); // triggers onclose → reconnect
      };

      wsRef.current = ws;

    } catch (err) {
      console.warn("⚠️ WebSocket unavailable. Retrying in 5s...", err);
      if (mountedRef.current) {
        reconnectRef.current = setTimeout(connect, 5000);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      // Cleanup on unmount
      mountedRef.current = false;
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);
}
