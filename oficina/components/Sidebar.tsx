"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => setMenuAberto(false), [pathname]);

  const itens = usuario.role === "MASTER"
    ? [...NAV, { href: "/usuarios", label: "Usuários", icon: "◎" }, { href: "/configuracoes", label: "Configurações", icon: "⚙" }]
    : NAV;

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-graphite-700 bg-graphite-900 px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-500 font-display text-lg font-bold text-graphite-950" aria-hidden="true">O</span>
          <span className="font-display text-base font-semibold text-paper">Oficina <span className="text-graphite-500">Gestão</span></span>
        </div>
        <button
          type="button"
          aria-expanded={menuAberto}
          aria-controls="navegacao-principal"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="rounded-sm border border-graphite-600 px-3 py-2 text-sm font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {menuAberto ? "Fechar" : "Menu"}
        </button>
      </header>

      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside id="navegacao-principal" className={`fixed inset-y-0 left-0 z-50 h-dvh w-72 flex-col border-r border-graphite-700 bg-graphite-900 transition-transform duration-200 motion-reduce:transition-none lg:static lg:z-auto lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:translate-x-0 ${menuAberto ? "flex translate-x-0" : "hidden -translate-x-full lg:translate-x-0"}`}>
      <div className="flex items-center gap-2 border-b border-graphite-700 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-500 font-display text-lg font-bold text-graphite-950">
          O
        </span>
        <div>
          <p className="font-display text-base font-semibold leading-none text-paper">Oficina</p>
          <p className="text-[11px] uppercase tracking-widest text-graphite-500">Gestão</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {itens.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAberto(false)}
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
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-graphite-400 transition hover:bg-graphite-800 hover:text-paper"
        >
          Sair
        </button>
      </div>
    </aside>
    </>
  );
}
