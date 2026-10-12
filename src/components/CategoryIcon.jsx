import Icon from './Icon';

/** Tinted rounded square holding a category icon. tone: income | expense | neutral */
export default function CategoryIcon({ icon, tone = 'neutral', size = 44 }) {
  return (
    <span className={`category-icon category-icon--${tone}`} style={{ width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </span>
  );
}
