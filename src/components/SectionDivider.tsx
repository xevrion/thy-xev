export function SectionDivider() {
  return (
    <div className="relative h-8 w-full overflow-hidden border-t border-b border-battleship-gray/15 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(315deg,var(--divider-stripe)_0,var(--divider-stripe)_1px,transparent_0,transparent_50%)] before:bg-[length:10px_10px] [--divider-stripe:color-mix(in_srgb,var(--color-battleship-gray)_20%,transparent)]" />
  )
}
