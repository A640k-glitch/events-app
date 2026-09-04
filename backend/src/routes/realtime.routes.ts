import { Router, Request, Response } from "express";
import { addRealtimeClient } from "../services/realtime.service.js";

export const realtimeRouter: Router = Router();

// GET /api/realtime/stream or /api/events/stream
realtimeRouter.get(["/stream", "/events/stream"], (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  addRealtimeClient(res);
});
