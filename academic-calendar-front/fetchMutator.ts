//import { env } from './env'

export const customFetch = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  //const baseUrl = env.BACKEND_URL
  const baseUrl = import.meta.env.VITE_BACKEND_URL

  const url =
    typeof input === 'string'
      ? `${baseUrl}${input}`
      : `${baseUrl}${input.toString()}`

  // converte headers para objeto simples
  const headersObj: Record<string, string> = {}

  if (init?.headers instanceof Headers) {
    for (const [key, value] of init.headers.entries()) {
      headersObj[key] = value
    }
  } else if (Array.isArray(init?.headers)) {
    for (const [key, value] of init.headers) {
      headersObj[key] = value
    }
  } else if (init?.headers) {
    Object.assign(headersObj, init.headers)
  }

  // adiciona Content-Type só se houver body
  if (init?.body) {
    headersObj['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...init,
    headers: headersObj,
  })

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()
}
