import React from 'react';
import { Switch, Tooltip, Badge } from 'antd';
import { ExperimentOutlined, DatabaseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useDemoMode } from '../contexts/DemoModeContext';

const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <Tooltip
      title={
        isDemoMode
          ? 'Demo Mode Active: 150+ sample invoices | Click to switch to live data'
          : 'Live Data Mode | Click to view demo with sample data'
      }
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: isDemoMode ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: isDemoMode ? Infinity : 0,
            repeatDelay: 5,
          }}
        >
          {isDemoMode ? (
            <Badge dot color="purple">
              <ExperimentOutlined className="text-purple-600 dark:text-purple-400 text-base" />
            </Badge>
          ) : (
            <DatabaseOutlined className="text-gray-500 dark:text-gray-400 text-base" />
          )}
        </motion.div>

        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 hidden md:inline">
          {isDemoMode ? 'Demo' : 'Live'}
        </span>

        <Switch
          checked={isDemoMode}
          onChange={toggleDemoMode}
          size="small"
          className={isDemoMode ? 'bg-purple-600' : ''}
        />
      </div>
    </Tooltip>
  );
};

export default DemoModeToggle;
