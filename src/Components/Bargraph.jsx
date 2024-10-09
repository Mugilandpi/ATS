// import PropTypes from "prop-types";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJs, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
 
// // Register the components with Chart.js
// ChartJs.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale);
 
// function BarGraph({ barChartData }) {
    
//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             x: {
//                 beginAtZero: true
//             },
//             y: {
//                 beginAtZero: true
//             }   
//         }
//     };

   

//  console.log(barChartData,"mahesh");
//     return <Bar options={options} data={barChartData}/>;
// }
 
// BarGraph.propTypes = {
//     barChartData: PropTypes.shape({
//         labels: PropTypes.arrayOf(PropTypes.string).isRequired,
//         datasets: PropTypes.arrayOf(
//             PropTypes.shape({
//                 label: PropTypes.string.isRequired,
//                 data: PropTypes.arrayOf(PropTypes.number).isRequired,
//                 backgroundColor: PropTypes.oneOfType([
//                     PropTypes.string,
//                     PropTypes.arrayOf(PropTypes.string)
//                 ]).isRequired,
//                 borderColor: PropTypes.oneOfType([
//                     PropTypes.string,
//                     PropTypes.arrayOf(PropTypes.string)
//                 ]),
//                 borderWidth: PropTypes.number
//             })
//         ).isRequired
//     }).isRequired,
//     onClick: PropTypes.func,
// };
 
// export default BarGraph;