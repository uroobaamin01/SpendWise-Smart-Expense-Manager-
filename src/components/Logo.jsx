import { Link } from 'react-router-dom';

export function LogoMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path d="M10 22V10h11M10 16h8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="22" cy="21" r="2.4" fill="#d9a441" />
    </svg>
  );
}

export default function Logo({ to = '/', light = false, className = '' }) {
  return (
    <Link to={to} className={`logo ${light ? 'logo--light' : ''} ${className}`.trim()} aria-label="Finora home">
      <LogoMark />
      <span className="logo__text">Finora</span>
    </Link>
  );
}
