import { NextRequest, NextResponse } from "next/server";
import { mistral } from "@/lib/mistral";

export async function POST(request: NextRequest) {
  try {
    const { inputs, model = "mistral-embed" } = await request.json();

    if (!inputs || !Array.isArray(inputs)) {
      return NextResponse.json(
        { error: "inputs array is required" },
        { status: 400 }
      );
    }

    const response = await mistral.embeddings.create({
      model,
      inputs,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Mistral embed error:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}
