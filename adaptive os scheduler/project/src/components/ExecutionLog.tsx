import React from 'react';
import { LogEntry } from '../types';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExecutionLogProps {
  logs: LogEntry[];
}

const getLogIcon = (type: LogEntry['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="text-neon-green w-4 h-4" />;
    case 'error':
      return <AlertTriangle className="text-red-400 w-4 h-4" />;
    case 'warning':
      return <AlertCircle className="text-yellow-400 w-4 h-4" />;
    default:
      return <Info className="text-neon-blue w-4 h-4" />;
  }
};

const getLogColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'success':
      return 'text-neon-green';
    case 'error':
      return 'text-red-400';
    case 'warning':
      return 'text-yellow-400';
    default:
      return 'text-neon-blue';
  }
};

export function ExecutionLog({ logs }: ExecutionLogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism rounded-lg p-4"
    >
      <h2 className="text-xl font-orbitron text-neon-green mb-4">System Logs</h2>
      <div className="space-y-2 max-h-40 overflow-y-auto terminal-text">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 text-sm"
          >
            {getLogIcon(log.type)}
            <span className="text-gray-500 font-mono">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`font-oxanium ${getLogColor(log.type)}`}>
              {log.message}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}