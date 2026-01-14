import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';

interface LoginBody {
  email: string;
  password: string;
}

export const authController = {
  async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Email and password are required',
        });
      }

      const { user, refreshToken } = await authService.login(email, password);

      // Generate access token (15 minutes)
      const accessToken = request.server.jwt.sign(
        { id: user.id, email: user.email },
        { expiresIn: '15m' }
      );

      // Set refresh token as HTTP-only cookie
      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      });

      return reply.send({
        accessToken,
        user,
      });
    } catch (error: any) {
      return reply.status(401).send({
        error: 'Authentication Failed',
        message: error.message || 'Invalid credentials',
      });
    }
  },

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'No refresh token provided',
        });
      }

      const user = await authService.refreshAccessToken(refreshToken);

      // Generate new access token
      const accessToken = request.server.jwt.sign(
        { id: user.id, email: user.email },
        { expiresIn: '15m' }
      );

      return reply.send({
        accessToken,
      });
    } catch (error: any) {
      return reply.status(401).send({
        error: 'Token Refresh Failed',
        message: error.message || 'Invalid refresh token',
      });
    }
  },

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear cookie
      reply.clearCookie('refreshToken', {
        path: '/',
      });

      return reply.send({
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: 'Logout Failed',
        message: error.message,
      });
    }
  },

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await authService.getUser(request.user.id);
      return reply.send({ user });
    } catch (error: any) {
      return reply.status(404).send({
        error: 'Not Found',
        message: error.message,
      });
    }
  },
};
