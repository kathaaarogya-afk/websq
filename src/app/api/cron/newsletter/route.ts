import { NextRequest, NextResponse } from "next/server";
import { sendNewsletter } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Cron secret is not configured. Set CRON_SECRET." },
        { status: 503 }
      );
    }

    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendNewsletter();
    return NextResponse.json({ ...result, ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send newsletter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}