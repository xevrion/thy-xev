export function SectionDivider() {
  return (
    <div className="relative flex w-full h-4 before:absolute before:left-1/2 before:-translate-x-1/2 before:z-0 before:w-screen before:h-4 before:bg-[repeating-linear-gradient(315deg,var(--divider-stripe)_0,var(--divider-stripe)_1px,transparent_0,transparent_50%)] before:bg-[length:10px_10px] before:border-t before:border-b before:[--divider-stripe:color-mix(in_srgb,var(--color-battleship-gray)_18%,transparent)] before:border-battleship-gray/15" />
  )
}
