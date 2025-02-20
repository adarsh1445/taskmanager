"use client"

import { useState } from "react"
import { Calendar, MoreVertical, User2 } from "lucide-react"
import type { Task } from "./task-dashboard"
import { TaskForm } from "./task-form"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusColors = {
  todo: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  done: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleUpdateTask = (updatedTask: Omit<Task, "id">) => {
    onUpdate({ ...updatedTask, id: task.id })
    setIsEditDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between space-y-0">
          <h3 className="font-medium leading-none">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(task.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={statusColors[task.status]}>
              {task.status}
            </Badge>
            <Badge variant="secondary" className={priorityColors[task.priority]}>
              {task.priority} priority
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(task.due_date).toLocaleDateString()}
            </div>
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User2 className="h-4 w-4" />
                {task.assignee}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} onSubmit={handleUpdateTask} />
        </DialogContent>
      </Dialog>
    </>
  )
}

