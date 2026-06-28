import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { DocumentoObrigatorio } from "@/types/entidades-banco/documentoObrigatorio";

export async function GET() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("documentos_obrigatorios")
    .select("*", { count: "exact" })
    .order("descricao");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documentosObrigatorios: data, totalRecords: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<DocumentoObrigatorio>;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos_obrigatorios")
    .insert({ descricao: body.descricao })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/documentosobrigatorios");

  return NextResponse.json(data, { status: 201 });
}
