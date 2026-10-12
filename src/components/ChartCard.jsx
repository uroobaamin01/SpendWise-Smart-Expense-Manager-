/** Card wrapper for charts: title, optional subtitle and a fixed-height plot area. */
export default function ChartCard({ title, subtitle, children, height = 280, className = '', footer }) {
  return (
    <section className={`card chart-card ${className}`.trim()}>
      <header className="chart-card__header">
        <h2 className="chart-card__title">{title}</h2>
        {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
      </header>
      <div className="chart-card__plot" style={{ height }}>
        {children}
      </div>
      {footer && <div className="chart-card__footer">{footer}</div>}
    </section>
  );
}
