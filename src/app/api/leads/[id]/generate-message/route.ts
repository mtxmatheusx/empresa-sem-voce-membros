import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGemini, MODEL } from "@/lib/ai";
import { buildWhatsAppMessagePrompt, PROGRAM_CONTEXT } from "@/lib/ai-prompts";
import { Lead } from "@/types/lead";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json({ message: "Lead não encontrado" }, { status: 404 });
    }

    const typedLead = lead as Lead;

    const gemini = getGemini();
    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: buildWhatsAppMessagePrompt(typedLead) }],
        },
      ],
      config: {
        systemInstruction: PROGRAM_CONTEXT,
        temperature: 0.75,
        maxOutputTokens: 500,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia do Gemini");

    const message = text.trim().replace(/^["']|["']$/g, "");

    return NextResponse.json({
      ok: true,
      message,
      usage: response.usageMetadata,
    });
  } catch (e) {
    console.error("AI generate-message error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro inesperado" },
      { status: 500 }
    );
  }
}
