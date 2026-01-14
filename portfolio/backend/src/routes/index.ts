import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';
import projectsRoutes from './projects.routes';
import aboutRoutes from './about.routes';
import contactRoutes from './contact.routes';
import uploadRoutes from './upload.routes';

export default async function routes(fastify: FastifyInstance) {
  // Register all routes under /api prefix
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(projectsRoutes, { prefix: '/projects' });
  await fastify.register(aboutRoutes, { prefix: '/about' });
  await fastify.register(contactRoutes, { prefix: '/contact' });
  await fastify.register(uploadRoutes, { prefix: '/upload' });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}
