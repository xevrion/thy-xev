import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
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

  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

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
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

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

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn("text-battleship-gray", className)}
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="[transform-origin:var(--radix-hover-card-content-transform-origin)] z-50"
          side="left"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
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
                exit={{ opacity: 0, x: 20, scale: 0.6 }}
                className="shadow-2xl rounded-xl"
                style={{
                  x: translateX,
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-1 bg-taupe border-2 border-battleship-gray/30 shadow-xl rounded-xl hover:border-soft-royal-blue/50 transition-colors duration-200"
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
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};
