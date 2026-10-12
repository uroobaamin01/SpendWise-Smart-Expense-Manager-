import Button from '../Button';
import Icon from '../Icon';
import HeroPreview from './HeroPreview';

const REASSURANCES = ['Free to get started', 'Works on every device', 'Your data stays yours'];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="pill hero__enter" style={{ '--delay': '0ms' }}>
            <Icon name="shield" size={14} /> Personal finance, simplified
          </p>
          <h1 className="hero__title hero__enter" style={{ '--delay': '80ms' }}>
            Take Control of Your Money.
          </h1>
          <p className="hero__subtitle hero__enter" style={{ '--delay': '160ms' }}>
            Track your income, manage expenses, plan your budget, and understand where your money goes — all in one simple place.
          </p>
          <div className="hero__actions hero__enter" style={{ '--delay': '240ms' }}>
            <Button to="/register" size="lg" iconRight="arrow-right">
              Get Started
            </Button>
            <Button href="#features" variant="secondary" size="lg">
              Explore Features
            </Button>
          </div>
          <ul className="hero__reassurance hero__enter" style={{ '--delay': '320ms' }}>
            {REASSURANCES.map((item) => (
              <li key={item}>
                <Icon name="check" size={16} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__visual hero__enter" style={{ '--delay': '200ms' }}>
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
