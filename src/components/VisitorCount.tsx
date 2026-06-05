'use client'

import { useState, useEffect } from "react";

const VisitorCount = () => {
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        const alreadyCounted = localStorage.getItem("visited");
        if (alreadyCounted) {
            fetch('/api/views')
                .then((r) => r.json())
                .then((d) => setTotal(d.total ?? null))
                .catch(() => {});
        } else {
            fetch('/api/views', { method: "POST" })
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
