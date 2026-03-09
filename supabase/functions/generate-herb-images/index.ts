import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get herbs without images
    const { data: herbs, error: fetchErr } = await supabase
      .from("herbs")
      .select("id, common_name, latin_name, chinese_name")
      .is("image_url", null)
      .order("common_name")
      .limit(5); // Process 5 at a time to avoid timeouts

    if (fetchErr) throw fetchErr;
    if (!herbs || herbs.length === 0) {
      return new Response(
        JSON.stringify({ message: "All herbs already have images", remaining: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { id: string; name: string; success: boolean; error?: string }[] = [];

    for (const herb of herbs) {
      try {
        const prompt = `Generate a beautiful detailed botanical watercolor illustration of the herb "${herb.common_name}"${herb.latin_name ? ` (${herb.latin_name})` : ""}. Show the plant with leaves, stems, and flowers or seeds if applicable. Clean white background, scientific illustration style, soft natural colors. No text or labels.`;

        const aiResp = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: prompt }],
              modalities: ["image", "text"],
            }),
          }
        );

        if (!aiResp.ok) {
          const errText = await aiResp.text();
          console.error(`AI error for ${herb.common_name}:`, aiResp.status, errText);
          results.push({ id: herb.id, name: herb.common_name, success: false, error: `AI ${aiResp.status}` });
          // Wait before retry on rate limit
          if (aiResp.status === 429) {
            await new Promise((r) => setTimeout(r, 5000));
          }
          continue;
        }

        const aiData = await aiResp.json();
        const base64Url = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!base64Url) {
          results.push({ id: herb.id, name: herb.common_name, success: false, error: "No image in response" });
          continue;
        }

        // Extract base64 data
        const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        // Upload to storage
        const fileName = `${herb.id}.png`;
        const { error: uploadErr } = await supabase.storage
          .from("herb-images")
          .upload(fileName, binaryData, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadErr) {
          results.push({ id: herb.id, name: herb.common_name, success: false, error: uploadErr.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("herb-images")
          .getPublicUrl(fileName);

        // Update herb record
        const { error: updateErr } = await supabase
          .from("herbs")
          .update({ image_url: urlData.publicUrl })
          .eq("id", herb.id);

        if (updateErr) {
          results.push({ id: herb.id, name: herb.common_name, success: false, error: updateErr.message });
          continue;
        }

        results.push({ id: herb.id, name: herb.common_name, success: true });
        console.log(`✓ Generated image for ${herb.common_name}`);

        // Small delay between generations to avoid rate limits
        await new Promise((r) => setTimeout(r, 2000));
      } catch (e) {
        results.push({
          id: herb.id,
          name: herb.common_name,
          success: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }

    // Count remaining
    const { count } = await supabase
      .from("herbs")
      .select("id", { count: "exact", head: true })
      .is("image_url", null);

    return new Response(
      JSON.stringify({ results, remaining: count }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-herb-images error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
