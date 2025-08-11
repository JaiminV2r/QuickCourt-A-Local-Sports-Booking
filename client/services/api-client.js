import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // Use bearer tokens, not cookies, to avoid credentialed CORS.
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const storedAuth = localStorage.getItem('quickcourt_auth')
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth)
        const token = parsed?.tokens?.access?.token
        if (token) {
          config.headers = config.headers ?? {}
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (e) {
      // ignore JSON parse error
    }
  }
  return config
})

function chooseClient(url) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    return axios
  }
  return api
}

export async function get(url, params, config) {
  const client = chooseClient(url)
  const res = await client.get(url, { params, ...(config ?? {}) })
  return res.data
}

export async function post(url, data, config) {
  const client = chooseClient(url)
  const res = await client.post(url, data, config)
  return res.data
}

export async function put(url, data, config) {
  const client = chooseClient(url)
  const res = await client.put(url, data, config)
  return res.data
}

export async function del(url, config) {
  const client = chooseClient(url)
  const res = await client.delete(url, config)
  return res.data
}

export default api


