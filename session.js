import express from 'express';
import { createSession, getSession, updateSession } from '../models/sessionModel.js';
const router = express.Router();

// create session
router.post('/create', (req, res) => {
  const { id, username } = req.body;
  if(!id) return res.status(400).json({ error: 'Missing id' });
  const s = createSession(id, username || '');
  res.json(s);
});

// get session
router.get('/:id', (req, res) => {
  const s = getSession(req.params.id);
  if(!s) return res.status(404).json({ error: 'Not found' });
  s.visited = JSON.parse(s.visited);
  res.json(s);
});

// update session
router.post('/update/:id', (req, res) => {
  const { stress, hope, visited } = req.body;
  const s = updateSession(req.params.id, { stress, hope, visited });
  if(!s) return res.status(404).json({ error: 'Not found' });
  s.visited = JSON.parse(s.visited);
  res.json(s);
});

export default router;
