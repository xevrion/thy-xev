'use client'

import { Download } from 'lucide-react'
import SplitText from './reactbits/splittext'

const DRIVE_FILE_ID = '1Bmtk0cAVQXqrG_f_HwjXKDTVQcbHqKWf'
const EMBED_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`

export const Resume = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SplitText
          text="Resume"
          className="text-5xl sm:text-6xl text-soft-royal-blue sg-bold"
          delay={20}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-battleship-gray text-[var(--color-text)] sg-medium text-sm hover:border-soft-royal-blue hover:text-soft-royal-blue transition-colors duration-200 w-fit"
        >
          <Download size={15} />
          Download PDF
        </a>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-battleship-gray/30" style={{ height: '80vh' }}>
        <iframe src={EMBED_URL} title="Resume" className="w-full h-full" allow="autoplay" />
      </div>
    </section>
  )
}

export default Resume
