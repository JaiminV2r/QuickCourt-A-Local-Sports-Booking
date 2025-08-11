import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('quickcourt_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user?.token) {
          config.headers = config.headers ?? {}
          config.headers.Authorization = `Bearer ${user.token}`
        }
      } catch (e) {
        // ignore JSON parse error
      }
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


