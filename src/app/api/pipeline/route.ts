import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { runResearchPipeline } from "@/lib/research-pipeline";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);

  try {
    const result = await runResearchPipeline(json);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Enter a valid query and up to five URLs." }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Pipeline failed.",
      },
      { status: 500 },
    );
  }
}
