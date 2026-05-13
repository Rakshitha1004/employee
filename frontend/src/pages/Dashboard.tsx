import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOverview } from '../api';
import { OverviewResponse, User } from '../types';

interface DashboardPageProps {
  user: User;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);

  useEffect(() => {
    fetchOverview().then(setOverview).catch(console.error);
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <h2>Welcome back, {user.name}</h2>
        <p>{user.role} on the {user.team} team</p>
      </section>

      <section className="grid-card">
        <div className="stat-card">
          <span>Open tasks</span>
          <strong>{overview?.openTasks ?? '—'}</strong>
        </div>
        <div className="stat-card">
          <span>Completed tasks</span>
          <strong>{overview?.completedTasks ?? '—'}</strong>
        </div>
        <div className="stat-card">
          <span>Active projects</span>
          <strong>{overview?.activeProjects ?? '—'}</strong>
        </div>
        <div className="stat-card">
          <span>Workflow campaigns</span>
          <strong>{overview?.workflowCount ?? '—'}</strong>
        </div>
      </section>

      <section className="card">
        <h3>Quick links</h3>
        <div className="button-row">
          <Link className="button" to="/projects">View projects</Link>
          <Link className="button" to="/dashboard">Team report</Link>
        </div>
      </section>
    </main>
  );
}
