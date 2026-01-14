import { FastifyInstance } from 'fastify';
import { projectsService } from '../services/projects.service';
import { authenticate } from '../middlewares/auth.middleware';
import { Project } from '@prisma/client';

interface GetProjectsQuery {
  published?: string;
}

type CreateProjectBody = Omit<Project, 'createdAt' | 'updatedAt'>;
type UpdateProjectBody = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;

interface ReorderBody {
  projectIds: string[];
}

export default async function projectsRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get<{ Querystring: GetProjectsQuery }>('/', async (request, reply) => {
    try {
      const published = request.query.published === 'true' ? true :
                       request.query.published === 'false' ? false :
                       undefined;
      const projects = await projectsService.getAll(published);
      return reply.send({ projects });
    } catch (error: any) {
      return reply.status(500).send({ error: 'Server Error', message: error.message });
    }
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const project = await projectsService.getById(request.params.id);
      return reply.send({ project });
    } catch (error: any) {
      return reply.status(404).send({ error: 'Not Found', message: error.message });
    }
  });

  // Admin routes (protected)
  fastify.post<{ Body: CreateProjectBody }>('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const project = await projectsService.create(request.body);
      return reply.status(201).send({ project });
    } catch (error: any) {
      const status = error.message.includes('already exists') ? 409 : 400;
      return reply.status(status).send({ error: 'Creation Failed', message: error.message });
    }
  });

  fastify.put<{ Params: { id: string }; Body: UpdateProjectBody }>('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const project = await projectsService.update(request.params.id, request.body);
      return reply.send({ project });
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 400;
      return reply.status(status).send({ error: 'Update Failed', message: error.message });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      await projectsService.delete(request.params.id);
      return reply.send({ message: 'Project deleted successfully' });
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      return reply.status(status).send({ error: 'Deletion Failed', message: error.message });
    }
  });

  fastify.patch<{ Body: ReorderBody }>('/reorder', { preHandler: authenticate }, async (request, reply) => {
    try {
      await projectsService.reorder(request.body.projectIds);
      return reply.send({ message: 'Projects reordered successfully' });
    } catch (error: any) {
      return reply.status(400).send({ error: 'Reorder Failed', message: error.message });
    }
  });
}
