import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");

  if (!clientId) {
    return NextResponse.json(
      { error: "client_id é obrigatório" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes_fases")
    .select("*, fases(*)")
    .eq("client_id", clientId)
    .order("descricao", { referencedTable: "fases" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ clientesFases: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    client_id: string;
    fase_id: string;
  };

  if (!body.client_id || !body.fase_id) {
    return NextResponse.json(
      { error: "client_id e fase_id são obrigatórios" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes_fases")
    .insert({
      client_id: body.client_id,
      fase_id: body.fase_id,
      concluido: false,
    })
    .select("*, fases(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/acompanhamento-fases");

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as {
    client_id: string;
    fase_id: string;
    concluido: boolean;
  };

  if (!body.client_id || !body.fase_id) {
    return NextResponse.json(
      { error: "client_id e fase_id são obrigatórios" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes_fases")
    .update({
      concluido: body.concluido,
      concluido_em: body.concluido ? new Date().toISOString() : null,
    })
    .eq("client_id", body.client_id)
    .eq("fase_id", body.fase_id)
    .select("*, fases(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/acompanhamento-fases");

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as {
    client_id: string;
    fase_id: string;
  };

  if (!body.client_id || !body.fase_id) {
    return NextResponse.json(
      { error: "client_id e fase_id são obrigatórios" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("clientes_fases")
    .delete()
    .eq("client_id", body.client_id)
    .eq("fase_id", body.fase_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/acompanhamento-fases");

  return NextResponse.json({ success: true });
}
