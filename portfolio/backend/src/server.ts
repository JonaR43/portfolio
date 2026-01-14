import Fastify from 'fastify';
import fastifyJWT from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import { config } from './config/env';
import routes from './routes';

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'development' ? 'info' : 'warn',
  },
});

// Declare JWT user type
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string };
    user: { id: string; email: string };
  }
}

async function start() {
  try {
    // Register plugins
    await fastify.register(fastifyCookie);

    await fastify.register(fastifyJWT, {
      secret: config.jwtSecret,
    });

    await fastify.register(fastifyCors, {
      origin: config.frontendUrl,
      credentials: true,
    });

    await fastify.register(fastifyMultipart, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    });

    // Register routes under /api prefix
    await fastify.register(routes, { prefix: '/api' });

    // Root endpoint
    fastify.get('/', async () => {
      return {
        name: 'Portfolio CMS API',
        version: '1.0.0',
        status: 'running',
      };
    });

    // Start server
    await fastify.listen({ port: config.port, host: '0.0.0.0' });

    console.log(`🚀 Server running at http://localhost:${config.port}`);
    console.log(`📋 API available at http://localhost:${config.port}/api`);
    console.log(`🏥 Health check: http://localhost:${config.port}/api/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
