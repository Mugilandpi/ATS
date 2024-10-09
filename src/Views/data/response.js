// src/App.js

export const bargraphdata = {
    labels: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'GraphQL'],
    datasets: [
        {
            label: 'Proficiency Level',
            data: [80, 70, 65, 60, 85, 50, 40], // Proficiency levels (out of 100)
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};

export const optionsForBarGraph = {
    scales: {
        x: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Skills',
            },
        },
        y: {
            beginAtZero: true,
            max: 100, // Set the maximum value for the y-axis to 100
            title: {
                display: true,
                text: 'Proficiency (%)',
            },
            ticks: {
                callback: function (value) {
                    return value + '%'; // Append percentage sign to y-axis labels
                }
            }
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.raw + '%'; // Append percentage sign to tooltips
                }
            }
        }
    }
};


export const radardata = {
    labels: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'GraphQL'],
    datasets: [
        {
            label: 'Candidate Expertise',
            data: [90, 85, 75, 70, 80, 60, 65], // Expertise levels out of 100
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }
    ]
};

export const optionsForRadarChart = {
    scales: {
        r: {
            angleLines: {
                display: true
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
                callback: function (value) {
                    return value + '%'; // Append percentage sign to axis labels
                }
            }
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    return tooltipItem.raw + '%'; // Append percentage sign to tooltips
                }
            }
        }
    }
};

export const events = [
    {
        date: 'January 2020 - Present',
        title: 'Senior Software Engineer',
        subtitle: 'Tech Company XYZ',
        description: 'Leading the development of the company’s flagship product.',
        icon: 'fa-laptop-code',
        iconBg: '#6fba1c',
    },
    {
        date: 'June 2017 - December 2019',
        title: 'Software Engineer',
        subtitle: 'Tech Company ABC',
        description: 'Worked on various web and mobile applications.',
        icon: 'fa-code',
        iconBg: '#00a8ff',
    },
    {
        date: 'January 2015 - May 2017',
        title: 'Junior Software Engineer',
        subtitle: 'Startup XYZ',
        description: 'Assisted in developing new features for the startup’s main product.',
        icon: 'fa-rocket',
        iconBg: '#ff4757',
    },
    {
        date: 'September 2013 - December 2014',
        title: 'Intern',
        subtitle: 'Company DEF',
        description: 'Gained experience in software development and project management.',
        icon: 'fa-graduation-cap',
        iconBg: '#3742fa',
    },
];



