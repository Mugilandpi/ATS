import React, { useState, useEffect } from "react";
import LeftNav from "../../Components/LeftNav";
import TitleBar from "../../Components/TitleBar";
import "../../Components/leftnav.css";
import "../../Components/titlenav.css";
import "./SubmissionSummary.css";
import { format } from 'date-fns';
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { utils as XLSXUtils, writeFile as writeExcelFile } from "xlsx";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { MdFilterAlt } from "react-icons/md";
import {
  BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

Modal.setAppElement('#root');

function SubmissionSummary() {
  const [message, setMessage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [recruiters, setRecruiters] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [tableData, setTableData] = useState({});
  const [showExportButton, setShowExportButton] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecruiterForDetails, setSelectedRecruiterForDetails] = useState(null);
  const [recruiterData, setRecruiterData] = useState([]);
  const [recruitersname, setrecruitersname] = useState([]);
  const { recruiters: rdxRecruiters, managers } = useSelector(
    (state) => state.userSliceReducer,
  );
  const [summary, setSummary] = useState([]);
  const [totalSummary, setTotalSummary] = useState({});

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const data = [...rdxRecruiters.map((item) => item.name)];
        setRecruiters(data || []);
      } catch (error) {
        console.error("Error fetching recruiters:", error);
      }
    };

    fetchRecruiters();
  }, [rdxRecruiters]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

 
  const [error, setError] = useState("");
 
  const handleToDateChange = (e) => {
     const selectedDate = new Date(e.target.value);
     const today = new Date();
    
     // Check if the selected date is in the future
     if (selectedDate > today) {
       setError("To Date should not be in the future.");
     } else {
       setError(""); // Clear error if the date is valid
     }
  
     setToDate(e.target.value);
   };
  

  const handleRecruiterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRecruiters((prevRecruiters) => [...prevRecruiters, value]);
    } else {
      setSelectedRecruiters((prevRecruiters) =>
        prevRecruiters.filter((recruiter) => recruiter !== value),
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), 'dd-MM-yyyy');
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedRecruiters(recruiters);
    } else {
      setSelectedRecruiters([]);
    }
  };

  const handleSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      const today = new Date();
      if (new Date(fromDate) > new Date(toDate)) {
        setwaitForSubmission(false);
        toast.error("From Date should be earlier than To Date");
      }
      else if (selectedRecruiters.length === 0) {
        setwaitForSubmission(false);
        toast.error("Please select at least one recruiter");
      } else {
        setMessage("");
        try {
          const response = await fetch(
            "http://144.126.254.255/generate_excel",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: localStorage.getItem("user_id"),
                from_date: formatDate(fromDate),
                to_date: formatDate(toDate),
                recruiter_names: selectedRecruiters,
              }),
            },
          );
          if (response.ok) {
            const data = await response.json();
            setwaitForSubmission(false);
            const parsedTableData = JSON.parse(data.pivot_table);
            setTableData(parsedTableData);
            // setTotalSummary(data);
            setShowExportButton(true);

          } else {
            console.log(response.statusText);
          }
        } catch (error) {
          setwaitForSubmission(false);
          console.error("Error fetching data:", error);
          setMessage("Error fetching data");
        }
      }
    }
  };

  const handleRecruitersReport = async () => {
    // setModalIsOpen(true);
    try {
      const response = await fetch("http://144.126.254.255/analyze_recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          from_date: formatDate(fromDate),
          to_date: formatDate(toDate),
          recruiter_names: selectedRecruiters,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data);
        const dataArray = Object.entries(data.recruiter_data)
        console.log(dataArray, "Array")
        setRecruiterData(dataArray)
        settotalcandidatecount(data.total_candidate_count)
        settotalcandidateselected(data.total_selected_candidates)
        settotalcandidaterejected(data.total_rejected_candidates_count)
        settotalcandidatepending(data.total_process_candidates_count)
        console.log(dataArray);
        dataArray.map((rec, ind) => {
          console.log(rec[1].candidate_count);
        })
        setSummary(dataArray);


        setModalIsOpen(true);
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error fetching data");
    }
  };



  const generateTableHeaders = () => {
    const dates = Object.keys(tableData);
    return (
      <tr>
        <th>Recruiters</th>
        {dates.map((date) => (
          <th key={date}>{date}</th>
        ))}
      </tr>
    );
  };

  const generateTableRows = () => {
    const recruiters = Object.keys(tableData["Grand Total"] || {});
    return recruiters.map((recruiter) => (
      <tr
        key={recruiter}
        style={{
          backgroundColor: recruiter === "Grand Total" ? "white" : "inherit",
        }}
      >
        <td style={{ backgroundColor: "white", color: "black" }}>{recruiter}</td>
        {Object.keys(tableData).map((date) => (
          <td key={date}>{tableData[date][recruiter] || 0}</td>
        ))}
      </tr>
    ));
  };

  const handleExportToExcel = () => {
    const headers = Object.keys(tableData);
    const recruiters = Object.keys(tableData["Grand Total"] || {});

    const excelData = [
      ["Recruiter", ...headers],
      ...recruiters.map((recruiter) => [
        recruiter,
        ...headers.map((date) => tableData[date][recruiter] || 0),
      ]),
    ];
    console.log(excelData);

    const wb = XLSXUtils.book_new();
    const ws = XLSXUtils.aoa_to_sheet(excelData);
    XLSXUtils.book_append_sheet(wb, ws, "SubmissionSummary");

    writeExcelFile(wb, "SubmissionSummary.xlsx");
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const styles = {
    th: {
      backgroundColor: "#32406D",
      padding: "10px 2px 10px 2px",
      fontSize: "14px",
    },
    arrow: {
      textAlign: "right",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "-3px",
    },
  };

  const listOfHeadings = {
    Recruiters: (
      <th style={styles.th}>
        <span>Recruiters </span>
        <MdFilterAlt className="arrow" style={styles.arrow} />
      </th>
    ),
    No_of_Candidates: (
      <th style={styles.th}>
        <span>No of Candidates </span>
        <MdFilterAlt className="arrow" style={styles.arrow} />
      </th>
    ),
    Successful: (
      <th style={styles.th}>
        <span>Successful </span>
        <MdFilterAlt className="arrow" style={styles.arrow} />
      </th>
    ),
    Rejected: (
      <th style={styles.th}>
        <span>Rejected </span>
        <MdFilterAlt className="arrow" style={styles.arrow} />
      </th>
    ),
    Percentage: (
      <th style={styles.th}>
        <span>Percentage </span>
        <MdFilterAlt className="arrow" style={styles.arrow} />
      </th>
    ),
    Rankings: (
      <th style={styles.th}>
        <span>Rankings </span>
        <MdFilterAlt className="arrow" style={styles.arrow} />
      </th>
    ),
  };
  const list = [
    "Recruiters",
    "No_of_Candidates",
    "Successful",
    "Rejected",
    "Percentage",
    "Rankings"
  ];
  const list1 = [
    "Recruiters",
    "No_of_Candidates",
  ];
  const openModal = () => {
    setModalIsOpen(true);
  };
  const displayColumns = [
    "Recruiters",
    "No_of_Candidates",
    "Successful",
    "Rejected",
    "In_Process",
    "Percentage",
    "Rankings"
  ];
  const [selectedCandidateCount, setSelectedCandidateCount] = useState(null);
  const [rejectedcount, setrejectedcount] = useState(null);
  const [selectedCount, setselectedcount] = useState(null);
  const [processCount, setprocessCount] = useState(null);
  const [selectedCandidateCountnew, setSelectedCandidateCountnew] = useState(null);
  const [rejectedcountnew, setrejectedcountnew] = useState(null);
  const [selectedCountnew, setselectedcountnew] = useState(null);
  const [processCountnew, setprocessCountnew] = useState(null);
  const [totalcandidatecount,settotalcandidatecount] = useState(0);
  const [totalcandidateselected,settotalcandidateselected] = useState(0);
  const [totalcandidaterejected,settotalcandidaterejected] = useState(0);
  const [totalcandidatepending,settotalcandidatepending] = useState(0);




  const dataForChart = {
    labels: recruiterData.map((rec) => rec[0]),
    datasets: [
      {
        label: "Candidate Count",
        data: recruiterData.map((rec) => rec[1].candidate_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Recruiter Performance - Candidate Count',
        font: {
          size: 18,
        },
      },
    },
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const recruitername = recruiterData[index][0].recruiters;
        const candidateCount = recruiterData[index][1].candidate_count;
        const rejectedCount = recruiterData[index][1].rejected_candidates_count;
        const selectedCount = recruiterData[index][1].selected_candidates_count;
        const processCount = recruiterData[index][1].in_process_candidates_count;
        setSelectedCandidateCount(candidateCount);
        setrejectedcount(rejectedCount);
        setselectedcount(selectedCount);
        setprocessCount(processCount);
        setrecruitersname(recruitername);

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
  const dataForChart1 = {
    labels: [...recruiterData.map((rec) => rec[0]),"total"],
    datasets: [
      {
        label: "Candidate Count",
        data: [...recruiterData.map((rec) => rec[1].percentage_of_selected),totalcandidatecount],
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
        text: 'successful conversion - Percentage',
        font: {
          size: 18,
        },
      },
    },
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const recruiternamenew = recruiterData[index][0].recruiters;
        const candidateCountnew = recruiterData[index][1].candidate_count;
        const rejectedCountnew = recruiterData[index][1].rejected_candidates_count;
        const selectedCountnew = recruiterData[index][1].selected_candidates_count;
        const processCountnew = recruiterData[index][1].in_process_candidates_count;
        const totalcandidatecount = recruiterData[index][1].total_candidate_count;
        setSelectedCandidateCountnew(candidateCountnew);
        setrejectedcountnew(rejectedCountnew);
        setselectedcountnew(selectedCountnew);
        setprocessCountnew(processCountnew);
        setrecruitersnamenew(recruiternamenew);

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
          text: 'Percentage',
          font: {
            size: 16,
          },
        },
      },
    },
  };
  const sortedSummary = summary
    .map(item => ({
      ...item,
      1: {
        ...item[1],
        ranking: item[1].ranking === 0 ? '-' : item[1].ranking
      }
    }))
    .sort((a, b) => (a[1].ranking === '-' ? 1 : b[1].ranking === '-' ? -1 : a[1].ranking - b[1].ranking));

  const barData = sortedSummary.map(rec => ({
    name: rec[0],
    percentageSelected: typeof rec[1].percentage_of_selected === 'string'
    ? parseFloat(rec[1].percentage_of_selected.replace('%', ''))
    : rec[1].percentage_of_selected
}));

  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <h5
          style={{
        
          }}
          className="submissionreport"
        >
          Recruiter's Submission Report
        </h5>
        <div className="container5">
          {message && (
            <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
              {message}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            className="ss_form"
            style={{ height: "350px" }}
          >
            <div className="filter-container">
              <div>
                <label htmlFor="from_date" className="align">From Date:</label>
                <input
                  type="date"
                  id="from_date"
                  name="from_date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  required
                />
              </div>
              <div >
                <label htmlFor="to_date" className="align">To Date:</label>
                <input
                  type="date"
                  id="to_date"
                  name="to_date"
                  value={toDate}
                  onChange={handleToDateChange}
                  required
                />
              </div>
            </div>
           
 {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
 
            <div
              style={{
                fontWeight: "500",
                marginTop: "-18px",
                marginLeft: "-12px",
              }}
            >
              Select Recruiters:
            </div>
            <div
              className="select-recruiter-container"
              style={{ height: "205px", overflowY: "scroll" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                }}
              >
                <input
                  type="checkbox"
                  name="select_all"
                  style={{ width: "14px", marginTop: "-6px" }}
                  checked={
                    recruiters.length > 0 &&
                    selectedRecruiters.length === recruiters.length
                  }
                  onChange={handleSelectAllChange}
                />
                <label style={{ marginLeft: "8px" }}>Select All</label>
              </div>
              {recruiters.map((recruiter, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    marginTop: "-10px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="recruiter_names"
                    value={recruiter}
                    checked={selectedRecruiters.includes(recruiter)}
                    onChange={handleRecruiterChange}
                  />
                  <label style={{ marginLeft: "8px", marginTop: "6px" }}>
                    {recruiter}
                  </label>
                </div>
              ))}
            </div>
            <div className="buttons-container1" style={{ display: "flex" }}>
              <button
                type="submit"
                className="button_ss"
                name="action"
                value="View Reports"
                style={{ marginLeft: "-12px", marginTop:"-10px" }}
              >
                {waitForSubmission ? "" : "View Reports"}
                <ThreeDots
                  wrapperClass="ovalSpinner"
                  wrapperStyle={{
                    position: "relative",
                    top: "0px",
                    left: "-5px",
                  }}
                  visible={waitForSubmission}
                  height="45"
                  width="45"
                  color="white"
                  ariaLabel="oval-loading"
                />
              </button>
         

              {showExportButton && (
                <button
                type="button"
                className="button_ss"
                onClick={handleExportToExcel}
                style={{ marginLeft: "10px", marginTop:"-10px" }}
              >  
                  Export to Excel
                </button>
              )}
            </div>
          </form>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}

            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,

              },
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                height: "85vh",
                width: "85%",
                overflow: "auto",
                padding: "40px",
                border: "2px solid #32406D",
                backgroundColor: "#fff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                WebkitBackdropFilter: "blur(8px)",
                backdropFilter: "blur(8px)",
              },
            }}
          >
            <div style={{ marginBottom: '10px' }} >
            <div style={{ position: "sticky",top:"-40px", zIndex: "999", backgroundColor: "#32406D",marginTop:"-60px",height:"40px",borderRadius:"3px" }}>
              <h3 style={{ color: "white", textAlign: "center" }}>
                Recruiter's Report :<span style={{ color: "green", paddingRight: "10px" }}>{recruitersname}</span>
              </h3>
            </div>

            <div className="dashcontainer" style={{marginTop:"50px"}}>
            <div style={{marginTop:"5px",height:"95%" }}>
            <div
              style={{
                display: "flex",
                marginLeft: "50px",
                marginTop: "30px",
                
              }}
            >
              <div className="cards" style={{ backgroundColor: "#f2c064" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Submissions</h3>
                </div>
                <div className="card-footers">
                  <p>{selectedCandidateCount}</p>
                </div>

              </div>

              <div
                className="cards"
                style={{ backgroundColor: "#d14545d1" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Reject</h3>
                </div>
                <div className="card-footers">
                  <p>{rejectedcount}</p>
                </div>
              </div>
              <div
                className="cards"
                style={{ backgroundColor: "lightgreen" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Selected</h3>
                </div>
                <div className="card-footers">
                  <p>{selectedCount}</p>
                </div>
              </div>
              <div className="cards" style={{ backgroundColor: "#6fafdb" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Feedback</h3>
                </div>
                <div className="card-footers">
                  <p></p>
                </div>
              </div>
            </div>

            <div style={{ width: "auto", marginTop: "30px" }}>
              <Bar data={dataForChart} options={chartOptions} style={{ width: "50%" }} />

            </div>
            </div>
            </div>
           
            <div className="dashcontainer" style={{marginTop:"30px"}}>
            <div
              style={{
                display: "flex",
                marginLeft: "50px",
                marginTop: "30px",
              }}
            >
              <div className="cards" style={{ backgroundColor: "#f2c064" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Submissions</h3>
                </div>
                <div className="card-footers">
                  <p>{selectedCandidateCountnew}</p>
                </div>

              </div>

              <div
                className="cards"
                style={{ backgroundColor: "#d14545d1" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Reject</h3>
                </div>
                <div className="card-footers">
                  <p>{rejectedcountnew}</p>
                </div>
              </div>
              <div
                className="cards"
                style={{ backgroundColor: "lightgreen" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Selected</h3>
                </div>
                <div className="card-footers">
                  <p>{selectedCountnew}</p>
                </div>
              </div>
              <div className="cards" style={{ backgroundColor: "#6fafdb" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Feedback</h3>
                </div>
                <div className="card-footers">
                  <p>{processCountnew}</p>
                </div>
              </div>
            </div>

          
            <div className="dashcontainer" style={{ marginTop: "30px", marginBottom: '10px' }}>
              <h3 style={{ color: "#32406D", textAlign: "center" }}>Successful Conversion Summary</h3 >
              <div
                className="table-container"
                style={{
                  overflowY: "auto",
                  marginTop: "3px",
                  overflowX: "auto",
                  height: "300px",
                  scrollbarWidth: "none",

                }}
              >
                <table className="max-width-fit-content table" id="candidates-table"
                  style={{
                    tableLayout: "fixed",
                    width: "100%",
                    marginTop: "-5px",

                  }}>
                  <thead >
                    <tr>
                      {displayColumns.map((key) => (
                        <th key={key} style={styles.th}>
                          <span>{key}</span>
                          {/* <MdFilterAlt className="arrow" style={styles.arrow} /> */}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="scrollable-body">
                    {
                      sortedSummary.map((rec, ind) => (

                        <tr key={ind}>
                          <td >{rec[0]}</td>
                          <td >{rec[1].candidate_count}</td>
                          <td >{rec[1].selected_candidates_count}</td>
                          <td style={{ color: "black" }}>{rec[1].rejected_candidates_count}</td>
                          <td style={{ color: "black" }}>{rec[1].in_process_candidates_count}</td>
                          <td style={{ color: "black" }}>{rec[1].percentage_of_selected}</td>
                          <td style={{ color: "black" }}>{rec[1].ranking}</td>
                        </tr>


                      ))
                    }
                  </tbody>

                </table>
              </div>
            </div>
            <div style={{ width: "auto", marginTop: "30px" }}>
              <Bar data={dataForChart} options={chartOptions}  />

            </div>
            </div>
            </div>

           
          </Modal>

          {tableData && Object.keys(tableData).length > 0 && (
            <div
              className="view-table-container"
              style={{
                flex: 1,
                overflow: "auto",
                marginTop: "10px",
                width: "90%",
                marginLeft: "68px",
                borderRadius: "5px",
              }}
            >
              <table className="submission-table">
                <thead>{generateTableHeaders()}</thead>
                <tbody>{generateTableRows()}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubmissionSummary;
