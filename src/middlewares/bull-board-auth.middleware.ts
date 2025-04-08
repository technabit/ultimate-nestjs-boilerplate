import { getConfig } from '@/worker/queues/bull.config';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function bullBoardAuthMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    reply.header('WWW-Authenticate', 'Basic realm="Queues Access"');
    return reply.status(401).send('Authentication required');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [username, password] = credentials.split(':');

  const config = getConfig();

  if (
    username === config.bullBoard.username &&
    password === config.bullBoard.password
  ) {
    return;
  }

  reply.header('WWW-Authenticate', 'Basic realm="Queues Access"');
  return reply.status(401).send('Invalid credentials');
}
