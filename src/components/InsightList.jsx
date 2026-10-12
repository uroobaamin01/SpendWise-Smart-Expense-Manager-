import Icon from './Icon';

/** Renders the output of generateInsights(). */
export default function InsightList({ insights, limit }) {
  const items = limit ? insights.slice(0, limit) : insights;
  return (
    <ul className="insight-list">
      {items.map((insight) => (
        <li key={insight.id} className={`insight insight--${insight.tone}`}>
          <span className="insight__icon">
            <Icon name={insight.icon} size={18} />
          </span>
          <p>{insight.text}</p>
        </li>
      ))}
    </ul>
  );
}
