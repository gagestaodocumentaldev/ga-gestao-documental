import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentos Obrigatórios",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
