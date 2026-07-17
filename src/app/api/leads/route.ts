import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { applicationSchema } from "@/lib/schemas";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...parsed.data,
        status: "recebida",
        source: parsed.data.utm_source || "site",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { message: "Erro ao salvar aplicação" },
        { status: 500 }
      );
    }

    // Notification email (non-blocking)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const notificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "mtxagenciacriativa@gmail.com";

      const fromEmail = process.env.RESEND_FROM_EMAIL || "Empresa Sem Você <onboarding@resend.dev>";
      resend.emails
        .send({
          from: fromEmail,
          to: notificationEmail,
          subject: `🪞 Nova aplicação: ${parsed.data.name} — ${parsed.data.company_name}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #C9A227;">Nova aplicação recebida</h1>
              <table style="width:100%; border-collapse:collapse;">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Nome:</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${parsed.data.name}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>WhatsApp:</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${parsed.data.whatsapp}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${parsed.data.email}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Empresa:</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${parsed.data.company_name} (${parsed.data.company_sector})</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Tamanho:</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${parsed.data.employees_range} funcionários · ${parsed.data.revenue_range}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Investimento:</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${parsed.data.investment_ready}</td></tr>
              </table>
              <p style="margin-top: 24px;"><strong>O que mais suga energia:</strong><br>${parsed.data.energy_suck}</p>
              <p><strong>Desejo 120d:</strong><br>${parsed.data.desire_120d}</p>
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/leads/${data.id}" style="display:inline-block; background:#C9A227; color:#0C0C0C; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:600;">Ver aplicação completa</a>
            </div>
          `,
        })
        .catch((e) => console.error("Resend error:", e));
    }

    // Log event
    await supabase.from("lead_events").insert({
      lead_id: data.id,
      event_type: "form_submitted",
      payload: { source: "site" },
    });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("API /leads error:", e);
    return NextResponse.json(
      { message: "Erro inesperado" },
      { status: 500 }
    );
  }
}
