export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  team: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface OverviewResponse {
  openTasks: number;
  completedTasks: number;
  activeProjects: number;
  workflowCount: number;
  teams: Record<string, number>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  status: string;
  priority: string;
}
