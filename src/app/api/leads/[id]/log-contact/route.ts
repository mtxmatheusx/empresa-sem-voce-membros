import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { channel = "whatsapp", message = "", auto_advance = true } = body;

    const admin = createAdminClient();

    // Log event
    await admin.from("lead_events").insert({
      lead_id: id,
      event_type: "contact_sent",
      payload: {
        channel,
        message_preview: message.slice(0, 200),
        sent_by: user.email,
      },
    });

    // Avança status se ainda estiver em "recebida"
    if (auto_advance) {
      const { data: lead } = await admin
        .from("leads")
        .select("status")
        .eq("id", id)
        .single();

      if (lead?.status === "recebida") {
        await admin.from("leads").update({ status: "triagem" }).eq("id", id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("log-contact error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro" },
      { status: 500 }
    );
  }
}
