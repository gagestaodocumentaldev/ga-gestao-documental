import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Categoria } from "@/types/entidades-banco/categoria";

export async function GET() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("clients")
    .select("*, categorias(id, descricao)", { count: "exact" })
    .order("nome");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const clientes = (data ?? []).map((c) => ({
    id: c.id,
    nome: c.nome,
    cnpj: c.cnpj,
    telefone: c.telefone,
    drive_folder_id: c.drive_folder_id,
    categoria_id: c.categoria_id,
    categoria: c.categorias as Categoria | undefined,
    created_at: c.created_at,
    updated_at: c.updated_at,
  }));

  return NextResponse.json({ clientes, totalRecords: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    nome: string;
    cnpj: string;
    telefone?: string;
    categoria_id?: string;
  };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .insert({
      nome: body.nome,
      cnpj: body.cnpj,
      telefone: body.telefone || null,
      categoria_id: body.categoria_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/clientes");

  return NextResponse.json(data, { status: 201 });
}
