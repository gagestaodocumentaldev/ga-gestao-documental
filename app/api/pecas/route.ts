import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Peca } from "@/types/peca";

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Peca>;

  const supabase = await createClient();

  const payload: Partial<Peca> = {
    codigo: body.codigo,
    descricao: body.descricao,
    marca: body.marca,
    estoque: body.estoque,
    preco_custo: body.preco_custo,
    preco_venda: body.preco_venda,
  };

  const { data, error } = await supabase
    .from("pecas")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/tabelas");

  return NextResponse.json(data, { status: 201 });
}
