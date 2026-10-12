import Icon from './Icon';

/** tone: neutral | positive | negative | gold */
export default function StatCard({ label, value, icon, tone = 'neutral', hint }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <p className="stat-card__label">{label}</p>
        {icon && (
          <span className="stat-card__icon">
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <p className="stat-card__value">{value}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
    </article>
  );
}
