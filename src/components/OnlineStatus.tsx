// import React, { useState, useEffect } from 'react';

// interface DiscordStatus {
//   discord_user: {
//     id: string;
//     username: string;
//     discriminator: string;
//     avatar: string;
//   };
//   discord_status: 'online' | 'idle' | 'dnd' | 'offline';
//   activities: Array<{
//     name: string;
//     type: number;
//     state?: string;
//     details?: string;
//   }>;
// }

// const DiscordWidget: React.FC = () => {
//   const [status, setStatus] = useState<DiscordStatus | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Replace with your Discord user ID
//   const DISCORD_USER_ID = "1121919048465268756";

//   const fetchDiscordStatus = async () => {
//     try {
//       const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
//       const data = await response.json();
      
//       if (data.success) {
//         setStatus(data.data);
//         setError(null);
//       } else {
//         setError('Failed to fetch Discord status');
//       }
//     } catch (err) {
//       setError('Unable to connect to Discord');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDiscordStatus();
//     // Update every 30 seconds
//     const interval = setInterval(fetchDiscordStatus, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const getStatusColor = (discordStatus: string) => {
//     switch (discordStatus) {
//       case 'online':
//         return 'bg-green-500';
//       case 'idle':
//         return 'bg-yellow-500';
//       case 'dnd':
//         return 'bg-red-500';
//       case 'offline':
//       default:
//         return 'bg-battleship-gray';
//     }
//   };

//   const getStatusText = (discordStatus: string) => {
//     switch (discordStatus) {
//       case 'online':
//         return 'Online';
//       case 'idle':
//         return 'Idle';
//       case 'dnd':
//         return 'DND';
//       case 'offline':
//       default:
//         return 'Offline/Sleeping';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center space-x-3 animate-pulse ">
//         <div className="w-3 h-3 bg-battleship-gray rounded-full opacity-50"></div>
//         <div className="h-3 bg-battleship-gray rounded w-10 opacity-50"></div>
//       </div>
//     );
//   }

//   if (error || !status) {
//     return (
//       <div className="flex items-center space-x-3 text-battleship-gray ">
//         <div className="w-3 h-3 bg-battleship-gray rounded-full opacity-50"></div>
//         <span className="inter-regular text-sm opacity-70">Discord status unavailable</span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center space-x-3 hover:scale-[1.05] duration-100">
//       {/* Status Indicator */}
//       <div className="relative">
//         <div className={`w-3 h-3 rounded-full ${getStatusColor(status.discord_status)}`}></div>
//         {status.discord_status === 'online' && (
//           <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(status.discord_status)} animate-ping opacity-75`}></div>
//         )}
//       </div>

//       {/* Status Text */}
//       <span className="inter-regular text-sm text-battleship-gray">
//         {getStatusText(status.discord_status)}
//       </span>
//     </div>
//   );
// };

// export default DiscordWidget;

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
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-3 h-3 bg-battleship-gray rounded-full opacity-50"></div>
        <div className="h-3 bg-battleship-gray rounded w-10 opacity-50"></div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="flex items-center space-x-2 text-battleship-gray">
        <div className="w-3 h-3 bg-battleship-gray rounded-full opacity-50"></div>
        <span className="inter-regular text-sm opacity-70">Discord unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-150">
      {/* Avatar (hidden on very small screens) */}
      {/* {status.discord_user.avatar && (
        <img
          src={`https://cdn.discordapp.com/avatars/${status.discord_user.id}/${status.discord_user.avatar}.png`}
          alt="Discord Avatar"
          className="hidden sm:block w-5 h-5 rounded-full border border-battleship-gray"
        />
      )} */}

      {/* Status Indicator */}
      <div className="relative shrink-0">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(status.discord_status)}`}></div>
        {status.discord_status === 'online' && (
          <div
            className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(status.discord_status)} animate-ping opacity-75`}
          ></div>
        )}
      </div>

      {/* Status Text */}
      <span className="inter-regular text-sm text-battleship-gray whitespace-nowrap">
        {getStatusText(status.discord_status)}
      </span>
    </div>
  );
};

export default DiscordWidget;
