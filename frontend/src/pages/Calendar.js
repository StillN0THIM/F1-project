import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function Calendar() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/calendar")
            .then(res => {
                setRaces(res.data.MRData.RaceTable.Races);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch calendar:", err));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-muted">
            Loading calendar...
        </div>
    );

    const today = new Date();
    // Used to determine if a race is past, upcoming, or next

    return (
        <div>
            {/* Page header */}
            <div className="mb-8">
                <p className="text-f1red text-sm font-display tracking-widest uppercase mb-1">2025 Season</p>
                <h1 className="font-display text-5xl font-bold uppercase tracking-wide">Race Calendar</h1>
            </div>

            <div className="space-y-2">
                {races.map(race => {
                    const raceDate = new Date(race.date);
                    const isPast = raceDate < today;
                    const isNext = !isPast && races.find(r => new Date(r.date) >= today)?.round === race.round;
                    // isNext flags the very next upcoming race

                    return (
                        <Link
                            to={isPast ? `/races/${race.round}` : "#"}
                            key={race.round}
                            className={`flex items-center gap-4 px-6 py-4 bg-surface rounded 
                transition-colors group
                ${isPast ? "hover:bg-white/5 cursor-pointer" : "cursor-default opacity-60"}
                ${isNext ? "border-l-4 border-f1red" : "border-l-4 border-transparent"}`}
                        // Past races link to results, future races are greyed out
                        // Next race gets a red left border highlight
                        >
                            {/* Round number */}
                            <span className="font-display text-3xl font-bold text-muted w-10 shrink-0">
                                {race.round}
                            </span>

                            {/* Race info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white group-hover:text-f1red transition-colors truncate">
                                    {race.raceName}
                                </p>
                                <p className="text-muted text-sm">
                                    {race.Circuit.circuitName} — {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                                </p>
                            </div>

                            {/* Date */}
                            <div className="text-right shrink-0">
                                <p className={`font-display text-lg font-semibold ${isNext ? "text-f1red" : "text-white"}`}>
                                    {new Date(race.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                    {/* Formats date as "15 Mar" */}
                                </p>
                                <p className="text-muted text-xs uppercase tracking-wider">
                                    {isPast ? "Results →" : isNext ? "Next Race" : "Upcoming"}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;