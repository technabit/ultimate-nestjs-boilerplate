"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = validateUsername;
function validateUsername(username) {
    const regex = /^[a-zA-Z](?!.*[._]{2})[a-zA-Z0-9._]{2,29}(?<![._])$/;
    return regex.test(username);
}
//# sourceMappingURL=username.js.map