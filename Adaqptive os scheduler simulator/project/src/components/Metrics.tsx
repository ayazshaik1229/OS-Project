import React from 'react';
import { SystemMetrics } from '../types';
import { Cpu, CheckCircle2, AlertTriangle, Clock, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricsProps {
  metrics: SystemMetrics;
  onToggleScheduler: () => void;
}

export function Metrics({ metrics, onToggleScheduler }: MetricsProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
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