import Link from "next/link";
import { Client, CLIENT_STATUS_LABELS, PILLAR_INFO } from "@/types/client";
import { ProgressRing } from "@/components/membros/ProgressRing";
import { ChangePassword } from "@/components/membros/ChangePassword";
import { LogoutButton } from "@/components/membros/LogoutButton";
import { MessageCircle } from "lucide-react";

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export function ProfileView({
  client,
  pct,
  done,
  total,
  now = new Date(),
}: {
  client: Client;
  pct: number;
  done: number;
  total: number;
  now?: Date;
}) {
  const initials = (client.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const start = new Date(client.started_at);
  const end = client.ends_at ? new Date(client.ends_at) : new Date(start.getTime() + 120 * DAY);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY));
  const day = Math.min(totalDays, Math.max(1, Math.floor((now.getTime() - start.getTime()) / DAY) + 1));
  const pillar = PILLAR_INFO[client.current_pillar];

  return (
    <div className="esv-page esv-profile">
      {/* Cabeçalho */}
      <header className="esv-profile__head esv-rise">
        <span className="esv-avatar" aria-hidden>
          {initials}
        </span>
        <div className="min-w-0">
          <p className="t-eyebrow">Sua conta</p>
          <h1 className="esv-lesson__title">{client.name}</h1>
          <p className="esv-profile__mail">{client.email}</p>
        </div>
        <span className={`esv-status is-${client.status}`}>{CLIENT_STATUS_LABELS[client.status]}</span>
      </header>

      <div className="esv-profile__grid">
        <div className="esv-profile__col">
        {/* Programa */}
        <section className="esv-panel esv-glass esv-profile__program esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
          <p className="esv-panel__kicker">Seu programa</p>
          <div className="esv-profile__prog">
            <ProgressRing pct={pct} id="esvRingProfile" />
            <dl className="esv-kv">
              <div>
                <dt>Dia</dt>
                <dd>
                  {day} <span>de {totalDays}</span>
                </dd>
              </div>
              <div>
                <dt>Aulas</dt>
                <dd>
                  {done} <span>de {total}</span>
                </dd>
              </div>
              <div>
                <dt>Pilar atual</dt>
                <dd>{client.current_pillar === 0 ? "Boas-vindas" : `${pad(client.current_pillar)} · ${pillar?.name ?? ""}`}</dd>
              </div>
              <div>
                <dt>Início</dt>
                <dd>{fmt(start)}</dd>
              </div>
              <div>
                <dt>Conclusão prevista</dt>
                <dd>{fmt(end)}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Sessão */}
        <section className="esv-panel esv-glass esv-profile__session esv-rise" style={{ "--d": 4 } as React.CSSProperties}>
          <p className="esv-panel__kicker">Sessão</p>
          <p className="esv-panel__body">Saia da conta neste aparelho. Seu progresso fica salvo.</p>
          <LogoutButton />
        </section>
        </div>

        <div className="esv-profile__col">
        {/* Dados */}
        <section className="esv-panel esv-glass esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
          <p className="esv-panel__kicker">Seus dados</p>
          <dl className="esv-rows-kv">
            <div>
              <dt>Nome</dt>
              <dd>{client.name}</dd>
            </div>
            <div>
              <dt>E-mail de acesso</dt>
              <dd>{client.email}</dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>{client.whatsapp || "Não informado"}</dd>
            </div>
          </dl>
          <Link
            href="https://wa.me/5551991443171"
            target="_blank"
            rel="noopener noreferrer"
            className="esv-link-row"
          >
            <MessageCircle size={16} strokeWidth={2} />
            Para mudar algum dado, fale comigo no WhatsApp
          </Link>
        </section>

        {/* Segurança */}
        <section className="esv-panel esv-glass esv-rise" style={{ "--d": 3 } as React.CSSProperties}>
          <ChangePassword />
        </section>

        </div>
      </div>
    </div>
  );
}
