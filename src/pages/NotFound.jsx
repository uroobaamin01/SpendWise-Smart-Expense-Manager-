import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code" aria-hidden="true">
        404
      </p>
      <h1>We couldn&apos;t find that page</h1>
      <p>The page may have moved, or the link might be mistyped. Let&apos;s get you back on track.</p>
      <Button to="/" iconRight="arrow-right">
        Back to home
      </Button>
    </div>
  );
}
