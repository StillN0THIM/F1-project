import { useState, useEffect } from "react";
import api from "../utils/api";

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news")
      .then(res => {
        setArticles(res.data);
        // News comes back as a flat array — no nested MRData like Jolpica
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch news:", err));
  }, []);

  if (loading) return <div>Loading news...</div>;

  return (
    <div>
      <h1>F1 News</h1>
      {articles.map((article, index) => (
        <div key={index}>
          <a href={article.url} target="_blank" rel="noreferrer">
            <h3>{article.title}</h3>
          </a>
          {/* target="_blank" opens the article in a new tab */}
          <p>{article.source} — {new Date(article.published).toLocaleDateString()}</p>
          {/* Converts the raw date into a readable format like 7/9/2026 */}
        </div>
      ))}
    </div>
  );
}

export default News;