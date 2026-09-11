import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: clientes, error } = await supabase
    .from("clients")
    .select(
      "id, nome, categorias(id, descricao), clientes_fases!left(fase_id, concluido)",
    )
    .order("nome");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resumo = (clientes ?? []).map((cliente) => {
    const vinculos = (cliente.clientes_fases ?? []) as {
      fase_id: string;
      concluido: boolean;
    }[];
    const total = vinculos.length;
    const concluidas = vinculos.filter((v) => v.concluido).length;

    return {
      id: cliente.id,
      nome: cliente.nome,
      categoria: ((cliente.categorias as { id: string; descricao: string }[])?.[0]) ?? undefined,
      total,
      concluidas,
      progresso: total > 0 ? Math.round((concluidas / total) * 100) : 0,
    };
  });

  return NextResponse.json({ resumo });
}
