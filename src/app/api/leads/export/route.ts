import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Lead, STATUS_LABELS, LeadStatus } from "@/types/lead";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (statusFilter) query = query.eq("status", statusFilter);

    const { data, error } = await query;
    if (error) throw error;

    const leads = (data as Lead[]) || [];

    const headers = [
      "Nome",
      "WhatsApp",
      "Email",
      "Instagram",
      "Empresa",
      "Setor",
      "Funcionarios",
      "Faturamento",
      "Anos",
      "Status",
      "Investimento",
      "Tempo no tatico",
      "Suga energia",
      "Desejo 120d",
      "Origem (UTM)",
      "Campanha",
      "Criado em",
    ];

    const escape = (v: unknown) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = leads.map((l) =>
      [
        l.name,
        l.whatsapp,
        l.email,
        l.instagram || "",
        l.company_name || "",
        l.company_sector || "",
        l.employees_range || "",
        l.revenue_range || "",
        l.years_in_business || "",
        STATUS_LABELS[l.status as LeadStatus] || l.status,
        l.investment_ready || "",
        l.tactical_time_pct || "",
        l.energy_suck || "",
        l.desire_120d || "",
        l.utm_source || l.source || "",
        l.utm_campaign || "",
        new Date(l.created_at).toLocaleString("pt-BR"),
      ].map(escape).join(",")
    );

    const csv = [headers.map(escape).join(","), ...rows].join("\n");
    const bom = "﻿"; // Excel friendly UTF-8

    return new NextResponse(bom + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    console.error("Export error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro" },
      { status: 500 }
    );
  }
}
