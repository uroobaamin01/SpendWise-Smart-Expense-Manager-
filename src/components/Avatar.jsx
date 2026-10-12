import { getInitials } from '../utils/imageUtils';

export default function Avatar({ name, src, size = 40, className = '' }) {
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (src) {
    return <img src={src} alt={`${name || 'User'} profile`} className={`avatar ${className}`.trim()} style={style} />;
  }
  return (
    <span className={`avatar avatar--initials ${className}`.trim()} style={style} role="img" aria-label={`${name || 'User'} avatar`}>
      {getInitials(name)}
    </span>
  );
}
