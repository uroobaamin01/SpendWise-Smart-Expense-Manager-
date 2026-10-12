import Icon from './Icon';

export default function Pagination({ page, pageCount, onChange, total, pageSize }) {
  if (pageCount <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination__summary">
        Showing {from}–{to} of {total}
      </p>
      <div className="pagination__controls">
        <button type="button" className="icon-button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
          <Icon name="chevron-left" size={18} />
        </button>
        <span className="pagination__page">
          Page {page} of {pageCount}
        </span>
        <button type="button" className="icon-button" onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </nav>
  );
}
