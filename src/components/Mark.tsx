export function Mark({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-[var(--mark-bg)] text-[var(--mark-fg)] rounded-sm px-[0.2em] not-italic">
      {children}
    </mark>
  )
}
