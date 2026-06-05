'use client'

import SplitText from './reactbits/splittext'
import { PdfViewer } from './PdfViewer'

const DRIVE_FILE_ID = '1Bmtk0cAVQXqrG_f_HwjXKDTVQcbHqKWf'
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`
const EMBED_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`

export const Resume = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <SplitText
          text="Resume"
          className="text-[clamp(2.25rem,5vw+1rem,3.5rem)] text-soft-royal-blue sg-bold leading-tight tracking-tight"
          delay={20}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p className="text-base text-[var(--color-text-muted)] sg-regular max-w-lg">
          Where I've been, what I built — one page.
        </p>
      </div>

      {/* PDF Viewer */}
      <PdfViewer
        file={EMBED_URL}
        downloadHref={DOWNLOAD_URL}
        filename="Yash_Bavadiya_Resume.pdf"
      />
    </section>
  )
}

export default Resume
