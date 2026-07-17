import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { Lead, LeadEvent, LeadNote, Product } from "@/types/lead";

export const dynamic = "force-dynamic";

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: lead }, { data: events }, { data: notes }, { data: products }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).single(),
    supabase
      .from("lead_events")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
  ]);

  if (!lead) notFound();

  return (
    <AdminShell>
      <LeadDetail
        lead={lead as Lead}
        events={(events || []) as LeadEvent[]}
        notes={(notes || []) as LeadNote[]}
        products={(products || []) as Product[]}
      />
    </AdminShell>
  );
}
