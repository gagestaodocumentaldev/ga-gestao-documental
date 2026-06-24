import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json() as {
    nome: string;
    cnpj: string;
    telefone?: string;
    categoria_id?: string;
  };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .update({
      nome: body.nome,
      cnpj: body.cnpj,
      telefone: body.telefone || null,
      categoria_id: body.categoria_id || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/clientes");

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/clientes");

  return NextResponse.json({ success: true });
}
