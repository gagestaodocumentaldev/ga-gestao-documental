import { createClient } from "@/lib/supabase/server";
import { UserData } from "@/layout/context/usercontext";

export async function getCurrentUser(): Promise<UserData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { nome: "", email: "", perfil: "" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, perfil")
    .eq("id", user.id)
    .single();

  return {
    nome: profile?.nome ?? "",
    email: user.email ?? "",
    perfil: profile?.perfil ?? "",
  };
}
