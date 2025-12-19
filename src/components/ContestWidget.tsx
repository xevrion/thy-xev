import React, { useState, useEffect } from 'react';

interface Contest {
    name: string;
    startTimeSeconds: number;
    durationSeconds: number;
    phase: string; // 'BEFORE', 'CODING', etc.
    url: string;
}

const CodeforcesWidget: React.FC = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContests = async () => {
        try {
            const response = await fetch('https://codeforces.com/api/contest.list?gym=false');
            const data = await response.json();

            if (data.status === 'OK') {
                const today = new Date();
                const contestsToday = data.result.filter((contest: Contest) => {
                    if (contest.phase !== 'BEFORE') return false;

                    const start = new Date(contest.startTimeSeconds * 1000);
                    const startIST = start.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
                    const todayIST = today.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

                    return startIST === todayIST;
                });

                setContests(contestsToday);
                console.log(contestsToday);
                setError(null);
            } else {
                setError('Failed to fetch contests');
            }
        } catch (err) {
            setError('Unable to fetch Codeforces contests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
        const interval = setInterval(fetchContests, 10 * 60 * 1000); // Refresh every 10 min
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="animate-pulse inter-bold text-battleship-gray text-xl">Loading contests...</div>;
    }

    if (error) {
        return <div className="inter-bold text-battleship-gray text-xl">{error}</div>;
    }

    if (contests.length === 0) {
        return <div className="inter-bold text-battleship-gray text-xl">No contests today</div>;
    }

    return (
        <div className="flex flex-col gap-2">


            <div className="flex flex-col gap-2">
                <p className='inter-bold text-battleship-gray text-xl'>Upcoming/Live Contests:</p>
                {contests.map((contest) => {
                    const start = new Date(contest.startTimeSeconds * 1000);
                    const timeIST = start.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'Asia/Kolkata',
                    });
                    return (
                        <a
                            key={contest.name}
                            href={`https://codeforces.com/contests/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:scale-[1.03] transition-all duration-200 ease-in-out w-full max-w-md"
                        >
                            {/* Dot Indicator */}
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shrink-0"></div>
                            {/* Contest Info */}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm md:text-base inter-medium text-battleship-gray truncate">{contest.name}</span>
                                <span className="text-xs md:text-sm text-battleship-gray opacity-80 inter-medium">{timeIST} IST</span>
                            </div>
                        </a>
                    );
                })}
            </div>



        </div>
    );
};

export default CodeforcesWidget;
