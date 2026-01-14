import { FastifyInstance } from 'fastify';
import { contactController } from '../controllers/contact.controller';
import { authenticate } from '../middlewares/auth.middleware';

export default async function contactRoutes(fastify: FastifyInstance) {
  // Public route
  fastify.get('/', contactController.get);

  // Admin route (protected)
  fastify.put('/', {
    preHandler: authenticate,
  }, contactController.update);
}
