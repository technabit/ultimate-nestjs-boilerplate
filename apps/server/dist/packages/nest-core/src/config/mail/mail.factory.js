"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = tslib_1.__importDefault(require("path"));
async function useMailFactory(config) {
    return {
        transport: {
            host: config.get('mail.host', { infer: true }),
            port: config.get('mail.port', { infer: true }),
            ignoreTLS: config.get('mail.ignoreTLS', { infer: true }),
            requireTLS: config.get('mail.requireTLS', { infer: true }),
            secure: config.get('mail.secure', { infer: true }),
            logger: false,
            auth: {
                user: config.get('mail.user', { infer: true }),
                pass: config.get('mail.password', { infer: true }),
            },
        },
        defaults: {
            from: `"${config.get('mail.defaultName', { infer: true })}" <${config.get('mail.defaultEmail', { infer: true })}>`,
        },
        template: {
            dir: path_1.default.join(__dirname, '..', '..', 'shared/mail/templates'),
            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    };
}
exports.default = useMailFactory;
//# sourceMappingURL=mail.factory.js.map