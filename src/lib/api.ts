const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || ''

type ApiRequestOptions = RequestInit & {
  token?: string | null
}

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function buildUrl(input: string | URL) {
  if (input instanceof URL) {
    return input.toString()
  }

  if (/^https?:\/\//i.test(input)) {
    return input
  }

  return `${API_BASE_URL}${input}`
}

export async function apiRequest<T>(input: string | URL, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options
  const requestHeaders = new Headers(headers || {})

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  if (init.body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(buildUrl(input), {
      ...init,
      headers: requestHeaders,
    })
  } catch {
    throw new ApiError('Unable to reach the LOOM API. Start the backend with `npm run dev:api` and try again.', 0)
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json().catch(() => ({})) : await response.text().catch(() => '')

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Request failed.'

    throw new ApiError(message, response.status, data)
  }

  return data as T
}
