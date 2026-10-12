"use client";

export function DeleteButton({
  action,
  confirmMessage = "Tem certeza que deseja excluir este registro?",
  children = "Excluir",
}: {
  action: () => void;
  confirmMessage?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm(confirmMessage)) action();
      }}
      className="rounded-sm border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
    >
      {children}
    </button>
  );
}
