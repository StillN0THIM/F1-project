import { useState, useEffect } from "react";
import api from "../utils/api";

function CircuitMap({ year, round }) {
    const [points, setPoints] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/races/${year}/${round}/tracking`)
            .then(res => {
                const tracking = res.data.tracking;
                // Just grab the first driver's full trace for now — proving the shape works
                const firstDriverKey = Object.keys(tracking)[0];
                if (!firstDriverKey) {
                    setError("No tracking data available for this race.");
                    return;
                }
                setPoints(tracking[firstDriverKey]);
            })
            .catch(err => {
                console.error("Failed to fetch tracking data:", err);
                setError("Failed to load circuit tracking data.");
            });
    }, [year, round]);

    if (error) return <div className="text-muted text-sm p-6">{error}</div>;
    if (!points) return <div className="text-muted text-sm p-6">Loading circuit map...</div>;

    // Raw OpenF1 coordinates are in arbitrary units (roughly meters) and not scaled
    // to any particular SVG viewport — so we normalize them to fit a 0-1000 box
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const padding = 40;
    const viewSize = 1000;

    const scaleX = (x) => padding + ((x - minX) / rangeX) * (viewSize - padding * 2);
    // OpenF1's y-axis is flipped relative to typical screen coordinates, so we invert it
    const scaleY = (y) => padding + (1 - (y - minY) / rangeY) * (viewSize - padding * 2);

    const pathD = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.x)} ${scaleY(p.y)}`)
        .join(" ");

    return (
        <div className="bg-surface rounded p-4">
            <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="w-full h-auto max-h-[500px] mx-auto" style={{ maxWidth: "600px", display: "block" }}>
                <path
                    d={pathD}
                    fill="none"
                    stroke="#e10600"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export default CircuitMap;