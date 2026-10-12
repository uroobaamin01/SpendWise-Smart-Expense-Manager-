import CategoryIcon from './CategoryIcon';
import Icon from './Icon';

export default function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <article className="card category-card">
      <CategoryIcon icon={category.icon} tone={category.type} />
      <div className="category-card__text">
        <h3 className="category-card__name">{category.name}</h3>
        <p className="category-card__type">{category.type === 'income' ? 'Income' : 'Expense'}</p>
      </div>
      <div className="row-actions">
        <button type="button" className="icon-button" onClick={() => onEdit(category)} aria-label={`Edit ${category.name}`}>
          <Icon name="edit" size={18} />
        </button>
        <button type="button" className="icon-button icon-button--danger" onClick={() => onDelete(category)} aria-label={`Delete ${category.name}`}>
          <Icon name="trash" size={18} />
        </button>
      </div>
    </article>
  );
}
