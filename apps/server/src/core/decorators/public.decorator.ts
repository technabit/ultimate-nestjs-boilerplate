import { IS_PUBLIC } from '@core/constants/app';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC, true);
