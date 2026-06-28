import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, descricao, created_at, categorias_documentos_obrigatorios(documento_obrigatorio_id)")
    .order("descricao");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const categorias = (data ?? []).map((cat) => ({
    id: cat.id,
    descricao: cat.descricao,
    created_at: cat.created_at,
    documentosObrigatoriosIds: (
      cat.categorias_documentos_obrigatorios as { documento_obrigatorio_id: string }[]
    ).map((ctd) => ctd.documento_obrigatorio_id),
  }));

  return NextResponse.json({ categorias, totalRecords: categorias.length });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    descricao: string;
    documentosObrigatoriosIds?: string[];
  };

  const supabase = await createClient();

  const { data: categoria, error } = await supabase
    .from("categorias")
    .insert({ descricao: body.descricao })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.documentosObrigatoriosIds?.length) {
    const junctions = body.documentosObrigatoriosIds.map((tipoId) => ({
      categoria_id: categoria.id,
      documento_obrigatorio_id: tipoId,
    }));

    const { error: junctionError } = await supabase
      .from("categorias_documentos_obrigatorios")
      .insert(junctions);

    if (junctionError) {
      return NextResponse.json({ error: junctionError.message }, { status: 500 });
    }
  }

  revalidatePath("/categorias");

  return NextResponse.json(categoria, { status: 201 });
}
