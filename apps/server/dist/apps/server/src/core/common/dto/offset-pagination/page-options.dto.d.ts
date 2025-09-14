import { Order } from '@core/constants/app';
export declare class PageOptionsDto {
    readonly limit?: number;
    readonly page?: number;
    readonly q?: string;
    readonly order?: Order;
    get offset(): number;
}
