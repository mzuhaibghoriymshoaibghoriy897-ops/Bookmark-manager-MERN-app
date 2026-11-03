export default function FilterBar({
  search,
  onSearch,
  favoritesOnly,
  onToggleFavorites,
  tags,
  activeTag,
  onTagChange,
}) {
  const total = tags.reduce((sum, t) => sum + t.count, 0);

  return (
    <section className="filters">
      <div className="filters-row">
        <div className="search">
          <span aria-hidden>🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by title…"
            aria-label="Search bookmarks by title"
          />
        </div>

        <button
          className={`btn toggle ${favoritesOnly ? "on" : ""}`}
          onClick={onToggleFavorites}
          aria-pressed={favoritesOnly}
        >
          {favoritesOnly ? "★" : "☆"} Favorites only
        </button>
      </div>

      <div className="chips" role="tablist" aria-label="Filter by tag">
        <button
          className={`chip ${activeTag === "all" ? "active" : ""}`}
          onClick={() => onTagChange("all")}
        >
          All <span className="count">{total}</span>
        </button>
        {tags.map((t) => (
          <button
            key={t.tag}
            className={`chip ${activeTag === t.tag ? "active" : ""}`}
            onClick={() => onTagChange(t.tag)}
          >
            #{t.tag} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
