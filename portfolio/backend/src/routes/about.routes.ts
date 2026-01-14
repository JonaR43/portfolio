import { FastifyInstance } from 'fastify';
import { aboutController } from '../controllers/about.controller';
import { authenticate } from '../middlewares/auth.middleware';

export default async function aboutRoutes(fastify: FastifyInstance) {
  // Public route
  fastify.get('/', aboutController.get);

  // Admin route (protected)
  fastify.put('/', {
    preHandler: authenticate,
  }, aboutController.update);
}
