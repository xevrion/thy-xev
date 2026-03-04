import { motion, AnimatePresence } from 'framer-motion'

interface HandwrittenHintProps {
  visible: boolean
  text: string
  /** SVG path d string — main curve + arrowhead as one composite path */
  arrowPath: string
  arrowViewBox?: string
  arrowWidth?: number
  arrowHeight?: number
  /** Tailwind flex-direction class, e.g. 'flex-col', 'flex-row', 'flex-col-reverse' */
  flexDir?: string
  /** Tailwind items-* alignment class */
  alignment?: string
  /** Optional second line of smaller text below the main label */
  subtitle?: string
  /** Tailwind rotate class for the text */
  textRotation?: string
  /** Extra classes on the outer absolute div */
  className?: string
}

export function HandwrittenHint({
  visible,
  text,
  subtitle,
  arrowPath,
  arrowViewBox = '0 0 30 35',
  arrowWidth = 30,
  arrowHeight = 35,
  flexDir = 'flex-col',
  alignment = 'items-center',
  textRotation = '-rotate-2',
  className = '',
}: HandwrittenHintProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`pointer-events-none select-none absolute flex ${alignment} ${flexDir} ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <svg
            width={arrowWidth}
            height={arrowHeight}
            viewBox={arrowViewBox}
            className="text-battleship-gray/65 shrink-0"
          >
            <motion.path
              d={arrowPath}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.0, duration: 0.9, ease: 'easeOut' }}
            />
          </svg>
          <div className="flex flex-col">
            <span
              className={`caveat text-battleship-gray/65 text-2xl whitespace-nowrap inline-block ${textRotation}`}
            >
              {text}
            </span>
            {subtitle && (
              <span className="caveat text-battleship-gray/50 text-xl whitespace-nowrap inline-block">
                {subtitle}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
