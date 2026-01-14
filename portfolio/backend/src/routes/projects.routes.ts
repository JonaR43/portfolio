import { FastifyInstance } from 'fastify';
import { projectsController } from '../controllers/projects.controller';
import { authenticate } from '../middlewares/auth.middleware';

export default async function projectsRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get('/', projectsController.getAll);
  fastify.get('/:id', projectsController.getById);

  // Admin routes (protected)
  fastify.post('/', {
    preHandler: authenticate,
  }, projectsController.create);

  fastify.put('/:id', {
    preHandler: authenticate,
  }, projectsController.update);

  fastify.delete('/:id', {
    preHandler: authenticate,
  }, projectsController.delete);

  fastify.patch('/reorder', {
    preHandler: authenticate,
  }, projectsController.reorder);
}
