import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, data } = await req.json();
    
    const message = {
      message: {
        token,
        notification: {
          title,
          body,
        },
        data: data || {},
        webpush: {
          headers: {
            Urgency: "high",
          },
          notification: {
            icon: "https://nawa-mariage.vercel.app/icon-192x192.png",
            badge: "https://nawa-mariage.vercel.app/badge-72x72.png",
            requireInteraction: true,
            actions: [
              {
                action: "open",
                title: "Ouvrir l'app",
              },
            ],
          },
          fcm_options: {
            link: data?.url || "https://nawa-mariage.vercel.app",
          },
        },
      },
    };

    // Envoyer via l'API FCM HTTP v1
    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/nawa-mariage/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FCM_SERVER_KEY}`,
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}