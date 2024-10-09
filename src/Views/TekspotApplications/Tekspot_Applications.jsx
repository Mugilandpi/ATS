import React, { useState, useEffect, useRef } from "react";
import LeftNav from "../../Components/LeftNav";
import TitleBar from "../../Components/TitleBar";
import { useSelector } from "react-redux";
import { constructFrom, format } from 'date-fns';
import BarChartComponent from "../../Components/cards";
import SuccessfulConversionSummary from "../../Components/tablecard";
import "./Tekspot_Applications.css";
// import BarGraph from "../../Components/Bargraph";
import { MdCancel } from "react-icons/md";
import { MdCloudDownload } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import { toast } from "react-toastify";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import Modal from "react-modal";
import { motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import EmployeePerformanceTable from "./EmployeePerformanceTable";
import { getDashboardData, getAllRecruitersManagers } from '../utilities'



function Tekspot_Applications() {
  const [selectedCandidateCount, setSelectedCandidateCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [processCount, setProcessCount] = useState(0);
  const [recruitername, setRecruitername] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [waitForSubmission, setwaitForSubmission] = useState(false);

  const dropdownRef = useRef(null);
  const [ranked, setranked] = useState([]);
  const handleChartDataUpdate = (candidateCount, rejectedCount, selectedCount, processCount, recruitername, ranked) => {
    setSelectedCandidateCount(candidateCount);
    setRejectedCount(rejectedCount);
    setSelectedCount(selectedCount);
    setProcessCount(processCount);
    setRecruitername(recruitername);
    setranked(ranked);
  };

  const [newselectedCandidateCount, newsetSelectedCandidateCount] = useState(0);
  const [newrejectedCount, newsetRejectedCount] = useState(0);
  const [newselectedCount, newsetSelectedCount] = useState(0);
  const [newprocessCount, newsetProcessCount] = useState(0);
  const [newrecruitername, newsetRecruitername] = useState('');
  const [newranked, newsetranked] = useState(0);
  const handlesubmission = (newcandidateCount, newrejectedCount, newselectedCount, newprocessCount, newrecruitername, newranked) => {
    newsetSelectedCandidateCount(newcandidateCount);
    newsetRejectedCount(newrejectedCount);
    newsetSelectedCount(newselectedCount);
    newsetProcessCount(newprocessCount);
    newsetRecruitername(newrecruitername);
    newsetranked(newranked);
  }
  const [clientname, setclientname] = useState('');
  const [clientcount, setclientcount] = useState(0);
  const [clientrejectedCount, setclientrejectedCount] = useState(0);
  const [clientselectedCount, setclientselectedCount] = useState(0);
  const [clientprocessCount, setclientprocessCount] = useState(0);

  const handleClientDataUpdate = (clientname, clientcount, clientrejectedCount, clientselectedCount, clientprocessCount) => {
    setclientname(clientname);
    setclientcount(clientcount);
    setclientrejectedCount(clientrejectedCount)
    setclientselectedCount(clientselectedCount)
    setclientprocessCount(clientprocessCount)
  }
  const [totalonboardcount, settotalonboardcount] = useState(0);
  const [onboardedpercentage, setonboardedpercentage] = useState(0);
  const [totalcandidatescount, settotalcandidatescount] = useState(0);
  const [ranking, setranking] = useState(0);
  const [timerecruitername, settimerecruitername] = useState(0)
  const timehandlechart = (totalcandidatescount, ranking, totalonboardcount, onboardedpercentage, timerecruitername) => {
    settotalcandidatescount(totalcandidatescount);
    settotalonboardcount(totalonboardcount);
    setonboardedpercentage(onboardedpercentage);
    setranking(ranking);
    settimerecruitername(timerecruitername);
  }
  const [historicalname, sethistoricalname] = useState(0);
  const [historicalcount, sethistoricalcount] = useState(0);
  const [historicalrejectedcount, sethistoricalrejectedcount] = useState(0);
  const [historicalselectedCount, sethistoricalselectedCount] = useState(0);
  const [historicalprocessCount, sethistoricalprocessCount] = useState(0)
  const handlehistoricaldata = (historicalname, historicalcount, historicalrejectedcount, historicalselectedCount, historicalprocessCount) => {
    sethistoricalname(historicalname);
    sethistoricalcount(historicalcount);
    sethistoricalrejectedcount(historicalrejectedcount);
    sethistoricalselectedCount(historicalselectedCount);
    sethistoricalprocessCount(historicalprocessCount);
  }


  const [wholeData, setWholeData] = useState({});
  const [rotate, setRotate] = useState(true);
  const [recruiterTableData, setRecruiterTableData] = useState([])
  const [columnsForMonths, setColumnsForMonths] = useState([])
  const [columnsForYears, setColumnsForYears] = useState([]);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const [x_data, setXdata] = useState([])
  const [y_data, setYdata] = useState([])
  const [columns, setColumns] = useState(null);
  const [datanew, setdatanew] = useState([]);
  const [recruiterData, setRecruiterData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [historicaldata, sethistoricaldata] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState('submission_counts_daily');

  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [totalCandidateCount, setTotalCandidateCount] = useState(0);
  const [totalCandidatesElected, setTotalCandidatesElected] = useState(0);
  const [totalCandidatesRejected, setTotalCandidatesRejected] = useState(0);
  const [totalCandidatesPending, setTotalCandidatesPending] = useState(0);
  const { recruiters: rdxRecruiters } = useSelector((state) => state.userSliceReducer);


  const [additionalField, setAdditionalField] = useState('');
  const [clientSummary, setClientSummary] = useState([]);
  const { dashboardData } = useSelector((state) => state.dashboardSliceReducer);



  const [timeToCloseData, setTimeToCloseData] = useState([]);

  const [selectedroleCount, setSelectedroleCount] = useState(0);
  const [processroleCount, setProcessroleCount] = useState(0);
  const [recruitersName, setRecruitersName] = useState('');
  const [rolesName, setRolesName] = useState('');

  const [SubmissionCandidateCount, setSubmissionCandidateCount] = useState(0);
  const [roleSummary, setroleSummary] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [overallTotalCount, setOverallTotalCount] = useState(0);
  const [overallSelectedCount, setOverallSelectedCount] = useState(0);
  const chartRef = useRef(null);
  const tableRef = useRef();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [SuccessData, setSuccessData] = useState();

  const [recruiternames, setrecruiternames] = useState(0);
  const [candidateCounts, setcandidateCounts] = useState(0);
  const [rejectedCounts, setrejectedCounts] = useState(0);
  const [selectedCounts, setselectedCounts] = useState(0);
  const [processCounts, setprocessCounts] = useState(0);

  // const handleGraphClick = (_, elements) => {
  //   if (elements.length > 0) {
  //     const index = elements[0].index;
  //     const recruiterNames = SuccessData[index][0].recruiters;
  //     const candidateCounts = SuccessData[index][1].candidate_count;
  //     const rejectedCounts = SuccessData[index][1].rejected_candidates_count;
  //     const selectedCounts = SuccessData[index][1].selected_candidates_count;
  //     const processCounts = SuccessData[index][1].in_process_candidates_count;
  //     setrecruiternames(recruiterNames);
  //     setrejectedCounts(rejectedCounts);
  //     setcandidateCounts(candidateCounts);
  //     setselectedCounts(selectedCounts);
  //     setprocessCounts(processCounts);
  //     console.log(recruiterNames, rejectedCounts, candidateCounts, selectedCounts, processCounts);
  //   }
  // };
  useEffect(() => {
    // handleRecruitersReport();
    setwaitForSubmission(false);
  }, [selectedReport]);

  // useEffect(()=>{
  //     async function getDataOfDashboard(){
  //       await getDashboardData()
  //       await getAllJobs()
  //     }
  //     if((selectedReport === "client_analysis" || selectedReport === "job_type_analysis") && Object.keys(dashboardData).length ===0){
  //       // dashboard data
  //       getDataOfDashboard();
  //     }
  // },[selectedReport])

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);


  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCardClick1 = () => {
    setIsModalOpen1(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const captureImage = (ref, fileName) => {
    htmlToImage.toPng(ref.current)
      .then((dataUrl) => {
        saveAs(dataUrl, `${fileName}.png`);
      })
      .catch((error) => {
        console.error('Error capturing image:', error);
      });
  };

  useEffect(() => {
    const fetchRecruiters = async () => {
      if (rdxRecruiters?.length === 0) {
        await getAllRecruitersManagers();
      } else {
        try {
          const data = rdxRecruiters.map((item) => item.name);
          setRecruiters(data || []);
        } catch (error) {
          console.error("Error fetching recruiters:", error);
        }
      }

    };

    fetchRecruiters();
  }, [rdxRecruiters]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
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
  const handleReportChange = (e) => {
    console.log(e.target.value)
    setFromDate("")
    setToDate("")
    setWholeData({})
    setSelectedRecruiters([])
    setRecruiterData([])
    setType("submission_counts_daily")
    setRecruiterTableData([])
    setColumns(null)
    setColumnsForMonths([])
    setColumnsForYears([])
    setdatanew([])
    setSelectedClients([]);
    setSelectedRoles([]);
    setSelectedReport(e.target.value);
    setTotalCandidateCount(0)
    setTotalCandidatesRejected(0)
    setTotalCandidatesElected(0)
    setTotalCandidatesPending(0)
    setSelectedCandClientAnalysis(0)
    setRejectedCandClientAnalysis(0)
    setTotalCandClientAnalysis(0)


    setHistoricalTotal(0);
    setHistoricalSelected(0);
    setHistoricalRejected(0);
    setHistoricalProcess(0);

    setOverallTotalCount(0)
    setOverallSelectedCount(0)

    setTimeTotalCand(0)
    setTimeSelectedCand(0)
    setTimeRejectedCand(0)
    setTimeScreeningCand(0)

    setHistorical_data(null)
    setClientSummary([])
    setTimeToCloseData([])
    setroleSummary([])
    setSummary([])


    //   sortedSummary
    //   historical_data
    // clientSummary
    // timeToCloseData
    // roleSummary

  };


  const handleRecruitersReport = async () => {
    const tempFromDate = new Date(fromDate);
    const tempToDate = new Date(toDate);
    const today = new Date();
    console.log("clicked")
    if (fromDate === "") {
      toast.error("select from date")
    } else if (toDate === "") {
      toast.error("select to date")
    } else if (tempFromDate.getTime() > today.getTime()) {
      toast.error("From Date is ahead of Current Date");
    } else if (tempToDate.getTime() > today.getTime()) {
      toast.error("To Date is ahead of Current Date");
    } else if (tempFromDate.getTime() > tempToDate.getTime()) {
      toast.error("From Date should be earlier than To Date");
    } else if (selectedRecruiters.length === 0) {
      toast.error("Please select at least one recruiter");
    } else if (!waitForSubmission) {
      setwaitForSubmission(true);
      try {
        const response = await fetch("https://ats-9.onrender.com/analyze_recruitment", {
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
          console.log(selectedReport, "selectedReport")
          if (selectedReport === "successful_submission") {
            const dataArray = Object.entries(data.recruiter_data);
            setSummary(dataArray);
            setRecruiterData(dataArray);
            setwaitForSubmission(false);
            setTotalCandidateCount(data.total_candidate_count);
            console.log(data.total_candidate_count);
            setSelectedCandidateCount(data.candidate_count)

            setTotalCandidatesElected(data.total_selected_candidates);
            setTotalCandidatesRejected(data.total_rejected_candidates_count);
            setTotalCandidatesPending(data.total_process_candidates_count);
          }
          // if (selectedReport === "historical_performance_analysis") {
          //   console.log("mknjjnk", selectedReport)
          //   const historicaldataArray = Object.entries(data.historical_performance_analysis);
          //   sethistoricaldata(historicaldataArray);
          //   console.log(historicaldataArray, "historicaldataArray")
          //   setRecruiterData(historicaldataArray);
          //   setTotalCandidateCount(data.total_candidates_count);
          //   setTotalCandidatesElected(data.count_of_onboarded_positions);
          //   setTotalCandidatesRejected(data.total_rejected_candidates_count);
          //   setTotalCandidatesPending(data.count_of_screening_candidates);
          // }
          if (selectedReport === "submission_analysis") {
            const dataArray = Object.entries(data.recruiter_data);
            setdatanew(dataArray);
            setTotalCandidateCount(data.total_candidate_count);
            console.log(data.total_candidate_count);
            setSelectedCandidateCount(data.candidate_count)
            setwaitForSubmission(false);
            setTotalCandidatesElected(data.total_selected_candidates);
            setTotalCandidatesRejected(data.total_rejected_candidates_count);
            setTotalCandidatesPending(data.total_process_candidates_count);
            console.log(data, "whole data")
            setWholeData(data)
            // let datas = Object.keys(wholeData).length === 0? data:wholeData;
            let datas = data;
            if (datas !== null && datas !== undefined && Object.keys(datas).length !== 0) {
              let tempRecruiterData = []
              for (const key of Object.keys(datas["recruiter_data"])) {
                tempRecruiterData.push({ name: key, data: datas["recruiter_data"][key], candidate_count: datas["recruiter_data"][key]["candidate_count"] })
              }
              console.log(tempRecruiterData, "temprecruiterdata")
              if (type === "submission_counts_monthly") {
                middle_function_monthly(tempRecruiterData)
                return;
              }
              if (type === "submission_counts_yearly") {
                middle_function_yearly(tempRecruiterData)
                return;
              }
              const rows = []
              for (const key of Object.keys(datas["recruiter_data"])) {
                rows.push({
                  name: key,
                  days: datas["recruiter_data"][key][type]?.map((item) => item.date_part),
                  count: datas["recruiter_data"][key][type]?.map((item) => item.count),
                })
              }
              console.log(type)
              if (type === 'submission_counts_daily')
                middle_function_daily(rows, datas["recruiter_data"])
              else if (type === 'submission_counts_weekly') {
                middle_function_weekly(rows)
              }
              console.log(rows)
            }
          }
        } else {
          console.log(response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data");
        setwaitForSubmission(false);
      }
    }
  };
  useEffect(() => {
    console.log('main use effect')
    console.log(wholeData, 'wholedata')
    console.log(type)
    if (wholeData !== null && wholeData !== undefined && Object.keys(wholeData).length !== 0) {
      let tempRecruiterData = []
      for (const key of Object.keys(wholeData["recruiter_data"])) {
        tempRecruiterData.push({ name: key, data: wholeData["recruiter_data"][key], candidate_count: wholeData["recruiter_data"][key]["candidate_count"] })
      }
      console.log(tempRecruiterData)
      if (type === "submission_counts_monthly") {
        middle_function_monthly(tempRecruiterData)
        return;
      }
      if (type === "submission_counts_yearly") {
        middle_function_yearly(tempRecruiterData)
        return;
      }
      const rows = []
      for (const key of Object.keys(wholeData["recruiter_data"])) {
        rows.push({
          name: key,
          days: wholeData["recruiter_data"][key][type]?.map((item) => item.date_part),
          count: wholeData["recruiter_data"][key][type]?.map((item) => item.count),
        })
      }
      console.log(type)
      if (type === 'submission_counts_daily')
        middle_function_daily(rows, wholeData["recruiter_data"])
      else if (type === 'submission_counts_weekly') {
        middle_function_weekly(rows)
      }
      console.log(rows)
    }

  }, [type])

  const sortedSummary = summary
    .map(item => ({
      ...item,
      1: {
        ...item[1],
        ranking: item[1].ranking === 0 ? '-' : item[1].ranking
      }
    }))
    .sort((a, b) => (a[1].ranking === '-' ? 1 : b[1].ranking === '-' ? -1 : a[1].ranking - b[1].ranking));

  const handleSelectAll = () => {
    if (selectedRecruiters.length === recruiters.length) {
      // If all are already selected, deselect all
      setSelectedRecruiters([]);
    } else {
      // Otherwise, select all
      setSelectedRecruiters([...recruiters]);
    }
  }

  const handleGenerateExcel = () => {
    handleRecruitersReport(); // Call the report function to fetch data and generate Excel
  };


  const handleAdditionalFieldChange = (e) => {
    setAdditionalField(e.target.value);
  };


  // Avaduth
  const [selectedClients, setSelectedClients] = useState([]);
  const [historical_data, setHistorical_data] = useState(null);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [selectedCandClientAnalysis, setSelectedCandClientAnalysis] = useState(0);
  const [rejectedCandClientAnalysis, setRejectedCandClientAnalysis] = useState(0);
  const [totalCandClientAnalysis, setTotalCandClientAnalysis] = useState(0);

  const [final, setFinal] = useState([]);

  const handleClientReport = () => {

    const uniqueNames1 = selectedClients;
    let clientSummary1 = {};
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    for (let cl of uniqueNames1) {
      let selectedCount = 0;
      let rejectedCount = 0;
      let totalCountArray = [];

      totalCountArray = dashboardData["candidates"].filter(
        (temp) => {
          // console.log("temp", temp);
          // console.log("cl", cl);
          if (temp.client.toLowerCase() === cl.toLowerCase()) {
            if (fromDate && toDate) {
              const date = new Date(temp.date_created);
              if ((date <= endDate) && (date >= startDate)) {
                if (temp?.status === "SELECTED" || temp?.status === "ON-BOARDED") {
                  selectedCount += 1;
                }
                return true;
              }
            }
            else {
              if (temp?.status === "SELECTED" || temp?.status === "ON-BOARDED") {
                selectedCount += 1;
              }
              if ((temp.status.toLowerCase() === "L1-Rejected".toLowerCase()) || (temp.status.toLowerCase() === "L2-Rejected".toLowerCase()) || (temp.status.toLowerCase() === "L3-Rejected".toLowerCase()) || (temp.status.toLowerCase() === "Screen Rejected".toLowerCase()) || (temp.status.toLowerCase() === "Offer-Rejected".toLowerCase())) {
                rejectedCount++;
              }
              return true;
            }
          }
          else return false;
        }
      )
      console.log("totalCountArray", totalCountArray);
      const totalCount = totalCountArray.length;
      let closureRate = 0
      if (totalCount !== 0) closureRate = (selectedCount / totalCount) * 100;

      clientSummary1[cl] = [totalCount, selectedCount, closureRate, rejectedCount];
      console.log(clientSummary1);
    }
    console.log("clientSummary", clientSummary1);
    const arr = Object.entries(clientSummary1);
    let grandTotal = 0;
    let grandRejected = 0;
    let grandSelected = 0;

    for (let det of arr) {
      grandTotal += det[1][0]
      grandSelected += det[1][1]
      grandRejected += det[1][3]
    }
    console.log(grandTotal, grandRejected, grandSelected);
    setRejectedCandClientAnalysis(grandRejected);
    setTotalCandClientAnalysis(grandTotal);
    setSelectedCandClientAnalysis(grandSelected);
    console.log("array", arr);
    //  setClientSummary(arr);
    const data1 = arr.sort((a, b) => {
      return b[1][2] - a[1][2];
    })
    console.log("data", data1);
    setClientSummary(data1);
    console.log("data1", data1);

  }
  const handleSelectAllClients = () => {
    if (selectedClients.length === uniqueClients.length) {
      // If all are already selected, deselect all
      setSelectedClients([]);
    } else {
      // Otherwise, select all
      setSelectedClients([...uniqueClients]);
    }
  }
  useEffect(() => {
    console.log("dashboardData", dashboardData);
    async function getDataOfDashboard() {
      await getDashboardData()
      // await getAllJobs()
    }
    if ((selectedReport === "client_analysis" || selectedReport === "job_type_analysis")) {
      if (Object.keys(dashboardData).length === 0) {
        getDataOfDashboard()
      } else {
        console.log(dashboardData);
        console.log("from redux");
        const data = dashboardData;
        let temp = data["jobs"];
        console.log(temp, "temp");
        const set1 = new Set();
        const uniqueNames1 = data["jobs"]
          .filter((job) => {
            if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
              return false;
            } else {
              set1.add(job.client);
              return true;
            }
          })
          .map((job) => job.client);
        console.log("uniqueNames1", uniqueNames1);
        setUniqueClients(uniqueNames1);

      }
    }
  }, [dashboardData, selectedReport]);
  const handleClientChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedClients((prevClients) => [...prevClients, value]);
    } else {
      setSelectedClients((prevClients) =>
        prevClients.filter((client) => client !== value),
      );
    }
  };
  // fiza
  const [timeTotalCand, setTimeTotalCand] = useState(0);
  const [timeSelectedCand, setTimeSelectedCand] = useState(0);
  const [timeRejectedCand, setTimeRejectedCand] = useState(0);
  const [timeScreeningCand, setTimeScreeningCand] = useState(0);

  const handleTimeToCloseReport = async () => {
    if (selectedRecruiters?.length === 0) {
      toast.error("Please select at least one recruiter")
    } else if (!waitForSubmission) {
      setwaitForSubmission(true);
      const response = await fetch("https://ats-9.onrender.com/time_to_close_position_for_recruiter", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        setwaitForSubmission(false)
        const data1 = data.sort((a, b) => {
          if (a.ranking !== 0 && b.ranking !== 0)
            return (a.ranking) - (b.ranking)
          else if (a.ranking !== 0 && b.ranking === 0)
            return b.ranking - a.ranking;
          else if (a.ranking === 0 && b.ranking !== 0)
            return b.ranking - a.ranking;
        })
        let total1 = 0;
        let rejected1 = 0;
        let selected1 = 0;
        let process1 = 0;
        setTimeToCloseData(data1);
        for (let temp of data1) {
          total1 += temp.total_candidates_count;
          selected1 += temp.count_of_onboarded_positions;
          rejected1 += temp.unsuccessful_closures;
          process1 += temp.count_of_screening_candidates + temp.candidates_in_progress;
        }
        setTimeScreeningCand(process1);
        setTimeRejectedCand(rejected1);
        setTimeSelectedCand(selected1);
        setTimeTotalCand(total1);
        console.log(data1, "data1");
        // settotalcandidatescount(data1[0].total_candidates_count);


      } else {
        console.log("error ocurred");
        setwaitForSubmission(false);
      }
    }
  }
  // Mugilan
  useEffect(() => {
    console.log("dashboardData", dashboardData);
    async function getDataOfDashboard() {
      await getDashboardData()
      // await getAllJobs()
    }
    if ((selectedReport === "client_analysis" || selectedReport === "job_type_analysis")) {
      // dashboard data
      if (Object.keys(dashboardData).length === 0) {
        getDataOfDashboard();
      } else {
        console.log(dashboardData);
        console.log("from redux");
        const data = dashboardData;
        let temp = data["jobs"];
        console.log(temp, "temp");
        const set1 = new Set();
        const uniqueNames1 = data["jobs"]
          .filter((job) => {
            if (set1.has(job.role) || set1.has(job.role?.toLowerCase())) {
              return false;
            } else {
              set1.add(job.role);
              return true;
            }
          })
          .map((job) => job.role);
        console.log("uniqueNames1", uniqueNames1);
        setUniqueRoles(uniqueNames1);
      }
    }
  }, [dashboardData, selectedReport]);
  const handleSelectAllRoles = () => {
    if (selectedRoles.length === uniqueRoles.length) {
      // If all are already selected, deselect all
      setSelectedRoles([]);
    } else {
      // Otherwise, select all
      setSelectedRoles([...uniqueRoles]);
    }
  }
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRoles((prevRoles) => [...prevRoles, value]);
    } else {
      setSelectedRoles((prevRoles) =>
        prevRoles.filter((role) => role !== value),
      );
    }
  };
  const handleroleReport = async () => {
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one role.");
      return;
    }
    console.log("dashboardData", dashboardData);
    if (Object.keys(dashboardData).length > 0) {
      console.log(dashboardData);
      console.log("from redux");

      const data = dashboardData;
      let temp = data["jobs"];
      const set1 = new Set();
      const uniqueNames1 = data["jobs"]
        .filter((job) => {
          if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
            return false;
          } else {
            set1.add(job.client);
            return true;
          }
        })
        .map((job) => job.client);
      //  console.log("UniqueClients: ", uniqueNames1);


      const uniqueNames3 = data["jobs"]
        .filter((job) => {
          if (set1.has(job.location) || set1.has(job.location?.toLowerCase())) {
            return false;
          } else {
            set1.add(job.location);
            return true;
          }
        })
        .map((job) => job.location);
      //  console.log("Uniquelocations: ", uniqueNames3);

      let roleSummary1 = [];
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      let overallTotalCount = 0;
      let overallSelectedCount = 0;
      for (let cl of uniqueNames1) {
        let totalCountArray = dashboardData["candidates"].filter((item) => item.client === cl && selectedRoles.includes(item.profile));

        // console.log("totalCountArray", cl, ": ", totalCountArray);
        const set2 = new Set();

        const uniqueProfiles = totalCountArray
          .filter((item) => {
            if (set2.has(item.profile) || set2.has(item.profile?.toLowerCase())) {
              return false;
            } else {
              set2.add(item.profile);
              return true;
            }
          })
          .map((item) => item.profile);

        // console.log("uniqueProfiles: ", uniqueProfiles);

        let rolesData1 = [];



        for (let role of uniqueProfiles) {
          let selectedCount = 0;
          let totalCountArray = [];

          totalCountArray = dashboardData["candidates"].filter((temp) => {
            if (temp.profile === role) {
              if (fromDate && toDate) {
                const date = new Date(temp.date_created);
                if (date <= endDate && date >= startDate) {
                  if (temp?.status === "SELECTED" || temp?.status === "ON-BOARDED") {
                    selectedCount += 1;
                  }
                  return true;
                }
              } else {
                if (temp?.status === "SELECTED" || temp?.status === "ON-BOARDED") {
                  selectedCount += 1;
                }
                return true;
              }
            }
            return false;
          });

          const locationArr = data["jobs"]
            .filter((job) => job.role === role)
            .map((job) => job.location);

          const totalCount = totalCountArray.length;

          overallTotalCount += totalCount;
          overallSelectedCount += selectedCount;

          setOverallTotalCount(overallTotalCount);
          setOverallSelectedCount(overallSelectedCount);

          let closureRate = 0;
          if (totalCount !== 0) closureRate = (selectedCount / totalCount) * 100;

          rolesData1.push([role, [[locationArr], totalCount, selectedCount, closureRate]]);
        }

        roleSummary1.push([cl, [rolesData1]]);
      }
      console.log(overallTotalCount, "overall total candidates count");
      console.log(overallSelectedCount, "overall selected candidates count");
      setroleSummary(roleSummary1);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  // Mahesh
  function calculateDaysBetween(fromDate, toDate) {
    // Convert the input dates to Date objects
    const start = new Date(fromDate);
    const end = new Date(toDate);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = end - start;

    // Convert the difference from milliseconds to days
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    return diffInDays;
  }
  function middle_function_daily(rows) {
    const c = calculateDaysBetween(fromDate, toDate)
    var today = new Date(fromDate); // 2024-18-05
    const clist = new Array(c + 1).fill().map((_, idx) => {
      let nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      let heading = `day${idx + 1} ${months[today.getMonth()]} ${today.getDate()}`;
      let date = new Date(today);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;// Output: 2024-06-20

      today = nextDay;
      return (
        { heading, date: formattedDate }
      )
    })
    console.log('clist', " ", clist)
    const showList = []
    let recruiters = []
    let y_datas = []
    for (let i = 0; i < rows.length; i++) {
      let finalList = []
      let sum = 0;
      finalList.push(rows[i]['name'])
      recruiters.push(rows[i]['name'])
      for (let j = 0; j < clist.length; j++) {
        let idx = rows[i]["days"].findIndex((day) => day === clist[j].date)
        if (idx === -1) {
          finalList.push(0);
        } else {
          finalList.push(rows[i]["count"][idx]);
          sum += rows[i]["count"][idx];
        }
      }
      y_datas.push(sum)
      console.log(recruiters, "xdate");
      console.log(y_datas, "xdate");
      setXdata(recruiters);
      setYdata(y_datas, "ydata")
      showList.push(finalList)

    }

    console.log(showList)
    setRecruiterTableData(showList)
    setColumns(clist)
    setRotate(false)
  }
  const date_format = (date) => {
    console.log(date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const middle_function_weekly = (rows) => {
    let today = new Date(fromDate);
    let finalDate = new Date(toDate);

    let count = 0;
    let clist = []
    clist.push({
      week: `week 1`,
      from: daysOfWeek[today.getDay()],  // from day
      fromDate: date_format(today)
    })
    while (today.getTime() <= finalDate.getTime()) {
      if (today.getDay() === 0) { // Check if it's Sunday
        count += 1;
        console.log(today)
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Adjust the date
        console.log(yesterday)
        const toDate = date_format(yesterday)
        console.log(toDate)
        clist[clist.length - 1] = { ...clist[clist.length - 1], to: 'sat', toDate }
        clist.push({
          week: `week ${count + 1}`,
          from: daysOfWeek[0],  // from day
          fromDate: date_format(today)
        })
        console.log(today)

      }
      // Move to the next day
      today.setDate(today.getDate() + 1);
    }
    today.setDate(today.getDate() - 1);
    if (today.getDay() !== 0) {
      count++;
      clist[clist.length - 1] = {
        ...clist[clist.length - 1], to: daysOfWeek[today.getDay()],
        toDate: date_format(today)
      };
    } else {
      clist[clist.length - 1] = {
        ...clist[clist.length - 1], to: 'sun',
        toDate: date_format(today)
      }
    }
    console.log(count);
    console.log(clist);
    setColumns(clist)
    let recruiters = []
    let y_datas = []
    const showList = []
    for (let i = 0; i < rows.length; i++) {
      let finalList = []
      let sum = 0;
      finalList.push(rows[i]['name'])
      recruiters.push(rows[i]['name'])
      for (let j = 0; j < clist.length; j++) {
        let count = 0;
        for (let z = 0; z < rows[i]["days"]?.length; z++) {
          const checkDate = new Date(rows[i]["days"][z]);
          const startDate = new Date(clist[j]["fromDate"]);
          const endDate = new Date(clist[j]["toDate"]);

          const isInRange = checkDate.getTime() >= startDate.getTime() && checkDate.getTime() <= endDate.getTime();
          console.log('isIn range', isInRange)
          if (isInRange) {
            count += rows[i]["count"][z];
            sum += rows[i]["count"][z];
          }
        }
        finalList.push(count);
      }
      y_datas.push(sum);
      showList.push(finalList);
    }
    console.log(showList)
    setRecruiterTableData(showList)
    setXdata(recruiters, "xdata");
    console.log(y_datas, "ydata")
    setYdata(y_datas)
    setRotate(false)
  }
  function getMonthDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth(); // 0-based index

    const endYear = end.getFullYear();
    const endMonth = end.getMonth(); // 0-based index

    // Calculate the total months difference
    const monthsDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

    // Include both start and end months
    return monthsDifference + 1;
  }
  const middle_function_monthly = (rows) => {
    console.log(rows)
    const diff = getMonthDifference(fromDate.substring(0, 7), toDate.substring(0, 7))
    console.log(diff)
    let start = Number(fromDate.substring(5, 7)) - 1;
    let start_year = Number(fromDate.substring(0, 4));
    let i = 0;
    let initial = start;
    let header = []
    while (i < diff) {
      if ((initial !== 0 || i % 12 == 0) && (start === 0)) {
        start_year++;
      }
      header.push({ month: months[start], year: start_year })
      if ((start + 1) % 12 === 0) {
        start = 0;
      } else {
        start += 1;
      }
      i++;
    }
    console.log(header)
    setColumnsForMonths(header)
    setRotate(false)
    let recruiters = []
    let y_datas = []
    const showList = []
    // console.log(rows.length)
    for (let i = 0; i < rows.length; i++) {
      // let cand_sum = 0;
      let finalList = []
      finalList.push(rows[i]['name'])
      recruiters.push(rows[i]['name'])
      console.log('header', header)
      for (let j = 0; j < header.length; j++) {
        console.log('hi')
        let sum = 0;
        for (let z = 0; z < rows[i]["data"]["submission_counts_monthly"]?.length; z++) {
          const str = rows[i]["data"]["submission_counts_monthly"][z]["date_part"];
          const y = Number(str.substring(str.length - 2));
          console.log(y, 'y')
          const m = months[Number(str.substring(str.length - 2)) - 1];
          console.log(header[j]['month'])
          console.log(m, 'm')
          if (m === header[j]["month"]) {
            sum += rows[i]["data"]["submission_counts_monthly"][z]["count"]
          }
        }
        // cand_sum += sum;  
        console.log(sum)
        finalList.push(sum);
      }
      y_datas.push(rows[i]["candidate_count"]);
      showList.push(finalList);
    }
    console.log(showList)
    setRecruiterTableData(showList)
    console.log(recruiters, "xdata");
    setXdata(recruiters);
    console.log(y_datas, "ydata")
    setYdata(y_datas)
  }

  const middle_function_yearly = (rows) => {
    console.log(rows, 'rows')
    // let from = new Date(fromDate); // eg: apr
    // let to = new Date(toDate);  // eg: may
    /*
      count years: a = fromDate.substring(fromDate.length-2) b = toDate.substring(fromDate.length-2)
       years_count = Number(b)-Number(a)+1;
    */

    const years_count = Number(toDate.substring(0, 4)) - Number(fromDate.substring(0, 4)) + 1;
    const temp = new Date(fromDate);
    let c = temp.getFullYear(); // number
    let c_temp = c;
    const arr = new Array(years_count).fill().map(() => {
      c++;
      return c - 1;
    })

    let recruiters = []
    let y_datas = []
    const showList = []
    for (let i = 0; i < rows.length; i++) {
      recruiters.push(rows[i]["name"])
      let sum = 0;
      const tempList = new Array(arr.length).fill().map(() => 0);
      for (let j = 0; j < rows[i]["data"]["submission_counts_yearly"].length; j++) {
        const str = rows[i]["data"]["submission_counts_yearly"][j]["date_part"];
        sum += rows[i]["data"]["submission_counts_yearly"][j]["count"];
        tempList[Number(str) - c_temp] += rows[i]["data"]["submission_counts_yearly"][j]["count"];
      }
      tempList.unshift(rows[i]["name"])
      y_datas.push(sum);
      showList.push(tempList);
    }
    console.log(showList)
    setRecruiterTableData(showList)
    console.log(recruiters, "xdata");
    setXdata(recruiters);

    console.log(y_datas, "ydata")
    setYdata(y_datas)
    console.log(arr)
    setColumnsForYears(arr)
    setRotate(false)
  }

  const [historicalTotal, setHistoricalTotal] = useState(0);
  const [historicalSelected, setHistoricalSelected] = useState(0);
  const [historicalRejected, setHistoricalRejected] = useState(0);
  const [historicalProcess, setHistoricalProcess] = useState(0);

  const handleHistoricalAnalysis = async () => {
    const tempFromDate = new Date(fromDate);
    const tempToDate = new Date(toDate);
    const today = new Date();
    if (fromDate === "") {
      toast.error("select from date")
    } else if (toDate === "") {
      toast.error("select to date")
    } else if (tempFromDate.getTime() > today.getTime()) {
      toast.error("From Date is ahead of Current Date");
    } else if (tempToDate.getTime() > today.getTime()) {
      toast.error("To Date is ahead of Current Date");
    } else if (tempFromDate.getTime() > tempToDate.getTime()) {
      toast.error("From Date should be earlier than To Date");
    } else if (selectedRecruiters.length === 0) {
      toast.error("Please select at least one recruiter");
    }
    else if (!waitForSubmission) {
      setwaitForSubmission(true)
      const response = await fetch("https://ats-9.onrender.com/analyze_recruitment", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          from_date: formatDate(fromDate),
          to_date: formatDate(toDate),
          recruiter_names: selectedRecruiters,
        }),
      });

      let total2 = 0;
      let selected2 = 0;
      let rejected2 = 0;
      let process2 = 0;

      if (response.ok) {
        const data = await response.json();
        setwaitForSubmission(false)
        console.log(data);
        console.log(data.historical_performance_analysis)
        setHistorical_data(data.historical_performance_analysis);

        const historicalData = [...Object.entries(data.historical_performance_analysis)];
        console.log(historicalData);
        const rec1 = historicalData[0][1];
        console.log(rec1)
        const data1 = Object.entries(rec1.line_graph_data);
        const final1 = [...data1.map((item) => item[0])]
        console.log(final1)
        setFinal(final1);

        let totalArr = [];
        let selectedArr = [];
        let rejectedArr = [];
        let processArr = [];
        for (let temp of historicalData) {
          const rec = temp[1];
          const data1 = Object.entries(rec.line_graph_data);
          totalArr = [...totalArr, ...data1.map((item) => item[1]["Total Candidates Count"])];
          selectedArr = [...selectedArr, ...data1.map((item) => item[1]["Onboarded Positions"])];
          rejectedArr = [...rejectedArr, ...data1.map((item) => item[1]["Unsuccessful Closures"])];
          processArr = [...processArr, ...data1.map((item) => item[1]["Screening Candidates"])];
        }
        console.log(totalArr);
        for (let temp of totalArr) {
          total2 += temp;
        }
        for (let temp of selectedArr) {
          selected2 += temp;
        }
        for (let temp of rejectedArr) {
          rejected2 += temp;
        }
        for (let temp of processArr) {
          process2 += temp;
        }
        console.log(process2, rejected2, selected2, total2);
        setHistoricalProcess(process2);
        setHistoricalRejected(rejected2);
        setHistoricalSelected(selected2);
        setHistoricalTotal(total2);

      } else {
        console.log("error ocurred");
      }
    }

  }


  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div className="reportsub">
          <form className="ss_form" id="formed_ss" style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", height: "100px", width: "100%", marginLeft: "0px" }}>
            <div className="wrapped" style={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%", marginLeft: "60px",flexWrap:"nowrap" }}>
              <div style={{  marginLeft: "-40px" }}>
                <label htmlFor="from_date" className="labels_TA">Reports</label>
                <select id="report" className="mediaReport" value={selectedReport} onChange={handleReportChange} style={{ height: "35px",width:"100%" }}>
                  <option value="" disabled>Select</option>
                  <option value="submission_analysis">Submission Analysis Report</option>
                  <option value="successful_submission">Successful Submission Report</option>
                  <option value="client_analysis">Client Analysis Report</option>
                  <option value="job_type_analysis">Job Type Analysis Report</option>
                  <option value="time_to_close_analysis">Time-to-Close Analysis Report</option>
                  <option value="historical_performance_analysis">Historical Performance Analysis Report</option>
                </select>
              </div>
              {(selectedReport === 'successful_submission' || selectedReport === 'submission_analysis' || selectedReport === 'client_analysis' || selectedReport === 'historical_performance_analysis'
              ) && (
                  <>
                    <div style={{ marginLeft: "10px" }}>
                      <label htmlFor="from_date" className="labels_TA">From Date:</label>
                      <input
                        type="date"
                        id="from_dates"
                        name="from_date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        required
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc",width:"100%" }}
                      />
                    </div>

                    <div className="toDate" style={{  marginLeft: "30px", marginRight: "10px" }}>
                      <label htmlFor="to_date"  className="labels_TA">To Date:</label>
                      <input
                        type="date"
                        id="to_dates"
                        name="to_date"
                        value={toDate}
                        onChange={handleToDateChange}
                        required
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", }}
                      />
                    </div>

                    {/* <div style={{ flex: "1", marginLeft: "10px", minWidth: "200px", maxWidth: "300px" }}>
                      <label htmlFor="select_recruiters">Select Recruiters:</label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type="text"
                          id="select_recruiters"
                          name="select_recruiters"
                          placeholder="Select Recruiters"
                          onClick={handleToggleDropdown}
                          readOnly
                          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", cursor: "pointer" }}
                        /> */}
                    {(selectedReport === 'successful_submission' || selectedReport === 'submission_analysis' || selectedReport === 'historical_performance_analysis') && (
                      <div className="widthadjust" style={{  marginLeft: "10px", minWidth: "200px", maxWidth: "300px", alignItems: "center", justifyContent: "center" }}>
                        <label htmlFor="select_recruiters"  className="labels_TA">Select Recruiters:</label>
                        <div style={{ position: "relative", width: "100%" }}>
                          <input
                            type="text"
                            id="select_recruiters"
                            name="select_recruiters"
                            placeholder="Select Recruiters"
                            value={selectedRecruiters.join(', ')}
                            onClick={handleToggleDropdown}
                            readOnly
                            style={{ padding: "8px 18px 8px 8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", cursor: "pointer" }}
                          />
                          <span
                          className="arrowmark"
                            style={{
                              position: 'absolute',
                              top: '55%',
                              right: '1px',
                              transform: 'translateY(-50%)',
                              pointerEvents: 'none'
                            }}
                          >
                            <FaAngleDown />
                          </span>
                          {showDropdown && (
                            <div className="dropdown-content" ref={dropdownRef} style={{ position: "absolute", backgroundColor: "#fff", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)", zIndex: 4, minWidth: "100%", maxHeight: "200px", overflowY: "auto", overflowX: "hidden", border: "1px solid #ccc", borderRadius: "4px", marginTop: "0px" }}>
                              <div className="TA" style={{ cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  id="select_all_recruiters"
                                  name="select_all_recruiters"
                                  value={selectedRecruiters.join(', ')}
                                  checked={selectedRecruiters.length === recruiters.length && selectedRecruiters.length > 0}
                                  onChange={handleSelectAll}
                                  style={{
                                    marginRight: "0px", cursor: "pointer", height: "12px", width: " 12px"
                                  }}
                                />
                                <label  className="labels_TA" style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}
                                  htmlFor="select_all_recruiters">Select All</label>
                              </div>
                              {recruiters.map((recruiter, index) => (
                                <div key={index} style={{ cursor: "pointer", verticalAlign: "top" }} className="TA" >
                                  <input
                                    type="checkbox"
                                    id={`recruiter_${index}`}
                                    name={`recruiter_${index}`}
                                    value={recruiter}
                                    checked={selectedRecruiters.includes(recruiter)}
                                    onChange={handleRecruiterChange}
                                    style={{
                                      marginRight: "0px", cursor: "pointer", height:
                                        "12px",
                                      width: " 12px",
                                    }}
                                  />
                                  <label   className="labels_TA"style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}
                                    htmlFor={`recruiter_${index}`}>{recruiter}</label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedReport === 'submission_analysis' && (
                      <div ref={dropdownRef} className="daily" style={{  marginLeft: "10px", alignItems: "center", justifyContent: "center",marginTop:"30px"}}>
                        <select
                        className="seldaily"
                          onChange={(e) => {
                            setType(e.target.value)
                            // setRotate(true);
                          }}
                          style={{ backgroundColor: 'white', color: 'grey', padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "35px" }} value={type}>
                          <option disabled={true}>select</option>
                          <option value={"submission_counts_daily"}>daily</option>
                          <option value={"submission_counts_weekly"}>weekly</option>
                          <option value={"submission_counts_monthly"}>monthly</option>
                          <option value={"submission_counts_yearly"}>yearly</option>
                        </select>

                      </div>
                    )}
                    {(selectedReport === "client_analysis") && (
                      <div ref={dropdownRef} style={{ flex: "1", marginLeft: "10px", minWidth: "200px", maxWidth: "300px" }}>
                        <label  className="labels_TA" htmlFor="select_recruiters">Select Clients:</label>
                        <div style={{ position: "relative", width: "100%" }}>
                          <input
                            type="text"
                            id="select_clients"
                            name="select_clients"
                            value={selectedClients.join(', ')}
                            placeholder="Select Clients"
                            onClick={handleToggleDropdown}
                            readOnly
                            style={{ padding: "8px 30px 8px 8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", cursor: "pointer" }}
                          />
                          <span
                          className="dropdown"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: '10px',
                              transform: 'translateY(-50%)',
                              pointerEvents: 'none'
                            }}
                          >
                            <FaAngleDown />
                          </span>
                          {showDropdown && (
                            <div className="dropdown-content" style={{ position: "absolute", backgroundColor: "#fff", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)", zIndex: 1, minWidth: "100%", maxHeight: "200px", overflowY: "auto", overflowX: "hidden", border: "1px solid #ccc", borderRadius: "4px", marginTop: "5px" }}>
                              <div className="TA" style={{ cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  id="select_all_clients"
                                  name="select_all_clients"
                                  value={selectedClients.join(', ')}
                                  checked={selectedClients.length === uniqueClients.length && selectedClients.length > 0}
                                  onChange={handleSelectAllClients}
                                  style={{
                                    marginRight: "0px", cursor: "pointer",
                                    height: "12px",
                                    width: " 12px",
                                  }}
                                />
                                <label  className="labels_TA" style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}
                                  htmlFor="select_all_recruiters">Select All</label>
                              </div>
                              {uniqueClients.map((client, index) => (
                                <div key={index} style={{ cursor: "pointer" }} className="TA" >
                                  <input
                                    type="checkbox"
                                    id={`client_${index}`}
                                    name={`client_${index}`}
                                    value={client}

                                    checked={selectedClients.includes(client)}
                                    onChange={handleClientChange}
                                    style={{
                                      marginRight: "0px", cursor: "pointer",
                                      height: "12px",
                                      width: " 12px"
                                    }}
                                  />
                                  <label style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}
                                    htmlFor={`client_${index}`}>{client}</label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              {(selectedReport === 'time_to_close_analysis') && (
                <div ref={dropdownRef} className="recruitselect" style={{  marginLeft: "10px", minWidth: "200px", maxWidth: "300px" }}>
                  <label  className="labels_TA" htmlFor="select_recruiters">Select Recruiters:</label>
                  <div  className="recruitselects" style={{ position: "relative" }}>
                    <input
                      type="text"
                      id="select_recruit"
                      name="select_recruiters"
                      placeholder="Select Recruiters"
                      value={selectedRecruiters.join(', ')}
                      onClick={handleToggleDropdown}
                      readOnly
                      style={{ padding: "8px 30px 8px 8px", borderRadius: "4px", border: "1px solid #ccc",  cursor: "pointer" }}
                    />
                    <span
                    className="recruit"
                      style={{
                       
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }}
                    >
                      <FaAngleDown />
                    </span>

                    {showDropdown && (
                      <div className="dropdown-content" style={{ position: "absolute", backgroundColor: "#fff", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)", zIndex: 1, minWidth: "100%", maxHeight: "200px", overflowY: "auto", overflowX: "hidden", border: "1px solid #ccc", borderRadius: "4px", marginTop: "5px" }}>
                        <div className="TA" style={{ cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            id="select_all_recruiters"
                            name="select_all_recruiters"
                            checked={selectedRecruiters.length === recruiters.length && selectedRecruiters.length > 0}
                            onChange={handleSelectAll}
                            style={{
                              marginRight: "0px", cursor: "pointer",
                              height: "12px",
                              width: " 12px",
                            }}
                          />
                          <label style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}
                            htmlFor="select_all_recruiters">Select All</label>
                        </div>
                        {recruiters.map((recruiter, index) => (
                          <div key={index} style={{ cursor: "pointer" }} className="TA" >
                            <input
                              type="checkbox"
                              id={`recruiter_${index}`}
                              name={`recruiter_${index}`}
                              value={recruiter}
                              checked={selectedRecruiters.includes(recruiter)}
                              onChange={handleRecruiterChange}
                              style={{
                                marginRight: "0px",
                                cursor: "pointer",
                                height: "12px",
                              }}
                            />
                            <label style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}
                              htmlFor={`recruiter_${index}`}>{recruiter}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(selectedReport === "job_type_analysis") && (
                <div ref={dropdownRef} style={{ flex: "1", marginLeft: "10px", minWidth: "200px", maxWidth: "300px", alignItems: "center", justifyContent: "center", }}>
                  <label  className="labels_TA" htmlFor="select_recruiters">Select Roles:</label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type="text"
                      id="select_roles"
                      name="select_roles"
                      placeholder="Select Roles"
                      onClick={handleToggleDropdown}
                      value={selectedRoles.join(', ')}
                      readOnly
                      style={{ padding: "8px 30px 8px 8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", cursor: "pointer" }}
                    />
                    <span
                    className="dropdown1"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }}
                    >
                      <FaAngleDown />
                    </span>
                    {showDropdown && (
                      <div className="dropdown-content" ref={dropdownRef} style={{ position: "absolute", backgroundColor: "#fff", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)", zIndex: 1, minWidth: "100%", maxHeight: "200px", overflowY: "auto", overflowX: "hidden", border: "1px solid #ccc", borderRadius: "4px", marginTop: "0px" }}>
                        <div className="TA" style={{ cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            id="select_all_clients"
                            name="select_all_clients"
                            checked={selectedRoles.length === uniqueRoles.length && selectedRoles.length > 0}
                            onChange={handleSelectAllRoles}
                            style={{
                              marginRight: "0px",
                              cursor: "pointer",
                              height: "12px",
                              width: " 12px",
                            }}
                          />
                          <label htmlFor="select_all_recruiters" style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px" }}>Select All</label>
                        </div>
                        {uniqueRoles.map((role, index) => (
                          <div key={index} style={{ cursor: "pointer", verticalAlign: "top" }} className="TA" >
                            <input
                              type="checkbox"
                              id={`role_${index}`}
                              name={`role_${index}`}
                              value={role}
                              checked={selectedRoles.includes(role)}
                              onChange={handleRoleChange}
                              style={{
                                marginRight: "0px", height:
                                  "12px",
                                width: " 12px", cursor: "pointer"
                              }}
                            />
                            <label htmlFor={`role_${index}`} style={{ padding: "0px 5px", marginBottom: "0px", fontWeight: "400", fontSize: "14px", lineHeight: "18px" }}>{role}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedReport === 'client_analysis' && (
                <div style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "70px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleClientReport}
                    style={{ borderRadius: "4px", background: "#32406D", color: "#fff", border: "none", cursor: "pointer", minWidth: "100px", height: "35px", marginLeft: "-50px" }}
                  >
                    Generate Report
                  </button>
                </div>
              )}
              {selectedReport === 'successful_submission' && (
                <div className="succbtn" style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "10px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleRecruitersReport}
                    style={{
                      borderRadius: "4px",
                      background: "#32406D",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "100px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {waitForSubmission ? "" : "Generate Report"}
                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      visible={waitForSubmission}
                      height="45"
                      width="45"
                      color="white"
                      ariaLabel="oval-loading"
                    />
                  </button>
                </div>
              )}

              {/* {selectedReport === 'time_to_close_analysis' && (
                <div style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "500px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleTimeToCloseReport}
                    style={{ borderRadius: "4px", background: "#32406D", color: "#fff", border: "none", cursor: "pointer", minWidth: "100px", height: "35px", marginLeft: "-480px" }}
                  >
                    Generate Report
                  </button>

                </div>
              )} */}


              {selectedReport === 'time_to_close_analysis' && (
                <div className="timebtn"style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "10px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleTimeToCloseReport}
                    style={{
                      borderRadius: "4px",
                      background: "#32406D",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "100px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // position: "relative",
                    }}
                  >
                    {waitForSubmission ? "" : "Generate Report"}
                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      visible={waitForSubmission}
                      height="45"
                      width="45"
                      color="white"
                      ariaLabel="oval-loading"
                    />
                  </button>
                </div>
              )}


              {/* {(selectedReport === 'historical_performance_analysis') && (
                <div style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "10px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleHistoricalAnalysis}
                    style={{ borderRadius: "4px", background: "#32406D", color: "#fff", border: "none", cursor: "pointer", minWidth: "100px", height: "35px" }}
                  >
                    Generate Report
                  </button>

                </div>
              )} */}

              {selectedReport === 'historical_performance_analysis' && (
                <div style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "10px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleHistoricalAnalysis}
                    style={{
                      borderRadius: "4px",
                      background: "#32406D",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "100px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {waitForSubmission ? "" : "Generate Report"}
                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      visible={waitForSubmission}
                      height="45"
                      width="45"
                      color="white"
                      ariaLabel="oval-loading"
                    />
                  </button>
                </div>
              )}


              {selectedReport === 'submission_analysis' && (
                <div className="submissionbtn" style={{ flex: "1", alignItems: "center", justifyContent: "center", marginTop: "29px", width: "100%", marginLeft: "10px" }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleRecruitersReport}
                    style={{
                      borderRadius: "4px",
                      background: "#32406D",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "100px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {waitForSubmission ? "" : "Generate Report"}
                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      visible={waitForSubmission}
                      height="45"
                      width="45"
                      color="white"
                      ariaLabel="oval-loading"
                    />
                  </button>
                </div>
              )}

              {selectedReport === 'job_type_analysis' && (

                <div style={{ flex: "1", marginTop: "29px", width: "100%", }}>
                  <button
                    type="button"
                    className="button_ss"
                    name="action"
                    value="Export to Excel"
                    onClick={handleroleReport}
                    style={{ borderRadius: "4px", background: "#32406D", color: "#fff", border: "none", cursor: "pointer", minWidth: "100px", height: "35px", marginLeft: "15px" }}
                  >
                    Generate Report
                  </button>

                </div>
              )}

            </div>
          </form>
        </div>
        <div style={{ marginTop: "5px",display:"flex", flexDirection: "column"}}>

          {(selectedReport === 'successful_submission') && (
            <>
              <div className="divwrap"
                style={{
                  display: "flex",
                  marginLeft: "50px",
                  marginTop: "5px",
                   flexWrap:"wrap"
                }}
              >
                <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Submissions</h3>
                  </div>
                  <div className="card-footers">
                    <p> {totalCandidateCount}</p>
                  </div>

                </div>

                <div
                  className="cards"
                  style={{ backgroundColor: "#d14545d1", width: "140px" }}
                >
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Rejected</h3>
                  </div>
                  <div className="card-footers">
                    <p>{totalCandidatesRejected}</p>
                  </div>
                </div>
                <div
                  className="cards"
                  style={{ backgroundColor: "lightgreen", width: "140px" }}
                >
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Selected</h3>
                  </div>
                  <div className="card-footers">
                    <p>{totalCandidatesElected}</p>
                  </div>
                </div>
                <div className="cards" style={{ backgroundColor: "#6fafdb", width: "140px" }}>
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Feedback</h3>
                  </div>
                  <div className="card-footers">
                    <p>{totalCandidatesPending}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {(selectedReport === 'client_analysis') && (
            <>
              <div className="divwrap"
                style={{
                  display: "flex",
                  marginLeft: "50px",
                  marginTop: "5px",
                   flexWrap:"wrap"
                }}
              >
                <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Submissions</h3>
                  </div>
                  <div className="card-footers">
                    <p>{totalCandClientAnalysis}</p>
                  </div>

                </div>

                <div
                  className="cards"
                  style={{ backgroundColor: "#d14545d1", width: "140px" }}
                >
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Rejected</h3>
                  </div>
                  <div className="card-footers">
                    <p>{rejectedCandClientAnalysis}</p>
                  </div>
                </div>
                <div
                  className="cards"
                  style={{ backgroundColor: "lightgreen", width: "140px" }}
                >
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Selected</h3>
                  </div>
                  <div className="card-footers">
                    <p>{selectedCandClientAnalysis}</p>
                  </div>
                </div>
                <div className="cards" style={{ backgroundColor: "#6fafdb", width: "140px" }}>
                  <div className="card-headers">
                    <h3 style={{ textAlign: "center" }}>Feedback</h3>
                  </div>
                  <div className="card-footers">
                    <p>{totalCandClientAnalysis - selectedCandClientAnalysis - rejectedCandClientAnalysis}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          {selectedReport === 'job_type_analysis' && (

            <div className="divwrap"
              style={{
                display: "flex",
                marginLeft: "50px",
                marginTop: "5px",
                 flexWrap:"wrap"
              }}
            >
              <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Submissions</h3>
                </div>
                <div className="card-footers">
                  <p>{overallTotalCount}</p>
                </div>

              </div>

              <div
                className="cards"
                style={{ backgroundColor: "lightgreen", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                </div>
                <div className="card-footers">
                  <p>{overallSelectedCount}</p>
                </div>
              </div>
              <div
                className="cards"
                style={{ backgroundColor: "#6fafdb", width: "190px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Closure Rate %</h3>
                </div>
                <div className="card-footers">
                  <p>{isNaN((overallSelectedCount / overallTotalCount) * 100) ? 0 : ((overallSelectedCount / overallTotalCount) * 100).toFixed(2)}</p>
                </div>
              </div>

            </div>
          )}
          {selectedReport === 'time_to_close_analysis' && (
            <div className="divwrap"
              style={{
                display: "flex",
                marginLeft: "50px",
                marginTop: "5px",
                 flexWrap:"wrap"
              }}
            >
              <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Submissions</h3>
                </div>
                <div className="card-footers">
                  <p>{timeTotalCand}</p>
                </div>

              </div>

              <div
                className="cards"
                style={{ backgroundColor: "lightgreen", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Selected</h3>
                </div>
                <div className="card-footers">
                  <p>{timeSelectedCand}</p>
                </div>
              </div>
              {/* <div
                className="cards"
                style={{ backgroundColor: "#d14545d1", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Rejected</h3>
                </div>
                <div className="card-footers">
                  <p>{timeRejectedCand}</p>
                </div>
              </div> */}
              <div
                className="cards"
                style={{ backgroundColor: "#6fafdb", width: "160px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Onboarded(%)</h3>
                </div>
                <div className="card-footers">
                  <p>{isNaN((timeSelectedCand / timeTotalCand) * 100) ? 0 : ((timeSelectedCand / timeTotalCand) * 100).toFixed(2)}</p>
                </div>
              </div>

            </div>
          )}
          {selectedReport === 'submission_analysis' && (
            <div className="divwrap"
              style={{
                display: "flex",
                marginLeft: "50px",
                marginTop: "5px",
                 flexWrap:"wrap"
              }}
            >
              <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Submissions</h3>
                </div>
                <div className="card-footers">
                  {
                    (wholeData !== undefined && wholeData !== null && Object.keys(wholeData).length !== 0) ? (
                      <p>
                        {(selectedReport === "submission_analysis") && wholeData["total_candidate_count"]}
                      </p>
                    ) : (<p>0</p>)
                  }
                </div>

              </div>

              <div
                className="cards"
                style={{ backgroundColor: "#d14545d1", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Rejected</h3>
                </div>
                <div className="card-footers">
                  {
                    (wholeData !== undefined && wholeData !== null && Object.keys(wholeData).length !== 0) ? (
                      <p>
                        {(selectedReport === "submission_analysis") && wholeData["total_rejected_candidates_count"]}
                      </p>
                    ) : (<p>0</p>)
                  }

                </div>
              </div>
              <div
                className="cards"
                style={{ backgroundColor: "lightgreen", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Selected</h3>
                </div>
                <div className="card-footers">

                  {
                    (wholeData !== undefined && wholeData !== null && Object.keys(wholeData).length !== 0) ? (
                      <p>
                        {(selectedReport === "submission_analysis") && wholeData["total_selected_candidates"]}
                      </p>
                    ) : (<p>0</p>)
                  }
                </div>
              </div>
              <div
                className="cards"
                style={{ backgroundColor: "#6fafdb", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Feedback</h3>
                </div>
                <div className="card-footers">

                  {
                    (wholeData !== undefined && wholeData !== null && Object.keys(wholeData).length !== 0) ? (
                      <p>
                        {(selectedReport === "submission_analysis") && wholeData["total_process_candidates_count"]}
                      </p>
                    ) : (<p>0</p>)
                  }
                </div>
              </div>
              {/* <div className="cards" style={{ backgroundColor: "#6fafdb", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Feedback</h3>
                </div>
                <div className="card-footers">

                  {
                    (wholeData !== undefined && wholeData !== null) && (
                      <p>
                        {(selectedReport === "submission_analysis") && wholeData["message"]}
                      </p>
                    )
                  }
                </div>
              </div> */}
            </div>
          )}
          {selectedReport === 'historical_performance_analysis' && (
            <div className="divwrap"
              style={{
                display: "flex",
                marginLeft: "50px",
                marginTop: "5px",
                 flexWrap:"wrap"
              }}
            >

              <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Submissions</h3>
                </div>
                <div className="card-footers">
                  <p>{historicalTotal}</p>
                </div>

              </div>

              <div
                className="cards"
                style={{ backgroundColor: "lightgreen", width: "140px" }}
              >
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                </div>
                <div className="card-footers">
                  <p>{historicalSelected}</p>
                </div>
              </div>
              <div className="cards" style={{ backgroundColor: "#d14545d1", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Rejected</h3>
                </div>
                <div className="card-footers">
                  <p>{historicalRejected}</p>
                </div>
              </div>
              <div className="cards" style={{ backgroundColor: "#6fafdb", width: "140px" }}>
                <div className="card-headers">
                  <h3 style={{ textAlign: "center" }}>Feedback</h3>
                </div>
                <div className="card-footers">
                  <p>{historicalProcess}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="cards-container1" style={{ overflow: "auto", marginTop: "5px" }} ref={chartRef}>
          {selectedReport !== "" ? (<motion.div whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7 }}
            className="card1" style={{ width: "100%", overflow: "auto" }} onClick={handleCardClick}>
            {selectedReport === 'successful_submission' && (
              <BarChartComponent recruiterData={recruiterData} selectedReport="successful_submission" />
            )}
            {selectedReport === 'client_analysis' && (
              <BarChartComponent clientSummary={clientSummary} selectedReport="client_analysis" />
            )}
            {selectedReport === 'time_to_close_analysis' && (
              <BarChartComponent timeToCloseData={timeToCloseData} selectedReport="time_to_close_analysis" />
            )}
            {selectedReport === 'job_type_analysis' && (
              <BarChartComponent roleSummary={roleSummary} selectedReport="job_type_analysis" setSubmissionCandidateCount={setSubmissionCandidateCount}
                setSelectedroleCount={setSelectedroleCount} />
            )}
            {selectedReport === 'historical_performance_analysis' && (
              <BarChartComponent historical_data={historical_data} selectedReport="historical_performance_analysis" final={final} />
            )}
            {selectedReport === 'submission_analysis' && (
              <BarChartComponent datanew={datanew} selectedReport="submission_analysis" />
            )}
          </motion.div>) : (<motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7 }}
            className="card1"
          // style={{color:"red",backgroundColor:"lightgray",display:"flex",alignItems:"center",justifyContent:"center", width: "100%", overflow: "auto" }
          // }

          >
            {/* <img style={{height:'200px'}} src={DemoGraph} alt="bar_graph" /> */}
            <BarChartComponent selectedReport="submission_analysis" />
          </motion.div>)}

          {
            selectedReport !== "" ? (<motion.div className="card1" whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7 }} ref={chartRef} onClick={handleCardClick1}>
              {selectedReport === 'successful_submission' && (
                <>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Successful Closure Summary</h3>
                  <SuccessfulConversionSummary sortedSummary={sortedSummary} displayColumns={['Recruiter', 'Candidate Count', 'Selected', 'Rejected', 'In Process', 'Percentage Selected', 'Ranking']} />
                </>
              )}
              {selectedReport === 'historical_performance_analysis' && (
                <>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Historical Performance Analysis</h3>
                  <SuccessfulConversionSummary historical_data={historical_data} displayColumns5={['Recruiter', 'Month', 'Total Candidate', 'Selected', 'Avg Closure Time']} />
                </>
              )}
              {selectedReport === 'client_analysis' && (
                <>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Successful client Closure Summary</h3>
                  <SuccessfulConversionSummary clientSummary={clientSummary} displayColumns2={['clients', 'No of candidates sourced', 'No of candidates Accepted', 'Closure Rate', 'Rankings']} />
                </>
              )}
              {selectedReport === 'time_to_close_analysis' && (
                <>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Time to Close Analysis</h3>
                  <SuccessfulConversionSummary timeToCloseData={timeToCloseData} displayColumns3={['Recruiters', 'Total candidates', 'On Boarded candidates', 'On Boarded Percentage', 'Avg Closure time(days)', 'Rankings']} />
                </>
              )}
              {selectedReport === 'job_type_analysis' && (
                <>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Job Type Analysis</h3>
                  <SuccessfulConversionSummary roleSummary={roleSummary} displayColumns4={['Client', 'Roles', 'Location', 'No of candidates', 'OnBoard', 'Closure Rate(%)']} />
                </>

              )}
              {selectedReport === 'submission_analysis' && (
                <>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Submission analysis Report</h3>
                  <div className="dashcontainer" style={{ marginBottom: '10px', overflow: "auto", height: "90%" }}>
                    <div className="table-container" style={{
                      overflowX: "auto",
                      overflowY: "auto",
                      marginTop: "3px",
                      height: "100%",
                    }}>
                      <table className="table" id="candidates-table"
                        style={{
                          tableLayout: "fixed",
                          width: "100%",
                          marginTop: "-5px",
                          // overFlowX:'auto'
                        }}>
                        <thead>
                          {
                            type === 'submission_counts_daily' ? (<tr>
                              <th className="d1" style={{ width: "200px" }}>Recruiter</th>
                              {
                                columns !== null && columns.map((obj, idx) => <th className="d1" key={idx} style={{ width: "200px" }}>{obj?.heading}</th>)
                              }
                            </tr>) : type === 'submission_counts_weekly' ? (<tr>
                              <th style={{ width: "200px" }}>Recruiter</th>
                              {
                                columns !== null && columns.map((obj, idx) => <th key={idx} style={{ width: "200px" }}>{`${obj["week"]} (${obj["from"]} - ${obj["to"]})`}</th>)
                              }
                            </tr>) : type === 'submission_counts_monthly' ? (<tr>
                              <th style={{ width: "200px" }}>Recruiter</th>
                              {
                                columnsForMonths !== null && columnsForMonths.map((obj, idx) => <th key={idx} style={{ width: "200px" }}>{obj["month"]}{obj["year"]}</th>)
                              }
                            </tr>) : (<tr>
                              <th style={{ width: "200px" }}>Recruiter</th>
                              {
                                columnsForYears !== null && columnsForYears.map((str, idx) => <th key={idx} style={{ width: "200px" }}>{str}</th>)
                              }
                            </tr>)
                          }
                        </thead>
                        <tbody className="scrollable-body">
                          {
                            type === "submission_counts_daily" ?
                              (recruiterTableData?.map((list, idx) => {
                                const sublist = list.slice(1);
                                return (<tr key={idx}>
                                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>{list[0]}</td>
                                  {
                                    sublist.map((str, idx) => <td key={idx}>{str}</td>)
                                  }
                                </tr>)
                              })) : type === "submission_counts_weekly" ?
                                (recruiterTableData?.map((list, idx) => {
                                  const sublist = list.slice(1);
                                  return (<tr key={idx}>
                                    <td>{list[0]}</td>
                                    {
                                      sublist.map((str, idx) => <td key={idx}>{str}</td>)
                                    }
                                  </tr>)
                                })) : type === "submission_counts_monthly" ?
                                  (recruiterTableData?.map((list, idx) => {
                                    return (<tr key={idx}>
                                      {
                                        list.map((str, idx) => <td key={idx}>{str}</td>)
                                      }
                                    </tr>)
                                  })) : type === "submission_counts_yearly" ?
                                    (recruiterTableData?.map((list, idx) => {
                                      return (<tr key={idx}>
                                        {
                                          list.map((str, idx) => <td key={idx}>{str}</td>)
                                        }
                                      </tr>)
                                    })) : (
                                      <tr>no data available</tr>
                                    )
                          }
                        </tbody>

                      </table>
                    </div>
                  </div>
                </>

              )}
            </motion.div>) : (<motion.div
              className="card1" whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7 }}
            // style={{color:"red",backgroundColor:"lightgray",display:"flex",alignItems:"center",justifyContent:"center", width: "100%", overflow: "auto" }}
            >
              {/* <img style={{height:'200px'}} src={DemoTable} alt="demo table" /> */}
              <EmployeePerformanceTable />
            </motion.div>)
          }
        </div>


        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
         className="customModalContent"
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
              marginRight: "-70%",
              marginTop:"40%",
              transform: "translate(-50%, -50%)",
              height: "auto",
              maxHeight: "80vh",
              width: "70%",
              // maxWidth: "50%",
              overflow: "auto",
              padding: "5px",
              border: "2px solid #32406D",
              backgroundColor: "#fff",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              // WebkitBackdropFilter: "blur(8px)",
              // backdropFilter: "blur(8px)",
            },
          }}

        >
        <div ref={chartRef} style={{height:'100%',width:"100%",overflow:"auto"}}>
        <div style={{ display: "flex", justifyContent: "end",position:"sticky",top:"0",left:'0',background:"#fff" }}>
              {(selectedReport === 'successful_submission') && (
                <h3 className="h3tag"style={{ textAlign: "center", display: "flex", justifyContent: "space-around", marginRight: "300px" }}>
                  Selected Recruiter : <span style={{ color: "green" }}>{recruitername || "Grand Total"}</span>
                </h3>
              )}
              {selectedReport === 'job_type_analysis' && (
                <h3 style={{ textAlign: "center", display: "flex", justifyContent: "space-around", marginRight: "300px" }}>
                  Selected Roles :<span style={{ color: "green" }}> {rolesName || "Grand Total"}</span>
                </h3>
              )}
              {selectedReport === 'client_analysis' && (
                <h3 style={{ textAlign: "center", display: "flex", justifyContent: "space-around", marginRight: "300px" }}>
                  Selected client : <span style={{ color: "green" }}>{clientname || "Grand Total"}</span>
                </h3>
              )}
              {selectedReport === 'time_to_close_analysis' && (
                <h3 style={{ textAlign: "center", display: "flex", justifyContent: "space-around", marginRight: "300px" }}>
                  Selected client : <span style={{ color: "green" }}>{timerecruitername || "Grand Total"}</span>
                </h3>
              )}
              {selectedReport === 'historical_performance_analysis' && (
                <h3 style={{ textAlign: "center", display: "flex", justifyContent: "space-around", marginRight: "300px" }}>
                  Selected Recruiter : <span style={{ color: "green" }}>{historicalname || "Grand Total"}</span>
                </h3>
              )}
              {selectedReport === 'submission_analysis' && (
                <h3 style={{ textAlign: "center", display: "flex", justifyContent: "right", marginRight: "300px" }}>
                  Selected Recruiter : <span style={{ color: "green" }}>{newrecruitername || "Grand Total"}</span>
                </h3>
              )}

              <MdCloudDownload
                onClick={() => captureImage(chartRef, 'chart')}
                style={{ width: "30px", height: "30px", color: "#32406d", marginRight: "10px", cursor: "pointer", justifyContent: "end" }}
              />
              <MdCancel onClick={closeModal} style={{ width: "25px", height: "25px", marginTop: "2px", cursor: "pointer", color: "#32406d" }} />

            </div>

            <div style={{ marginTop: "5px",marginBottom:"2px",position:"sticky",top:"30px",left:'0',background:"#fff" }}>

              {selectedReport === 'successful_submission' && (

                <div
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "5px",
                  }}
                >
                  <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Submissions</h3>
                    </div>
                    <div className="card-footers">
                      <p>{selectedCandidateCount}</p>
                    </div>

                  </div>

                  <div
                    className="cards"
                    style={{ backgroundColor: "#d14545d1", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Rejected</h3>
                    </div>
                    <div className="card-footers">
                      <p>{rejectedCount}</p>
                    </div>
                  </div>
                  <div
                    className="cards"
                    style={{ backgroundColor: "lightgreen", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Selected</h3>
                    </div>
                    <div className="card-footers">
                      <p>{selectedCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#6fafdb", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Feedback</h3>
                    </div>
                    <div className="card-footers">
                      <p>{processCount}</p>
                    </div>
                  </div>
                  {/* {(selectedReport === 'successful_submission'
                      ) && (
                          <div className="cards" style={{ backgroundColor: "lightpink", width: "140px" }}>
                            <div className="card-headers">
                              <h3 style={{ textAlign: "center" }}>Ranking</h3>
                            </div>
                            <div className="card-footers">
                              <p>{ranked}</p>
                            </div>
                          </div>
                        )} */}
                </div>

              )}
              {selectedReport === 'job_type_analysis' && (

                <div
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "5px",
                  }}
                >
                  <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Submissions</h3>
                    </div>
                    <div className="card-footers">
                      <p>{SubmissionCandidateCount}</p>
                    </div>

                  </div>

                  <div
                    className="cards"
                    style={{ backgroundColor: "lightgreen", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                    </div>
                    <div className="card-footers">
                      <p>{selectedroleCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#6fafdb", width: "190px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>closureRate(%)</h3>
                    </div>
                    <div className="card-footers">
                      <p>{(processroleCount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedReport === 'client_analysis' && (
                <div
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "5px",
                  }}
                >
                  <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Submissions</h3>
                    </div>
                    <div className="card-footers">
                      <p>{clientcount}</p>
                    </div>

                  </div>

                  <div
                    className="cards"
                    style={{ backgroundColor: "lightgreen", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                    </div>
                    <div className="card-footers">
                      <p>{clientselectedCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#d14545d1", width: "190px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Rejected</h3>
                    </div>
                    <div className="card-footers">
                      <p>{clientrejectedCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#6fafdb", width: "190px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Feedback</h3>
                    </div>
                    <div className="card-footers">
                      <p>{clientprocessCount}</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedReport === 'submission_analysis' && (
                <div
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "5px",
                  }}
                >

                  <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Submissions</h3>
                    </div>
                    <div className="card-footers">
                      <p>{newselectedCandidateCount}</p>
                    </div>

                  </div>

                  <div
                    className="cards"
                    style={{ backgroundColor: "lightgreen", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                    </div>
                    <div className="card-footers">
                      <p>{newselectedCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#d14545d1", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Rejected</h3>
                    </div>
                    <div className="card-footers">
                      <p>{newrejectedCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#6fafdb", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Feedback</h3>
                    </div>
                    <div className="card-footers">
                      <p>{newprocessCount}</p>
                    </div>
                  </div>

                </div>
              )}

              {selectedReport === 'time_to_close_analysis' && (

                <div
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "5px",
                  }}
                >
                  <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Submissions</h3>
                    </div>
                    <div className="card-footers">
                      <p>{totalcandidatescount}</p>
                    </div>

                  </div>

                  <div
                    className="cards"
                    style={{ backgroundColor: "lightgreen", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                    </div>
                    <div className="card-footers">
                      <p>{totalonboardcount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#6fafdb", width: "190px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>onboarded(%)</h3>
                    </div>
                    <div className="card-footers">
                      <p>{(onboardedpercentage).toFixed(2)}</p>
                    </div>
                  </div>
                  {/* <div className="cards" style={{ backgroundColor: "lightpink", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Rankings</h3>
                    </div>
                    <div className="card-footers">
                      <p>{ranking}</p>
                    </div>
                  </div> */}
                </div>
              )}
              {selectedReport === 'historical_performance_analysis' && (
                <div
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "5px",
                  }}
                >

                  <div className="cards" style={{ backgroundColor: "#f2c064", width: "140px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Submissions</h3>
                    </div>
                    <div className="card-footers">
                      <p>{historicalcount}</p>
                    </div>

                  </div>

                  <div
                    className="cards"
                    style={{ backgroundColor: "lightgreen", width: "140px" }}
                  >
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>OnBoard</h3>
                    </div>
                    <div className="card-footers">
                      <p>{historicalselectedCount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#d14545d1", width: "190px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Rejected</h3>
                    </div>
                    <div className="card-footers">
                      <p>{historicalrejectedcount}</p>
                    </div>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#6fafdb", width: "190px" }}>
                    <div className="card-headers">
                      <h3 style={{ textAlign: "center" }}>Feedback</h3>
                    </div>
                    <div className="card-footers">
                      <p>{historicalprocessCount}</p>
                    </div>
                  </div>
                </div>
              )}


            </div>
            <div>

              {selectedReport === 'successful_submission' && (
                <BarChartComponent recruiterData={recruiterData} selectedReport="successful_submission" handleChartDataUpdate={handleChartDataUpdate} totalCandidateCount={totalCandidateCount} selectedCandidateCount={selectedCandidateCount}
                  processCount={processCount} selectedCount={selectedCount} rejectedCount={rejectedCount} />
              )}
            </div>
            {selectedReport === 'client_analysis' && (
              <BarChartComponent clientSummary={clientSummary} selectedReport="client_analysis" handleClientDataUpdate={handleClientDataUpdate} />
            )}
            {selectedReport === 'time_to_close_analysis' && (
              <BarChartComponent timeToCloseData={timeToCloseData} selectedReport="time_to_close_analysis" timehandlechart={timehandlechart} />
            )}
            {selectedReport === 'job_type_analysis' && (
              <BarChartComponent roleSummary={roleSummary} selectedReport="job_type_analysis" setSubmissionCandidateCount={setSubmissionCandidateCount}
                setSelectedroleCount={setSelectedroleCount} setRolesName={setRolesName} setProcessroleCount={setProcessroleCount} />
            )}

            {selectedReport === 'submission_analysis' && (
              <BarChartComponent datanew={datanew} selectedReport="submission_analysis" handlesubmission={handlesubmission} totalCandidateCount={totalCandidateCount} selectedCandidateCount={selectedCandidateCount}
                processCount={processCount} selectedCount={selectedCount} rejectedCount={rejectedCount} />
            )}
            {selectedReport === 'historical_performance_analysis' && (
              <BarChartComponent historical_data={historical_data} selectedReport="historical_performance_analysis" final={final} handlehistoricaldata={handlehistoricaldata} />
            )}

          </div >

        </Modal>

        <Modal
          isOpen={isModalOpen1}
          onRequestClose={closeModal1}
          className="customModalContent"
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
              marginRight: "-70%",
              transform: "translate(-50%, -50%)",
              height: "auto",
              maxHeight: "65vh",
              width: "70%",
              // maxWidth: "70%",
              marginTop:"30%",
              overflow: "auto",
           
              padding: "20px",
              border: "2px solid #32406D",
              backgroundColor: "#fff",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              // WebkitBackdropFilter: "blur(8px)",
              // backdropFilter: "blur(8px)",
            },
          }}
        >
          <div style={{ display: "flex", marginBottom: "30px", justifyContent: "end" }}>
            <MdCloudDownload onClick={() => captureImage(tableRef, 'table')} style={{ width: "30px", height: "30px", marginRight: "10px", color: "#32406d", cursor: "pointer", justifyContent: "end" }} />
            <MdCancel onClick={closeModal1} style={{ width: "30px", height: "30px", cursor: "pointer", color: "#32406d" }} />
          </div>
          <div className="card1" ref={tableRef} style={{ marginTop: "-30px" }}>
            {selectedReport === 'successful_submission' && (
              <>
                <h3 style={{ color: "#32406D", textAlign: "center" }}>Successful Closure Summary</h3>
                <SuccessfulConversionSummary sortedSummary={sortedSummary} displayColumns={['Recruiter', 'Candidate Count', 'Selected', 'Rejected', 'In Process', 'Percentage Selected', 'Ranking']} />
              </>
            )}
            {selectedReport === 'historical_performance_analysis' && (
              <>
                <h3 style={{ color: "#32406D", textAlign: "center" }}>Historical Performance Analysis</h3>
                <SuccessfulConversionSummary historical_data={historical_data} displayColumns5={['Recruiter', 'Month', 'Total Candidate', 'Selected', 'Avg Closure Time']} />
              </>
            )}
            {selectedReport === 'client_analysis' && (
              <>
                <h3 style={{ color: "#32406D", textAlign: "center" }}>Successful client Closure Summary</h3>
                <SuccessfulConversionSummary clientSummary={clientSummary} displayColumns2={['clients', 'No of candidates sourced', 'No of candidates Accepted', 'Closure Rate', 'Rankings']} />
              </>
            )}
            {selectedReport === 'time_to_close_analysis' && (
              <>
                <h3 style={{ color: "#32406D", textAlign: "center" }}>Time to Close Analysis</h3>
                <SuccessfulConversionSummary timeToCloseData={timeToCloseData} displayColumns3={['Recruiters', 'Total candidates', 'On Boarded candidates', 'On Boarded Percentage', 'Avg Closure time(days)', 'Rankings']} />
              </>
            )}
            {selectedReport === 'job_type_analysis' && (
              <>
                <h3 style={{ color: "#32406D", textAlign: "center" }}>Job Type Analysis</h3>
                <SuccessfulConversionSummary roleSummary={roleSummary} displayColumns4={['Client', 'Roles', 'Location', 'No of candidates', 'OnBoard', 'Closure Rate(%)']} />
              </>

            )}
            <div>
              {selectedReport === 'submission_analysis' && (
                <div style={{ height: "400px", overflow: "auto" }}>
                  <h3 style={{ color: "#32406D", textAlign: "center" }}>Submission analysis Report</h3>
                  <div className="dashcontainer" style={{ marginBottom: '10px', overflow: "auto", height: "90%" }}>
                    <div className="table-container" style={{
                      overflowX: "auto",
                      overflowY: "auto",
                      marginTop: "3px",
                      height: "100%",
                    }}>
                      <table className="table" id="candidates-table"
                        style={{
                          tableLayout: "fixed",
                          width: "100%",
                          marginTop: "-5px",
                          // overFlowX:'auto'
                        }}>
                        <thead>
                          {
                            type === 'submission_counts_daily' ? (<tr>
                              <th className="d1" style={{ width: "200px" }}>Recruiter</th>
                              {
                                columns !== null && columns.map((obj, idx) => <th className="d1" key={idx} style={{ width: "200px" }}>{obj?.heading}</th>)
                              }
                            </tr>) : type === 'submission_counts_weekly' ? (<tr>
                              <th style={{ width: "200px" }}>Recruiter</th>
                              {
                                columns !== null && columns.map((obj, idx) => <th key={idx} style={{ width: "200px" }}>{`${obj["week"]} (${obj["from"]} - ${obj["to"]})`}</th>)
                              }
                            </tr>) : type === 'submission_counts_monthly' ? (<tr>
                              <th style={{ width: "200px" }}>Recruiter</th>
                              {
                                columnsForMonths !== null && columnsForMonths.map((obj, idx) => <th key={idx} style={{ width: "200px" }}>{obj["month"]}{obj["year"]}</th>)
                              }
                            </tr>) : (<tr>
                              <th style={{ width: "200px" }}>Recruiter</th>
                              {
                                columnsForYears !== null && columnsForYears.map((str, idx) => <th key={idx} style={{ width: "200px" }}>{str}</th>)
                              }
                            </tr>)
                          }
                        </thead>
                        <tbody className="scrollable-body">
                          {
                            type === "submission_counts_daily" ?
                              (recruiterTableData?.map((list, idx) => {
                                const sublist = list.slice(1);
                                return (<tr key={idx}>
                                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>{list[0]}</td>
                                  {
                                    sublist.map((str, idx) => <td key={idx}>{str}</td>)
                                  }
                                </tr>)
                              })) : type === "submission_counts_weekly" ?
                                (recruiterTableData?.map((list, idx) => {
                                  const sublist = list.slice(1);
                                  return (<tr key={idx}>
                                    <td>{list[0]}</td>
                                    {
                                      sublist.map((str, idx) => <td key={idx}>{str}</td>)
                                    }
                                  </tr>)
                                })) : type === "submission_counts_monthly" ?
                                  (recruiterTableData?.map((list, idx) => {
                                    return (<tr key={idx}>
                                      {
                                        list.map((str, idx) => <td key={idx}>{str}</td>)
                                      }
                                    </tr>)
                                  })) : type === "submission_counts_yearly" ?
                                    (recruiterTableData?.map((list, idx) => {
                                      return (<tr key={idx}>
                                        {
                                          list.map((str, idx) => <td key={idx}>{str}</td>)
                                        }
                                      </tr>)
                                    })) : (
                                      <tr>no data available</tr>
                                    )
                          }
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>

              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Tekspot_Applications;
