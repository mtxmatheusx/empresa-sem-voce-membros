"use client";

import { Lead } from "@/types/lead";
import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

type PresetKey =
  | "hoje"
  | "ontem"
  | "7d"
  | "15d"
  | "mes"
  | "30d"
  | "trimestre"
  | "semestre"
  | "anual"
  | "custom";

interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function getRange(preset: PresetKey, customFrom?: string, customTo?: string): DateRange {
  const now = new Date();
  const today = startOfDay(now);

  switch (preset) {
    case "hoje":
      return { from: today, to: endOfDay(now), label: "Hoje" };
    case "ontem": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: y, to: endOfDay(y), label: "Ontem" };
    }
    case "7d": {
      const f = new Date(today);
      f.setDate(f.getDate() - 6);
      return { from: f, to: endOfDay(now), label: "Últimos 7 dias" };
    }
    case "15d": {
      const f = new Date(today);
      f.setDate(f.getDate() - 14);
      return { from: f, to: endOfDay(now), label: "Últimos 15 dias" };
    }
    case "mes": {
      const f = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: f, to: endOfDay(now), label: "Este mês" };
    }
    case "30d": {
      const f = new Date(today);
      f.setDate(f.getDate() - 29);
      return { from: f, to: endOfDay(now), label: "Últimos 30 dias" };
    }
    case "trimestre": {
      const f = new Date(today);
      f.setDate(f.getDate() - 89);
      return { from: f, to: endOfDay(now), label: "Últimos 90 dias" };
    }
    case "semestre": {
      const f = new Date(today);
      f.setDate(f.getDate() - 179);
      return { from: f, to: endOfDay(now), label: "Últimos 180 dias" };
    }
    case "anual": {
      const f = new Date(today);
      f.setDate(f.getDate() - 364);
      return { from: f, to: endOfDay(now), label: "Últimos 365 dias" };
    }
    case "custom": {
      const f = customFrom ? startOfDay(new Date(customFrom)) : today;
      const t = customTo ? endOfDay(new Date(customTo)) : endOfDay(now);
      return { from: f, to: t, label: "Personalizado" };
    }
  }
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "hoje", label: "Hoje" },
  { key: "ontem", label: "Ontem" },
  { key: "7d", label: "7d" },
  { key: "15d", label: "15d" },
  { key: "mes", label: "Mês" },
  { key: "30d", label: "30d" },
  { key: "trimestre", label: "Trim" },
  { key: "semestre", label: "Sem" },
  { key: "anual", label: "Ano" },
];

export function LeadsByDayChart({ leads }: { leads: Lead[] }) {
  const [preset, setPreset] = useState<PresetKey>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const range = useMemo(
    () => getRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  );

  const data = useMemo(() => {
    const fromTs = range.from.getTime();
    const toTs = range.to.getTime();
    const oneDay = 86400000;
    const totalDays = Math.max(1, Math.ceil((toTs - fromTs) / oneDay) + 1);

    // Agregação: por dia se <= 90, por semana se > 90
    const groupByWeek = totalDays > 90;

    const buckets = new Map<string, { date: string; label: string; count: number; sortKey: number }>();

    if (groupByWeek) {
      const fromDate = new Date(range.from);
      // Alinha pro início da semana (segunda-feira)
      const dayOfWeek = fromDate.getDay() || 7;
      fromDate.setDate(fromDate.getDate() - (dayOfWeek - 1));

      let cursor = new Date(fromDate);
      while (cursor.getTime() <= toTs) {
        const key = cursor.toISOString().slice(0, 10);
        const label = cursor.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
        buckets.set(key, { date: key, label, count: 0, sortKey: cursor.getTime() });
        cursor.setDate(cursor.getDate() + 7);
      }
    } else {
      const cursor = new Date(range.from);
      while (cursor.getTime() <= toTs) {
        const key = cursor.toISOString().slice(0, 10);
        const label = cursor.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        });
        buckets.set(key, { date: key, label, count: 0, sortKey: cursor.getTime() });
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    for (const lead of leads) {
      const ts = new Date(lead.created_at).getTime();
      if (ts < fromTs || ts > toTs) continue;
      const d = new Date(lead.created_at);

      let key: string;
      if (groupByWeek) {
        const dayOfWeek = d.getDay() || 7;
        const weekStart = new Date(d);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - (dayOfWeek - 1));
        key = weekStart.toISOString().slice(0, 10);
      } else {
        key = d.toISOString().slice(0, 10);
      }

      const bucket = buckets.get(key);
      if (bucket) bucket.count++;
    }

    return Array.from(buckets.values()).sort((a, b) => a.sortKey - b.sortKey);
  }, [leads, range]);

  const total = data.reduce((a, b) => a + b.count, 0);

  return (
    <div className="card-elevated p-8">
      <header className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="t-label mb-2">{range.label}</p>
          <h3 className="t-h4 text-[#0F0E0C]">Leads por dia</h3>
        </div>
        <p className="font-display font-semibold text-[28px] text-[#B8902A] leading-none tracking-tight">
          {total}
        </p>
      </header>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer tracking-[-0.005em]",
              preset === p.key
                ? "bg-[#0F0E0C] text-white"
                : "bg-[#F4F2EC] text-[#6B6862] hover:bg-[#EAE6DC] hover:text-[#0F0E0C]"
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setPreset("custom")}
          className={cn(
            "px-3 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer tracking-[-0.005em]",
            preset === "custom"
              ? "bg-[#0F0E0C] text-white"
              : "bg-[#F4F2EC] text-[#6B6862] hover:bg-[#EAE6DC] hover:text-[#0F0E0C]"
          )}
        >
          Personalizado
        </button>
      </div>

      {/* Custom inputs */}
      {preset === "custom" && (
        <div className="mb-6 flex flex-wrap items-center gap-3 p-4 bg-[#F4F2EC]/60 rounded-lg border border-[#EAE6DC]">
          <div className="flex items-center gap-2">
            <label className="t-label">De</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="bg-white border border-[#EAE6DC] rounded-md px-2.5 py-1.5 text-[13px] text-[#0F0E0C] focus:outline-none focus:border-[#B8902A] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="t-label">Até</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="bg-white border border-[#EAE6DC] rounded-md px-2.5 py-1.5 text-[13px] text-[#0F0E0C] focus:outline-none focus:border-[#B8902A] transition-colors"
            />
          </div>
          {(customFrom || customTo) && (
            <button
              onClick={() => {
                setCustomFrom("");
                setCustomTo("");
              }}
              className="text-[11px] uppercase tracking-[0.12em] text-[#A09C92] hover:text-[#C24842] transition-colors cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      <div className="h-56 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8902A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#B8902A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EAE6DC" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#A09C92", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={32}
            />
            <YAxis
              tick={{ fill: "#A09C92", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: "#B8902A", strokeWidth: 1, strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #EAE6DC",
                borderRadius: "12px",
                boxShadow: "0 6px 24px rgba(15, 14, 12, 0.06)",
                padding: "8px 12px",
                fontSize: 12,
              }}
              labelStyle={{ color: "#6B6862", fontSize: 11, marginBottom: 4 }}
              itemStyle={{ color: "#0F0E0C", fontWeight: 500 }}
              formatter={(value) => [value, "Leads"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#B8902A"
              strokeWidth={2}
              fill="url(#leadGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
