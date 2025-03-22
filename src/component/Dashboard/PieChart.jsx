import React, { useEffect, useState } from 'react'
import { use } from 'react';
import { Pie } from 'react-chartjs-2'

const PieChart = ({ dashboardContent }) => {
    const [taskStats, setTaskStats] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pieData = {
        labels: ['Done', 'In Progress', 'Pending'],
        datasets: [
            {
                data: [taskStats.done, taskStats.inProgress, taskStats.pending],
                backgroundColor: ['hsl(160, 80%, 80%)', 'hsl(150, 85%, 40%)', 'hsl(160, 80%, 95%)'],
                borderColor: ['hsl(160, 100%, 35%)', 'hsl(160, 100%, 40%)', 'hsl(160, 75%, 50%)'],
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: isDarkMode ? '#d1d5dc' : 'hsl(216, 15%, 9%)', font: { size: 14 } },
            },
            tooltip: {
                backgroundColor: 'hsl(223, 7%, 18%)',
                titleColor: 'hsl(0, 0%, 100%)',
                bodyColor: 'hsl(0, 0%, 100%)',
            },
        },
        maintainAspectRatio: false,
    };
    const calculateTaskStats = () => {
        const allTasks = [...dashboardContent.todayTasks.items, ...dashboardContent.pendingTasks.items];
        return {
            done: allTasks.filter((t) => t.status === 'done').length,
            inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
            pending: allTasks.filter((t) => t.status === 'pending').length,
        };
    };

    useEffect(() => {
        setTaskStats(calculateTaskStats())
    }, [dashboardContent])

    useEffect(()=>{
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        // Initial check
        checkDarkMode(); 

        let observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        // Cleanup observer on unmount
        return ()=> observer.disconnect();
    })

    return <Pie data={pieData} options={pieOptions} />
}

export default PieChart