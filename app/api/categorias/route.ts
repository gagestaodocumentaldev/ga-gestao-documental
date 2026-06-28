import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, descricao, created_at")
    .order("descricao");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categorias: data ?? [], totalRecords: (data ?? []).length });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { descricao: string };

  const supabase = await createClient();

  const { data: categoria, error } = await supabase
    .from("categorias")
    .insert({ descricao: body.descricao })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/categorias");

  return NextResponse.json(categoria, { status: 201 });
}
