"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/", label: "Painel", icon: "◧" },
  { href: "/ordens", label: "Ordens de serviço", icon: "▤" },
  { href: "/clientes", label: "Clientes", icon: "◍" },
  { href: "/veiculos", label: "Veículos", icon: "▭" },
  { href: "/estoque", label: "Estoque de peças", icon: "▥" },
  { href: "/funcionarios", label: "Funcionários", icon: "◔" },
];

type Usuario = { nome: string; role: "MASTER" | "PADRAO" };

export function Sidebar({ usuario }: { usuario: Usuario }) {
  const pathname = usePathname();

  const itens = usuario.role === "MASTER"
    ? [...NAV, { href: "/usuarios", label: "Usuários", icon: "◎" }, { href: "/configuracoes", label: "Configurações", icon: "⚙" }]
    : NAV;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-graphite-700 bg-graphite-900">
      <div className="flex items-center gap-2 border-b border-graphite-700 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-500 font-display text-lg font-bold text-graphite-950">
          O
        </span>
        <div>
          <p className="font-display text-base font-semibold leading-none text-paper">Oficina</p>
          <p className="text-[11px] uppercase tracking-widest text-graphite-500">Gestão</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {itens.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition ${
                active
                  ? "bg-amber-500/10 font-semibold text-amber-400"
                  : "text-graphite-500 hover:bg-graphite-800 hover:text-paper"
              }`}
            >
              <span aria-hidden className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-graphite-700 px-4 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">{usuario.nome}</p>
            <p className="text-[11px] uppercase tracking-widest text-graphite-500">
              {usuario.role === "MASTER" ? "Master" : "Usuário"}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-graphite-400 transition hover:bg-graphite-800 hover:text-paper"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
