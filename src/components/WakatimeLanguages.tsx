import { useState, useEffect } from "react";

interface LangEntry {
  name: string;
  seconds: number;
}

const API_URL = import.meta.env.VITE_API_URL;

function formatSeconds(sec: number) {
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  if (hrs === 0 && mins === 0) return "<1m";
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

// Assign a consistent color per language name
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f0db4f",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Markdown: "#083fa1",
  JSON: "#292929",
  YAML: "#cb171e",
  Bash: "#89e051",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Kotlin: "#A97BFF",
};

function langColor(name: string) {
  return LANG_COLORS[name] ?? "#5e7aff";
}

const WakatimeLanguages = () => {
  const [langs, setLangs] = useState<LangEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLangs = async () => {
      try {
        const res = await fetch(`${API_URL}/wakatimeLanguages`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: LangEntry[] = await res.json();
        setLangs(data);
      } catch (e: any) {
        setError("Unable to fetch language stats");
      } finally {
        setLoading(false);
      }
    };

    fetchLangs();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse inter-bold text-battleship-gray text-xl">
        Loading language stats...
      </div>
    );
  }

  if (error || langs.length === 0) {
    return (
      <div className="inter-bold text-battleship-gray text-xl">
        {error ?? "No language data this week"}
      </div>
    );
  }

  const maxSeconds = langs[0].seconds;

  return (
    <div className="flex flex-col gap-3">
      <p className="inter-bold text-battleship-gray text-xl">Languages this week</p>
      <div className="flex flex-col gap-2 w-full max-w-md">
        {langs.map((lang) => (
          <div key={lang.name} className="flex items-center gap-3">
            {/* Label */}
            <span className="inter-medium text-battleship-gray text-sm w-24 shrink-0 truncate">
              {lang.name}
            </span>
            {/* Bar */}
            <div className="flex-1 h-2 rounded-full bg-battleship-gray/20 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(lang.seconds / maxSeconds) * 100}%`,
                  backgroundColor: langColor(lang.name),
                }}
              />
            </div>
            {/* Time */}
            <span className="inter-medium text-battleship-gray text-xs w-12 text-right shrink-0">
              {formatSeconds(lang.seconds)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WakatimeLanguages;
