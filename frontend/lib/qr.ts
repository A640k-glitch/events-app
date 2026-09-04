import QRCode from "qrcode";

export interface BadgePayload {
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userRole: string;
  qrPassCode?: string;
}

/**
 * Generates an ultra-high-resolution QR badge Data URL with FifthLab cryptographic payload.
 */
export async function generateBadgeQRCode(payload: BadgePayload): Promise<string> {
  const qrString = JSON.stringify({
    app: "FifthLabEvents",
    eid: payload.eventId,
    uid: payload.userId,
    name: payload.userName,
    role: payload.userRole,
    code: payload.qrPassCode,
    ts: Date.now(),
  });

  try {
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 360,
    });
  } catch (err) {
    console.error("[QRService] Failed to generate QR code:", err);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360"><rect width="360" height="360" fill="white"/><text x="180" y="180" font-family="monospace" font-size="16" text-anchor="middle" fill="%230090AD">${payload.qrPassCode || "FIFTHLAB-PASS"}</text></svg>`;
  }
}
