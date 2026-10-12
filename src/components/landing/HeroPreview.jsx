import Icon from '../Icon';

/* Decorative product preview for the landing page. Illustrative figures only. */
const SEGMENTS = [
  { label: 'Rent', value: 900, color: '#0b6b4f' },
  { label: 'Food', value: 408, color: '#d9a441' },
  { label: 'Shopping', value: 240, color: '#2a9d8f' },
  { label: 'Bills', value: 125, color: '#9fd3bb' },
];

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL = SEGMENTS.reduce((sum, segment) => sum + segment.value, 0);

const RECENT = [
  { title: 'Salary', meta: 'Today · Bank Transfer', amount: '+$2,500.00', tone: 'income', icon: 'briefcase' },
  { title: 'Groceries', meta: 'Yesterday · Debit Card', amount: '−$120.00', tone: 'expense', icon: 'coffee' },
  { title: 'Electricity Bill', meta: 'Mon · Bank Transfer', amount: '−$80.00', tone: 'expense', icon: 'zap' },
];

export default function HeroPreview() {
  let offset = 0;

  return (
    <div className="hero-preview" role="img" aria-label="Preview of the Finora app showing monthly savings, a spending breakdown and recent transactions">
      <div className="hero-preview__main" aria-hidden="true">
        <div className="hero-preview__head">
          <div>
            <p className="hero-preview__label">Net savings this month</p>
            <p className="hero-preview__value">$1,586.01</p>
          </div>
          <span className="hero-preview__pill">
            <Icon name="trending-up" size={14} /> 36% saved
          </span>
        </div>

        <div className="hero-preview__chart">
          <svg viewBox="0 0 100 100" className="hero-preview__donut">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#eef2ed" strokeWidth="14" />
            {SEGMENTS.map((segment) => {
              const length = (segment.value / TOTAL) * CIRCUMFERENCE;
              const circle = (
                <circle
                  key={segment.label}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="14"
                  strokeDasharray={`${Math.max(length - 1.5, 0)} ${CIRCUMFERENCE - length + 1.5}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 50 50)"
                />
              );
              offset += length;
              return circle;
            })}
          </svg>
          <ul className="hero-preview__legend">
            {SEGMENTS.map((segment) => (
              <li key={segment.label}>
                <span style={{ background: segment.color }} />
                {segment.label}
                <strong>${segment.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <ul className="hero-preview__list">
          {RECENT.map((item) => (
            <li key={item.title}>
              <span className={`category-icon category-icon--${item.tone}`} style={{ width: 36, height: 36 }}>
                <Icon name={item.icon} size={16} />
              </span>
              <div>
                <p>{item.title}</p>
                <small>{item.meta}</small>
              </div>
              <strong className={`tx-amount tx-amount--${item.tone}`}>{item.amount}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-preview__float hero-preview__float--budget" aria-hidden="true">
        <p>
          <Icon name="target" size={14} /> Food budget
        </p>
        <strong>$408 / $500</strong>
        <div className="progress progress--warning">
          <span className="progress__bar" style={{ width: '82%' }} />
        </div>
      </div>

      <div className="hero-preview__float hero-preview__float--goal" aria-hidden="true">
        <span className="hero-preview__goal-icon">
          <Icon name="check-circle" size={18} />
        </span>
        <div>
          <p>Savings goal</p>
          <strong>Ahead of plan</strong>
        </div>
      </div>
    </div>
  );
}
