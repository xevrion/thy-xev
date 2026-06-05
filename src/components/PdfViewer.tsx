'use client'

import dynamic from 'next/dynamic'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useResizeObserver } from '@wojtekmaj/react-hooks'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ExternalLink,
} from 'lucide-react'

const Document = dynamic(() => import('react-pdf').then((m) => m.Document), { ssr: false })
const Page = dynamic(() => import('react-pdf').then((m) => m.Page), { ssr: false })

interface PdfCtx {
  numPages: number | null
  currentPage: number
  setCurrentPage: (p: number) => void
  zoom: number
  setZoom: (z: number) => void
  reload: () => void
  file: string
  downloadHref: string
}

const Ctx = createContext<PdfCtx | null>(null)
function usePdf() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Must be inside PdfViewer')
  return ctx
}

interface PdfViewerProps {
  file: string
  downloadHref?: string
  filename?: string
}

export function PdfViewer({ file, downloadHref, filename }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [docKey, setDocKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [workerReady, setWorkerReady] = useState(false)
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    import('react-pdf').then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString()
      setWorkerReady(true)
    })
  }, [])

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const entry = entries[0]
    if (entry) setContainerWidth(entry.contentRect.width)
  }, [])

  useResizeObserver(containerRef, {}, onResize)

  const reload = () => {
    setCurrentPage(1)
    setNumPages(null)
    setLoading(true)
    setDocKey((k) => k + 1)
  }

  const href = downloadHref ?? file
  const pageWidth = containerWidth > 0 ? Math.min(containerWidth, 860) : null

  return (
    <Ctx.Provider
      value={{
        numPages,
        currentPage,
        setCurrentPage,
        zoom,
        setZoom,
        reload,
        file,
        downloadHref: href,
      }}
    >
      <div className="flex flex-col border border-[var(--color-text-subtle)]/20 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--color-text-subtle)]/15 bg-[var(--color-taupe)]">
          {/* Filename */}
          <span className="flex-1 min-w-0 truncate font-mono text-[11px] text-[var(--color-text-subtle)]">
            {filename ?? file.split('/').pop()}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-0.5">
            {/* Pagination */}
            {numPages && numPages > 1 && (
              <div className="flex items-center gap-1 mr-2">
                <IconBtn
                  label="Previous page"
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={14} />
                </IconBtn>
                <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums px-1">
                  {currentPage}/{numPages}
                </span>
                <IconBtn
                  label="Next page"
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, numPages))}
                  disabled={currentPage >= numPages}
                >
                  <ChevronRight size={14} />
                </IconBtn>
              </div>
            )}

            {/* Zoom */}
            <IconBtn label="Zoom out" onClick={() => setZoom(Math.max(+(zoom - 0.1).toFixed(1), 0.5))}>
              <ZoomOut size={14} />
            </IconBtn>
            <span className="font-mono text-xs text-[var(--color-text-muted)] w-10 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <IconBtn label="Zoom in" onClick={() => setZoom(Math.min(+(zoom + 0.1).toFixed(1), 3))}>
              <ZoomIn size={14} />
            </IconBtn>

            <div className="w-px h-4 bg-[var(--color-text-subtle)]/20 mx-1" />

            <IconBtn label="Reload" onClick={reload}>
              <RotateCcw size={14} />
            </IconBtn>
            <IconBtn label="Open in new tab" asLink href={file} target="_blank">
              <ExternalLink size={14} />
            </IconBtn>

            {/* Download button */}
            <a
              href={href}
              aria-label="Download PDF"
              className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-md bg-[var(--color-soft-royal-blue)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        {/* PDF canvas */}
        <div
          ref={setContainerRef}
          className="relative flex-1 overflow-auto bg-[var(--color-text-subtle)]/5"
          style={{ minHeight: '80vh' }}
        >
          {workerReady && pageWidth ? (
            <Document
              key={docKey}
              file={file}
              loading={null}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages)
                setLoading(false)
              }}
              onLoadError={() => setLoading(false)}
              className="flex flex-col items-center gap-4 py-6"
            >
              {Array.from({ length: numPages ?? 0 }, (_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  width={pageWidth - 32}
                  scale={zoom}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              ))}
            </Document>
          ) : null}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs text-[var(--color-text-subtle)] animate-pulse">
                Loading…
              </span>
            </div>
          )}
        </div>
      </div>
    </Ctx.Provider>
  )
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
  asLink,
  href,
  target,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  asLink?: boolean
  href?: string
  target?: string
}) {
  const base =
    'flex items-center justify-center w-7 h-7 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-text-subtle)]/10 transition-colors disabled:opacity-40 disabled:pointer-events-none'

  if (asLink) {
    return (
      <a href={href} target={target} rel="noopener noreferrer" aria-label={label} className={base}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} aria-label={label} className={base}>
      {children}
    </button>
  )
}
