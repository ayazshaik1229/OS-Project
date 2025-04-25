import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, LogEntry, SchedulingAlgorithm } from '../types';

const TICK_INTERVAL = 100; // 100ms per tick for smoother updates
const DEFAULT_TIME_SLICE = 2000; // 2 seconds default for round-robin

export function useScheduler() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<SchedulingAlgorithm>('round-robin');
  const [timeSlice, setTimeSlice] = useState(DEFAULT_TIME_SLICE);
  const schedulerLock = useRef(false);
  const [metrics, setMetrics] = useState({
    cpuUtilization: 0,
    completedTasks: 0,
    missedDeadlines: 0,
    averageWaitTime: 0,
    isRunning: true,
    currentAlgorithm: 'round-robin' as SchedulingAlgorithm,
    timeSlice: DEFAULT_TIME_SLICE,
  });

  // Logging function
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: Date.now(),
      message,
      type,
    }].slice(-50)); // Keep last 50 logs
  }, []);

  // Change time slice
  const changeTimeSlice = useCallback((newTimeSlice: number) => {
    setTimeSlice(newTimeSlice);
    setMetrics(prev => ({ ...prev, timeSlice: newTimeSlice }));
    addLog(`Time slice updated to ${newTimeSlice / 1000} seconds`, 'info');
  }, [addLog]);

  // Add new task
  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'progress'>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'ready',
      progress: 0,
      remainingTime: task.executionTime,
      startTime: Date.now(), // Add arrival time for FCFS
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

  // Change scheduling algorithm
  const changeAlgorithm = useCallback((algorithm: SchedulingAlgorithm) => {
    setCurrentAlgorithm(algorithm);
    addLog(`Switched to ${algorithm.toUpperCase()} scheduling algorithm`, 'info');
    setMetrics(prev => ({ ...prev, currentAlgorithm: algorithm }));
    
    // Reset all running tasks to ready when switching algorithms
    setTasks(prev => prev.map(task => 
      task.status === 'running' ? { ...task, status: 'ready' } : task
    ));
  }, [addLog]);

  // Start/Stop scheduler
  const toggleScheduler = useCallback(() => {
    setIsRunning(prev => {
      const newState = !prev;
      addLog(`Scheduler ${newState ? 'started' : 'paused'}`, newState ? 'success' : 'warning');
      return newState;
    });
  }, [addLog]);

  // FCFS Scheduling - Select the task that arrived first
  const scheduleFCFS = useCallback((tasks: Task[]) => {
    const runningTask = tasks.find(t => t.status === 'running');
    if (runningTask) return runningTask;

    const readyTasks = tasks.filter(t => t.status === 'ready');
    if (readyTasks.length === 0) return null;

    // Sort by arrival time (startTime) and return the earliest
    return readyTasks.sort((a, b) => (a.startTime || 0) - (b.startTime || 0))[0];
  }, []);

  // SJF Non-preemptive Scheduling - Once a task starts, it runs to completion
  const scheduleSJFNonPreemptive = useCallback((tasks: Task[]) => {
    const runningTask = tasks.find(t => t.status === 'running');
    if (runningTask) return runningTask;

    const readyTasks = tasks.filter(t => t.status === 'ready');
    if (readyTasks.length === 0) return null;

    // Sort by execution time and return the shortest
    return readyTasks.sort((a, b) => a.executionTime - b.executionTime)[0];
  }, []);

  // SJF Preemptive Scheduling - Can preempt if a shorter task arrives
  const scheduleSJFPreemptive = useCallback((tasks: Task[]) => {
    const readyOrRunningTasks = tasks.filter(t => 
      t.status === 'ready' || t.status === 'running'
    );
    if (readyOrRunningTasks.length === 0) return null;

    // Sort by remaining time and return the shortest
    return readyOrRunningTasks.sort((a, b) => 
      (a.remainingTime || a.executionTime) - (b.remainingTime || b.executionTime)
    )[0];
  }, []);

  // Round-robin scheduling - Give each task a time slice
  const scheduleRoundRobin = useCallback((tasks: Task[]) => {
    const runningTask = tasks.find(t => t.status === 'running');
    if (runningTask) {
      const timeInExecution = Date.now() - (runningTask.startTime || Date.now());
      if (timeInExecution >= timeSlice) {
        // Time slice expired, move to next task
        const readyTasks = tasks.filter(t => t.status === 'ready');
        if (readyTasks.length > 0) {
          return {
            ...runningTask,
            status: 'ready' as const,
            remainingTime: runningTask.remainingTime,
          };
        }
      }
      return runningTask;
    }

    // Find next ready task
    const readyTasks = tasks.filter(t => t.status === 'ready');
    return readyTasks[0] || null;
  }, [timeSlice]);

  // Select scheduling algorithm
  const selectSchedulingAlgorithm = useCallback((tasks: Task[]) => {
    switch (currentAlgorithm) {
      case 'fcfs':
        return scheduleFCFS(tasks);
      case 'sjf-nonpreemptive':
        return scheduleSJFNonPreemptive(tasks);
      case 'sjf-preemptive':
        return scheduleSJFPreemptive(tasks);
      case 'round-robin':
      default:
        return scheduleRoundRobin(tasks);
    }
  }, [currentAlgorithm, scheduleFCFS, scheduleSJFNonPreemptive, scheduleSJFPreemptive, scheduleRoundRobin]);

  // Scheduler tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning || schedulerLock.current) return;
      
      schedulerLock.current = true;
      setCurrentTime(Date.now());
      
      setTasks(prevTasks => {
        let sortedTasks = [...prevTasks];
        const nextTask = selectSchedulingAlgorithm(sortedTasks);
        
        return sortedTasks.map(task => {
          if (task.status === 'completed' || task.status === 'missed' || task.status === 'paused') {
            return task;
          }

          const elapsed = Date.now() - (task.startTime || Date.now());
          
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
              addLog(`Task ${task.name} yielded to ${nextTask.name}`, 'info');
              return { 
                ...task, 
                status: 'ready',
                progress: newProgress,
                remainingTime,
              };
            }
            
            return { ...task, progress: newProgress, remainingTime };
          }

          // Start new task if it's selected by the scheduler
          if (task.status === 'ready' && nextTask?.id === task.id) {
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
          currentAlgorithm,
          timeSlice,
        };
      });

      schedulerLock.current = false;
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tasks, isRunning, currentAlgorithm, timeSlice, selectSchedulingAlgorithm, addLog]);

  return {
    tasks,
    metrics,
    logs,
    addTask,
    removeTask,
    toggleScheduler,
    currentTime,
    changeAlgorithm,
    changeTimeSlice,
  };
}