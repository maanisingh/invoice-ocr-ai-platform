import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="text"
          size="large"
          onClick={toggleTheme}
          className="flex items-center justify-center"
          icon={
            <motion.div
              initial={false}
              animate={{
                rotate: isDarkMode ? 180 : 0,
                scale: isDarkMode ? 1.2 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
            >
              {isDarkMode ? (
                <BulbFilled className="text-2xl text-yellow-400" />
              ) : (
                <BulbOutlined className="text-2xl text-gray-600" />
              )}
            </motion.div>
          }
        />
      </motion.div>
    </Tooltip>
  );
};

export default ThemeToggle;
