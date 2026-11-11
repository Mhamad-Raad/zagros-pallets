// Public demo build: bundles the compiled API into two CommonJS files for Vercel's functions.
// @pallet/shared is ESM and Vercel's runtime cannot require() ESM, so it is bundled in; every other
// dependency stays external and is traced from node_modules as usual.
import { copyFileSync, readFileSync } from 'node:fs';
import { build } from 'esbuild';

const pkg = JSON.parse(readFileSync(new URL('../apps/api/package.json', import.meta.url), 'utf8'));
const external = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
  .filter((name) => name !== '@pallet/shared')
  .flatMap((name) => [name, `${name}/*`]);

for (const [entry, out] of [
  ['apps/api/dist/serverless.js', 'apps/api/bundle/serverless.cjs'],
  ['apps/api/dist/scripts/demo-reset.js', 'apps/api/bundle/demo-reset.cjs'],
]) {
  await build({
    entryPoints: [entry],
    outfile: out,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node24',
    external: [...external, '@nestjs/microservices', '@nestjs/websockets', 'class-transformer', 'class-validator'],
    keepNames: true,
    logLevel: 'warning',
  });
}
copyFileSync('apps/api/src/modules/auth/common-passwords.txt', 'apps/api/bundle/common-passwords.txt');
console.log('api bundles written');
