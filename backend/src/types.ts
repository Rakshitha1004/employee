export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  team: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  phase: 'IDEATION' | 'SPRINT' | 'REVIEW' | 'DEPLOYMENT';
  projectId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
