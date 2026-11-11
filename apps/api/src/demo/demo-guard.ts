import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { DEMO_USER_ID } from './demo-mode';

/**
 * Requests refused on the public demo because they would lock every other visitor out of the shared
 * account: its password, its sessions, its profile, and edits to the account itself from the Users page.
 */
const BLOCKED: { method: string; path: RegExp }[] = [
  { method: 'POST', path: /^\/api\/auth\/change-password\/?$/ },
  { method: 'POST', path: /^\/api\/auth\/logout-all\/?$/ },
  { method: 'PATCH', path: /^\/api\/auth\/me\/?$/ },
  { method: '*', path: new RegExp(`^/api/users/${DEMO_USER_ID}(/.*)?$`) },
];

export function demoGuard(req: Request, res: Response, next: NextFunction): void {
  const path = (req.originalUrl || req.url).split('?')[0] ?? '';
  const blocked = BLOCKED.some(
    (rule) => (rule.method === '*' ? req.method !== 'GET' : req.method === rule.method) && rule.path.test(path),
  );
  if (!blocked) return next();
  res.status(403).json({ error: { code: 'PERMISSION_DENIED' }, requestId: randomUUID() });
}
