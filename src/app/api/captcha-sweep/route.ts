import { NextResponse } from "next/server";
import { sweepCaptchaModes } from "@/lib/captcha/adaptiveCaptcha";

export const dynamic = "force-dynamic";

export async function POST() {
  const closed = await sweepCaptchaModes();
  return NextResponse.json({ closed });
}

export const GET = POST;
