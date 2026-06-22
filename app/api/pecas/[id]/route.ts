import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Peca } from "@/types/peca";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
    .update(payload)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/tabelas");

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();

  const { error } = await supabase
    .from("pecas")
    .delete()
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/tabelas");

  return NextResponse.json({ success: true });
}