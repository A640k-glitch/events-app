import { Response } from "express";

/**
 * Real-time event streaming service using Server-Sent Events (SSE).
 * Broadcasts mutations (event added/edited, leads, rsvps, pitches, products)
 * to all connected clients across mobile and desktop.
 */
const clients = new Set<Response>();

export function addRealtimeClient(res: Response): void {
  clients.add(res);

  // Initial connection handshake
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", timestamp: Date.now() })}\n\n`);

  res.on("close", () => {
    clients.delete(res);
  });
}

export function broadcast(eventType: string, payload?: unknown): void {
  const message = `data: ${JSON.stringify({ type: eventType, payload, timestamp: Date.now() })}\n\n`;
  for (const client of Array.from(clients)) {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  }
}

// Keep connection alive across mobile sleep / proxy timeouts
setInterval(() => {
  for (const client of Array.from(clients)) {
    try {
      client.write(": ping\n\n");
    } catch {
      clients.delete(client);
    }
  }
}, 25000);
