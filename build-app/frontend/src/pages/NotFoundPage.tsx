import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 text-center">
      <div className="eyebrow mb-2" style={{ color: 'var(--crisis)' }}>Signal lost</div>
      <h1 className="font-display text-7xl tracking-tight" style={{ color: 'var(--text)' }}>404</h1>
      <p className="mt-3 text-lg" style={{ color: 'var(--text-muted)' }}>That route does not exist in the Build Room.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn btn-primary">Return to home</Link>
      </div>
    </div>
  );
}
