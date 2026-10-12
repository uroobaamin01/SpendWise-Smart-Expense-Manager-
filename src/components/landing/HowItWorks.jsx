import Icon from '../Icon';

const STEPS = [
  { icon: 'arrow-down-left', title: 'Add your income', text: 'Start with what you earn: salary, freelance projects or anything else that lands in your account.' },
  { icon: 'arrow-up-right', title: 'Track your expenses', text: 'Record spending as it happens and file it under a category. It takes a few taps.' },
  { icon: 'pie-chart', title: 'Understand your spending', text: 'See your savings, budgets and trends update automatically, so the next decision is an easy one.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section section--tinted">
      <div className="container">
        <div className="section__intro">
          <p className="eyebrow">How it works</p>
          <h2 className="section__title">Three steps to a clearer picture</h2>
        </div>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step__number">{index + 1}</span>
              <span className="step__icon">
                <Icon name={step.icon} size={22} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
