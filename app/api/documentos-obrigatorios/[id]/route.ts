import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { DocumentoObrigatorio } from "@/types/entidades-banco/documentoObrigatorio";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<DocumentoObrigatorio>;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos_obrigatorios")
    .update({ descricao: body.descricao })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/documentosobrigatorios");

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();

  const { error } = await supabase
    .from("documentos_obrigatorios")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/documentosobrigatorios");

  return NextResponse.json({ success: true });
}
