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

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()
}
