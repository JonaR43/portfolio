import { FastifyRequest, FastifyReply } from 'fastify';
import { aboutService } from '../services/about.service';

export const aboutController = {
  async get(request: FastifyRequest, reply: FastifyReply) {
    try {
      const about = await aboutService.get();
      return reply.send({ about });
    } catch (error: any) {
      return reply.status(404).send({
        error: 'Not Found',
        message: error.message,
      });
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const about = await aboutService.update(request.body);
      return reply.send({ about });
    } catch (error: any) {
      return reply.status(400).send({
        error: 'Update Failed',
        message: error.message,
      });
    }
  },
};
