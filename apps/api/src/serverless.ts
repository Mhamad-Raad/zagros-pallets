/**
 * Entry point for the public demo on Vercel: the same application as `main.ts`, built once per function
 * instance and handed to the platform as an Express handler instead of listening on a port.
 */
import './instrument';
import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { configureApp } from './bootstrap';
import { ENV, type Env } from './config/env';
import { demoGuard } from './demo/demo-guard';
import { DEMO_MODE } from './demo/demo-mode';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let instance: Promise<Handler> | undefined;

async function create(): Promise<Handler> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true, bodyParser: false });
  const env = app.get<Env>(ENV);
  app.useLogger(app.get(Logger));
  if (DEMO_MODE) app.use(demoGuard);
  configureApp(app, env);
  // Behind Vercel's edge: the client address is the first X-Forwarded-For entry.
  app.set('trust proxy', true);
  await app.init();
  return app.getHttpAdapter().getInstance() as Handler;
}

export async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  instance ??= create().catch((error: unknown) => {
    instance = undefined;
    throw error;
  });
  (await instance)(req, res);
}
