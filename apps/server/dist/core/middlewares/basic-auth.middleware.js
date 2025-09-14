"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = basicAuthMiddleware;
const auth_config_1 = require("../config/auth/auth.config");
async function basicAuthMiddleware(req, reply) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        reply.header('WWW-Authenticate', 'Basic realm="Queues Access"');
        return reply.status(401).send('Authentication required');
    }
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const config = (0, auth_config_1.getConfig)();
    if (username === config.basicAuth.username &&
        password === config.basicAuth.password) {
        return;
    }
    reply.header('WWW-Authenticate', 'Basic realm="Queues Access"');
    return reply.status(401).send('Invalid credentials');
}
//# sourceMappingURL=basic-auth.middleware.js.map