import { NextResponse } from "next/server";
import { generateMockExam } from "@/lib/mock-exam";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    exam?: string;
  };

  const exam = body.exam?.trim();

  if (!exam) {
    return NextResponse.json(
      { error: "Enter a test name to generate a mock." },
      { status: 400 },
    );
  }

  return NextResponse.json(generateMockExam(exam));
}
