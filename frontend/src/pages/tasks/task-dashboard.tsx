"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { TaskList } from "./task-list"
import { TaskForm } from "./task-form"
import { Navbar } from "./navbar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTasks } from "@/hooks/pre-fetch"

export type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  due_date: string
  assignee?: string
}

export function TaskDashboard() {
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreate = async (taskData: Omit<Task, "id">) => {
    try {
      await createTask({
        ...taskData,
        status: taskData.status.replace("-", "_") as "todo" | "in_progress" | "done",
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create task")
    }
  }

  const handleUpdate = async (task: Task) => {
    try {
      await updateTask({
        ...task,
        status: task.status.replace("-", "_") as "todo" | "in_progress" | "done",
      })
    } catch (error) {
      console.error("Failed to update task")
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Failed to delete task")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Manage your tasks and track progress</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {isLoading ? (
          <div>Loading tasks...</div>
        ) : error ? (
          <div>Error loading tasks</div>
        ) : tasks && tasks.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <TaskList
              tasks={tasks.map((t) => ({
                ...t,
                status: t.status.replace("_", "-") as "todo" | "in-progress" | "done",
                due_date: t.due_date,
              }))}
              onUpdateTask={handleUpdate}
              onDeleteTask={handleDelete}
            />
          </div>
        ) : (
          <div className="bg-gray-200 text-gray-600 rounded-lg p-6 text-center">
            No tasks available. Click "Add Task" to create a new task.
          </div>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

