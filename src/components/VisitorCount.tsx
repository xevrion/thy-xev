import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const VisitorCount = () => {
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        // increment on mount (rate limited server-side to 1/hour per IP)
        fetch(`${API_URL}/views`, { method: "POST" })
            .then((r) => r.json())
            .then((d) => setTotal(d.total ?? null))
            .catch(() => {
                // fallback: just fetch
                fetch(`${API_URL}/views`)
                    .then((r) => r.json())
                    .then((d) => setTotal(d.total ?? null))
                    .catch(() => {});
            });
    }, []);

    if (total === null) return null;

    return (
        <p className="inter-regular text-battleship-gray/60 text-sm">
            {total.toLocaleString()} {total === 1 ? "visitor" : "visitors"} so far
        </p>
    );
};

export default VisitorCount;
