import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as {
    descricao: string;
    tiposDocumentosIds?: string[];
  };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .update({ descricao: body.descricao })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: deleteError } = await supabase
    .from("categorias_tipos_documentos")
    .delete()
    .eq("categoria_id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (body.tiposDocumentosIds?.length) {
    const junctions = body.tiposDocumentosIds.map((tipoId) => ({
      categoria_id: id,
      tipo_documento_id: tipoId,
    }));

    const { error: insertError } = await supabase
      .from("categorias_tipos_documentos")
      .insert(junctions);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  revalidatePath("/categorias");

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/categorias");

  return NextResponse.json({ success: true });
}
