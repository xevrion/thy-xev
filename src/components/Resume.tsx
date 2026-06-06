import { PdfViewer } from './PdfViewer'

const PDF_URL = '/resume.pdf'
const DOWNLOAD_URL = '/resume.pdf'

export const Resume = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col">
      <div className="py-10 sm:py-14 flex flex-col gap-3">
        <h1 className="text-[clamp(2rem,5vw+1rem,3.5rem)] font-extrabold text-[var(--color-text)] leading-tight tracking-tight">
          Resume
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular">
          CS student at IIT Jodhpur. Full stack developer. One page.
        </p>
      </div>

      <PdfViewer
        file={PDF_URL}
        downloadHref={DOWNLOAD_URL}
        filename="Yash_Bavadiya_Resume.pdf"
      />

      <div className="pb-10 sm:pb-14" />
    </section>
  )
}

export default Resume
