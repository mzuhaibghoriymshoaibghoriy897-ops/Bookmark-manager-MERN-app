function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    if (seconds >= secs) return `${Math.floor(seconds / secs)}${label} ago`;
  }
  return "just now";
}

export default function BookmarkCard({ bookmark, onToggleFavorite, onDelete, onEdit, onTagClick }) {
  const host = getHost(bookmark.url);

  return (
    <article className="card bookmark">
      <img
        className="favicon"
        src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
        alt=""
        loading="lazy"
        width="40"
        height="40"
      />

      <div className="bookmark-body">
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="bookmark-title">
          {bookmark.title}
        </a>
        <div className="bookmark-meta">
          <span className="host">{host}</span>
          <span className="dot">•</span>
          <span>{timeAgo(bookmark.createdAt)}</span>
        </div>
        <button className="badge" onClick={() => onTagClick(bookmark.tag)} title="Filter by this tag">
          #{bookmark.tag}
        </button>
      </div>

      <div className="bookmark-actions">
        <button
          className={`icon-btn star ${bookmark.isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(bookmark._id)}
          aria-label={bookmark.isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={bookmark.isFavorite}
          title="Favorite"
        >
          {bookmark.isFavorite ? "★" : "☆"}
        </button>
        <button className="icon-btn" onClick={() => onEdit(bookmark)} aria-label="Edit" title="Edit">
          ✎
        </button>
        <button
          className="icon-btn danger"
          onClick={() => onDelete(bookmark._id)}
          aria-label="Delete"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </article>
  );
}
