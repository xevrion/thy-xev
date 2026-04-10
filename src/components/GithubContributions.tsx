import { useState, useEffect, useRef } from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const API_URL = import.meta.env.VITE_API_URL;

function getColor(count: number): string {
  if (count === 0) return "var(--color-cell-empty)";
  if (count <= 3) return "var(--color-cell-low)";
  if (count <= 6) return "var(--color-cell-mid)";
  if (count <= 9) return "var(--color-cell-high)";
  return "var(--color-cell-max)";
}

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const GithubContributions = () => {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_URL}/github-contributions`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ContributionCalendar = await res.json();
        setCalendar(data);
      } catch (e: any) {
        setError("Unable to fetch GitHub contributions");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  // Scroll to the right (most recent) on load
  useEffect(() => {
    if (calendar && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [calendar]);

  if (loading) {
    return (
      <div className="animate-pulse inter-bold text-battleship-gray text-xl">
        Loading contributions...
      </div>
    );
  }

  if (error || !calendar) {
    return <div className="inter-bold text-battleship-gray text-xl">{error}</div>;
  }

  // Build month labels: track which column each month first appears in
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  calendar.weeks.forEach((week, col) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      monthPositions.push({ label: MONTH_LABELS[month], col });
      lastMonth = month;
    }
  });

  const CELL = 12;
  const GAP = 3;
  const STEP = CELL + GAP;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="inter-bold text-battleship-gray text-xl">GitHub Contributions</p>
        <span className="text-sm text-battleship-gray/60 sg-regular">
          {calendar.totalContributions.toLocaleString()} this year
        </span>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none pb-1"
        style={{ position: "relative" }}
      >
        {/* css variables for theme-aware colors */}
        <style>{`
          :root {
            --color-cell-empty: rgba(100,116,139,0.15);
            --color-cell-low:   rgba(94,122,255,0.25);
            --color-cell-mid:   rgba(94,122,255,0.50);
            --color-cell-high:  rgba(94,122,255,0.75);
            --color-cell-max:   rgba(94,122,255,1);
          }
          .dark {
            --color-cell-empty: rgba(255,255,255,0.07);
          }
        `}</style>

        <svg
          width={calendar.weeks.length * STEP}
          height={20 + 7 * STEP}
          style={{ display: "block" }}
        >
          {/* Month labels */}
          {monthPositions.map(({ label, col }) => (
            <text
              key={`${label}-${col}`}
              x={col * STEP}
              y={10}
              fontSize={9}
              fill="currentColor"
              opacity={0.45}
              fontFamily="inherit"
            >
              {label}
            </text>
          ))}

          {/* Day labels (Mon, Wed, Fri only) */}
          {[1, 3, 5].map((dow) => (
            <text
              key={dow}
              x={-28}
              y={20 + dow * STEP + CELL - 1}
              fontSize={9}
              fill="currentColor"
              opacity={0.35}
              fontFamily="inherit"
            >
              {DAY_LABELS[dow]}
            </text>
          ))}

          {/* Cells */}
          {calendar.weeks.map((week, col) =>
            week.contributionDays.map((day) => (
              <rect
                key={day.date}
                x={col * STEP}
                y={20 + day.weekday * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                fill={getColor(day.contributionCount)}
                style={{ cursor: "pointer", transition: "opacity 0.1s" }}
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGRectElement).getBoundingClientRect();
                  const label = day.contributionCount === 0
                    ? `No contributions on ${day.date}`
                    : `${day.contributionCount} contribution${day.contributionCount > 1 ? "s" : ""} on ${day.date}`;
                  setTooltip({ text: label, x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 text-xs text-battleship-gray/50 sg-regular">
        <span>Less</span>
        {[0, 3, 6, 9, 12].map((n) => (
          <div
            key={n}
            style={{ width: CELL, height: CELL, borderRadius: 2, background: getColor(n), flexShrink: 0 }}
          />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip (fixed to viewport) */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded bg-gray-900 text-white text-xs sg-regular whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y - 30, transform: "translateX(-50%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default GithubContributions;
