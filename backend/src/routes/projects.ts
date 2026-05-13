import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { projects, users } from '../data/store';

const router = Router();
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res) => {
  const currentUser = req.user!;
  const results = currentUser.role === 'ADMIN'
    ? projects
    : projects.filter((project) => project.ownerId === currentUser.id || users.some((u) => u.team === currentUser.team && project.ownerId === u.id));
  res.json(results);
});

router.post('/', requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const { name, description, ownerId } = req.body;
  if (!name || !description || !ownerId) {
    return res.status(400).json({ message: 'name, description, and ownerId are required' });
  }

  const newProject = {
    id: `p${projects.length + 1}`,
    name,
    description,
    ownerId,
    status: 'PLANNED' as const
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

export default router;
