export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-text-muted)]/60 uppercase shrink-0">
        {children}
      </p>
      <div className="flex-1 h-px bg-battleship-gray/15" />
    </div>
  )
}
