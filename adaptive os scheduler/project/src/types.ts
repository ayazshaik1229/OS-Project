export interface Task {
  id: string;
  name: string;
  priority: number;
  deadline: number; // milliseconds from now
  executionTime: number; // milliseconds required
  status: 'ready' | 'running' | 'paused' | 'completed' | 'missed';
  progress: number; // 0-100
  startTime?: number;
  pausedAt?: number;
  remainingTime?: number;
}

export type SchedulingAlgorithm = 
  | 'round-robin'
  | 'fcfs'
  | 'sjf-nonpreemptive'
  | 'sjf-preemptive';

export interface SystemMetrics {
  cpuUtilization: number;
  completedTasks: number;
  missedDeadlines: number;
  averageWaitTime: number;
  isRunning: boolean;
  currentAlgorithm: SchedulingAlgorithm;
  timeSlice: number; // in milliseconds
}

export interface LogEntry {
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}