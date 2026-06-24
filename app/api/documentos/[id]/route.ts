import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type DocumentPayload = {
  client_id?: string;
  numero?: string;
  tipo?: string;
  data_emissao?: string;
  data_validade?: string;
  file_url?: string;
  file_name?: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as DocumentPayload;

  const supabase = await createClient();

  const payload = {
    client_id: body.client_id,
    numero: body.numero,
    tipo: body.tipo,
    data_emissao: body.data_emissao,
    data_validade: body.data_validade,
    file_url: body.file_url,
    file_name: body.file_name,
  };

  const { data, error } = await supabase
    .from("documents")
    .update(payload)
    .eq("id", id)
    .select("*, client:clients(*), tipo:tipos_documentos(*)")
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

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/tabelas");

  return NextResponse.json({ success: true });
}
