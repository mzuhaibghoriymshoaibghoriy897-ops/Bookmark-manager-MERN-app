import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "./services/api";
import useDebounce from "./hooks/useDebounce";
import BookmarkForm from "./components/BookmarkForm";
import BookmarkCard from "./components/BookmarkCard";
import FilterBar from "./components/FilterBar";
import Toasts from "./components/Toasts";

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTag, setActiveTag] = useState("all");
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const debouncedSearch = useDebounce(search);

  const [editing, setEditing] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || "light");
  const toastId = useRef(0);

  const notify = useCallback((message, type = "success") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const loadTags = useCallback(async () => {
    try {
      setTags(await api.getTags());
    } catch {
      /* tags are non-critical */
    }
  }, []);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getBookmarks({
        tag: activeTag,
        search: debouncedSearch,
        favorite: favoritesOnly,
      });
      setBookmarks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTag, debouncedSearch, favoritesOnly]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // If the active tag disappears (last bookmark deleted/retagged), go back to "all"
  useEffect(() => {
    if (activeTag !== "all" && tags.length && !tags.some((t) => t.tag === activeTag)) {
      setActiveTag("all");
    }
  }, [tags, activeTag]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await api.updateBookmark(editing._id, data);
        setEditing(null);
        notify("Bookmark updated");
      } else {
        await api.createBookmark(data);
        notify("Bookmark saved");
      }
      await Promise.all([loadBookmarks(), loadTags()]);
    } catch (err) {
      notify(err.message, "error");
      throw err; // lets the form keep its values
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const updated = await api.toggleFavorite(id);
      // In "favorites only" mode an un-starred item should leave the list
      setBookmarks((list) =>
        favoritesOnly && !updated.isFavorite
          ? list.filter((b) => b._id !== id)
          : list.map((b) => (b._id === id ? updated : b))
      );
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bookmark?")) return;
    try {
      await api.deleteBookmark(id);
      setBookmarks((list) => list.filter((b) => b._id !== id));
      if (editing?._id === id) setEditing(null);
      notify("Bookmark deleted");
      loadTags();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const handleEdit = (bookmark) => {
    setEditing(bookmark);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setActiveTag("all");
    setSearch("");
    setFavoritesOnly(false);
  };

  const filtersActive = activeTag !== "all" || search || favoritesOnly;

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo">🔖</span>
          <div>
            <h1>Linkly</h1>
            <p>Save, tag and find your favorite links.</p>
          </div>
        </div>
        <button
          className="icon-btn theme"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <BookmarkForm
            editing={editing}
            tags={tags}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <section className="content">
          <FilterBar
            search={search}
            onSearch={setSearch}
            favoritesOnly={favoritesOnly}
            onToggleFavorites={() => setFavoritesOnly((v) => !v)}
            tags={tags}
            activeTag={activeTag}
            onTagChange={setActiveTag}
          />

          {error && (
            <div className="state error-state">
              <p>{error}</p>
              <button className="btn primary" onClick={loadBookmarks}>
                Try again
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card skeleton" />
              ))}
            </div>
          )}

          {!error && !loading && bookmarks.length === 0 && (
            <div className="state">
              <div className="emoji">📭</div>
              <h3>{filtersActive ? "No matching bookmarks" : "No bookmarks yet"}</h3>
              <p>
                {filtersActive
                  ? "Try a different search or tag."
                  : "Add your first link using the form."}
              </p>
              {filtersActive && (
                <button className="btn ghost" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!error && !loading && bookmarks.length > 0 && (
            <div className="list">
              {bookmarks.map((b) => (
                <BookmarkCard
                  key={b._id}
                  bookmark={b}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onTagClick={setActiveTag}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
