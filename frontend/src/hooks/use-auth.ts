import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'


interface User {
  email: string
}

interface LoginData {
  email: string  
  password: string
}

const AUTH_QUERY_KEY = 'auth'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      } catch (error) {
        return null
      }
    }
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const response = await axios.post(`/api/login`, {
        email,
        password
      })
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      queryClient.setQueryData([AUTH_QUERY_KEY], data.user)
    }
  })

  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const response = await axios.post(`/api/register`, {
        email,
        password
      })
      return response.data
    }
  })

  const logout = () => {
    localStorage.removeItem('token')
    queryClient.setQueryData([AUTH_QUERY_KEY], null)
    queryClient.clear()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    error: loginMutation.error || registerMutation.error
  }
}
