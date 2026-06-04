import { NextRequest } from "next/server";
import { mistral } from "@/lib/mistral";

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "mistral-large-latest" } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await mistral.chat.stream({
      model,
      messages,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.data.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Mistral stream error:", error);
    return new Response(JSON.stringify({ error: "Failed to stream response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
