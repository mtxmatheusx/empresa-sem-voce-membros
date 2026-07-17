# Programa Empresa Sem Você — Sistema de Leads

CRM próprio do Matheus Martins. Form público → Supabase → Dashboard + Kanban administrativos.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (PostgreSQL + Auth + RLS)
- Resend (notificações por email)
- Framer Motion + @dnd-kit (animações + drag-and-drop)
- Vercel (deploy)

## Setup (passo a passo)

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto (nome sugerido: `empresa-sem-voce`)
3. Aguarde a provisão (~2 min)
4. Em **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e rode
5. Em **Project Settings → API**, copie:
   - `Project URL`
   - `anon` key (public)
   - `service_role` key (secret)

### 2. Criar usuário admin

1. No painel Supabase, vá em **Authentication → Users**
2. Clique em **Add user → Create new user**
3. Email: `mtxagenciacriativa@gmail.com`
4. Defina uma senha forte
5. Marque **Auto Confirm User**

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha com os valores que você copiou no passo 1.

### 4. (Opcional) Configurar Resend

1. Crie conta em [resend.com](https://resend.com)
2. Verifique seu domínio (`mtxestrategia.com.br`) ou use o sandbox deles
3. Crie API key e cole em `.env.local`

### 5. Rodar localmente

```bash
npm install
npm run dev
```

URLs:
- Landing pública: http://localhost:3000
- Formulário: http://localhost:3000/aplicar
- Login admin: http://localhost:3000/admin/login

### 6. Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Configure as variáveis de ambiente no painel da Vercel (mesmas do `.env.local`).

Em **Project Settings → Domains**, adicione `mentoria.mtxestrategia.com.br`.

## Estrutura

```
src/
├── app/
│   ├── page.tsx                    # Landing
│   ├── aplicar/page.tsx            # Formulário multi-etapas
│   ├── obrigado/page.tsx           # Tela de confirmação
│   ├── api/leads/route.ts          # API POST do form
│   └── admin/
│       ├── login/page.tsx
│       ├── dashboard/page.tsx
│       ├── kanban/page.tsx
│       └── leads/[id]/page.tsx
├── components/
│   ├── ui/                         # Button, Input, Logo
│   ├── form/MultiStepForm.tsx
│   └── admin/                      # AdminShell, KanbanBoard, LeadDetail
├── lib/
│   ├── supabase/                   # client.ts, server.ts, middleware.ts
│   ├── schemas.ts
│   └── utils.ts
├── types/lead.ts
└── middleware.ts                   # Auth protection
```

## Segurança

- Rotas `/admin/*` protegidas via middleware (redirect → /admin/login)
- Row Level Security (RLS) no Supabase: leads inseridos por anônimos; SELECT/UPDATE/DELETE só autenticado
- Service role usado apenas server-side (API routes)
- Cookies httpOnly via @supabase/ssr

## Próximos passos

- [ ] Adicionar gráficos no dashboard (Recharts) — leads por dia, origem
- [ ] Filtros e busca no Kanban
- [ ] Export CSV
- [ ] Integração com WhatsApp API (Z-API)
- [ ] 2FA opcional
