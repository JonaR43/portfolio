import { FastifyRequest, FastifyReply } from 'fastify';
import { contactService } from '../services/contact.service';

export const contactController = {
  async get(request: FastifyRequest, reply: FastifyReply) {
    try {
      const contact = await contactService.get();
      return reply.send({ contact });
    } catch (error: any) {
      return reply.status(404).send({
        error: 'Not Found',
        message: error.message,
      });
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const contact = await contactService.update(request.body);
      return reply.send({ contact });
    } catch (error: any) {
      return reply.status(400).send({
        error: 'Update Failed',
        message: error.message,
      });
    }
  },
};
