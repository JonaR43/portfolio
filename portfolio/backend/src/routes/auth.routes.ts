import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  // Login
  fastify.post('/login', authController.login);

  // Refresh access token
  fastify.post('/refresh', authController.refresh);

  // Logout
  fastify.post('/logout', authController.logout);

  // Get current user (protected)
  fastify.get('/me', {
    preHandler: authenticate,
  }, authController.me);
}
