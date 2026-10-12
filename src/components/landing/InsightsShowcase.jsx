import Icon from '../Icon';

/* Illustrative figures for the landing page only; real charts live on the Reports page. */
const MONTHS = [
  { label: 'May', income: 72, expense: 48 },
  { label: 'Jun', income: 80, expense: 52 },
  { label: 'Jul', income: 68, expense: 55 },
  { label: 'Aug', income: 84, expense: 46 },
  { label: 'Sep', income: 78, expense: 58 },
  { label: 'Oct', income: 86, expense: 44 },
];

const POINTS = [
  { icon: 'pie-chart', text: 'See which categories take the biggest share of your spending.' },
  { icon: 'bar-chart', text: 'Compare income and expenses month by month.' },
  { icon: 'trending-up', text: 'Watch your savings rate move as your habits change.' },
];

export default function InsightsShowcase() {
  return (
    <section id="insights" className="section">
      <div className="container insights-showcase">
        <div className="insights-showcase__copy">
          <p className="eyebrow">Financial insights</p>
          <h2 className="section__title">Know where your money goes, not just how much is left</h2>
          <p className="section__lead">
            Finora turns your transactions into clear charts and short, readable summaries. Spot patterns early, notice what changed since last month, and decide what to adjust.
          </p>
          <ul className="check-list">
            {POINTS.map((point) => (
              <li key={point.text}>
                <span className="check-list__icon">
                  <Icon name={point.icon} size={18} />
                </span>
                {point.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="insights-showcase__visual" role="img" aria-label="Illustration of a monthly income versus expenses bar chart with an insight about spending">
          <div className="report-preview" aria-hidden="true">
            <p className="report-preview__title">Income vs expenses</p>
            <div className="report-preview__bars">
              {MONTHS.map((month) => (
                <div key={month.label} className="report-preview__group">
                  <div className="report-preview__pair">
                    <span className="report-preview__bar report-preview__bar--income" style={{ height: `${month.income}%` }} />
                    <span className="report-preview__bar report-preview__bar--expense" style={{ height: `${month.expense}%` }} />
                  </div>
                  <small>{month.label}</small>
                </div>
              ))}
            </div>
            <div className="report-preview__insight">
              <Icon name="bulb" size={18} />
              <p>Food is your highest spending category this month.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
