import React from 'react';
import { SystemMetrics, SchedulingAlgorithm } from '../types';
import { Cpu, CheckCircle2, AlertTriangle, Clock, Play, Pause, Layers, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricsProps {
  metrics: SystemMetrics;
  onToggleScheduler: () => void;
  onChangeAlgorithm?: (algorithm: SchedulingAlgorithm) => void;
  onChangeTimeSlice?: (timeSlice: number) => void;
}

const algorithmOptions: { value: SchedulingAlgorithm; label: string }[] = [
  { value: 'round-robin', label: 'Round Robin' },
  { value: 'fcfs', label: 'First Come First Serve' },
  { value: 'sjf-nonpreemptive', label: 'Shortest Job First (Non-preemptive)' },
  { value: 'sjf-preemptive', label: 'Shortest Job First (Preemptive)' },
];

export function Metrics({ metrics, onToggleScheduler, onChangeAlgorithm, onChangeTimeSlice }: MetricsProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glassmorphism rounded-lg p-4 col-span-2"
      >
        <div className="flex items-center space-x-2">
          <Layers className="text-purple-400 animate-pulse-slow" />
          <h3 className="font-orbitron text-purple-400">Scheduling Algorithm</h3>
        </div>
        <select
          className="mt-2 w-full bg-transparent border border-purple-400 rounded-lg p-2 text-white font-orbitron text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:border-purple-300"
          value={metrics.currentAlgorithm}
          onChange={(e) => onChangeAlgorithm?.(e.target.value as SchedulingAlgorithm)}
        >
          {algorithmOptions.map(option => (
            <option key={option.value} value={option.value} className="bg-black">
              {option.label}
            </option>
          ))}
        </select>
      </motion.div>

      {metrics.currentAlgorithm === 'round-robin' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="glassmorphism rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <Timer className="text-yellow-400 animate-pulse-slow" />
            <h3 className="font-orbitron text-yellow-400">Time Slice</h3>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="10"
              value={metrics.timeSlice ? metrics.timeSlice / 1000 : 2}
              onChange={(e) => onChangeTimeSlice?.(Number(e.target.value) * 1000)}
              className="w-full bg-transparent border border-yellow-400 rounded-lg p-2 text-white font-orbitron text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 hover:border-yellow-300"
            />
            <span className="text-yellow-400 font-orbitron text-sm">sec</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glassmorphism rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <Cpu className="text-neon-blue animate-pulse-slow" />
          <h3 className="font-orbitron text-neon-blue">CPU Usage</h3>
        </div>
        <p className="text-2xl font-bold text-white mt-2 neon-glow">
          {metrics.cpuUtilization}%
        </p>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glassmorphism rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="text-neon-green animate-pulse-slow" />
          <h3 className="font-orbitron text-neon-green">Completed</h3>
        </div>
        <p className="text-2xl font-bold text-white mt-2 neon-glow">
          {metrics.completedTasks}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glassmorphism rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <AlertTriangle className="text-red-400 animate-pulse-slow" />
          <h3 className="font-orbitron text-red-400">Missed</h3>
        </div>
        <p className="text-2xl font-bold text-white mt-2 neon-glow">
          {metrics.missedDeadlines}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glassmorphism rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <Clock className="text-neon-blue animate-pulse-slow" />
          <h3 className="font-orbitron text-neon-blue">Avg. Wait</h3>
        </div>
        <p className="text-2xl font-bold text-white mt-2 neon-glow">
          {Math.abs(Math.round(metrics.averageWaitTime / 1000))}s
        </p>
      </motion.div>

      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleScheduler}
        className="cyber-button rounded-lg p-4 flex items-center justify-center"
      >
        <div className="flex items-center space-x-2">
          {metrics.isRunning ? (
            <Pause className="text-neon-blue animate-pulse" />
          ) : (
            <Play className="text-neon-green animate-pulse" />
          )}
          <h3 className={`font-orbitron ${metrics.isRunning ? 'text-neon-blue' : 'text-neon-green'}`}>
            {metrics.isRunning ? 'PAUSE' : 'START'}
          </h3>
        </div>
      </motion.button>
    </div>
  );
}