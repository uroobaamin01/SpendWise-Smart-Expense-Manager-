import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_NAV_ITEMS } from '../routes/navItems';
import Avatar from './Avatar';
import Icon from './Icon';
import Logo from './Logo';
import Modal from './Modal';

const DESKTOP_ITEMS = APP_NAV_ITEMS.filter((item) => item.to !== '/app/profile');
const TAB_ITEMS = ['/app', '/app/transactions', '/app/budget'];
const MORE_ITEMS = APP_NAV_ITEMS.filter((item) => !TAB_ITEMS.includes(item.to));

const linkClass = ({ isActive }) => `app-bar__link ${isActive ? 'is-active' : ''}`.trim();
const tabClass = ({ isActive }) => `tab-bar__item ${isActive ? 'is-active' : ''}`.trim();

/**
 * Signed-in navigation.
 * Desktop: a top bar with pill links. Mobile / tablet: a slim top bar plus a bottom tab bar
 * with a central "add" action and a "More" sheet.
 */
export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null); // 'add' | 'more' | null

  const closeSheet = () => setSheet(null);
  const handleLogout = async () => {
    closeSheet();
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className="app-bar">
        <div className="container app-bar__inner">
          <Logo to="/app" />

          <nav className="app-bar__nav" aria-label="Main">
            {DESKTOP_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="app-bar__right">
            <NavLink to="/app/profile" className="app-bar__profile" aria-label="Your profile">
              <Avatar name={user?.name} src={user?.avatar} size={36} />
              <span className="app-bar__name">{user?.name?.split(' ')[0]}</span>
            </NavLink>
            <button type="button" className="icon-button app-bar__logout" onClick={handleLogout} aria-label="Log out">
              <Icon name="log-out" size={20} />
            </button>
          </div>
        </div>
      </header>

      <nav className="tab-bar" aria-label="Primary">
        <NavLink to="/app" end className={tabClass}>
          <Icon name="home" size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/app/transactions" className={tabClass}>
          <Icon name="list" size={22} />
          <span>Activity</span>
        </NavLink>
        <button type="button" className="tab-bar__add" onClick={() => setSheet('add')} aria-label="Add a transaction">
          <Icon name="plus" size={26} />
        </button>
        <NavLink to="/app/budget" className={tabClass}>
          <Icon name="target" size={22} />
          <span>Budget</span>
        </NavLink>
        <button type="button" className="tab-bar__item" onClick={() => setSheet('more')} aria-haspopup="dialog">
          <Icon name="more" size={22} />
          <span>More</span>
        </button>
      </nav>

      <Modal open={sheet === 'add'} onClose={closeSheet} title="Add a transaction" size="sm" variant="sheet">
        <div className="sheet-actions">
          <NavLink to="/app/income" className="sheet-action sheet-action--income" onClick={closeSheet} data-autofocus>
            <span className="sheet-action__icon">
              <Icon name="arrow-down-left" size={22} />
            </span>
            <span>
              <strong>Add income</strong>
              <small>Salary, freelance, gifts</small>
            </span>
          </NavLink>
          <NavLink to="/app/expenses" className="sheet-action sheet-action--expense" onClick={closeSheet}>
            <span className="sheet-action__icon">
              <Icon name="arrow-up-right" size={22} />
            </span>
            <span>
              <strong>Add expense</strong>
              <small>Food, bills, shopping</small>
            </span>
          </NavLink>
        </div>
      </Modal>

      <Modal open={sheet === 'more'} onClose={closeSheet} title="More" size="sm" variant="sheet">
        <ul className="sheet-list">
          {MORE_ITEMS.map((item, index) => (
            <li key={item.to}>
              <NavLink to={item.to} className="sheet-list__item" onClick={closeSheet} data-autofocus={index === 0 || undefined}>
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
                <Icon name="chevron-right" size={18} className="sheet-list__chevron" />
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" className="sheet-list__item sheet-list__item--danger" onClick={handleLogout}>
              <Icon name="log-out" size={20} />
              <span>Log out</span>
            </button>
          </li>
        </ul>
      </Modal>
    </>
  );
}
