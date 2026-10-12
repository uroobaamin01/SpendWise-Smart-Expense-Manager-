import { Link } from 'react-router-dom';
import Icon from './Icon';
import Logo from './Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { to: '/#features', label: 'Features' },
      { to: '/#how-it-works', label: 'How it works' },
      { to: '/#insights', label: 'Insights' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
    ],
  },
];

const SOCIAL = [
  { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com' },
  { name: 'GitHub', icon: 'github', href: 'https://github.com' },
  { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>Take control of your money with a calm, clear view of what comes in and what goes out.</p>
          <ul className="footer__social" aria-label="Social media">
            {SOCIAL.map((item) => (
              <li key={item.name}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name} className="icon-button">
                  <Icon name={item.icon} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__columns" aria-label="Footer">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="footer__heading">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} Finora. All rights reserved.</p>
      </div>
    </footer>
  );
}
