import { Outlet } from 'react-router-dom';
import Icon from '../components/Icon';
import Logo from '../components/Logo';

const POINTS = ['Track income and expenses in one place', 'Set budgets and get early warnings', 'See clear charts and plain-language insights'];

/** Split-screen layout shared by the login, register and forgot-password pages. */
export default function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__brand">
        <Logo light />
        <div>
          <h2 className="auth__headline">A calmer way to manage your money.</h2>
          <p className="auth__lead">Finora brings your income, spending and budgets together so every decision is easier.</p>
          <ul className="auth__points">
            {POINTS.map((point) => (
              <li key={point}>
                <Icon name="check" size={26} />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth__lead">© {new Date().getFullYear()} Finora</p>
      </aside>

      <main className="auth__panel" id="main">
        <Logo className="auth__mobile-logo" />
        <Outlet />
      </main>
    </div>
  );
}
