import React from 'react';
import { Task } from '../types';
import { Circle, AlertTriangle, CheckCircle, Clock, Pause, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (id: string) => void;
}

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'running':
      return <Circle className="animate-spin text-neon-blue" />;
    case 'completed':
      return <CheckCircle className="text-neon-green" />;
    case 'missed':
      return <AlertTriangle className="text-red-400" />;
    case 'paused':
      return <Pause className="text-yellow-400" />;
    default:
      return <Clock className="text-gray-400" />;
  }
};

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${seconds}s`;
};

export function TaskList({ tasks, onRemoveTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="glassmorphism rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(task.status)}
              <div>
                <h3 className="font-orbitron text-neon-blue">{task.name}</h3>
                <div className="text-sm text-gray-400 font-oxanium">
                  Priority: {task.priority} | Deadline: {formatTime(Math.max(0, task.deadline - (Date.now() - (task.startTime || Date.now()))))}
                  {task.remainingTime !== undefined && ` | Remaining: ${formatTime(task.remainingTime)}`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-32">
                <div className="progress-bar rounded-full h-2">
                  <motion.div
                    className="progress-bar-fill rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveTask(task.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-400/10"
              >
                <X size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}