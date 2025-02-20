import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string
  assignee?: string
}

export const useTasks = () => {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (task: Omit<Task, 'id'>) => {
      const response = await axios.post(`${API_BASE_URL}/api/tasks`, task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (task: Task) => {
      const response = await axios.put(`${API_BASE_URL}/api/tasks/${task.id}`, task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return {
    tasks,
    isLoading,
    error,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}
