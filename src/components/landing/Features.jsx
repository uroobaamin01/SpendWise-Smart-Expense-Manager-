import Icon from '../Icon';

const FEATURES = [
  { icon: 'arrow-up-right', title: 'Expense Tracking', text: 'Log every purchase in seconds and sort it into categories that match how you actually live.' },
  { icon: 'arrow-down-left', title: 'Income Management', text: 'Record salary, freelance work and side income so you always know what is coming in.' },
  { icon: 'target', title: 'Smart Budgets', text: 'Set an overall monthly budget and limits per category, with gentle warnings before you overspend.' },
  { icon: 'bulb', title: 'Financial Insights', text: 'Plain-language takeaways, like your top spending category or how your savings are trending.' },
  { icon: 'clock', title: 'Transaction History', text: 'Search, filter and sort your full history by category, date, amount or payment method.' },
  { icon: 'pie-chart', title: 'Spending Analysis', text: 'Clear charts show where your money goes and how each month compares with the last.' },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section__intro">
          <p className="eyebrow">Features</p>
          <h2 className="section__title">Everything you need to understand your money</h2>
          <p className="section__lead">Simple tools that work together, without the spreadsheet.</p>
        </div>
        <ul className="feature-grid">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="feature-card">
              <span className="feature-card__icon">
                <Icon name={feature.icon} size={22} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
