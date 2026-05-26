import { useEffect, useRef, useCallback } from "react";

export type AuraEvent =
  | { type: "connected"; message: string; namespace: string; nodes_online: number }
  | { type: "incident_detected"; pod: string; reason: string; message: string; timestamp: string; status: "analyzing" }
  | { type: "rca_complete"; pod: string; reason: string; root_cause_analysis: string; extracted_logic: string; method: string; active_node: string; timestamp: string; status: "complete" };

export function useAuraSocket(onEvent: (e: AuraEvent) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/incidents");

    ws.onopen = () => console.log("🔌 Aura WebSocket connected");

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data) as AuraEvent;
        onEventRef.current(data);
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    ws.onclose = () => {
      console.log("🔌 WS closed. Reconnecting in 3s...");
      setTimeout(connect, 3000); // auto-reconnect
    };

    ws.onerror = (e) => console.error("WS error", e);
    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);
}