import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { projects, tasks, workflows, users } from '../data/store';

const router = Router();
router.use(authMiddleware);

router.get('/overview', (req: AuthRequest, res) => {
  const openTasks = tasks.filter((task) => task.status !== 'DONE').length;
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  const activeProjects = projects.filter((project) => project.status === 'ACTIVE').length;
  const teamBreakdown = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.team] = (acc[user.team] || 0) + 1;
    return acc;
  }, {});

  res.json({ openTasks, completedTasks, activeProjects, teams: teamBreakdown, workflowCount: workflows.length });
});

export default router;
