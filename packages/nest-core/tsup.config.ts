import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: true,
  skipNodeModulesBundle: true,
  tsconfig: 'tsconfig.json',
  target: 'es2022',
  alias: {
    '@core': '@app/core',
    '@/core': './src',
    '@': './src'
  },
  // exclude app-specific interop that references server app directly
  // we ship only fastify graphql factory
  ignoreWatch: ['src/graphql/graphql-express.factory.ts'],
});
