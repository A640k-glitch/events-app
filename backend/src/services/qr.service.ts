import QRCode from "qrcode";

export interface BadgePayload {
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userRole: string;
}

export async function generateBadgeQRCode(payload: BadgePayload): Promise<string> {
  const qrString = JSON.stringify({
    app: "FifthLabEvents",
    eid: payload.eventId,
    uid: payload.userId,
    name: payload.userName,
    role: payload.userRole,
    ts: Date.now(),
  });

  // Generates data URL string
  return await QRCode.toDataURL(qrString, {
    errorCorrectionLevel: "H",
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    width: 320,
  });
}
