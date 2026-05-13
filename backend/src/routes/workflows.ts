import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { workflows } from '../data/store';

const router = Router();
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res) => {
  res.json(workflows);
});

router.post('/', (req, res) => {
  const { name, description, phase, projectId } = req.body;
  if (!name || !description || !phase || !projectId) {
    return res.status(400).json({ message: 'name, description, phase, and projectId are required' });
  }

  const newWorkflow = {
    id: `w${workflows.length + 1}`,
    name,
    description,
    phase,
    projectId
  };
  workflows.push(newWorkflow);
  res.status(201).json(newWorkflow);
});

export default router;
