import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, LogEntry } from '../types';

const TICK_INTERVAL = 100; // 100ms per tick for smoother updates
const TIME_SLICE = 2000; // 2 seconds for round-robin time slice

export function useScheduler() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const schedulerLock = useRef(false);
  const [metrics, setMetrics] = useState({
    cpuUtilization: 0,
    completedTasks: 0,
    missedDeadlines: 0,
    averageWaitTime: 0,
    isRunning: true,
  });

  // Logging function
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: Date.now(),
      message,
      type,
    }].slice(-50)); // Keep last 50 logs
  }, []);

  // Add new task
  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'progress'>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'ready',
      progress: 0,
      remainingTime: task.executionTime,
      ...task,
    };
    setTasks(prev => [...prev, newTask]);
    addLog(`Added new task: ${task.name}`, 'info');
  }, [addLog]);

  // Remove task
  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        addLog(`Removed task: ${task.name}`, 'warning');
      }
      return prev.filter(task => task.id !== taskId);
    });
  }, [addLog]);

  // Start/Stop scheduler
  const toggleScheduler = useCallback(() => {
    setIsRunning(prev => {
      const newState = !prev;
      addLog(`Scheduler ${newState ? 'started' : 'paused'}`, newState ? 'success' : 'warning');
      return newState;
    });
  }, [addLog]);

  // Update task priorities based on deadlines and progress
  const updatePriorities = useCallback((currentTasks: Task[]) => {
    return currentTasks.map(task => {
      if (task.status === 'ready' || task.status === 'running') {
        const timeToDeadline = task.deadline - (Date.now() - (task.startTime || Date.now()));
        const urgencyFactor = Math.max(1, 10 * (1 - timeToDeadline / task.deadline));
        const newPriority = Math.min(10, Math.floor(task.priority * urgencyFactor));
        
        return {
          ...task,
          priority: newPriority,
        };
      }
      return task;
    });
  }, []);

  // Round-robin scheduling
  const scheduleNextTask = useCallback((tasks: Task[]) => {
    const runningTask = tasks.find(t => t.status === 'running');
    if (runningTask) {
      // Check if current task's time slice is expired
      const timeInExecution = Date.now() - (runningTask.startTime || Date.now());
      if (timeInExecution >= TIME_SLICE) {
        return {
          ...runningTask,
          status: 'ready' as const,
          remainingTime: runningTask.remainingTime,
        };
      }
      return runningTask;
    }
    return null;
  }, []);

  // Scheduler tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning || schedulerLock.current) return;
      
      schedulerLock.current = true;
      setCurrentTime(Date.now());
      
      setTasks(prevTasks => {
        // Update priorities
        const tasksWithUpdatedPriorities = updatePriorities(prevTasks);
        
        // Sort by priority (highest first)
        const sortedTasks = [...tasksWithUpdatedPriorities].sort((a, b) => b.priority - a.priority);
        
        return sortedTasks.map(task => {
          if (task.status === 'completed' || task.status === 'missed' || task.status === 'paused') {
            return task;
          }

          const elapsed = Date.now() - (task.startTime || Date.now());
          const nextTask = scheduleNextTask(sortedTasks);
          
          // Check for missed deadline
          if (elapsed > task.deadline) {
            addLog(`Task ${task.name} missed deadline`, 'error');
            return { ...task, status: 'missed' };
          }

          // Update running task
          if (task.status === 'running') {
            const newProgress = Math.min(100, (elapsed / task.executionTime) * 100);
            const remainingTime = Math.max(0, task.executionTime - elapsed);
            
            if (newProgress >= 100) {
              addLog(`Task ${task.name} completed`, 'success');
              return { ...task, status: 'completed', progress: 100, remainingTime: 0 };
            }
            
            // If this task needs to yield to next task
            if (nextTask && nextTask.id !== task.id) {
              addLog(`Task ${task.name} yielded to next task`, 'info');
              return { 
                ...task, 
                status: 'ready',
                progress: newProgress,
                remainingTime,
              };
            }
            
            return { ...task, progress: newProgress, remainingTime };
          }

          // Start new task if none is running
          if (task.status === 'ready' && !sortedTasks.some(t => t.status === 'running')) {
            addLog(`Starting task: ${task.name}`, 'info');
            return { 
              ...task, 
              status: 'running',
              startTime: Date.now(),
              progress: 0,
              remainingTime: task.remainingTime || task.executionTime,
            };
          }

          return task;
        });
      });

      // Update metrics
      setMetrics(prev => {
        const completed = tasks.filter(t => t.status === 'completed').length;
        const missed = tasks.filter(t => t.status === 'missed').length;
        const running = tasks.filter(t => t.status === 'running').length;
        
        return {
          cpuUtilization: running > 0 ? 100 : 0,
          completedTasks: completed,
          missedDeadlines: missed,
          averageWaitTime: tasks.reduce((acc, task) => {
            if (task.startTime) {
              return acc + (task.startTime - Date.now());
            }
            return acc;
          }, 0) / Math.max(1, tasks.length),
          isRunning,
        };
      });

      schedulerLock.current = false;
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tasks, isRunning, updatePriorities, scheduleNextTask, addLog]);

  return {
    tasks,
    metrics,
    logs,
    addTask,
    removeTask,
    toggleScheduler,
    currentTime,
  };
}