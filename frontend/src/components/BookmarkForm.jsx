import { useEffect, useState } from "react";

const empty = { title: "", url: "", tag: "" };

export default function BookmarkForm({ editing, tags, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Prefill when the user clicks "edit", reset when editing ends
  useEffect(() => {
    setForm(editing ? { title: editing.title, url: editing.url, tag: editing.tag } : empty);
    setErrors({});
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.title.trim()) er.title = "Title is required";
    if (!form.url.trim()) er.url = "URL is required";
    else if (!/^https?:\/\/\S+$/i.test(form.url.trim()))
      er.url = "URL must start with http:// or https://";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        url: form.url.trim(),
        tag: form.tag.trim() || "general",
      });
      setForm(empty); // clear after saving
    } catch {
      /* parent shows the error toast; keep the form filled */
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? "Edit bookmark" : "Add a bookmark"}</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. React Docs"
          className={errors.title ? "invalid" : ""}
          maxLength={120}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="url">URL</label>
        <input
          id="url"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://react.dev"
          className={errors.url ? "invalid" : ""}
          inputMode="url"
        />
        {errors.url && <span className="error">{errors.url}</span>}
      </div>

      <div className="field">
        <label htmlFor="tag">Tag <small>(optional)</small></label>
        <input
          id="tag"
          name="tag"
          value={form.tag}
          onChange={handleChange}
          placeholder="general"
          list="tag-suggestions"
          maxLength={30}
        />
        <datalist id="tag-suggestions">
          {tags.map((t) => (
            <option key={t.tag} value={t.tag} />
          ))}
        </datalist>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? "Saving…" : editing ? "Update" : "Save bookmark"}
        </button>
        {editing && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
