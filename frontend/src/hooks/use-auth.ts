import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface User {
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

const AUTH_QUERY_KEY = 'auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/me`, {
          withCredentials: true, 
        });
        return response.data;
      } catch (error) {
        return null;
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const response = await axios.post(
        `/api/login`,
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const response = await axios.post(`/api/register`, {
        email,
        password,
      });
      return response.data;
    },
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      await axios.post('/api/logout', {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.setQueryData([AUTH_QUERY_KEY], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    error: loginMutation.error || registerMutation.error,
  };
};