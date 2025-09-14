"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthOptional = void 0;
const app_1 = require("../../../core/src/constants/app");
const common_1 = require("@nestjs/common");
const AuthOptional = () => (0, common_1.SetMetadata)(app_1.IS_AUTH_OPTIONAL, true);
exports.AuthOptional = AuthOptional;
//# sourceMappingURL=auth-optional.decorator.js.map