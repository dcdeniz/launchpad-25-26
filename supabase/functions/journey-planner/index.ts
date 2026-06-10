import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fromStopId, toStopId, time } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const mistralKey  = Deno.env.get("MISTRAL_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: stops } = await supabase
      .from("stops")
      .select("id, stop_name")
      .in("id", [fromStopId, toStopId]);

    const fromStop = stops?.find((s: any) => s.id === fromStopId);
    const toStop   = stops?.find((s: any) => s.id === toStopId);

    const requestedTime = time || "08:00";
    const [h] = requestedTime.split(":").map(Number);
    const plusTwo = `${String(Math.min(h + 2, 23)).padStart(2, "0")}:${requestedTime.split(":")[1]}`;

    const { data: schedules } = await supabase
      .from("schedules")
      .select("arrival_time, routes(route_name), stops(stop_name)")
      .gte("arrival_time", requestedTime)
      .lte("arrival_time", plusTwo)
      .order("arrival_time")
      .limit(12);

    const from = fromStop?.stop_name ?? `Stop #${fromStopId}`;
    const to   = toStop?.stop_name   ?? `Stop #${toStopId}`;

    const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mistralKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful public transport assistant for Ladywood, Birmingham, UK. Give concise, practical journey plans under 120 words.",
          },
          {
            role: "user",
            content: `Plan a journey from "${from}" to "${to}" departing after ${requestedTime}.\n\nAvailable services: ${JSON.stringify(schedules ?? [])}`,
          },
        ],
        max_tokens: 300,
      }),
    });

    const mistralData = await mistralRes.json();
    const plan = mistralData.choices?.[0]?.message?.content ?? "Unable to plan journey at this time.";

    return new Response(JSON.stringify({ plan, fromStop: from, toStop: to }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
