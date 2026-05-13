import axios, { type InternalAxiosRequestConfig } from 'axios';
import { LoginRequest, LoginResponse, OverviewResponse, Project, Task, User } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const api = axios.create({ baseURL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const headers = config.headers ?? {};
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    config.headers = headers;
  }
  return config;
});

export function login(payload: LoginRequest) {
  return api.post<LoginResponse>('/auth/login', payload).then((res) => res.data);
}

export function getCurrentUser() {
  return api.get<{ user: User }>('/auth/me').then((res) => res.data);
}

export function fetchOverview() {
  return api.get<OverviewResponse>('/reports/overview').then((res) => res.data);
}

export function fetchProjects() {
  return api.get<Project[]>('/projects').then((res) => res.data);
}

export function fetchTasks() {
  return api.get<Task[]>('/tasks').then((res) => res.data);
}
