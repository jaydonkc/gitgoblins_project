import { NextResponse } from "next/server";
import { createInquiry, listInquiries } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ inquiries: await listInquiries() });
}

export async function POST(request: Request) {
  try {
    const inquiry = await createInquiry(await request.json());
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create inquiry" },
      { status: 400 },
    );
  }
}
