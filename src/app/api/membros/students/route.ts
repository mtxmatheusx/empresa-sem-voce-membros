import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createClient as createSbClient } from "@supabase/supabase-js";

// Cria/atualiza um aluno e envia o e-mail "defina sua senha". Só admin.
export async function POST(req: NextRequest) {
  const server = await createClient();
  const {
    data: { user },
  } = await server.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { data: isAdmin } = await server.rpc("esv_is_admin");
  if (isAdmin !== true) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const resend = body.resend === true;
  const name = String(body.name ?? "").trim();
  const months = Number(body.months) > 0 ? Number(body.months) : 12;
  const current_pillar = Number(body.current_pillar) || 1;

  if (!email || (!resend && !name)) {
    return NextResponse.json(
      { error: "Nome e e-mail são obrigatórios." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // 1) cria o usuário de auth (ignora se já existe)
  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr && !/already|registered|exists/i.test(createErr.message)) {
    return NextResponse.json({ error: createErr.message }, { status: 500 });
  }

  // 2) upsert da ficha (só quando NÃO é reenvio — reenvio preserva datas)
  if (!resend) {
    const now = new Date();
    const ends = new Date(now);
    ends.setMonth(ends.getMonth() + months);
    const { error: upErr } = await admin.from("clients").upsert(
      {
        name,
        email,
        status: "ativo",
        current_pillar,
        started_at: now.toISOString(),
        ends_at: ends.toISOString(),
      },
      { onConflict: "email" }
    );
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }
  }

  // 4) e-mail "defina sua senha" (recovery) via cliente anon
  const anon = createSbClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  const { error: mailErr } = await anon.auth.resetPasswordForEmail(email, {
    redirectTo: `${req.nextUrl.origin}/membros/auth/callback?next=/membros/definir-senha`,
  });
  if (mailErr) {
    return NextResponse.json({
      ok: true,
      warning: "Aluno salvo, mas o e-mail falhou: " + mailErr.message,
    });
  }

  return NextResponse.json({ ok: true });
}
