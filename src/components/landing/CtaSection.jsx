import Button from '../Button';

export default function CtaSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <h2 className="cta__title">Start managing your money smarter.</h2>
          <p className="cta__text">Set up in a minute and see a clearer picture of your finances today.</p>
          <Button to="/register" variant="light" size="lg" iconRight="arrow-right">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
