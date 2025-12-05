import { encode } from "qss";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { cn } from "../lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export const LinkPreview = ({
  children,
  url,
  className,
  width = 256,
  height = 160,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 3,
      "viewport.height": height * 3,
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const [isHovered, setIsHovered] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [previewPosition, setPreviewPosition] = React.useState({ x: 0, y: 0 });
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
    
    // Check if device is mobile/touch device
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768; // md breakpoint
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: any) => {
    if (!isHovered) return;
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  // Update preview position when hovered
  React.useEffect(() => {
    if (isHovered && linkRef.current && previewRef.current) {
      const updatePosition = () => {
        if (!linkRef.current || !previewRef.current) return;
        
        const linkRect = linkRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const previewWidth = 256; // w-64 = 256px
        const previewHeight = 176; // h-40 (160px) + padding (16px) = ~176px

        // Position to the left of the link
        let x = linkRect.left - previewWidth - 10;
        let y = linkRect.top + linkRect.height / 2 - previewHeight / 2;

        // Adjust if preview goes off screen
        if (x < 10) x = 10;
        if (x + previewWidth > viewportWidth - 10) {
          x = viewportWidth - previewWidth - 10;
        }
        if (y < 10) y = 10;
        if (y + previewHeight > viewportHeight - 10) {
          y = viewportHeight - previewHeight - 10;
        }

        setPreviewPosition({ x, y });
      };

      const timeoutId = setTimeout(updatePosition, 0);
      updatePosition();
      
      return () => clearTimeout(timeoutId);
    }
  }, [isHovered]);

  // Reset parallax when closing
  React.useEffect(() => {
    if (!isHovered) {
      x.set(0);
    }
  }, [isHovered, x]);

  // If mobile, just render a regular link without hover preview
  if (isMobile) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cn("text-battleship-gray", className)}>
        {children}
      </a>
    );
  }

  return (
    <>
      {isMounted ? (
        <div className="hidden">
          <img
            src={src}
            width={width}
            height={height}
            alt="hidden image"
          />
        </div>
      ) : null}

      <a
        ref={linkRef}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("text-battleship-gray relative", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            ref={previewRef}
            initial={{ opacity: 0, x: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
              },
            }}
            exit={{
              opacity: 0,
              x: 20,
              scale: 0.6,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.2,
              },
            }}
            className="fixed z-50 pointer-events-none shadow-2xl rounded-xl"
            style={{
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
              x: translateX,
            }}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-1 bg-taupe border-2 border-battleship-gray/30 shadow-xl rounded-xl hover:border-soft-royal-blue/50 transition-colors duration-200 pointer-events-auto"
              style={{ fontSize: 0 }}
            >
              <img
                src={isStatic ? imageSrc : src}
                width={width}
                height={height}
                className="rounded-lg"
                alt="preview image"
              />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
