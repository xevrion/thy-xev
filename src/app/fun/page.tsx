import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { Shenanigans } from '@/components/Shenanigans'
import { SectionDivider } from '@/components/SectionDivider'
import { Mark } from '@/components/Mark'

const description = 'Weird, fun, and fast-built side projects by Yash Bavadiya — shipped for laughs, learning, and the love of building.'

export const metadata: Metadata = {
  title: 'Shenanigans',
  description,
  alternates: { canonical: 'https://xevrion.dev/fun' },
}

export default function FunPage() {
  return (
    <>
      <JsonLd
        type="webpage"
        title="Shenanigans"
        description={description}
        canonicalUrl="https://xevrion.dev/fun"
      />
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 sm:pt-14 pb-6 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
        <h1 className="text-[clamp(2rem,5vw+1rem,3.5rem)] sg-bold text-[var(--color-text)] leading-tight tracking-tight">
          Shenanigans
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular">
          Weird, fun, and fast-built side projects — <Mark>shipped for laughs, learning, and the love of building</Mark>.
        </p>
      </div>
      <SectionDivider />
      <Shenanigans noHeader />
    </>
  )
}
