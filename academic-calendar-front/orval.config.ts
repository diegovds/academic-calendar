import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: 'https://academic-calendar-back.vercel.app/docs/json',
    output: {
      target: './src/http/api.ts',
      client: 'fetch',
      httpClient: 'fetch',
      clean: true,
      baseUrl: 'https://academic-calendar-back.vercel.app',

      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
})
