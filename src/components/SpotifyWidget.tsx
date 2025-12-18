import React, { useState, useEffect } from 'react';
import { Music, ExternalLink } from 'lucide-react';

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  songUrl: string;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const SpotifyWidget: React.FC = () => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(`${API_URL}/now-playing`);
      const data = await response.json();
      setTrack(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch current song');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 animate-pulse w-full max-w-xs">
        <div className="w-12 h-12 bg-battleship-gray rounded-lg opacity-50 shrink-0"></div>
        <div className="flex-1 w-full">
          <div className="h-4 bg-battleship-gray rounded w-full sm:w-32 mb-2 opacity-50"></div>
          <div className="h-3 bg-battleship-gray rounded w-full sm:w-24 opacity-30"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-battleship-gray w-full max-w-xs ">
        <div className="w-12 h-12 bg-battleship-gray bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
          <Music className="w-5 h-5" />
        </div>
        <p className="inter-regular text-sm text-center sm:text-left truncate w-full">
          {error}
        </p>
      </div>
    );
  }

  // Not playing state
  if (!track?.isPlaying) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-battleship-gray w-full max-w-xs">
        <div className="w-12 h-12 bg-battleship-gray bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
          <Music className="w-5 h-5" />
        </div>
        <p className="inter-medium text-sm text-center sm:text-left truncate w-full">
          Currently not listening to anything
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3 space-y-2 sm:space-y-0 max-w-full sm:max-w-xs group">
      {/* Album Art (clickable on mobile) */}
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative shrink-0"
      >
        <img
          src={track.albumArt}
          alt="Album cover"
          className="w-12 h-12 rounded-lg shadow-md hover:opacity-90 transition"
        />
      </a>

      {/* Track Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h4 className="sg-semibold text-silver text-sm truncate">{track.title}</h4>
        <p className="inter-regular text-battleship-gray text-xs truncate">
          {track.artist}
        </p>
      </div>

      {/* Spotify Link (hidden on very small screens, shown on sm+) */}
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex text-soft-royal-blue hover:text-blue-crayola transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer"
        title="Open in Spotify"
      >
        <ExternalLink className="w-5 h-5" />
      </a>
    </div>
  );
};

export default SpotifyWidget;
