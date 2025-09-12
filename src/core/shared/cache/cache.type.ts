import { CacheKey } from '@/core/constants/cache.constant';

export type CacheParam = { key: keyof typeof CacheKey; args?: string[] };
