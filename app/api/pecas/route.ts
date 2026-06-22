import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const rows = Number(searchParams.get("rows")) || 10;
  const termo = searchParams.get("termo") || "";

  const supabase = await createClient();

  const from = (page - 1) * rows;
  const to = from + rows - 1;

  let query = supabase.from("pecas").select("*", { count: "exact" });

  if (termo) {
    query = query.ilike("descricao", `%${termo}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pecas: data, totalRecords: count ?? 0 });
}