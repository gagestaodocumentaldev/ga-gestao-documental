import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function proxy(req: NextRequest) {
  return await updateSession(req);
}

// Configuração para dizer ao Next.js quais caminhos devem passar por este Proxy
export const config = {
  matcher: [
    /*
     * Aplica o proxy a todas as rotas exceto:
     * - _next/static (arquivos estáticos do Next.js)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone do navegador)
     * - arquivos com extensões: svg, png, jpg, jpeg, gif, webp (imagens globais)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
