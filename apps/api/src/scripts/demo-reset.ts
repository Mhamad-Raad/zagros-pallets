/**
 * Nightly reset of the public demo (Vercel cron): empties the database, recreates the shared demo
 * account and runs the demo seed again, so the data is fresh and dated up to today. Only with DEMO_MODE=true.
 */
import { resetForDemo } from './e2e-reset';
import { runSeedDemo } from './seed-demo';

export async function resetDemo(): Promise<void> {
  if (process.env.DEMO_MODE !== 'true') throw new Error('demo-reset runs only with DEMO_MODE=true');
  await resetForDemo();
  await runSeedDemo();
}

if (require.main === module) {
  resetDemo().catch((error: unknown) => {
    console.error('[demo-reset] failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
