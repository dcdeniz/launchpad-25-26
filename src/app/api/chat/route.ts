import { NextRequest, NextResponse } from "next/server";
import { mistral } from "@/lib/mistral";

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "mistral-large-latest" } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const response = await mistral.chat.complete({
      model,
      messages,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Mistral chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
