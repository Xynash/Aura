import { useEffect, useRef, useCallback } from "react";

export type AuraEvent =
  | { type: "connected"; message: string; namespace: string; nodes_online: number; services: string[] }
  | { type: "incident_detected"; pod: string; reason: string; message: string; timestamp: string; status: "analyzing" }
  | { type: "rca_complete"; pod: string; reason: string; root_cause_analysis: string; extracted_logic: string; method: string; source_file: string; active_node: string; timestamp: string; status: "complete" };

export function useAuraSocket(onEvent: (e: AuraEvent) => void) {
  const wsRef      = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket("ws://localhost:8000/ws/incidents");

      ws.onopen = () => console.log("🔌 Aura WebSocket: Neural link established.");

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data) as AuraEvent;
          onEventRef.current(data);
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onclose = () => {
        console.log("🔌 WS closed. Reconnecting in 5s...");
        setTimeout(connect, 5000);
      };

      ws.onerror = () => ws.close();

      wsRef.current = ws;
    } catch {
      console.warn("WebSocket unavailable. Running in simulation mode.");
    }
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);
}