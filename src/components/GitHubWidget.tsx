import React from "react";
import { GitHubCalendar } from "react-github-calendar";

// Hook for responsive breakpoints
const useResponsiveCalendar = () => {
  const [dimensions, setDimensions] = React.useState({
    blockSize: 11,
    blockMargin: 5,
    fontSize: 13,
  });

  React.useEffect(() => {
    const calculateDimensions = () => {
      const width = window.innerWidth;

      // Mobile: < 640px (sm)
      if (width < 640) {
        setDimensions({
          blockSize: 5,
          blockMargin: 2,
          fontSize: 8,
        });
      }
      // Tablet: 640px - 1024px (md to lg)
      else if (width < 1024) {
        setDimensions({
          blockSize: 7,
          blockMargin: 3,
          fontSize: 10,
        });
      }
      // Desktop: >= 1024px (lg+)
      else {
        setDimensions({
          blockSize: 10,
          blockMargin: 4,
          fontSize: 12,
        });
      }
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  return dimensions;
};

const GitHubWidget: React.FC = () => {
  const dimensions = useResponsiveCalendar();

  return (
    <section className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 sm:px-6">
        <svg
          aria-label="GitHub"
          viewBox="0 0 16 16"
          width={20}
          height={20}
          className="text-blue-crayola opacity-95 shrink-0"
          fill="currentColor"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.18-.01-.71-.01-1.39-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.2 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2.01-.27c.68 0 1.37.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <h2 className="sg-semibold text-lg sm:text-xl leading-tight text-silver select-none tracking-tight">
          GitHub Activity
        </h2>
      </div>

      {/* Calendar Container - Optimized for all screen sizes */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-xl bg-taupe/50 border border-silver/5 hover:border-silver/10 transition-colors duration-300"
        style={{
          boxShadow: "0 2px 8px 0 rgba(22, 31, 41, 0.08)",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Scroll wrapper with hidden scrollbar - ensures no overflow */}
        <div className="w-full overflow-x-auto overflow-y-hidden -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari, and Opera */
            }
            /* Force white color for calendar month labels in SVG, override black */
            .react-github-calendar text,
            svg.react-activity-calendar__labels text,
            .react-activity-calendar__labels text,
            svg text[font-size="12"],
            svg text[font-size="10"] {
              fill: var(--color-silver, #e0dedb) !important;
            }
          `}</style>

          <div className="inline-block min-w-max">
            <GitHubCalendar
              username="xevrion"
              colorScheme="dark"
              blockSize={dimensions.blockSize}
              blockMargin={dimensions.blockMargin}
              fontSize={dimensions.fontSize}
              showColorLegend={false}
              showTotalCount={false}
              showMonthLabels={true}
              tooltips={{
                activity: {
                  text: (activity) =>
                    `${activity.count} contributions on ${activity.date}`,
                  withArrow: true,
                },
              }}
              theme={{
                dark: [
                  "var(--color-taupe, #2e2a27)", // empty
                  "#6b6560", // low - adjusted for better contrast
                  "var(--color-battleship-gray, #a6a19d)", // medium
                  "var(--color-blue-crayola, #4c6fff)", // high
                  "var(--color-soft-royal-blue, #6e8cff)", // max
                ],
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubWidget;
