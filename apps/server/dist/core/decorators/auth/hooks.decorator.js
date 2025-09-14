"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = exports.AfterHook = exports.BeforeHook = void 0;
const auth_1 = require("../../../../../../packages/core/src/constants/auth");
const common_1 = require("@nestjs/common");
const BeforeHook = (path) => (0, common_1.SetMetadata)(auth_1.BEFORE_HOOK_KEY, path);
exports.BeforeHook = BeforeHook;
const AfterHook = (path) => (0, common_1.SetMetadata)(auth_1.AFTER_HOOK_KEY, path);
exports.AfterHook = AfterHook;
const Hook = () => (0, common_1.SetMetadata)(auth_1.HOOK_KEY, true);
exports.Hook = Hook;
//# sourceMappingURL=hooks.decorator.js.map