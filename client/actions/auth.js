'use client'

import { useQuery } from '@tanstack/react-query'
import { get, post } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => get(endpoints.auth.me),
    enabled,
  })
}

export async function loginAction(data) {
  return post(endpoints.auth.login, data)
}

export async function signupAction(data) {
  return post(endpoints.auth.signup, data)
}


