import { mergeConfig, defineConfig } from 'vitest/config';
import baseConfig from './vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'postgres',
      include: ['app/**/*.pg.test.ts'],
      setupFiles: ['app/lib/db/test-utils/setupEnv.ts'],
      sequence: {
        hooks: 'stack',
      },
    },
  })
);
