import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("message_templates")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (error) throw error;
    return NextResponse.json({ templates: data || [] });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, description, body: content, display_order = 99 } = body;
    if (!name || !content) {
      return NextResponse.json({ message: "Nome e corpo obrigatórios" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("message_templates")
      .insert({ name, description, body: content, display_order })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, template: data });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro" },
      { status: 500 }
    );
  }
}
