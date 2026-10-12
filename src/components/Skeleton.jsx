export function Skeleton({ width = '100%', height = 16, radius = 8, className = '' }) {
  return <span className={`skeleton ${className}`.trim()} style={{ width, height, borderRadius: radius }} aria-hidden="true" />;
}

/** Placeholder rows shown while a list is loading. */
export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="skeleton-list" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-row">
          <Skeleton width={44} height={44} radius={14} />
          <div className="skeleton-row__text">
            <Skeleton width="45%" height={14} />
            <Skeleton width="30%" height={12} />
          </div>
          <Skeleton width={72} height={16} />
        </div>
      ))}
    </div>
  );
}

/** Placeholder blocks for stat cards and chart areas. */
export function CardGridSkeleton({ count = 4, height = 120 }) {
  return (
    <div className="skeleton-grid" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={height} radius={20} />
      ))}
    </div>
  );
}
