import React from 'react';
import { useScheduler } from './hooks/useScheduler';
import { TaskList } from './components/TaskList';
import { Metrics } from './components/Metrics';
import { AddTaskForm } from './components/AddTaskForm';
import { ExecutionLog } from './components/ExecutionLog';
import { motion } from 'framer-motion';

function App() {
  const { tasks, metrics, logs, addTask, removeTask, toggleScheduler } = useScheduler();

  return (
    <div className="min-h-screen bg-black text-white font-oxanium">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          <h1 className="text-4xl font-orbitron font-bold text-neon-blue mb-8 neon-glow text-center">
            Quantum OS Scheduler
          </h1>
          
          <div className="space-y-8">
            <Metrics metrics={metrics} onToggleScheduler={toggleScheduler} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glassmorphism rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-orbitron text-neon-green mb-4">
                  Task Control Center
                </h2>
                <AddTaskForm onAddTask={addTask} />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="glassmorphism rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-orbitron text-neon-green mb-4">
                  Active Processes
                </h2>
                <TaskList tasks={tasks} onRemoveTask={removeTask} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ExecutionLog logs={logs} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;