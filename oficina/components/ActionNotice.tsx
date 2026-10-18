export function ActionNotice({ message = "Alterações salvas com sucesso." }: { message?: string }) {
  return (
    <p role="status" aria-live="polite" className="mb-4 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
      {message}
    </p>
  );
}
