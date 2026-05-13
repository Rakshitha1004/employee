import { Project, Task, User, Workflow } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Priya Sharma', email: 'admin@corp.com', role: 'ADMIN', team: 'Leadership' },
  { id: 'u2', name: 'Amit Patel', email: 'manager@corp.com', role: 'MANAGER', team: 'Product' },
  { id: 'u3', name: 'Neha Rao', email: 'employee@corp.com', role: 'EMPLOYEE', team: 'Engineering' }
];

export const projects: Project[] = [
  { id: 'p1', name: 'Employee Portal', description: 'Modernize internal task tracking and sprint reporting.', ownerId: 'u2', status: 'ACTIVE' },
  { id: 'p2', name: 'Workflow Engine', description: 'Build workflow automation for sprint approvals.', ownerId: 'u2', status: 'PLANNED' }
];

export const tasks: Task[] = [
  { id: 't1', title: 'Define backlog items', description: 'Collect requirements and refine stories for sprint 12.', projectId: 'p1', assigneeId: 'u3', status: 'IN_PROGRESS', priority: 'HIGH' },
  { id: 't2', title: 'Deploy staging pipeline', description: 'Add CI/CD workflow for backend services.', projectId: 'p1', assigneeId: 'u2', status: 'BACKLOG', priority: 'MEDIUM' }
];

export const workflows: Workflow[] = [
  { id: 'w1', name: 'Sprint Planning', description: 'Plan tasks and allocate resources.', phase: 'SPRINT', projectId: 'p1' },
  { id: 'w2', name: 'Review Gate', description: 'Collect stakeholder feedback before rollout.', phase: 'REVIEW', projectId: 'p1' }
];

export const passwords: Record<string, string> = {
  'admin@corp.com': 'Admin123!',
  'manager@corp.com': 'Manager123!',
  'employee@corp.com': 'Employee123!'
};
