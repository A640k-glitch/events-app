import { Response } from "express";

/**
 * Real-time event streaming service using Server-Sent Events (SSE).
 * Broadcasts mutations (event added/edited, leads, rsvps, pitches, products)
 * to all connected clients across mobile and desktop.
 */
const clients = new Set<Response>();

export function addRealtimeClient(res: Response): void {
  clients.add(res);

  const cleanup = () => {
    clients.delete(res);
  };

  res.on("close", cleanup);
  res.on("finish", cleanup);
  res.on("error", cleanup);
  if (res.req) {
    res.req.on("close", cleanup);
    res.req.on("aborted", cleanup);
  }
  if (res.socket) {
    res.socket.on("error", cleanup);
    res.socket.on("close", cleanup);
  }

  // Initial connection handshake
  try {
    if (!res.destroyed && !res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: "CONNECTED", timestamp: Date.now() })}\n\n`);
    }
  } catch {
    cleanup();
  }
}

export function broadcast(eventType: string, payload?: unknown): void {
  const message = `data: ${JSON.stringify({ type: eventType, payload, timestamp: Date.now() })}\n\n`;
  for (const client of Array.from(clients)) {
    try {
      if (!client.destroyed && !client.writableEnded && client.writable) {
        client.write(message);
      } else {
        clients.delete(client);
      }
    } catch {
      clients.delete(client);
    }
  }
}

// Keep connection alive across mobile sleep / proxy timeouts with safe checks (15s heartbeat)
setInterval(() => {
  for (const client of Array.from(clients)) {
    try {
      if (!client.destroyed && !client.writableEnded && client.writable) {
        client.write(": ping\n\n");
      } else {
        clients.delete(client);
      }
    } catch {
      clients.delete(client);
    }
  }
}, 15000);
