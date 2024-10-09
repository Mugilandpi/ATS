import React, { useEffect, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register the necessary components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ categoriesCounts }) => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const labels = categoriesCounts.map(item => item.category);
    const data = categoriesCounts.map(item => item.count);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Category Counts',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: false
                        },
                        suggestedMin: 0,
                        suggestedMax: Math.max(...data) + 1
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [labels, data]);

    return <canvas ref={canvasRef} id="radarChart" width="270" height="100"></canvas>;
};

export default RadarChart;
