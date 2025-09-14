"use strict";
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const nestjs_1 = require("@bull-board/nestjs");
const apollo_1 = require("@nestjs/apollo");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const nest_core_1 = require("@app/nest-core");
const fastify_1 = require("@bull-board/fastify");
const job_1 = require("../../../packages/core/src/constants/job");
const api_module_1 = require("./apps/api/api.module");
const worker_module_1 = require("./apps/worker/worker.module");
const BULL_BOARD_FEATURES = Object.values(job_1.Queue).map((name) => ({
    name,
    adapter: bullMQAdapter_1.BullMQAdapter,
}));
let AppModule = AppModule_1 = class AppModule {
    static main() {
        return {
            module: AppModule_1,
            imports: [
                ...nest_core_1.CoreModule.common().imports,
                graphql_1.GraphQLModule.forRootAsync({
                    driver: apollo_1.ApolloDriver,
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: nest_core_1.useGraphqlFactory,
                }),
                nestjs_1.BullBoardModule.forRoot({
                    route: nest_core_1.BULL_BOARD_PATH,
                    adapter: fastify_1.FastifyAdapter,
                }),
                nestjs_1.BullBoardModule.forFeature(...BULL_BOARD_FEATURES),
                api_module_1.ApiModule,
            ],
        };
    }
    static worker() {
        return {
            module: AppModule_1,
            imports: [...nest_core_1.CoreModule.common().imports, worker_module_1.WorkerModule],
        };
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], AppModule);
//# sourceMappingURL=app.module.js.map