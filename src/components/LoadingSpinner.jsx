export default function LoadingSpinner({ label = 'Loading…', fullPage = false }) {
  return (
    <div className={`spinner-wrap ${fullPage ? 'spinner-wrap--full' : ''}`.trim()} role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="spinner-wrap__label">{label}</span>
    </div>
  );
}
