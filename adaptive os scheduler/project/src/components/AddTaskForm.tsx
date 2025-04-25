import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddTaskFormProps {
  onAddTask: (task: {
    name: string;
    priority: number;
    deadline: number;
    executionTime: number;
  }) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(1);
  const [deadline, setDeadline] = useState(5);
  const [executionTime, setExecutionTime] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      name,
      priority,
      deadline: deadline * 1000,
      executionTime: executionTime * 1000,
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-orbitron text-neon-blue mb-2">
            Process Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cyber-input w-full rounded-lg p-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-orbitron text-neon-blue mb-2">
            Priority Level (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="cyber-input w-full rounded-lg p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-orbitron text-neon-blue mb-2">
            Deadline (seconds)
          </label>
          <input
            type="number"
            min="1"
            value={deadline}
            onChange={(e) => setDeadline(Number(e.target.value))}
            className="cyber-input w-full rounded-lg p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-orbitron text-neon-blue mb-2">
            Runtime (seconds)
          </label>
          <input
            type="number"
            min="1"
            value={executionTime}
            onChange={(e) => setExecutionTime(Number(e.target.value))}
            className="cyber-input w-full rounded-lg p-2"
          />
        </div>
      </div>
      
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cyber-button w-full rounded-lg p-3 flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-orbitron">Initialize Process</span>
      </motion.button>
    </form>
  );
}