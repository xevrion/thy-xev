import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const VisitorCount = () => {
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        const alreadyCounted = localStorage.getItem("visited");
        if (alreadyCounted) {
            // just fetch the count, don't increment
            fetch(`${API_URL}/views`)
                .then((r) => r.json())
                .then((d) => setTotal(d.total ?? null))
                .catch(() => {});
        } else {
            // first visit — increment and mark
            fetch(`${API_URL}/views`, { method: "POST" })
                .then((r) => r.json())
                .then((d) => {
                    setTotal(d.total ?? null);
                    localStorage.setItem("visited", "1");
                })
                .catch(() => {});
        }
    }, []);

    if (total === null) return null;

    return (
        <p className="inter-regular text-battleship-gray/60 text-sm text-center md:text-left">
            {total.toLocaleString()} {total === 1 ? "visitor" : "visitors"} so far
        </p>
    );
};

export default VisitorCount;
