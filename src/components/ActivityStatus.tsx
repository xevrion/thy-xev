import React, { useState, useEffect } from 'react';
import { Monitor, Keyboard, Mouse } from 'lucide-react';

interface ActivityData {
  keystrokes: number;
  mouse_movements: number;
  left_mouse_clicks: number;
  right_mouse_clicks: number;
  session_duration_hours: number;
  uptime: string;
  last_updated: string;
}

const ActivityWidget: React.FC = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3002/activity');
      const data = await response.json();
      setActivity(data);
      setError(null);
    } catch (err) {
      setError('PC tracker offline');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3 animate-pulse mt-5">
        <Monitor className="w-4 h-4 text-battleship-gray opacity-50" />
        <div className="h-3 bg-battleship-gray rounded w-20 opacity-50"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="flex items-center space-x-3 text-battleship-gray mt-5">
        <Monitor className="w-4 h-4 opacity-50" />
        <span className="inter-regular text-sm opacity-70">Stats unavailable</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-5 w-full max-w-xs sm:max-w-sm md:max-w-md ">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="inter-bold text-2xl text-silver">Stats</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
        {/* Keystrokes */}
        <div className="flex items-center space-x-2">
          <Keyboard className="w-4 h-4 text-battleship-gray hover:scale-[1.1] duration-200" />
          <div>
            <div className="sg-semibold text-silver">
              {formatNumber(activity.keystrokes)}
            </div>
            <div className="inter-regular text-battleship-gray opacity-70">
              keys
            </div>
          </div>
        </div>

        {/* Mouse Activity */}
        <div className="flex flex-wrap gap-4 ">
          <div className="flex items-center space-x-2">
            <Mouse className="w-4 h-4 text-battleship-gray hover:scale-[1.1] duration-200" />
            <div>
              <div className="sg-semibold text-silver">
                {formatNumber(activity.left_mouse_clicks)}
              </div>
              <div className="inter-regular text-battleship-gray opacity-70">
                left
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              <div className="sg-semibold  text-silver">
                {formatNumber(activity.right_mouse_clicks)}
              </div>
              <div className="inter-regular text-battleship-gray opacity-70">
                right
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between text-md text-battleship-gray opacity-70">
        <span className="inter-regular">
          Uptime: {activity.session_duration_hours}h
        </span>
      </div>
    </div>
  );
};

export default ActivityWidget;
