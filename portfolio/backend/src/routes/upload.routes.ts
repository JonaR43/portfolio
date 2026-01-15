import { FastifyInstance } from 'fastify';
import { cloudinaryService } from '../services/cloudinary.service';
import { authenticate } from '../middlewares/auth.middleware';

export default async function uploadRoutes(fastify: FastifyInstance) {
  // Upload image (protected)
  fastify.post('/image', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({
          error: 'Invalid file type',
          message: 'Only JPEG, PNG, WebP, and GIF images are allowed',
        });
      }

      // Get buffer from stream
      const chunks: Buffer[] = [];
      for await (const chunk of data.file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (buffer.length > maxSize) {
        return reply.status(400).send({
          error: 'File too large',
          message: 'Maximum file size is 5MB',
        });
      }

      // Upload to Cloudinary
      const result = await cloudinaryService.uploadImage(buffer, 'portfolio/projects');

      return reply.send({
        success: true,
        image: result,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return reply.status(500).send({
        error: 'Upload failed',
        message: error.message || 'An error occurred during upload',
      });
    }
  });

  // Upload PDF (protected)
  fastify.post('/pdf', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      // Validate file type
      if (data.mimetype !== 'application/pdf') {
        return reply.status(400).send({
          error: 'Invalid file type',
          message: 'Only PDF files are allowed',
        });
      }

      // Get buffer from stream
      const chunks: Buffer[] = [];
      for await (const chunk of data.file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Check file size (max 10MB for PDFs)
      const maxSize = 10 * 1024 * 1024;
      if (buffer.length > maxSize) {
        return reply.status(400).send({
          error: 'File too large',
          message: 'Maximum file size is 10MB',
        });
      }

      // Get original filename without extension, default to 'resume'
      const originalName = data.filename?.replace(/\.pdf$/i, '') || 'resume';
      const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_');

      // Upload to Cloudinary with the original filename
      const result = await cloudinaryService.uploadPdf(buffer, 'portfolio/resume', safeName);

      return reply.send({
        success: true,
        pdf: result,
      });
    } catch (error: any) {
      console.error('PDF Upload error:', error);
      return reply.status(500).send({
        error: 'Upload failed',
        message: error.message || 'An error occurred during upload',
      });
    }
  });

  // Delete image (protected)
  fastify.delete('/image/:publicId', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    try {
      const { publicId } = request.params as { publicId: string };

      if (!publicId) {
        return reply.status(400).send({ error: 'Public ID is required' });
      }

      // Decode the public ID (it may be URL encoded)
      const decodedPublicId = decodeURIComponent(publicId);

      await cloudinaryService.deleteImage(decodedPublicId);

      return reply.send({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      return reply.status(500).send({
        error: 'Delete failed',
        message: error.message || 'An error occurred during deletion',
      });
    }
  });
}
