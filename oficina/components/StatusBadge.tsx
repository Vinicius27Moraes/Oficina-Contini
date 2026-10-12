const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ABERTA: { label: "Aberta", className: "bg-steel-300/20 text-steel-300 border-steel-300/40" },
  EM_ANDAMENTO: { label: "Em andamento", className: "bg-amber-500/15 text-amber-400 border-amber-500/40" },
  AGUARDANDO_PECA: { label: "Aguardando peça", className: "bg-orange-500/15 text-orange-400 border-orange-500/40" },
  FINALIZADA: { label: "Finalizada", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" },
  CANCELADA: { label: "Cancelada", className: "bg-red-500/15 text-red-400 border-red-500/40" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.ABERTA;
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
