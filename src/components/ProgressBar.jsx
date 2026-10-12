/** status: safe | warning | over. `value` is a percentage and is capped at 100 for display. */
export default function ProgressBar({ value, status = 'safe', label }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`progress progress--${status}`}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className="progress__bar" style={{ width: `${width}%` }} />
    </div>
  );
}
