"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalAuth = void 0;
const auth_1 = require("../../../../core/src/constants/auth");
const common_1 = require("@nestjs/common");
const OptionalAuth = () => (0, common_1.SetMetadata)(auth_1.IS_OPTIONAL_AUTH, true);
exports.OptionalAuth = OptionalAuth;
//# sourceMappingURL=optional-auth.decorator.js.map