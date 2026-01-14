import { FastifyRequest, FastifyReply } from 'fastify';
import { projectsService } from '../services/projects.service';
import { Project } from '@prisma/client';

interface GetProjectsQuery {
  published?: string;
}

interface CreateProjectBody extends Omit<Project, 'createdAt' | 'updatedAt'> {}

interface UpdateProjectBody extends Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>> {}

interface ReorderBody {
  projectIds: string[];
}

export const projectsController = {
  async getAll(
    request: FastifyRequest<{ Querystring: GetProjectsQuery }>,
    reply: FastifyReply
  ) {
    try {
      const published = request.query.published === 'true' ? true :
                       request.query.published === 'false' ? false :
                       undefined;

      const projects = await projectsService.getAll(published);
      return reply.send({ projects });
    } catch (error: any) {
      return reply.status(500).send({
        error: 'Server Error',
        message: error.message,
      });
    }
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const project = await projectsService.getById(request.params.id);
      return reply.send({ project });
    } catch (error: any) {
      return reply.status(404).send({
        error: 'Not Found',
        message: error.message,
      });
    }
  },

  async create(
    request: FastifyRequest<{ Body: CreateProjectBody }>,
    reply: FastifyReply
  ) {
    try {
      const project = await projectsService.create(request.body);
      return reply.status(201).send({ project });
    } catch (error: any) {
      const status = error.message.includes('already exists') ? 409 : 400;
      return reply.status(status).send({
        error: 'Creation Failed',
        message: error.message,
      });
    }
  },

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateProjectBody }>,
    reply: FastifyReply
  ) {
    try {
      const project = await projectsService.update(request.params.id, request.body);
      return reply.send({ project });
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 400;
      return reply.status(status).send({
        error: 'Update Failed',
        message: error.message,
      });
    }
  },

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      await projectsService.delete(request.params.id);
      return reply.send({ message: 'Project deleted successfully' });
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      return reply.status(status).send({
        error: 'Deletion Failed',
        message: error.message,
      });
    }
  },

  async reorder(
    request: FastifyRequest<{ Body: ReorderBody }>,
    reply: FastifyReply
  ) {
    try {
      await projectsService.reorder(request.body.projectIds);
      return reply.send({ message: 'Projects reordered successfully' });
    } catch (error: any) {
      return reply.status(400).send({
        error: 'Reorder Failed',
        message: error.message,
      });
    }
  },
};
