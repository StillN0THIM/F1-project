import { useState, useEffect } from "react";
import api from "../utils/api";
import YearSelector from "../components/YearSelector";

function Standings() {
    const [drivers, setDrivers] = useState([]);
    const [constructors, setConstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("drivers");
    const [year, setYear] = useState(new Date().getFullYear());
    // tab controls which table is visible — drivers or constructors
    // year controls which season's data is fetched

    useEffect(() => {
        setLoading(true);
        api.get(`/standings?year=${year}`)
            .then(res => {
                const data = res.data;
                setDrivers(data.drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings);
                setConstructors(data.constructors.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch standings:", err));
    }, [year]);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-muted">
            Loading standings...
        </div>
    );

    return (
        <div>
            {/* Page header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-f1red text-sm font-display tracking-widest uppercase mb-1">{year} Season</p>
                    <h1 className="font-display text-5xl font-bold uppercase tracking-wide">Standings</h1>
                </div>
                <YearSelector year={year} onChange={setYear} />
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-6">
                {["drivers", "constructors"].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2 text-sm font-medium uppercase tracking-wider transition-colors
              ${tab === t
                                ? "bg-f1red text-white"
                                : "bg-surface text-muted hover:text-white"
                            }`}
                    // Active tab is red, inactive is dark grey
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Drivers table */}
            {tab === "drivers" && (
                <div className="bg-surface rounded overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-muted text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="px-4 py-3 text-left w-12">Pos</th>
                                <th className="px-4 py-3 text-left">Driver</th>
                                <th className="px-4 py-3 text-left">Team</th>
                                <th className="px-4 py-3 text-right">Points</th>
                                <th className="px-4 py-3 text-right">Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((entry, i) => (
                                <tr
                                    key={entry.Driver.driverId}
                                    className={`border-b border-white/5 hover:bg-white/5 transition-colors
                    ${i === 0 ? "text-white" : "text-white/80"}`}
                                // First place row is slightly brighter
                                >
                                    <td className="px-4 py-3 font-display text-lg text-muted">{entry.position}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {entry.Driver.givenName} <span className="font-bold">{entry.Driver.familyName}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{entry.Constructors[0].name}</td>
                                    <td className="px-4 py-3 text-right font-bold font-display text-lg">{entry.points}</td>
                                    <td className="px-4 py-3 text-right text-muted">{entry.wins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Constructors table */}
            {tab === "constructors" && (
                <div className="bg-surface rounded overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-muted text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="px-4 py-3 text-left w-12">Pos</th>
                                <th className="px-4 py-3 text-left">Team</th>
                                <th className="px-4 py-3 text-right">Points</th>
                                <th className="px-4 py-3 text-right">Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {constructors.map((entry, i) => (
                                <tr
                                    key={entry.Constructor.constructorId}
                                    className={`border-b border-white/5 hover:bg-white/5 transition-colors
                    ${i === 0 ? "text-white" : "text-white/80"}`}
                                >
                                    <td className="px-4 py-3 font-display text-lg text-muted">{entry.position}</td>
                                    <td className="px-4 py-3 font-medium">{entry.Constructor.name}</td>
                                    <td className="px-4 py-3 text-right font-bold font-display text-lg">{entry.points}</td>
                                    <td className="px-4 py-3 text-right text-muted">{entry.wins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Standings;