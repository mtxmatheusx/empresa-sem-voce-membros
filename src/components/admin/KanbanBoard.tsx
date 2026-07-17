"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadStatus, STATUS_LABELS, STATUS_ORDER } from "@/types/lead";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FilterKey = "todos" | "contatados_hoje" | "pendentes_contato" | "sem_analise" | "prontos_investir";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "contatados_hoje", label: "Contatados hoje" },
  { key: "pendentes_contato", label: "Pendentes contato" },
  { key: "sem_analise", label: "Sem análise IA" },
  { key: "prontos_investir", label: "Prontos pra investir" },
];

interface KanbanProps {
  initialLeads: Lead[];
  leadIdsContactedToday: string[];
  leadIdsContacted: string[];
  leadIdsAnalyzed: string[];
}

export function KanbanBoard({
  initialLeads,
  leadIdsContactedToday,
  leadIdsContacted,
  leadIdsAnalyzed,
}: KanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("todos");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filteredLeads = useMemo(() => {
    switch (filter) {
      case "contatados_hoje":
        return leads.filter((l) => leadIdsContactedToday.includes(l.id));
      case "pendentes_contato":
        return leads.filter(
          (l) =>
            !leadIdsContacted.includes(l.id) &&
            !["fechou", "perdeu"].includes(l.status)
        );
      case "sem_analise":
        return leads.filter(
          (l) =>
            !leadIdsAnalyzed.includes(l.id) &&
            !["fechou", "perdeu"].includes(l.status)
        );
      case "prontos_investir":
        return leads.filter(
          (l) =>
            l.investment_ready === "Sim, estou pronto" &&
            !["fechou", "perdeu"].includes(l.status)
        );
      default:
        return leads;
    }
  }, [
    leads,
    filter,
    leadIdsContactedToday,
    leadIdsContacted,
    leadIdsAnalyzed,
  ]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setLeads(initialLeads);
    }
  }

  const activeLead = leads.find((l) => l.id === activeId);

  // counts dos filtros
  const counts = {
    todos: leads.length,
    contatados_hoje: leads.filter((l) => leadIdsContactedToday.includes(l.id)).length,
    pendentes_contato: leads.filter(
      (l) => !leadIdsContacted.includes(l.id) && !["fechou", "perdeu"].includes(l.status)
    ).length,
    sem_analise: leads.filter(
      (l) => !leadIdsAnalyzed.includes(l.id) && !["fechou", "perdeu"].includes(l.status)
    ).length,
    prontos_investir: leads.filter(
      (l) =>
        l.investment_ready === "Sim, estou pronto" &&
        !["fechou", "perdeu"].includes(l.status)
    ).length,
  };

  return (
    <>
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer tracking-[-0.005em] inline-flex items-center gap-2",
              filter === f.key
                ? "bg-[#0F0E0C] text-white"
                : "bg-[#F4F2EC] text-[#6B6862] hover:bg-[#EAE6DC] hover:text-[#0F0E0C]"
            )}
          >
            {f.label}
            <span
              className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                filter === f.key
                  ? "bg-white/15 text-white"
                  : "bg-white text-[#A09C92]"
              )}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2">
          {STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              leads={filteredLeads.filter((l) => l.status === status)}
              leadIdsContactedToday={leadIdsContactedToday}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead && (
            <Card
              lead={activeLead}
              dragging
              contactedToday={leadIdsContactedToday.includes(activeLead.id)}
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}

function Column({
  status,
  leads,
  leadIdsContactedToday,
}: {
  status: LeadStatus;
  leads: Lead[];
  leadIdsContactedToday: string[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const isPositive = status === "fechou";
  const isNegative = status === "perdeu";

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 rounded-xl border bg-white transition-all duration-300 ${
        isOver ? "border-[#B8902A] bg-[#FAFAF7]" : "border-[#EAE6DC]"
      }`}
    >
      <div className="px-5 py-4 border-b border-[#EAE6DC] flex items-center justify-between">
        <h3
          className={`text-[11px] uppercase tracking-[0.15em] font-medium ${
            isPositive
              ? "text-[#2D7A4E]"
              : isNegative
              ? "text-[#C24842]"
              : "text-[#6B6862]"
          }`}
        >
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-[11px] text-[#6B6862] font-mono bg-[#F4F2EC] px-2 py-0.5 rounded-full min-w-[24px] text-center">
          {leads.length}
        </span>
      </div>

      <div className="p-3 space-y-2 min-h-[400px]">
        {leads.map((lead) => (
          <Card
            key={lead.id}
            lead={lead}
            contactedToday={leadIdsContactedToday.includes(lead.id)}
          />
        ))}
        {leads.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif italic text-[#D4CFC0] text-sm">Vazio</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  lead,
  dragging = false,
  contactedToday,
}: {
  lead: Lead;
  dragging?: boolean;
  contactedToday: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white border border-[#EAE6DC] rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-[#B8902A]/40 hover:bg-[#FAFAF7] transition-all duration-300 ${
        isDragging ? "opacity-30" : ""
      } ${dragging ? "shadow-2xl rotate-2 scale-105 border-[#B8902A]" : ""}`}
    >
      <Link
        href={`/admin/leads/${lead.id}`}
        onClick={(e) => e.stopPropagation()}
        className="block"
      >
        <p className="text-[14px] font-medium text-[#0F0E0C] mb-1 tracking-[-0.01em] truncate">
          {lead.name}
        </p>
        <p className="text-[12px] text-[#6B6862] truncate mb-4 font-serif italic">
          {lead.company_name || "Sem empresa"}
        </p>

        <div className="flex items-center justify-between text-[11px]">
          {lead.employees_range ? (
            <span className="text-[#A09C92] uppercase tracking-[0.1em]">
              {lead.employees_range} func
            </span>
          ) : (
            <span />
          )}
          <span className="text-[#A09C92]">{formatDate(lead.created_at)}</span>
        </div>

        {(lead.investment_ready === "Sim, estou pronto" || contactedToday) && (
          <div className="mt-3 pt-3 border-t border-[#EAE6DC] flex items-center gap-3 flex-wrap">
            {lead.investment_ready === "Sim, estou pronto" && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#B8902A] font-medium">
                · Pronto pra investir
              </span>
            )}
            {contactedToday && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#2D7A4E] font-medium">
                · Contatado hoje
              </span>
            )}
          </div>
        )}
      </Link>
    </div>
  );
}
