'use client'

import React, { useState, useEffect } from 'react';

interface DiscordStatus {
  discord_user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
  }>;
}

const DiscordWidget: React.FC = () => {
  const [status, setStatus] = useState<DiscordStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DISCORD_USER_ID = "1121919048465268756";

  const fetchDiscordStatus = async () => {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await response.json();

      if (data.success) {
        setStatus(data.data);
        setError(null);
      } else {
        setError('Failed to fetch Discord status');
      }
    } catch (err) {
      setError('Unable to connect to Discord');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscordStatus();
    const interval = setInterval(fetchDiscordStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (discordStatus: string) => {
    switch (discordStatus) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'dnd':
        return 'bg-red-500';
      case 'offline':
      default:
        return 'bg-battleship-gray';
    }
  };

  const getStatusText = (discordStatus: string) => {
    switch (discordStatus) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'dnd':
        return 'Do Not Disturb';
      case 'offline':
      default:
        return 'Offline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 animate-pulse">
        <div className="w-2.5 h-2.5 bg-battleship-gray rounded-full opacity-40" />
        <div className="h-2.5 bg-battleship-gray rounded w-12 opacity-30" />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 bg-battleship-gray rounded-full opacity-40" />
        <span className="text-xs font-mono text-[var(--color-text-subtle)]">unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status.discord_status)}`} />
        {status.discord_status === 'online' && (
          <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${getStatusColor(status.discord_status)} animate-ping opacity-75`} />
        )}
      </div>
      <span className="text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap">
        {getStatusText(status.discord_status)}
      </span>
    </div>
  );
};

export default DiscordWidget;
