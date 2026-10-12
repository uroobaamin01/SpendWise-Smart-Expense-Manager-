import Button from '../components/Button';
import Icon from '../components/Icon';

const CONTENT = {
  about: {
    title: 'About Finora',
    intro: 'Finora is a personal finance app built around one idea: understanding your money should feel calm, not complicated.',
    sections: [
      { heading: 'Why we built it', body: 'Most budgeting tools are either spreadsheets in disguise or dashboards full of numbers nobody reads. Finora focuses on the few things that matter: what came in, what went out, and what that means for your month.' },
      { heading: 'What we believe', body: 'Good financial habits come from clarity. When you can see where your money goes, small adjustments become easy, and you stay in control without having to track every detail.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Illustrative policy for this demo application.',
    intro: 'This page describes how a production version of Finora would handle your information.',
    sections: [
      { heading: 'Information we collect', body: 'Account details such as your name and email, and the financial entries you choose to record: transactions, budgets and categories.' },
      { heading: 'How it is used', body: 'Your data is used only to provide the app: showing your history, calculating summaries and generating insights. It is not sold to third parties.' },
      { heading: 'Your choices', body: 'You can edit your profile, change your password, or remove any transaction, budget or category at any time.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Illustrative terms for this demo application.',
    intro: 'These terms outline how a production version of Finora would be offered.',
    sections: [
      { heading: 'Using Finora', body: 'Finora is a tool for tracking and understanding personal finances. It does not provide financial, tax or investment advice.' },
      { heading: 'Your account', body: 'You are responsible for keeping your login details secure and for the accuracy of the information you enter.' },
      { heading: 'Changes', body: 'Features and these terms may change over time. Significant changes would be communicated within the app.' },
    ],
  },
};

function ContactPage() {
  return (
    <div className="container info-page">
      <h1>Contact us</h1>
      <p className="info-page__updated">We usually reply within two business days.</p>
      <div className="info-page__cards">
        <div className="card">
          <Icon name="mail" size={22} />
          <h2>Support</h2>
          <p>Questions about your account or how something works.</p>
          <a href="mailto:support@finora.app">support@finora.app</a>
        </div>
        <div className="card">
          <Icon name="globe" size={22} />
          <h2>Partnerships</h2>
          <p>Press, collaborations and everything else.</p>
          <a href="mailto:hello@finora.app">hello@finora.app</a>
        </div>
      </div>
    </div>
  );
}

export default function InfoPage({ page }) {
  if (page === 'contact') return <ContactPage />;

  const content = CONTENT[page];
  return (
    <article className="container info-page">
      <h1>{content.title}</h1>
      {content.updated && <p className="info-page__updated">{content.updated}</p>}
      <p style={{ marginTop: 20 }}>{content.intro}</p>
      {content.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <div style={{ marginTop: 36 }}>
        <Button to="/register" iconRight="arrow-right">
          Get Started
        </Button>
      </div>
    </article>
  );
}
