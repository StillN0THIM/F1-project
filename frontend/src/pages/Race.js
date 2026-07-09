import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

function Race() {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [raceInfo, setRaceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/races/${id}`)
      .then(res => {
        const race = res.data.MRData.RaceTable.Races[0];
        setRaceInfo(race);
        setResults(race.Results);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch race:", err));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted">
      Loading race results...
    </div>
  );

  return (
    <div>
      <Link to="/calendar" className="text-muted text-sm hover:text-white transition-colors mb-6 inline-block">
        ← Back to Calendar
      </Link>
      <div className="mb-8">
        <p className="text-f1red text-sm font-display tracking-widest uppercase mb-1">Round {id} — {raceInfo.date}</p>
        <h1 className="font-display text-5xl font-bold uppercase tracking-wide">{raceInfo.raceName}</h1>
        <p className="text-muted mt-1">{raceInfo.Circuit.circuitName} — {raceInfo.Circuit.Location.locality}, {raceInfo.Circuit.Location.country}</p>
      </div>
      <div className="bg-surface rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wider border-b border-white/10">
              <th className="px-4 py-3 text-left w-12">Pos</th>
              <th className="px-4 py-3 text-left">Driver</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-right">Time / Status</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((entry, i) => (
              <tr key={entry.Driver.driverId} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? "text-white" : "text-white/80"}`}>
                <td className="px-4 py-3 font-display text-lg text-muted">{entry.position}</td>
                <td className="px-4 py-3 font-medium">
                  {entry.Driver.givenName} <span className="font-bold">{entry.Driver.familyName}</span>
                </td>
                <td className="px-4 py-3 text-muted">{entry.Constructor.name}</td>
                <td className="px-4 py-3 text-right font-display">{entry.Time ? entry.Time.time : entry.status}</td>
                <td className="px-4 py-3 text-right font-bold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Race;
