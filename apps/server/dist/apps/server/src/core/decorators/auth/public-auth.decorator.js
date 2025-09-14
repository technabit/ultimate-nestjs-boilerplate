"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAuth = void 0;
const auth_1 = require("../../../../../../packages/core/src/constants/auth");
const common_1 = require("@nestjs/common");
const PublicAuth = () => (0, common_1.SetMetadata)(auth_1.IS_PUBLIC_AUTH, true);
exports.PublicAuth = PublicAuth;
//# sourceMappingURL=public-auth.decorator.js.map