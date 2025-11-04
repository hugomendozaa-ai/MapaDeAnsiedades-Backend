import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./backend/db/session.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    username TEXT,
    stress INTEGER DEFAULT 30,
    hope INTEGER DEFAULT 0,
    visited TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export function createSession(id, username = ''){
  db.prepare(`INSERT OR IGNORE INTO sessions (id, username) VALUES (?, ?)`).run(id, username);
  return getSession(id);
}

export function getSession(id){
  return db.prepare(`SELECT * FROM sessions WHERE id = ?`).get(id);
}

export function updateSession(id, { stress, hope, visited }){
  const s = getSession(id);
  if(!s) return null;
  const newStress = typeof stress === 'number' ? stress : s.stress;
  const newHope = typeof hope === 'number' ? hope : s.hope;
  const newVisited = Array.isArray(visited) ? JSON.stringify(visited) : s.visited;
  db.prepare(`UPDATE sessions SET stress = ?, hope = ?, visited = ? WHERE id = ?`).run(newStress, newHope, newVisited, id);
  return getSession(id);
}
