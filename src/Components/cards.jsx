import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import PropTypes from "prop-types"
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BarChartComponent = ({ recruiterData, clientSummary, selectedReport, timeToCloseData, roleSummary,
  setRolesName,setProcessroleCount, setSubmissionCandidateCount,setSelectedroleCount,handleChartDataUpdate,timehandlechart,historical_data,final,handleClientDataUpdate,handlehistoricaldata,
  handlesubmission,datanew}) => {

    let historicalData = []
    if(historical_data)
      historicalData = [...Object.entries(historical_data)]
    console.log(historicalData)
  const [clickedIndex, setClickedIndex] = useState(null);
  function BarChartComponent({barChartData}) {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    };

    return <Bar options={options} data={barChartData} />;
  }

  BarChartComponent.propTypes = {
    barChartData: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          data: PropTypes.arrayOf(PropTypes.number).isRequired,
          backgroundColor: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
          ]).isRequired,
          borderColor: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
          ]),
          borderWidth: PropTypes.number
        })
      ).isRequired
    }).isRequired
  };


  // const handleClick = (event) => {
  //   if (!event.active.length) return;

  //   const index = event.active[0].index;
  //   const recruiter = recruiterData[index];

  //   setSelectedCandidateCount(recruiter[1].candidate_count);
  //   setRejectedCount(recruiter[1].rejected_candidates_count);
  //   setSelectedCount(recruiter[1].selected_candidates_count);
  //   setProcessCount(recruiter[1].in_process_candidates_count);
  //   setRecruitersName(recruiter[0]);
  // };
  const roleDataMap = new Map();

  roleSummary?.forEach(clientData => {
    clientData[1].forEach(roleGroup => {
      roleGroup.forEach(roleDetails => {
        const roleName = roleDetails[0];
        const candidateCount = roleDetails[1][1];
        const selectedCount = roleDetails[1][2];
        const rejectedCount = roleDetails[1][3];

        if (roleDataMap.has(roleName)) {
          const existingData = roleDataMap.get(roleName);
          existingData.candidateCount += candidateCount;
          existingData.selectedCount += selectedCount;
          existingData.rejectedCount += rejectedCount;
          roleDataMap.set(roleName, existingData);
        } else {
          roleDataMap.set(roleName, {
            candidateCount: candidateCount,
            selectedCount: selectedCount,
            rejectedCount: rejectedCount,
          });
        }
      });
    });
  });

  const roles = Array.from(roleDataMap.keys());
  const rolePercentages = roles.map(roleName => {
    const data = roleDataMap.get(roleName);
    const closureRate = data.candidateCount > 0 ? (data.selectedCount / data.candidateCount) * 100 : 0;
    return closureRate;
  });

  // pavan

  const dataForChart1 = {
    labels: recruiterData ? [...recruiterData.map(rec => rec[0]), ] : [], 
    datasets: [
      {
        label: "Percentage",
        data: recruiterData ? [...recruiterData.map(rec => rec[1].percentage_of_selected)] : [],
        // data: [...recruiterData.map((rec) => rec[1].percentage_of_selected),totalcandidatecount],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
      },
      
    ],
  };

 const chartOptions1 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Successful closure - Percentage',
        font: {
          size: 18,
        },
      },
    },
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const recruitername = recruiterData[index][0];
        const candidateCount = recruiterData[index][1].candidate_count;
        const rejectedCount = recruiterData[index][1].rejected_candidates_count;
        const selectedCount = recruiterData[index][1].selected_candidates_count;
        const processCount = recruiterData[index][1].in_process_candidates_count;
        const ranked = recruiterData[index][1].ranking;
        console.log("clicked");
        handleChartDataUpdate(candidateCount, rejectedCount, selectedCount, processCount, recruitername,ranked,);
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Recruiters',
          font: {
            size: 16,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Candidate Count',
          font: {
            size: 16,
          },
        },
      },
    },
  };

  // mahesh
  const dataForCharts = {
    labels: datanew ?.map((rec) => rec[0]),
    datasets: [
      {
        label: "total",
        data: datanew ? [...datanew.map(rec => rec[1].candidate_count)] : [],
        // data: [...recruiterData.map((rec) => rec[1].percentage_of_selected),totalcandidatecount],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
      },
      
    ],
  };

 const newchartOption = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Total count',
        font: {
          size: 18,
        },
      },
    },
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const newrecruitername = datanew[index][0];
        const newcandidateCount = datanew[index][1].candidate_count;
        const newrejectedCount = datanew[index][1].rejected_candidates_count;
        const newselectedCount = datanew[index][1].selected_candidates_count;
        const newprocessCount = datanew[index][1].in_process_candidates_count;
        const newranked = datanew[index][1].ranking;
        console.log("clicked");
        handlesubmission(newcandidateCount, newrejectedCount, newselectedCount, newprocessCount, newrecruitername,newranked,);
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Recruiters',
          font: {
            size: 16,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Candidate Count',
          font: {
            size: 16,
          },
        },
      },
    },
  };
  

  //   avadhut
  const dataForChart = {
    labels: clientSummary?.map((rec) => rec[0]),
    datasets: [
      {
        label: "Closure Rate",
        data: clientSummary?.map((rec) => rec[1][2]),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
        barThickness: 'flex',
        maxBarThickness: 25, // Set the maximum bar thickness
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Clients Report',
        font: {
          size: 18,
        },
      },
    },
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const clientname = clientSummary[index][0];
        const clientcount = clientSummary[index][1][0];
        const clientrejectedCount = clientSummary[index][1][3];
        const clientselectedCount = clientSummary[index][1][1];
        const clientprocessCount = clientcount-clientrejectedCount-clientselectedCount;

        handleClientDataUpdate(clientname, clientcount, clientrejectedCount, clientselectedCount, clientprocessCount);
        console.log(clientname, clientcount, clientrejectedCount, clientselectedCount, clientprocessCount);
      }
    },

    scales: {
      x: {
        title: {
          display: true,
          text: 'Recruiters',
          font: {
            size: 16,
            barPercentage: 0.4, 
            categoryPercentage: 0.6, 
          },
        },
        ticks: {
          maxTicksLimit: 60,  // Ensure all labels are shown
          autoSkip: false,    // Do not skip any labels
          minRotation: 45,    // Rotate labels if necessary
          maxRotation: 45,    // Rotate labels if necessary
        },
        grid: {
          offset: true, // This will offset the bars in the center
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Candidate Count',
          font: {
            size: 16,
          },
        },
      },
    },
  };
  //   fiza
  const dataForChart2 = {
    labels: timeToCloseData?.map((rec) => rec.recruiter_name),
    datasets: [
      {
        label: "Avg Closure in Days",
        data: timeToCloseData?.map((rec) => rec.average_days_to_close),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
        barThickness: 25,
      },
    ],
  };


  const chartOptions2 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Clients Report',
        font: {
          size: 18,
        },
      },
    },
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index; 

        const clickedData = timeToCloseData[index];
        
        if (clickedData) {
          const timerecruitername = clickedData.recruiter_name;
          const totalcandidatescount = clickedData.total_candidates_count;
          const totalonboardcount = clickedData.count_of_onboarded_positions;
          const onboardedpercentage = clickedData.percentage_onboarded;
          const ranking = clickedData.ranking;
          timehandlechart(totalcandidatescount,ranking,totalonboardcount,onboardedpercentage,timerecruitername);
          console.log(clickedData.count_of_onboarded_positions,"rfwetwe")
         
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Recruiters',
          font: {
            size: 16,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Avg closure time',
          font: {
            size: 16,
          },
        },
      },
    },
  };
  //   mugilan
  const dataForChartrole = {
    labels: roles,
    datasets: [
      {
        label: "Closure Rate (%)",
        data: rolePercentages,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
        barThickness: 'flex',
        maxBarThickness: 25, 
      },
    ],

  };
  const chartOptionsrole = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Roles Closure Rate',
        font: {
          size: 18,
        },
      },
    },
     onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
       const index = chartElement[0].index;
        const roleName = roles[index];
        const roleData = roleDataMap.get(roleName);

        setSubmissionCandidateCount(roleData.candidateCount);
       setProcessroleCount(roleData.rejectedCount);
         setSelectedroleCount(roleData.selectedCount);
         console.log(roleData.selectedCount,"onboarded count");
    //     setProcessroleCount(roleData.candidateCount - roleData.selectedCount - roleData.rejectedCount);
         setRolesName(roleName);
      }
     },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Roles',
          font: {
            size: 16,
          },
        },
        ticks: {
          maxTicksLimit: 60,  // Ensure all labels are shown
          autoSkip: false,    // Do not skip any labels
          minRotation: 45,    // Rotate labels if necessary
          maxRotation: 45,    // Rotate labels if necessary
        },
        grid: {
          offset: true, 
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Closure Rate (%)',
          font: {
            size: 16,
          },
        },
      },
    },
  };

  // neha
  const fun1 = (index) => {
    let total = 0;
    total = Object.entries(historicalData[index][1].line_graph_data)
      .map((item) => item[1]["Total Candidates Count"])
      .reduce((sum, value) => sum + value, 0);
    return total;
  };
  
  const fun2 = (index) => {
    let total = 0;
    total = Object.entries(historicalData[index][1].line_graph_data)
      .map((item) => item[1]["Onboarded Positions"])
      .reduce((sum, value) => sum + value, 0);
    return total;
  };
  
  const fun3 = (index) => {
    let total = 0;
    total = Object.entries(historicalData[index][1].line_graph_data)
      .map((item) => item[1]["Unsuccessful Closures"])
      .reduce((sum, value) => sum + value, 0);
    return total;
  };
  
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  const HistoricalAnalysisData = {
    labels: final,
    datasets: historical_data
      ? Object.entries(historical_data).map((rec, ind) => ({
          label: rec[0],
          data: [
            ...Object.entries(rec[1].line_graph_data).map(
              (item, indx) => item[1]["Average Days to Close"]
            ),
          ],
          borderColor: getRandomColor(),
          backgroundColor: getRandomColor(),
          pointBorderColor: getRandomColor(),
          pointBackgroundColor: getRandomColor(),
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
        }))
      : [],
  };
  
  const HistoricalAnalysisOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        onClick: (e, legendItem, legend) => {
          const datasetIndex = legendItem.datasetIndex;
          const historicalname = HistoricalAnalysisData.datasets[datasetIndex].label;
          const historicalcount = fun1(datasetIndex);
          const historicalrejectedcount = fun3(datasetIndex);
          const historicalselectedCount = fun2(datasetIndex);
          const historicalprocessCount = historicalcount - historicalrejectedcount - historicalselectedCount;
  
          handlehistoricaldata(historicalname, historicalcount, historicalrejectedcount, historicalselectedCount, historicalprocessCount);
          console.log(historicalname, historicalcount, historicalrejectedcount, historicalselectedCount, historicalprocessCount);
        }
      },
      title: {
        display: true,
        text: 'Recruiter Conversions Over Months',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Conversions',
        },
      },
    },
  };


//   const dataForChart5 = {
//     labels: recruiterData ? [...recruiterData.map(rec => rec[0]), ] : [], 
//     datasets: [
//       {
//         label: "Percentage",
//         data: recruiterData ? [...recruiterData.map(rec => rec[1].percentage_of_selected)] : [],
//         // data: [...recruiterData.map((rec) => rec[1].percentage_of_selected),totalcandidatecount],
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderWidth: 1,
//       },
      
//     ],
//   };

//  const chartOptions5 = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: true,
//         text: 'Successful closure - Percentage',
//         font: {
//           size: 18,
//         },
//       },
//     },
//     onClick: (_, chartElement) => {
//       if (chartElement.length > 0) {
//         const index = chartElement[0].index;
//         const recruitername = recruiterData[index][0];
//         const candidateCount = recruiterData[index][1].candidate_count;
//         const rejectedCount = recruiterData[index][1].rejected_candidates_count;
//         const selectedCount = recruiterData[index][1].selected_candidates_count;
//         const processCount = recruiterData[index][1].in_process_candidates_count;
//         const ranked = recruiterData[index][1].ranking;
//         console.log("clicked");
//         handleChartDataUpdate(candidateCount, rejectedCount, selectedCount, processCount, recruitername,ranked,);
//       }
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Recruiters',
//           font: {
//             size: 16,
//           },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Candidate Count',
//           font: {
//             size: 16,
//           },
//         },
//       },
//     },
//   };
  const calculateWidth = (labels) => {
    const minWidth = 500; 
    const widthPerLabel = 30; 
    return Math.max(minWidth, labels?.length * widthPerLabel);
  };
  const calculatesWidth = (roles) => {
    const baseWidth = 50; // Adjust based on how wide you want each label
    return roles.length * baseWidth;
  };

  
  const calculateWidthForRoles = (labels) => {
    const minWidth = 500; 
    const widthPerLabel = 30; 
    return Math.max(minWidth, labels?.length * widthPerLabel);
  };
  
  return (
    <div>
   

      {selectedReport === "client_analysis" && (
         <div style={{ width: `${calculateWidth(clientSummary?.map((rec) => rec[0]))}px`,height:"500px" }}>
        <Bar data={dataForChart} options={chartOptions} selectedReport="client_analysis" />
        </div>
      )}

      <div>
      {selectedReport === "successful_submission" && (
        <Bar data={dataForChart1} options={chartOptions1} selectedReport="successful_submission" />
      )}
      {selectedReport === "time_to_close_analysis" && (
        <Bar data={dataForChart2} options={chartOptions2} selectedReport="time_to_close_analysis" />
      )}
  
 
    {selectedReport === "job_type_analysis" && (
         <div style={{ width: `${calculateWidthForRoles(roles)}px`, height: "500px" }}>
      <Bar data={dataForChartrole} options={chartOptionsrole} selectedReport="job_type_analysis" />
   
      </div> )}


      {selectedReport === "historical_performance_analysis" && (
          <Line data={HistoricalAnalysisData} options={HistoricalAnalysisOptions} selectedReport="job_type_analysis"/>
        )}
        {selectedReport === "submission_analysis" && (
        <Bar data={dataForCharts} options={newchartOption} selectedReport="submission_analysis" />
        )}
    </div>
    </div>

  );
};

export default BarChartComponent;
