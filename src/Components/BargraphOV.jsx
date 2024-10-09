import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BarChart = ({ categoriesCounts, setClickedData }) => {
    const defaultData = {
        category: 'Select a bar',
        count: 0,
        items: []
    };

    const labels = categoriesCounts?.map(item => item.category);
    const data = categoriesCounts?.map(item => item.count);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Total Counts',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: true, // Enable tooltip
                callbacks: {
                    title: (tooltipItems) => {
                        // Get the index of the hovered item
                        const index = tooltipItems[0].dataIndex;
                        // Get the category name
                        return categoriesCounts[index].category;
                    },
                    label: (tooltipItem) => {
                        // Get the index of the hovered item
                        const index = tooltipItem.dataIndex;
                        // Get the count and items for the hovered category
                        const { count, items } = categoriesCounts[index];
                        // Return the formatted tooltip text
                        return [
                            `Count: ${count}`,
                            `Items: ${items.join(', ')}`
                        ];
                    }
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                        weight: 'bold',
                        color: 'black'
                    }
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 14,
                        weight: 'bold',
                        color: 'black'
                    }
                },
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const elementIndex = elements[0].index;
                const clickedItem = categoriesCounts[elementIndex];
                setClickedData(clickedItem);
                console.log('Clicked Data:', clickedItem); // For debugging
            }
        }
    };

    return (
        <div>
            <div>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default BarChart;
