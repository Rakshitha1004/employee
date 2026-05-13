import { Router } from 'express';
import { users, passwords } from '../data/store';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find((item) => item.email === email);
  if (!user || passwords[email] !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({ token: user.id, user });
});

router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
