import { defineConfig } from 'orval'
import { env } from './env'

export default defineConfig({
  api: {
    input: `${env.BACKEND_URL}/docs/json`,
    output: {
      target: './src/http/api.ts',
      client: 'fetch',
      httpClient: 'fetch',
      clean: true,
      baseUrl: env.BACKEND_URL,

      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
})
