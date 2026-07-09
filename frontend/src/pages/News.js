import { useState, useEffect } from "react";
import api from "../utils/api";

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news")
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch news:", err));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted">
      Loading news...
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-f1red text-sm font-display tracking-widest uppercase mb-1">Latest</p>
        <h1 className="font-display text-5xl font-bold uppercase tracking-wide">F1 News</h1>
      </div>
      <div className="space-y-3">
        {articles.map((article, index) => (
          <a key={index} href={article.url} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-6 px-6 py-4 bg-surface rounded hover:bg-white/5 transition-colors group">
            <div className="flex-1 min-w-0">
              <span className="text-f1red text-xs font-display tracking-widest uppercase mb-1 block">
                {article.source}
              </span>
              <p className="font-medium text-white group-hover:text-f1red transition-colors leading-snug">
                {article.title}
              </p>
            </div>
            <p className="text-muted text-xs shrink-0 mt-1">
              {new Date(article.published).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default News;
