import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MARKETING_LINKS } from '../routes/navItems';
import Button from './Button';
import Icon from './Icon';
import Logo from './Logo';

/** Marketing-site navigation. Collapses into a menu panel on small screens. */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`.trim()}>
      <div className="container navbar__inner">
        <Logo />

        <nav id="site-menu" className="navbar__menu" aria-label="Main">
          <ul className="navbar__links">
            {MARKETING_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="navbar__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="navbar__actions">
            {isAuthenticated ? (
              <Button to="/app" iconRight="arrow-right">
                Open Finora
              </Button>
            ) : (
              <>
                <Button to="/login" variant="ghost">
                  Log in
                </Button>
                <Button to="/register">Get Started</Button>
              </>
            )}
          </div>
        </nav>

        <button
          type="button"
          className="icon-button navbar__toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>
      </div>
    </header>
  );
}
