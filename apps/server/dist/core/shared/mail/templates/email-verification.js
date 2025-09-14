"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerification = void 0;
const tslib_1 = require("tslib");
const components_1 = require("@react-email/components");
const React = tslib_1.__importStar(require("react"));
const EmailVerification = ({ email = '{{email}}', url = '{{url}}', }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "Verify your Email"),
        React.createElement(components_1.Tailwind, null,
            React.createElement(components_1.Body, { className: "bg-[#f4f4f7] font-sans" },
                React.createElement(components_1.Container, { className: "bg-white max-w-xl mx-auto p-6 rounded-lg" },
                    React.createElement(components_1.Text, { className: "text-xl font-semibold mb-4" },
                        "Hi ",
                        email,
                        ","),
                    React.createElement(components_1.Text, { className: "text-base mb-2" },
                        "Thank you for registering. Please verify your email address by clicking the button below:",
                        ' '),
                    React.createElement(components_1.Text, { className: "text-base mb-4" }, "Click the button below to proceed to reset it:"),
                    React.createElement(components_1.Button, { href: url, className: "bg-blue-600 text-white font-bold py-3 px-5 rounded-md no-underline inline-block mb-4" }, "Verify"),
                    React.createElement(components_1.Text, { className: "text-xs text-gray-500 text-center mt-6" }, "If you did not request this, you can safely ignore this email."),
                    React.createElement(components_1.Text, { className: "text-xs text-gray-500 text-center mt-6" }, "This link will expire shortly for security reasons."))))));
};
exports.EmailVerification = EmailVerification;
exports.default = exports.EmailVerification;
//# sourceMappingURL=email-verification.js.map