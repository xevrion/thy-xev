// import React, { useState, useEffect } from "react";

// interface WakaResp {
//   data: {
//     total_seconds: number;
//     text: string; // e.g. "123 hrs 45 mins"
//   };
// }

// const WakatimeWidget: React.FC = () => {
//   const [time, setTime] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchWakatime = async () => {
//     try {
//       const res = await fetch("http://localhost:3001/wakatimeAllTime");
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json: WakaResp = await res.json();
//       setTime(json.data.text);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to fetch WakaTime data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWakatime();
//     const interval = setInterval(fetchWakatime, 30 * 60 * 1000); // refresh every 30 min
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <div className="animate-pulse inter-bold text-battleship-gray text-xl">
//         Loading coding stats...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="inter-bold text-battleship-gray text-xl">{error}</div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       <p className="inter-bold text-battleship-gray text-xl">
//         All-Time Coding:
//       </p>
//       <div className="flex items-center gap-3 rounded-xl px-3 py-2 w-full max-w-md hover:scale-[1.03] transition-all duration-200 ease-in-out">
//         <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0"></div>
//         <span className="text-sm md:text-base inter-medium text-battleship-gray truncate">
//           {time}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default WakatimeWidget;


/* eslint-disable  @typescript-eslint/no-explicit-any */


import React, { useState, useEffect } from "react";

interface WakaDailyResponse {
  data?: Array<{
    grand_total?: {
      total_seconds?: number;
      text?: string;
    };
  }>;
  // WakaTime may include other fields, we only care about data[0].grand_total
}

const API_URL = import.meta.env.VITE_API_URL;

const WakatimeDailyWidget: React.FC = () => {
  const [timeText, setTimeText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDaily = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/wakatimeDaily`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const json: WakaDailyResponse = await res.json();

      const day = json?.data?.[0];
      const grand = day?.grand_total;

      if (grand && (grand.total_seconds || grand.text)) {
        // Prefer the human-readable text if available, otherwise format seconds
        setTimeText(grand.text ?? formatSeconds(grand.total_seconds ?? 0));
      } else {
        // No activity recorded today
        setTimeText("No coding today");
      }
    } catch (e: any) {
      console.error("WakaTime daily fetch error:", e);
      setError("Unable to fetch WakaTime daily");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
    const id = setInterval(fetchDaily, 5 * 60 * 1000); // refresh every 5 minutes
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse inter-bold text-battleship-gray text-xl">
        Loading today's coding...
      </div>
    );
  }

  if (error) {
    return (
      <div className="inter-bold text-battleship-gray text-xl">{error}</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="inter-bold text-battleship-gray text-xl">Today's Coding Time</p>
      <div className="flex items-center gap-3 rounded-xl px-3 py-2 w-full max-w-md hover:scale-[1.03] transition-all duration-200 ease-in-out">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0"></div>
        <span className="text-sm md:text-base inter-medium text-battleship-gray truncate">
          {timeText}
        </span>
      </div>
    </div>
  );
};

function formatSeconds(sec: number) {
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  if (hrs === 0 && mins === 0) return "<1 min";
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs} hr ${mins} min`;
}

export default WakatimeDailyWidget;
