import { useEffect, useState } from 'react';
import { fetchProjects, fetchTasks } from '../api';
import { Project, Task } from '../types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(console.error);
    fetchTasks().then(setTasks).catch(console.error);
  }, []);

  return (
    <main className="page-shell">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Projects</h2>
            <p>Track active workstreams and sprint objectives for your squad.</p>
          </div>
        </div>
        {projects.length ? (
          <ul className="item-list">
            {projects.map((project) => (
              <li key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span>Status: {project.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects assigned yet.</p>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>My tasks</h2>
            <p>Review your assigned work and current delivery status.</p>
          </div>
        </div>
        {tasks.length ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No task assignments yet.</p>
        )}
      </section>
    </main>
  );
}
