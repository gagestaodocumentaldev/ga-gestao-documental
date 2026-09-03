import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Fase } from "@/types/entidades-banco/fase";

export async function GET() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("fases")
    .select("*", { count: "exact" })
    .order("descricao");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ fases: data, totalRecords: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Fase>;

  const supabase = await createClient();

  const { data: fase, error } = await supabase
    .from("fases")
    .insert({
      descricao: body.descricao,
      consultoria: body.consultoria,
      treinamento: body.treinamento,
    })
    .select("*")
    .single();

  if (error || !fase) {
    return NextResponse.json(
      { error: error?.message || "Erro ao criar fase" },
      { status: 500 },
    );
  }

  const { data: clientes, error: clientesError } = await supabase
    .from("clients")
    .select("id");

  if (clientesError) {
    await supabase.from("fases").delete().eq("id", fase.id);
    return NextResponse.json(
      { error: clientesError.message },
      { status: 500 },
    );
  }

  if (clientes && clientes.length > 0) {
    const vinculos = clientes.map((cliente) => ({
      client_id: cliente.id,
      fase_id: fase.id,
      concluido: false,
    }));

    const { error: vinculosError } = await supabase
      .from("clientes_fases")
      .insert(vinculos);

    if (vinculosError) {
      await supabase.from("fases").delete().eq("id", fase.id);
      return NextResponse.json(
        { error: vinculosError.message },
        { status: 500 },
      );
    }
  }

  revalidatePath("/fases");
  revalidatePath("/acompanhamento-fases");

  return NextResponse.json(fase, { status: 201 });
}
