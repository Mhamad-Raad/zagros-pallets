/**
 * Public demo deployment (portfolio): one shared account that anyone may sign in with. Off unless
 * `DEMO_MODE=true`. The demo account is the first user the nightly reset creates, so its id is 1.
 */
export const DEMO_MODE = process.env.DEMO_MODE === 'true';
export const DEMO_USERNAME = (process.env.DEMO_USERNAME ?? 'demo').trim().toLowerCase();
export const DEMO_USER_ID = 1;

/** True for sign-ins to the shared demo account: wrong passwords never lock it for everyone else. */
export function isDemoAccount(username: string): boolean {
  return DEMO_MODE && username.trim().toLowerCase() === DEMO_USERNAME;
}
