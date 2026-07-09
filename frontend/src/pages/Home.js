import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function Home() {
  const [standings, setStandings] = useState([]);
  const [nextRace, setNextRace] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/standings"),
      api.get("/calendar"),
      api.get("/news")
    ]).then(([standingsRes, calendarRes, newsRes]) => {
      const drivers = standingsRes.data.drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      setStandings(drivers.slice(0, 5));

      const races = calendarRes.data.MRData.RaceTable.Races;
      const today = new Date();
      const next = races.find(r => new Date(r.date) >= today);
      setNextRace(next);

      setNews(newsRes.data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted">
      Loading...
    </div>
  );

  return (
    <div className="space-y-10">

      {/* Hero */}
      <div className="border-l-4 border-f1red pl-6 py-2">
        <p className="text-muted text-sm font-display tracking-widest uppercase mb-1">2025 Season</p>
        <h1 className="font-display text-6xl font-bold uppercase tracking-wide leading-none">F1 Dashboard</h1>
        <p className="text-muted mt-2">Everything you need to know about the current season.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Next race card */}
        {nextRace && (
          <div className="bg-surface rounded p-6">
            <p className="text-f1red text-xs font-display tracking-widest uppercase mb-3">Next Race</p>
            <h2 className="font-display text-3xl font-bold uppercase mb-1">{nextRace.raceName}</h2>
            <p className="text-muted text-sm mb-4">{nextRace.Circuit.circuitName} — {nextRace.Circuit.Location.country}</p>
            <p className="font-display text-2xl font-semibold text-white">
              {new Date(nextRace.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        )}

        {/* Top 5 standings card */}
        <div className="bg-surface rounded p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-f1red text-xs font-display tracking-widest uppercase">Driver Standings</p>
            <Link to="/standings" className="text-muted text-xs hover:text-white transition-colors">View all →</Link>
          </div>
          <div className="space-y-2">
            {standings.map(entry => (
              <div key={entry.Driver.driverId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-muted w-6">{entry.position}</span>
                  <span className="font-medium text-sm">
                    {entry.Driver.givenName} <span className="font-bold">{entry.Driver.familyName}</span>
                  </span>
                </div>
                <span className="font-display font-bold text-lg">{entry.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest news */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-f1red text-xs font-display tracking-widest uppercase">Latest News</p>
          <Link to="/news" className="text-muted text-xs hover:text-white transition-colors">View all →</Link>
        </div>
        <div className="space-y-2">
          {news.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noreferrer"
              className="flex items-start justify-between gap-6 px-6 py-3 bg-surface rounded hover:bg-white/5 transition-colors group">
              <div className="flex-1 min-w-0">
                <span className="text-f1red text-xs font-display tracking-widest uppercase mb-1 block">{article.source}</span>
                <p className="text-sm font-medium text-white group-hover:text-f1red transition-colors leading-snug">{article.title}</p>
              </div>
              <p className="text-muted text-xs shrink-0 mt-1">
                {new Date(article.published).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;
