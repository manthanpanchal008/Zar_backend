export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-[#eee7dd] bg-white shadow-panel ${className}`}>{children}</section>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 border-b border-[#f0e8dd] px-5 py-4">{children}</div>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-5">{children}</div>;
}
