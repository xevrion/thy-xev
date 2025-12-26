import React, { useEffect, useState } from "react";

interface DiscordActivity {
  id: string;
  name: string;
  type: number;
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
  };
}

interface LanyardResponse {
  data: {
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: DiscordActivity[];
  };
}

const API_URL = "https://api.lanyard.rest/v1/users/1121919048465268756";

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const DiscordActivityWidget: React.FC = () => {
  const [activity, setActivity] = useState<DiscordActivity | null>(null);
  const [status, setStatus] = useState<string>("offline");
  const [elapsed, setElapsed] = useState<string>("0:00:00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresence = async () => {
    try {
      const res = await fetch(API_URL);
      const json: LanyardResponse = await res.json();

      const realActivity =
        json.data.activities.find((a) => a.type === 0) || null;

      setActivity(realActivity);
      setStatus(json.data.discord_status);
      setError(null);
    } catch {
      setError("Failed to fetch Discord activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresence();
    const interval = setInterval(fetchPresence, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activity?.timestamps?.start) return;

    const update = () => {
      setElapsed(formatDuration(Date.now() - activity.timestamps!.start!));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activity]);

  if (loading) {
    return (
      <div className="w-full max-w-xs animate-pulse">
        <div className="h-4 bg-battleship-gray rounded mb-2 opacity-50" />
        <div className="h-3 bg-battleship-gray rounded opacity-30" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xs text-battleship-gray">
        <p className="inter-regular text-sm truncate">{error}</p>
      </div>
    );
  }

  const isActive = status !== "offline";

  return (
    <div className="flex flex-col gap-2 items-center sm:items-end w-full max-w-xs sm:ml-auto">
      <div
        className={isActive ? "text-soft-royal-blue" : "text-battleship-gray"}
      >
        <h2 className="inter-bold text-center sm:text-right">
          {isActive ? "Currently Active" : "Idle"}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3 space-y-2 sm:space-y-0 max-w-full group">
        <div className="flex-1 min-w-0 text-center sm:text-right">
          <h4 className="sg-semibold text-silver text-sm truncate">
            {activity?.name || "No active app"}
          </h4>

          <p className="inter-regular text-battleship-gray text-xs truncate">
            {activity ? elapsed : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscordActivityWidget;
