import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-shell">
      <div className="card">
        <h2>Page not found</h2>
        <p>The page you were looking for does not appear to exist.</p>
        <Link className="button" to="/dashboard">Return to dashboard</Link>
      </div>
    </section>
  );
}
