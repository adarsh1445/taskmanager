import type { Task } from "./task-dashboard"
import { TaskCard } from "./task-card"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "done")

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">To Do</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{todoTasks.length}</span>
        </div>
        {todoTasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">In Progress</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{inProgressTasks.length}</span>
        </div>
        {inProgressTasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Completed</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{completedTasks.length}</span>
        </div>
        {completedTasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  )
}

