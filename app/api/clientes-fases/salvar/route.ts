import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    client_id: string;
    fases: {
      fase_id: string;
      associada: boolean;
      concluido: boolean;
      concluido_em?: string | null;
    }[];
  };

  if (!body.client_id || !Array.isArray(body.fases)) {
    return NextResponse.json(
      { error: "client_id e fases são obrigatórios" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("clientes_fases")
    .delete()
    .eq("client_id", body.client_id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const vinculos = body.fases
    .filter((fase) => fase.associada)
    .map((fase) => ({
      client_id: body.client_id,
      fase_id: fase.fase_id,
      concluido: fase.concluido,
      concluido_em: fase.concluido
        ? fase.concluido_em ?? new Date().toISOString()
        : null,
    }));

  if (vinculos.length > 0) {
    const { error: insertError } = await supabase
      .from("clientes_fases")
      .insert(vinculos);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 },
      );
    }
  }

  revalidatePath("/acompanhamento-fases");

  return NextResponse.json({ success: true });
}
