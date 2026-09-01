import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a proposal-writing assistant for independent consultants and coaches.
Given details about a consultant's business and a potential engagement, draft a professional
proposal with these sections:
1. Overview (1 paragraph)
2. Scope of Work (bulleted deliverables)
3. Timeline
4. Investment (pricing, using the amount/structure provided)
5. Terms (payment terms, cancellation policy — keep simple, 2-3 sentences)

Do not invent specific dollar amounts, deadlines, or deliverables that were not provided.
If key information is missing, add a short "Note to consultant" line at the end asking for it.
Write in a {{tone}} tone. Return plain text only — no markdown headers, use simple line breaks
and dashes for bullets so it renders cleanly in a plain text field.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      client_id,
      business_name,
      niche,
      client_name,
      engagement_description,
      amount,
      pricing_structure,
      timeline,
      tone = "professional",
    } = body;

    if (!user_id || !engagement_description) {
      return NextResponse.json(
        { error: "user_id and engagement_description are required" },
        { status: 400 }
      );
    }

    const userMessage = `Consultant: ${business_name || "N/A"}, specializing in ${niche || "N/A"}
Client: ${client_name || "N/A"}
Engagement description: ${engagement_description}
Pricing: ${amount ? `${amount} (${pricing_structure || "flat fee"})` : "not specified"}
Timeline: ${timeline || "not specified"}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: SYSTEM_PROMPT.replace("{{tone}}", tone),
      messages: [{ role: "user", content: userMessage }],
    });

    const draft = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        user_id,
        client_id: client_id || null,
        title: `Proposal for ${client_name || "client"}`,
        content: draft,
        amount: amount || null,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ proposal: data });
  } catch (err: any) {
    console.error("proposal draft error", err);
    return NextResponse.json({ error: "Failed to draft proposal" }, { status: 500 });
  }
}
