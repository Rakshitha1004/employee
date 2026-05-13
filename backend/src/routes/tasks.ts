import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { tasks } from '../data/store';

const router = Router();
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res) => {
  const currentUser = req.user!;
  if (currentUser.role === 'ADMIN') {
    return res.json(tasks);
  }

  const results = tasks.filter((task) => task.assigneeId === currentUser.id);
  res.json(results);
});

router.post('/', requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const { title, description, projectId, assigneeId, priority } = req.body;
  if (!title || !projectId || !assigneeId || !priority) {
    return res.status(400).json({ message: 'title, projectId, assigneeId, and priority are required' });
  }

  const newTask = {
    id: `t${tasks.length + 1}`,
    title,
    description: description || '',
    projectId,
    assigneeId,
    status: 'BACKLOG' as const,
    priority
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

export default router;
