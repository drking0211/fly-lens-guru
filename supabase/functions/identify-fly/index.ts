import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Identifying fly from image...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert fly fishing guide with decades of experience. Analyze the fly fishing lure in the image and provide:
1. The fly name/pattern (be specific - e.g., "Woolly Bugger", "Adams Dry Fly", "Pheasant Tail Nymph")
2. Fly type/category (e.g., Dry Fly, Nymph, Streamer, Wet Fly, Emerger)
3. Best fishing conditions (water type, season, time of day)
4. Target fish species
5. Effective fishing techniques and presentation tips
6. Hook size range typically used

If you cannot identify the specific pattern, describe what you see and suggest similar patterns. Be helpful and educational.

Format your response as JSON with these fields:
{
  "name": "string",
  "type": "string",
  "confidence": "high|medium|low",
  "description": "string",
  "conditions": "string",
  "targetSpecies": ["array", "of", "species"],
  "techniques": "string",
  "hookSize": "string",
  "similarPatterns": ["optional", "array"]
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please identify this fly fishing lure and provide detailed information."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI identification failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI Response:", content);

    // Parse the JSON response from the AI
    let flyInfo;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      flyInfo = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: return the raw content
      flyInfo = {
        name: "Unknown Fly",
        type: "Unable to identify",
        confidence: "low",
        description: content,
        conditions: "Not specified",
        targetSpecies: [],
        techniques: "Not specified",
        hookSize: "Not specified"
      };
    }

    return new Response(
      JSON.stringify(flyInfo),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in identify-fly function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
