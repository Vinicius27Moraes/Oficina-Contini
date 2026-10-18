"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

type FilterOption = { value: string; label: string };

export function FilterableList({
  children,
  filters = [],
  filterLabel = "Filtrar",
}: {
  children: ReactNode;
  filters?: FilterOption[];
  filterLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const filterId = useId();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 25;
  const pageCount = Math.max(1, Math.ceil(matchCount / pageSize));

  const normalizedQuery = useMemo(() => normalize(query), [query]);

  useEffect(() => setPage(0), [normalizedQuery, filter]);

  useEffect(() => {
    const rows = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-list-row]") ?? []);
    const matches = rows.filter((row) => {
      const text = normalize(`${row.dataset.search ?? ""} ${row.textContent ?? ""}`);
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesFilter = !filter || row.dataset.filter === filter;
      return matchesQuery && matchesFilter;
    });

    const firstIndex = page * pageSize;
    const matchIndexes = new Map(matches.map((row, index) => [row, index]));
    rows.forEach((row) => {
      const matchIndex = matchIndexes.get(row);
      row.hidden = matchIndex === undefined || matchIndex < firstIndex || matchIndex >= firstIndex + pageSize;
    });
    setMatchCount(matches.length);
    setTotalCount(rows.length);
  }, [normalizedQuery, filter, page, children]);

  return (
    <div ref={rootRef} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={searchId} className="mb-1 block text-xs font-semibold text-steel-300">Buscar</label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Digite para localizar…"
            className="w-full rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm text-paper placeholder:text-graphite-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        {filters.length > 0 && (
          <div className="sm:w-56">
            <label htmlFor={filterId} className="mb-1 block text-xs font-semibold text-steel-300">{filterLabel}</label>
            <select
              id={filterId}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm text-paper focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Todos</option>
              {filters.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {Math.min(pageSize, Math.max(0, matchCount - page * pageSize))} registros nesta página; {matchCount} encontrados de {totalCount}.
      </p>
      {children}
      {totalCount > 0 && matchCount === 0 && (
        <p className="rounded-sm border border-graphite-700 px-4 py-6 text-center text-sm text-graphite-400">
          Nenhum registro corresponde à busca ou aos filtros selecionados.
        </p>
      )}
      {matchCount > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-graphite-700 pt-3">
          <p className="text-xs text-graphite-400">Mostrando {page * pageSize + 1}–{Math.min((page + 1) * pageSize, matchCount)} de {matchCount}</p>
          <div className="flex gap-2">
            <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
            <span className="self-center text-xs text-graphite-400">Página {page + 1} de {pageCount}</span>
            <button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}
