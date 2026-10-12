import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-graphite-700 bg-graphite-800 p-5 ${className}`}>
      {children}
    </div>
  );
}
