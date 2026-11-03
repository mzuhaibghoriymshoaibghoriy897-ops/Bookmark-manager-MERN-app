export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => onDismiss(t.id)}>
          {t.type === "error" ? "⚠️" : "✅"} {t.message}
        </div>
      ))}
    </div>
  );
}
