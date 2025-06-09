import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext/ThemeContext';

const PieChart = ({ pendingTask = [], todayTask = [] }) => {
  const { theme } = useTheme();

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const allTasks = [...todayTask, ...pendingTask];
    if (!allTasks.length) {
      return { done: 0, inProgress: 0, pending: 0 };
    }

    return {
      done: allTasks.filter((t) => t.status?.toLowerCase() === 'closed').length,
      inProgress: allTasks.filter((t) => t.status?.toLowerCase() === 'in progress').length,
      pending: allTasks.filter((t) => t.status?.toLowerCase() === 'open').length,
    };
  }, [todayTask, pendingTask]);

  // Pie chart data
  const pieData = useMemo(
    () => ({
      labels: ['Done', 'In Progress', 'Pending'],
      datasets: [
        {
          data: [taskStats.done, taskStats.inProgress, taskStats.pending],
          backgroundColor: ['hsl(160, 80%, 80%)', 'hsl(150, 85%, 40%)', 'hsl(160, 80%, 95%)'],
          borderColor: ['hsl(160, 100%, 35%)', 'hsl(160, 100%, 40%)', 'hsl(160, 75%, 50%)'],
          borderWidth: 2,
        },
      ],
    }),
    [taskStats]
  );

  // Pie chart options
  const pieOptions = useMemo(
    () => ({
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: theme === 'light' ? 'hsl(216, 15%, 9%)' : 'hsl(216, 12%, 84%)',
            font: { size: 14 },
          },
        },
        tooltip: {
          backgroundColor: theme === 'light' ? 'hsl(223, 7%, 18%)' : 'hsl(223, 7%, 28%)',
          titleColor: 'hsl(0, 0%, 100%)',
          bodyColor: 'hsl(0, 0%, 100%)',
        },
      },
      maintainAspectRatio: false,
    }),
    [theme]
  );

  // Fallback UI for no tasks
  if (!taskStats.done && !taskStats.inProgress && !taskStats.pending) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No tasks available
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};

export default PieChart;