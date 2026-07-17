"use client";

import { Lead } from "@/types/lead";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  "Sim, estou pronto": "#B8902A",
  "Preciso entender mais": "#6B6862",
  "Não no momento": "#D4CFC0",
};

export function InvestmentReadyDonut({ leads }: { leads: Lead[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {
      "Sim, estou pronto": 0,
      "Preciso entender mais": 0,
      "Não no momento": 0,
    };
    leads.forEach((l) => {
      if (l.investment_ready && counts[l.investment_ready] !== undefined) {
        counts[l.investment_ready]++;
      }
    });
    return Object.entries(counts)
      .filter(([_, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [leads]);

  const total = data.reduce((a, b) => a + b.value, 0);
  const ready = data.find((d) => d.name === "Sim, estou pronto")?.value || 0;
  const readyPct = total > 0 ? Math.round((ready / total) * 100) : 0;

  return (
    <div className="card-elevated p-8">
      <header className="mb-6">
        <p className="t-label mb-2">Qualificação</p>
        <h3 className="t-h4 text-[#0F0E0C]">Prontidão de investimento</h3>
      </header>

      {total === 0 ? (
        <p className="font-serif italic text-[#A09C92] text-[15px] py-8">
          Sem dados ainda.
        </p>
      ) : (
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #EAE6DC",
                    borderRadius: "12px",
                    fontSize: 12,
                    padding: "6px 10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display font-bold text-[28px] text-[#B8902A] leading-none tracking-tight">
                {readyPct}%
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6862] mt-1">
                prontos
              </span>
            </div>
          </div>

          <ul className="flex-1 space-y-3">
            {data.map((entry) => (
              <li key={entry.name} className="flex items-center gap-3 text-[13px]">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[entry.name] }}
                />
                <span className="text-[#0F0E0C] flex-1">{entry.name}</span>
                <span className="text-[#6B6862] tabular-nums font-medium">
                  {entry.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
