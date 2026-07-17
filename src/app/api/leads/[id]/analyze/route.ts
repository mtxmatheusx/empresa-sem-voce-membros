import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getGemini, MODEL, analysisSchema } from "@/lib/ai";
import { buildDiagnosisPrompt, PROGRAM_CONTEXT } from "@/lib/ai-prompts";
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
          parts: [{ text: buildDiagnosisPrompt(typedLead) }],
        },
      ],
      config: {
        systemInstruction: PROGRAM_CONTEXT,
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia do Gemini");

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      console.error("JSON parse error:", text);
      throw new Error("Resposta do Gemini não é JSON válido");
    }

    const admin = createAdminClient();
    await admin.from("lead_events").insert({
      lead_id: id,
      event_type: "ai_analysis",
      payload: {
        fit_score: analysis.fit_score,
        model: MODEL,
        usage: response.usageMetadata,
      },
    });

    return NextResponse.json({
      ok: true,
      analysis,
      usage: response.usageMetadata,
    });
  } catch (e) {
    console.error("AI analyze error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro inesperado" },
      { status: 500 }
    );
  }
}
