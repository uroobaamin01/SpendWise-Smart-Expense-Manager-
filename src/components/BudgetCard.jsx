import { useCurrency } from '../hooks/useCurrency';
import { useFinance } from '../hooks/useFinance';
import Badge from './Badge';
import CategoryIcon from './CategoryIcon';
import Icon from './Icon';
import ProgressBar from './ProgressBar';

const STATUS_COPY = {
  safe: { label: 'On track', badge: 'safe' },
  warning: { label: 'Nearing limit', badge: 'warning' },
  over: { label: 'Over budget', badge: 'over' },
};

/** `item` is `{ budget, progress }` from buildBudgetOverview(). The overall budget has `categoryId === null`. */
export default function BudgetCard({ item, onEdit, onDelete }) {
  const { format } = useCurrency();
  const { categoriesById } = useFinance();
  const { budget, progress } = item;
  const isOverall = budget.categoryId === null;
  const category = categoriesById[budget.categoryId];
  const title = isOverall ? 'Monthly budget' : category?.name || 'Category';
  const status = STATUS_COPY[progress.status];

  return (
    <article className={`card budget-card budget-card--${progress.status} ${isOverall ? 'budget-card--overall' : ''}`.trim()}>
      <header className="budget-card__header">
        <CategoryIcon icon={isOverall ? 'target' : category?.icon || 'tag'} tone="expense" />
        <div className="budget-card__heading">
          <h3 className="budget-card__title">{title}</h3>
          <Badge tone={status.badge}>{status.label}</Badge>
        </div>
        <div className="row-actions">
          <button type="button" className="icon-button" onClick={() => onEdit(budget)} aria-label={`Edit ${title} budget`}>
            <Icon name="edit" size={18} />
          </button>
          <button type="button" className="icon-button icon-button--danger" onClick={() => onDelete(budget)} aria-label={`Delete ${title} budget`}>
            <Icon name="trash" size={18} />
          </button>
        </div>
      </header>

      <ProgressBar value={progress.percent} status={progress.status} label={`${title} budget used`} />

      <dl className="budget-card__figures">
        <div>
          <dt>Budget</dt>
          <dd>{format(progress.limit)}</dd>
        </div>
        <div>
          <dt>Spent</dt>
          <dd>{format(progress.spent)}</dd>
        </div>
        <div>
          <dt>{progress.remaining < 0 ? 'Over by' : 'Remaining'}</dt>
          <dd className={progress.remaining < 0 ? 'text-negative' : 'text-positive'}>{format(Math.abs(progress.remaining))}</dd>
        </div>
      </dl>

      {progress.status !== 'safe' && (
        <p className={`budget-card__warning budget-card__warning--${progress.status}`} role="status">
          <Icon name="alert-triangle" size={16} />
          {progress.status === 'over'
            ? `You have spent ${format(Math.abs(progress.remaining))} more than planned.`
            : `You have used ${Math.round(progress.percent)}% of this budget.`}
        </p>
      )}
    </article>
  );
}
