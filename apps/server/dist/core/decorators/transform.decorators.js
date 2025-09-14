"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = Trim;
exports.ToBoolean = ToBoolean;
exports.ToLowerCase = ToLowerCase;
exports.ToUpperCase = ToUpperCase;
const class_transformer_1 = require("class-transformer");
function Trim() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (Array.isArray(value)) {
            return value.map((v) => v.trim().replaceAll(/\s\s+/g, ' '));
        }
        return value.trim().replaceAll(/\s\s+/g, ' ');
    });
}
function ToBoolean() {
    return (0, class_transformer_1.Transform)((params) => {
        switch (params.value) {
            case 'true': {
                return true;
            }
            case 'false': {
                return false;
            }
            default: {
                return params.value;
            }
        }
    }, { toClassOnly: true });
}
function ToLowerCase() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (!value) {
            return;
        }
        if (!Array.isArray(value)) {
            return value.toLowerCase();
        }
        return value.map((v) => v.toLowerCase());
    }, {
        toClassOnly: true,
    });
}
function ToUpperCase() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (!value) {
            return;
        }
        if (!Array.isArray(value)) {
            return value.toUpperCase();
        }
        return value.map((v) => v.toUpperCase());
    }, {
        toClassOnly: true,
    });
}
//# sourceMappingURL=transform.decorators.js.map