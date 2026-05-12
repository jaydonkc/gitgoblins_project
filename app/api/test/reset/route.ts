import { NextResponse } from "next/server";
import { resetDb } from "@/lib/store";

export const runtime = "nodejs";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  return NextResponse.json(await resetDb());
}
