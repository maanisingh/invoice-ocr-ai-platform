import React from 'react';
import { Card, Statistic, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface AnimatedMetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: string;
  gradient?: string;
  delay?: number;
  precision?: number;
  progress?: number;
  description?: string;
  loading?: boolean;
}

const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  trend,
  trendLabel,
  color = '#1890ff',
  gradient,
  delay = 0,
  precision = 0,
  progress,
  description,
  loading = false,
}) => {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  const cardStyle = gradient
    ? {
        background: gradient,
        border: 'none',
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
    >
      <Card
        loading={loading}
        bordered={false}
        style={cardStyle}
        className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 rounded-full bg-white/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className={`text-sm mb-1 ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
                {title}
              </p>
              <Statistic
                value={value}
                precision={precision}
                prefix={
                  <span className={gradient ? 'text-white' : ''}>
                    {prefix}
                  </span>
                }
                suffix={
                  <span className={gradient ? 'text-white' : ''}>
                    {suffix}
                  </span>
                }
                valueStyle={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: gradient ? '#ffffff' : color,
                }}
                formatter={(val) => (
                  <CountUp
                    end={Number(val)}
                    duration={2}
                    separator=","
                    decimals={precision}
                    decimal="."
                  />
                )}
              />
            </div>

            {icon && (
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
                className={`text-4xl ${gradient ? 'text-white/60' : ''}`}
                style={{ color: gradient ? undefined : color }}
              >
                {icon}
              </motion.div>
            )}
          </div>

          {description && (
            <p className={`text-xs mb-3 ${gradient ? 'text-white/70' : 'text-gray-500'}`}>
              {description}
            </p>
          )}

          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
              className={`flex items-center gap-2 text-sm ${
                isPositiveTrend
                  ? gradient
                    ? 'text-green-300'
                    : 'text-green-600'
                  : gradient
                  ? 'text-red-300'
                  : 'text-red-600'
              }`}
            >
              {isPositiveTrend ? (
                <ArrowUpOutlined className="text-xs" />
              ) : (
                <ArrowDownOutlined className="text-xs" />
              )}
              <span className="font-semibold">
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className={gradient ? 'text-white/60' : 'text-gray-500'}>
                {trendLabel || 'vs last period'}
              </span>
            </motion.div>
          )}

          {progress !== undefined && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + 0.6, duration: 0.8 }}
              className="mt-3"
              style={{ transformOrigin: 'left' }}
            >
              <Progress
                percent={progress}
                strokeColor={{
                  '0%': color,
                  '100%': gradient ? '#ffffff' : color,
                }}
                trailColor={gradient ? 'rgba(255,255,255,0.2)' : undefined}
                showInfo={false}
                strokeWidth={6}
              />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default AnimatedMetricCard;
