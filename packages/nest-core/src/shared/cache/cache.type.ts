import { CacheKey } from '@/core//constants/cache';

export type CacheParam = { key: keyof typeof CacheKey; args?: string[] };
