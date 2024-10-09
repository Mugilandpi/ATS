import React, { useEffect, useState } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "./AssignedRequirements.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { MdFilterAlt } from "react-icons/md";
import filter_icon from '../../assets/filter_icon.svg'
import ResumeIcon from "../../assets/resume.png"
import {getAllJobs} from "../utilities"
import clear_search from '../../assets/clear_search.svg'
// import "./joblisting.css";
// import './AssignedRequirements.css';
import { FaUserPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreeDots,Radio } from "react-loader-spinner";
import Error from "../../assets/error.jpg"
import {
  faFileAlt,
  faInfoCircle,
  faSyncAlt,
  faTrashAlt,
  faPen,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { Hourglass } from "react-loader-spinner";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "../../store/slices/jobSlice";
import { useRef } from "react";
function AssignedRequirements() {
  // css style objects

  const thstyle = { textAlign: "left" }
  const tdstyle = { textAlign: "left" }

  console.log("assigned requirements rendered")

  const uniRef = useRef();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [matchData, setMatchData] = useState({
    experience_match_percentage: 0,
    experience_unmatch_percentage: 0,
    skill_match_percentage: 0,
    overall_match_percentage: 0,
  });
  const [waitForSubmission, setwaitForSubmission] = useState(false);

  const [belowCount, setBelowCount] = useState(0);
  const { jobs } = useSelector((state) => state.jobSliceReducer);

  console.log(jobs,AssignedRequirements)
  const [id, setId] = useState(1);
  const [details, setDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [filteredId, setFilteredId] = useState([]);
  const [countItems, setCountItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  //filtered
  const [selectAllDate, setSelectAllDate] = useState(false);
  const [uniqueDataDate, setuniqueDataDate] = useState([]);
  const [dateSelected, setdateSelected] = useState([]);

  const [selectAllForJobId, setselectAllForJobId] = useState(false);
  const [uniqueDatajobId, setuniqueDatajobId] = useState([]);
  const [jobIdSelected, setjobIdSelected] = useState([]);

  const [selectAllStatus, setSelectAllStatus] = useState(false);
  const [uniqueDataStatus, setuniqueDataStatus] = useState([]);
  const [statusSelected, setstatusSelected] = useState([]);

  const [selectAllClient, setSelectAllClient] = useState(false);
  const [uniqueDataClient, setuniqueDataClient] = useState([]);
  const [clientSelected, setclientSelected] = useState([]);

  const [selectAllRecruiter, setSelectAllRecruiter] = useState(false);
  const [uniqueDataRecruiter, setuniqueDataRecruiter] = useState([]);
  const [recruiterSelected, setrecruiterSelected] = useState([]);

  const [selectAllProfile, setSelectAllProfile] = useState(false);
  const [uniqueDataProfile, setuniqueDataProfile] = useState([]);
  const [profileSelected, setprofileSelected] = useState([]);

  const jdApiCall = async (item) => {
    console.log("Fetching jd_file...");
    try {
      const response = await fetch(
        `http://144.126.254.255/view_jd/${item.id}`,
        {
          method: "GET",
        },
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        console.log("Failed to fetch jd_file:", response.statusText);
      }
    } catch (err) {
      console.log("Error fetching jd_file:", err);
    }
  };

  const handleCloseModal = () => {
    setShowResults(false)
    setShowModal(false)
  }

  //filtering

  const [showSearchjoblisting, setshowSearchjoblisting] = useState({
    showSearchdate: false,
    showSearchuserId: false,
    showSearchStatus: false,
    showSearchClient: false,
    showSearchRecruiter: false,
    showSearchProfile: false,
  });
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [isJobIdFiltered, setIsJobIdFiltered] = useState(false);
  const [isstatusFiltered, setIsStatusFiltered] = useState(false);
  const [isclientFiltered, setIsClientFiltered] = useState(false);
  const [isprofileFiltered, setIsProfileFiltered] = useState(false);

  useEffect(() => {
    // console.log("handleOkClick Called");
    handleOkClick();
  }, [dateSelected,
    jobIdSelected,
    statusSelected,
    clientSelected,
    recruiterSelected,
    profileSelected]);


  const handleOkClick = () => {
    setId(1)
    updateFilteredRows({
      dateSelected,
      jobIdSelected,
      statusSelected,
      clientSelected,
      recruiterSelected,
      profileSelected,

      setdateSelected,
      setjobIdSelected,
      setstatusSelected,
      setclientSelected,
      setrecruiterSelected,
      setprofileSelected,

      setSelectAllDate,
      setselectAllForJobId,
      setSelectAllStatus,
      setSelectAllClient,
      setSelectAllRecruiter,
      setSelectAllProfile,

      setuniqueDataDate,
      setuniqueDatajobId,
      setuniqueDataStatus,
      setuniqueDataClient,
      setuniqueDataRecruiter,
      setuniqueDataProfile,
    });

    setIsDateFiltered(dateSelected.length > 0);
    setIsJobIdFiltered(jobIdSelected.length > 0);
    setIsClientFiltered(clientSelected.length > 0);
    setIsProfileFiltered(profileSelected.length > 0);
    setIsStatusFiltered(statusSelected.length > 0);

    // setshowSearchjoblisting((prev) =>
    //   Object.fromEntries(
    //     Object.entries(prev).map(([key, value]) => [key, false]),
    //   ),
    // );
  };
  const handleCheckboxChangeForDate = (date_created) => {
    const isSelected = dateSelected.includes(date_created.toLowerCase());
    if (isSelected) {
      setdateSelected(
        dateSelected.filter((d) => d !== date_created.toLowerCase()),
      );
      setSelectAllDate(false);
    } else {
      setdateSelected([...dateSelected, date_created.toLowerCase()]);
      setSelectAllDate(dateSelected.length === uniqueDataDate.length - 1);
    }
  };

  const handleSelectAllForDate = () => {
    const allChecked = !selectAllDate;
    setSelectAllDate(allChecked);

    if (allChecked) {
      setdateSelected(uniqueDataDate.map((d) => d.toString()));
    } else {
      setdateSelected([]);
    }
  };

  const handleCheckboxChangeUser = (id) => {
    const isSelected = jobIdSelected.includes(id);
    if (isSelected) {
      setjobIdSelected((prevSelected) =>
        prevSelected.filter((item) => item !== id),
      );
      setselectAllForJobId(false);
    } else {
      setjobIdSelected((prevSelected) => [...prevSelected, id]);
      setselectAllForJobId(jobIdSelected.length === uniqueDatajobId.length - 1);
    }
  };

  const handleSelectAllForUserId = () => {
    const allChecked = !selectAllForJobId;
    setselectAllForJobId(allChecked);
    if (allChecked) {
      setjobIdSelected(uniqueDatajobId.map((d) => d.toString()));
    } else {
      setjobIdSelected([]);
    }
  };

  const handleCheckboxChangeStatus = (job_status) => {
    const isSelected = statusSelected.includes(job_status);
    if (isSelected) {
      setstatusSelected((prevSelected) =>
        prevSelected.filter((item) => item !== job_status),
      );
      setSelectAllStatus(false);
    } else {
      setstatusSelected((prevSelected) => [...prevSelected, job_status]);
      setSelectAllStatus(statusSelected.length === uniqueDataStatus.length - 1);
    }
  };
  const handleSelectAllForStatus = () => {
    const allChecked = !selectAllStatus;
    setSelectAllStatus(allChecked);

    if (allChecked) {
      setstatusSelected(uniqueDataStatus.map((d) => d.toLowerCase()));
    } else {
      setstatusSelected([]);
    }
  };

  const handleCheckboxChangeClient = (client) => {
    const isSelected = clientSelected.includes(client);
    if (isSelected) {
      setclientSelected((prevSelected) =>
        prevSelected.filter((item) => item !== client),
      );
      setSelectAllClient(false);
    } else {
      setclientSelected((prevSelected) => [...prevSelected, client]);
      setSelectAllClient(clientSelected.length === uniqueDataClient.length - 1);
    }
  };
  const handleSelectAllForClient = () => {
    const allChecked = !selectAllClient;
    setSelectAllClient(allChecked);

    if (allChecked) {
      setclientSelected(uniqueDataClient.map((d) => d.toLowerCase()));
    } else {
      setclientSelected([]);
    }
  };
  const handleCheckboxChangeRecruiter = (recruiter) => {
    const isSelected = recruiterSelected.includes(recruiter);
    if (isSelected) {
      setrecruiterSelected((prevSelected) =>
        prevSelected.filter((item) => item !== recruiter),
      );
      setSelectAllRecruiter(false);
    } else {
      setrecruiterSelected((prevSelected) => [...prevSelected, recruiter]);
      setSelectAllRecruiter(
        recruiterSelected.length === uniqueDataRecruiter.length - 1,
      );
    }
  };
  const handleSelectAllForRecruiter = () => {
    const allChecked = !selectAllRecruiter;
    setSelectAllRecruiter(allChecked);

    if (allChecked) {
      setrecruiterSelected(uniqueDataRecruiter.map((d) => d.toLowerCase()));
    } else {
      setrecruiterSelected([]);
    }
  };

  const handleCheckboxChangeProfile = (role) => {
    const isSelected = profileSelected.includes(role);
    if (isSelected) {
      setprofileSelected((prevSelected) =>
        prevSelected.filter((item) => item !== role),
      );
      setSelectAllProfile(false);
    } else {
      setprofileSelected((prevSelected) => [...prevSelected, role]);
      setSelectAllProfile(
        profileSelected.length === uniqueDataProfile.length - 1,
      );
    }
  };
  const handleSelectAllForProfile = () => {
    const allChecked = !selectAllProfile;
    setSelectAllProfile(allChecked);

    if (allChecked) {
      setprofileSelected(uniqueDataProfile.map((d) => d.toLowerCase()));
    } else {
      setprofileSelected([]);
    }
  };
  const [filteredRows, setFilteredRows] = useState([]);
  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);
  const updateFilteredRows = ({
    dateSelected,
    jobIdSelected,
    statusSelected,
    clientSelected,
    recruiterSelected,
    profileSelected,

    setuniqueDataDate,
    setuniqueDatajobId,
    setuniqueDataStatus,
    setuniqueDataClient,
    setuniqueDataRecruiter,
    setuniqueDataProfile,
  }) => {
    const it = jobs;
    // console.log(it);
    const filteredList = it.filter((item) => {
      // // console.log(typeof item.recruiter, " ", item.recruiter);
      // console.log(
      //   typeof (localStorage.getItem("username"),
      //   " ",
      //   localStorage.getItem("username")),
      // );
      return item.recruiter
        .split(", ")
        .includes(localStorage.getItem("name"));
    });


    let prevfilteredRows = filteredList;
    console.log("prevfilteredRows", prevfilteredRows)

    if (dateSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        dateSelected.includes(row.date_created.toString()),
      );
    }
    if (jobIdSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        jobIdSelected.includes(row.id.toString()),
      );
    }
    if (statusSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        statusSelected.includes(row.job_status.toLowerCase()),
      );
    }
    if (clientSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        clientSelected.includes(row.client.toLowerCase()),
      );
    }
    if (recruiterSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        recruiterSelected.includes(row.recruiter.toLowerCase()),
      );
    }
    if (profileSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        profileSelected.includes(row.role.toLowerCase()),
      );
    }
    const arrayNames = [
      "dateSelected",
      "jobIdSelected",
      "statusSelected",
      "clientSelected",
      "recruiterSelected",
      "profileSelected",
    ];

    const arrays = [
      dateSelected,
      jobIdSelected,
      statusSelected,
      clientSelected,
      recruiterSelected,
      profileSelected,
    ];

    let NamesOfNonEmptyArray = [];

    arrays.forEach((arr, index) => {
      if (arr.length > 0) {
        // NameOfNonEmptyArray = arrayNames[index];
        NamesOfNonEmptyArray.push(arrayNames[index]);
        // setNonEmptyArray(prev => ([
        //   ...prev,
        //   arrayNames[index]
        // ]))
      }
    });
    if (!NamesOfNonEmptyArray.includes("dateSelected")) {
      setuniqueDataDate(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.date_created;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("jobIdSelected")) {
      setuniqueDatajobId(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.id;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("statusSelected")) {
      setuniqueDataStatus(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.job_status;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("clientSelected")) {
      setuniqueDataClient(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.client;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("recruiterSelected")) {
      setuniqueDataRecruiter(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.recruiter;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("profileSelected")) {
      setuniqueDataProfile(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.role;
            }),
          ),
        );
      });
    }
    setFilteredRows(prevfilteredRows);
    setBelowCount(prevfilteredRows.length);
  };

  const [showRadio,setshowRadio] = useState(false);
  const [stopCount, setStopCount] = useState(0);
  useEffect(() => {
    console.log("interval useeffect")
    console.log(stopCount)
    if (stopCount !== 0) {
      if (stopCount !== 0 && stopCount < 10) {
        const intervalId = setInterval(() => {
          console.log(stopCount)
          setStopCount(stopCount + 1)
        }, 1000)
        return () => clearInterval(intervalId)
      }
      if (stopCount === 10) {
        setLoading(false)
      }
    }
  }, [stopCount])

  const setDashboardData = async () => {
    if (jobs.length > 0) {
      const it = jobs;
      console.log(it);
      const filteredList = it.filter((item) => {
        // console.log(typeof item.recruiter, " ", item.recruiter);
        // console.log(
        //   typeof (localStorage.getItem("username"),
        //   " ",
        //   localStorage.getItem("username")),
        // );
        return item.recruiter
          .split(", ")
          .includes(localStorage.getItem("name"));
      });
      // console.log(filteredList);
      setListing(filteredList);
      setLoading(false);
      setStopCount(0);
      setuniqueDataDate([...new Set(filteredList.map((d) => d.date_created))]);
      setuniqueDatajobId([...new Set(filteredList.map((d) => d.id))]);
      setuniqueDataStatus([...new Set(filteredList.map((d) => d.job_status))]);
      setuniqueDataClient([...new Set(filteredList.map((d) => d.client))]);
      setuniqueDataRecruiter([
        ...new Set(filteredList.map((d) => d.recruiter)),
      ]);
      setuniqueDataProfile([...new Set(filteredList.map((d) => d.role))]);
      console.log("filteredList", filteredList)
      setFilteredRows(filteredList);
      setBelowCount(filteredList.length);
      const val = filteredList.length;
      if (val % 30 != 0) setCountItems(parseInt(val / 30) + 1);
      else setCountItems(parseInt(val / 30));
    } else {
      // console.log('hello')
      try {
        setStopCount(1);
        getAllJobs()
      } catch (err) {
        console.log("Handle error:", err);
      }
    }
  };

  useEffect(() => {
    setDashboardData();
  }, [jobs]);

  useEffect(() => {
    const closeFilterPop = (e) => {
      const allRefIds = [
        "job_postedRef",
        "job_idRef",
        "job_statusRef",
        "client_ref",
        "recuiter_ref",
        "role_ref",

        "job_label_postRef",
        "job_label_idRef",
        "job_label_statusRef",
        "client_label_ref",
        "role_label_ref",
      ];
      let bool = false;
      for (const ref of allRefIds) {
        if (document.getElementById(ref)?.contains(e.target)) {
          bool = true;
          return;
        }
      }
      if (uniRef.current?.contains(e.target) || bool) {
        console.log("yes");
      } else {
        console.log("no");
        setshowSearchjoblisting((prev) => ({
          ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
        }));
      }
    };
    document.addEventListener("click", closeFilterPop);
    return () => {
      document.removeEventListener("click", closeFilterPop);
    };
  });
  useEffect(() => {
    console.log(listing);
  }, [listing]);

  const goToCandidateDetails = (candidate) => {
    // console.log('candidate details', candidate)
    navigate("/CandidateDetails", { state: candidate });
  };
  function extractKeyValuePairs(object, keysToExtract) {
    return keysToExtract.reduce((acc, key) => {
      if (key in object) {
        acc[key] = object[key];
      }
      return acc;
    }, {});
  }
  const getPageRange = () => {
    const pageRange = [];
    const maxPagesToShow = 5; // Adjust this value to show more or fewer page numbers

    // Determine the start and end page numbers to display
    let startPage = Math.max(1, id - Math.floor(maxPagesToShow / 30));
    let endPage = Math.min(countItems, startPage + maxPagesToShow - 1);

    // Adjust startPage and endPage if near the beginning or end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Include ellipsis if necessary
    if (startPage > 1) {
      pageRange.push(1);
      if (startPage > 30) {
        pageRange.push("...");
      }
    }

    // Add page numbers to the range
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }

    // Include ellipsis if necessary
    if (endPage < countItems) {
      if (endPage < countItems - 1) {
        pageRange.push("...");
      }
      pageRange.push(countItems);
    }

    return pageRange;
  };
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= countItems) {
      setId(pageNumber);
    }
  };
  const displayItems = () => {
    console.log("filteredRows", filteredRows)
    const data = filteredRows
      ?.filter((item) => {
        if (filteredId.length > 0) {
          for (const it of filteredId) {
            if (it === item.id) {
              return true;
            }
          }
          // Return false only if none of the elements in filteredId match item.id
          return false;
        } else {
          // console.log("zero size");
          if (searchValue === "") return true;
          else return false;
        }
      })
      .filter((_, idx) => idx + 1 <= id * 30 && idx + 1 > (id - 1) * 30);
    // console.log("data", data)
    return data;
  };
  const handleDetails = (item) => {
    setDetails(item);
    setShowDetails(true);
  };
  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  const fun = (data) => {
    const list = data.filter((it) => {
      return filteredRows.some((item) => item.id === it.id);
    });
    // setBelowCount(list?.length)
    const value = list?.length;
    console.log(value, "value");
    setBelowCount(value);

    if (searchValue === "") {
      if (localStorage.getItem("page_no")) {
        setId(parseInt(localStorage.getItem("page_no")));
        localStorage.removeItem("page_no");
      }
    } else {
      setId(1);
    }
    // setuniqueDataDate([...new Set(list.map((d) => d.date_created))]);
    // setuniqueDatajobId([...new Set(list.map((d) => d.id))]);
    // setuniqueDataStatus([...new Set(list.map((d) => d.job_status))]);
    // setuniqueDataClient([...new Set(list.map((d) => d.client))]);
    // setuniqueDataRecruiter([...new Set(list.map((d) => d.recruiter))]);
    // setuniqueDataProfile([...new Set(list.map((d) => d.role))]);
  };
  useEffect(() => {
    if (belowCount % 30 != 0) setCountItems(parseInt(belowCount / 30) + 1);
    else setCountItems(parseInt(belowCount / 30));
  }, [belowCount]);
  useEffect(() => {
    // console.log(searchValue)

    if (listing.length > 0) {
      const update = listing.filter((item) => {
        const extractedObj = extractKeyValuePairs(item, [
          "id",
          "date_created",
          "job_status",
          "client",
          "role",
        ]);
        console.log(extractedObj);
        for (const key in extractedObj) {
          if (key === "id") {
            continue;
          }
          console.log("key", key);
          let val = extractedObj[key];
          console.log(val);
          if (val !== null && val !== undefined) {
            if (typeof val !== "string") {
              val = val.toString();
            }
            if (val.toLowerCase().includes(searchValue.toLowerCase())) {
              console.log("yes working good");
              return true;
            }
          } else {
            console.log("Value is null or undefined for key:", key);
          }
        }
        console.log("No match found for searchValue:", searchValue);
        return false;
      });
      console.log(update);
      fun(update);
      let extract = [];
      for (const item of update) {
        extract.push(item.id);
      }
      setFilteredId(extract);
      console.log(extract);
    }
  }, [filteredRows, searchValue]);
  // useEffect(()=>{
  //   if(localStorage.getItem('path')){
  //     localStorage.removeItem('path')
  //   }
  // },[])

  const removeAllFilter = () => {
    setdateSelected([])
    setjobIdSelected([])
    setstatusSelected([])
    setclientSelected([])
    setprofileSelected([])
  }
  useEffect(() => {
    console.log(selectedRow)
  }, [selectedRow])
  const fileToBase64 = (file) => {
    if (file === null) return;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      console.log(file, "pdf")
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRow) {
      // handle submit with selectedItem
      console.log('Submitting with item:', selectedRow);
      // Perform your submit logic here
    } else {
      console.error('No item selected');
    }
    if (!selectedFile) {
      toast.error("Please upload a resume before submitting.");
      return;
    }
    if (!waitForSubmission) {
      setwaitForSubmission(true)
      try {
        const base64String = await fileToBase64(selectedFile);
        const candidateExperience = document.getElementById('candidate_experenece').value;
        console.log("Base64 String:"); // Add this line for debugging
        console.log(selectedRow, "jobid")
        const body_data = {
          user_id: localStorage.getItem("user_id"),
          resume: base64String,
          job_id: selectedRow.id,
 
        };
        console.log("job post Request Body:", body_data); // Add this line for debugging
 
        const response = await fetch(
          "http://144.126.254.255/check_resume_match", {
          // "api/check_resume_match", {
          method: "POST",
          // mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body_data),
        });
 
        const data = await response.json();
        console.log("data", data);
        setShowResults(true);
        setMatchData({
          experience_match_percentage: data.experience_match_percentage,
          experience_unmatch_percentage: data.experience_unmatch_percentage,
          skill_match_percentage: data.skill_match_percentage,
          overall_match_percentage: data.overall_match_percentage
        })
      } catch (err) {
        console.log("handle error", err);
        toast.error("An error occured, try again");
      } finally {
        setwaitForSubmission(false)
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  return (
    // style={{filter:showDetails?'blur(5px)':'blur(0px)'}}
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        {loading ? (
          <div className="loader-container">
            <Hourglass
              // visible={true}
              height="60"
              width="60"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={["#306cce", "#72a1ed"]}
            />
          </div>
        ) : stopCount >= 10 ? (
          <div style={{
            marginTop: "40px", height: "80vh", display: "flex",
            justifyContent: "center", alignItems: "center"
          }}>
            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "lightgray", padding: "10px 10px 10px 10px", borderRadius: "4px", rowGap: "0px" }}>
              <img style={{ height: "100px", width: "100px" }} src={Error} alt="error" />
              <h3 style={{ paddingBottom: "0px" }}>Something went wrong</h3>
              <text style={{ fontWeight: 300 }}>Try refreshing the page, or try again later.</text>
              <div style={{ display: "flex" }}>
                <motion.button
                  className="error-refresh"
                  id={"addCandidateSubmit"}
                  type="submit"
                  style={{
                    borderRadius: "4px",
                    background: "#32406D",
                    color: "#fff",
                    width: "100px",
                    position: "relative",
                  }}
                  onClick={() => {
                    window.location.reload()
                    setshowRadio(true)
                  }}
                  whileTap={{ scale: 0.8 }} // Scale down to 80% of the original size on click
                  animate={{ scale: 1 }} // Animate back to original size
                  transition={{ duration: 0.2 }} // Duration for the animation
                >
                  Refresh Page
                </motion.button>
                <div>
                  <Radio
                    visible={showRadio}
                    height="40"
                    width="40"
                    color="#4fa94d"
                    ariaLabel="radio-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              </div>
            </div>

          </div>
        ) : (
          <>
            {showDetails && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 98,
                }}
              >
                <motion.div
                  style={{
                    paddingBottom: "10px",
                    zIndex: "99",
                    borderRadius: "4px",
                    position: "fixed",
                    left: "35%",
                    top: "10px",
                    backgroundColor: "white",
                    padding: "10px",
                    width: "500px",
                    // height:"90vh",
                    height: "auto",
                    maxHeight: "90vh",
                    overflow: "auto"
                  }}
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h3 style={{ paddingTop: "0px" }}>Job Details</h3>

                    <MdCancel onClick={handleCloseDetails} style={{ cursor: "pointer", height: "30px", width: "30px" }} />
                  </div>
                  <table id={"details"}>
                    <tr id={"tr"}>
                      <th id={"th"}>Job ID:</th>
                      <td id={"td"}>{details.id}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Client:</th>
                      <td id={"td"}>{details.client}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Role:</th>
                      <td id={"td"}>{details.role}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Skills:</th>
                      <td id={"td"}>{details.skills}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Min Experience:</th>
                      <td id={"td"}>{details.experience_min}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Max Experience:</th>
                      <td id={"td"}>{details.experience_max}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Job Location:</th>
                      <td id={"td"}>{details.location}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Shift Timings:</th>
                      <td id={"td"}>{details.shift_timings}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Notice period:</th>
                      <td id={"td"}>{details.notice_period}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"} >Detailed JD:</th>
                      <div style={{ maxHeight: "300px", overflowY: "auto", wordBreak: "break-word", }}>
                        <td id={"td"} style={{ border: "none" }}>
                          {details.detailed_jd}
                        </td>
                      </div>

                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Mode Of Work:</th>
                      <td id={"td"}>{details.mode}</td>
                    </tr>
                    <tr id={"tr"}>
                      <th id={"th"}>Requirement Assigned:</th>
                      <td id={"td"}>{details.management}</td>
                    </tr>
                  </table>
                </motion.div>
              </div>
            )}


            <div
            className="mobiledash"
            >

              <div style={{ display: 'flex', alignItems: 'center',zIndex:'2' }}>
                <IoMdSearch style={{ display: 'flex', alignItems: 'center', height: "22px", width: "22px", marginRight: "-25px", marginTop: "5px" }} />
                <input
                  placeholder="Search"
                  style={{
                    marginTop: "4px",
                    paddingLeft: "26px",
                    height: "30px",
                    width: "300px",
                    backgroundColor: "rgba(255, 255, 255, 0.80)",
                    border: "none",
                    borderRadius: "5px",
                    padding: "0 25px"
                  }}
                  value={searchValue}
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setSearchValue(e.target.value);
                    // date_created    job_id    name    email   mobile   client    profile    skills    recruiter    status
                  }}
                />
                {/* <button style={{marginLeft:'20px',backgroundColor: "#32406d",color:'white',border:'none',padding:'4px',borderRadius:'5px'}}
                  onClick={removeAllFilter}
>clear all filters</button> */}
                {/* <img style={{marginLeft:'20px',height:'24px'}} src={clear_search} alt="svg_img" /> */}
                <div className="remove_filter_icons" onClick={() => {
                  setSearchValue('');
                }} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center', borderRadius: "5px", marginTop: "4px" }}>
                  {/* <img style={{ cursor: 'pointer', height: '24px' }} src={clear_search} alt="svg_img"
                        data-tooltip-id={"remove_search"}
                        data-tooltip-content="Clear search"
                    /> */}
                  <MdOutlineYoutubeSearchedFor style={{ cursor: 'pointer', height: '24px', width: "24px", color: "#32406d" }} data-tooltip-id={"remove_search"}
                    data-tooltip-content="Clear search" />
                  <ReactTooltip
                    style={{ zIndex: 999, padding: "2px", backgroundColor: "#32406d" }}
                    place="top-start"
                    id="remove_search"
                  />
                </div>
                <div className="remove_filter_icons" onClick={removeAllFilter} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center', borderRadius: "5px", marginTop: "4px" }}>
                  <img style={{ cursor: 'pointer', height: '24px' }} src={filter_icon} alt="svg_img"
                    data-tooltip-id={"remove_filter"}
                    data-tooltip-content="Clear all filters"
                  />
                  <ReactTooltip
                    style={{ zIndex: 999, padding: "4px", backgroundColor: "#32406d" }}
                    place="top-start"
                    id="remove_filter"
                  />
                </div>
              </div>
            </div>
            <div className="theader">
            <h5
              className="joblisthead"
              style={{ paddingTop: "0px", fontWeight: "700", fontSize: "17px", margin: "-35px 0 10px" }}
            >
              View Job Requirements
            </h5>
            </div>

            <div class="container" style={{ marginTop: "0px" }}>
              <div
                className="table-container"
                style={{ overflowY: "auto", overflowX: "auto" }}
              >
                <table
                  style={{
                    width: "100%",
                    overflow: "auto",
                    tableLayout: "fixed",
                    marginTop: "15px",
                  }}
                  class="table userac"
                  id="myTable"
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#32406D",
                        color: "white",
                        height: "40px",
                      }}
                    >   <th style={{ width: "87px", color: showSearchjoblisting.showSearchdate ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"job_label_postRef"}
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchdate"
                                    ? !prev.showSearchdate
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Job Posted</span>
                        <MdFilterAlt
                          style={{ color: isDateFiltered ? "orange" : "white" }}
                          id={"job_postRef"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchdate"
                                    ? !prev.showSearchdate
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjoblisting.showSearchdate && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form"
                              className="Filter-inputs-container"
                            >
                              <ul>
                                <li>
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "12px",
                                      marginRight: "5px",
                                    }}
                                    checked={selectAllDate}
                                    onChange={handleSelectAllForDate}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      fontSize: '13px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelectAllForDate()}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataDate
                                    .sort((a, b) => {
                                      const inArray2a = dateSelected.includes(a);
                                      const inArray2b = dateSelected.includes(b);

                                      if (inArray2a && !inArray2b) {
                                        return -1;
                                      }
                                      else if (!inArray2a && inArray2b) {
                                        return 1;
                                      } else {
                                        return new Date(b) - new Date(a);
                                      }

                                    })
                                    .map((date_created, index) => (
                                      <div key={index} className="filter-inputs">
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={dateSelected.includes(
                                            date_created,
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeForDate(
                                              date_created,
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeForDate(
                                            date_created,
                                          )}>
                                          {date_created}
                                        </label>
                                      </div>
                                    ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchjoblisting((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "60px", color: showSearchjoblisting.showSearchuserId ? "orange" : "white" }}>
                        <span
                          id={"job_label_idRef"}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchuserId"
                                    ? !prev.showSearchuserId
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Job Id{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isJobIdFiltered ? "orange" : "white",
                          }}
                          id={"job_idRef"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchuserId"
                                    ? !prev.showSearchuserId
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjoblisting.showSearchuserId && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-user"
                              className="Filter-inputs-container"
                            >
                              <ul>
                                <li>
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "12px",
                                      marginRight: "5px",
                                    }}
                                    checked={selectAllForJobId}
                                    onChange={handleSelectAllForUserId}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      fontSize: '13px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelectAllForUserId()}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDatajobId
                                    .sort((a, b) => {
                                      const inArray2a = jobIdSelected.includes(a.toString());
                                      const inArray2b = jobIdSelected.includes(b.toString());

                                      if (inArray2a && !inArray2b) {
                                        return -1;
                                      }
                                      else if (!inArray2a && inArray2b) {
                                        return 1;
                                      } else {
                                        return a - b;
                                      }

                                    })
                                    .map((userId, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="filter-inputs"
                                        >
                                          <input
                                            type="checkbox"
                                            style={{
                                              width: "12px",
                                            }}
                                            checked={jobIdSelected.includes(
                                              userId.toString(),
                                            )}
                                            onChange={() =>
                                              handleCheckboxChangeUser(
                                                userId.toString(),
                                              )
                                            }
                                          />
                                          <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                            onClick={() => handleCheckboxChangeUser(
                                              userId.toString(),
                                            )}>
                                            {userId}
                                          </label>
                                        </div>
                                      );
                                    })}
                                </li>
                              </ul>
                            </form>

                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchjoblisting((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(([key]) => [
                                        key,
                                        false,
                                      ]),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "91px", color: showSearchjoblisting.showSearchStatus ? "orange" : "white" }}>
                        <span
                          id={"job_label_statusRef"}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchStatus"
                                    ? !prev.showSearchStatus
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Job Status{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isstatusFiltered ? "orange" : "white",
                          }}
                          id={"job_statusRef"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchStatus"
                                    ? !prev.showSearchStatus
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjoblisting.showSearchStatus && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-client"
                              className="Filter-inputs-container"
                            >
                              <ul>
                                <li>
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "12px",
                                      marginRight: "5px",
                                    }}
                                    checked={selectAllStatus}
                                    onChange={handleSelectAllForStatus}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      fontSize: '13px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelectAllForStatus()}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataStatus.map((job_status, index) => (
                                    <div key={index} className="filter-inputs">
                                      <input
                                        type="checkbox"
                                        style={{
                                          width: "12px",
                                        }}
                                        checked={statusSelected.includes(
                                          job_status.toLowerCase(),
                                        )}
                                        onChange={() =>
                                          handleCheckboxChangeStatus(
                                            job_status.toLowerCase(),
                                          )
                                        }
                                      />
                                      <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                        onClick={() => handleCheckboxChangeStatus(
                                          job_status.toLowerCase(),
                                        )}>
                                        {job_status}
                                      </label>
                                    </div>
                                  ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchjoblisting((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "100px", color: showSearchjoblisting.showSearchClient ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"client_label_ref"}
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchClient"
                                    ? !prev.showSearchClient
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Client{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isclientFiltered ? "orange" : "white",
                          }}
                          id={"client_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchClient"
                                    ? !prev.showSearchClient
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjoblisting.showSearchClient && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-client"
                              className="Filter-inputs-container"
                            >
                              <ul>
                                <li>
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "12px",
                                      marginRight: "5px",
                                    }}
                                    checked={selectAllClient}
                                    onChange={handleSelectAllForClient}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                    }}
                                    onClick={() => handleSelectAllForClient()} >
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataClient
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = clientSelected.includes(trimmedA);
                                      const inArray2B = clientSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return trimmedA.localeCompare(trimmedB);
                                      }
                                    })
                                    .map((client, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={clientSelected.includes(
                                            client.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeClient(
                                              client.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeClient(
                                            client.toLowerCase(),
                                          )}>
                                          {client}
                                        </label>
                                      </div>
                                    ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchjoblisting((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>

                      <th style={{ width: "132px", color: showSearchjoblisting.showSearchProfile ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"role_label_ref"}
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchProfile"
                                    ? !prev.showSearchProfile
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >
                          Role{" "}
                        </span>
                        <MdFilterAlt
                          style={{
                            color: isprofileFiltered ? "orange" : "white",
                          }}
                          id={"role_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchProfile"
                                    ? !prev.showSearchProfile
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjoblisting.showSearchProfile && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-role"
                              className="Filter-inputs-container"
                            >
                              <ul>
                                <li>
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "12px",
                                      marginRight: "5px",
                                    }}
                                    checked={selectAllProfile}
                                    onChange={handleSelectAllForProfile}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                    }}
                                    onClick={() => handleSelectAllForProfile()} >
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataProfile
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = profileSelected.includes(trimmedA);
                                      const inArray2B = profileSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return 0;
                                      }
                                    })
                                    .map((role, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={profileSelected.includes(
                                            role.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeProfile(
                                              role.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeProfile(
                                            role.toLowerCase(),
                                          )}>
                                          {role}
                                        </label>
                                      </div>
                                    ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchjoblisting((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "100px" }}>View JD</th>
                      <th style={{ width: "100px" }}>Resume Match</th>
                      <th style={{ width: "130px" }}>Add Candidate </th>
                      <th style={{ width: "80px" }}>Details </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems()?.map((item, idx) => {
                      return (
                        <tr
                          style={{
                            height: "20px",
                            color: "#333",
                            backgroundColor:
                              idx % 30 === 0 ? "#f9f9f9" : "white",
                            border: "1px solid #ddd",
                          }}
                          key={idx}
                        >
                          <td style={{ textAlign: "center" }}>
                            {item.date_created}
                          </td>
                          <td
                            style={{ textAlign: "left", paddingLeft: "10px" }}
                          >
                            {item.id}
                          </td>
                          <td>
                            <div
                              className="job_status"
                              style={{
                                backgroundColor:
                                  item.job_status === "Active"
                                    ? "green"
                                    : "red",
                                borderRadius: "5px",
                                color: "white",
                                width: "100px",
                                marginLeft: "12px",
                              }}
                            >
                              {item.job_status}
                            </div>
                          </td>
                          <td
                            style={{ textAlign: "left", paddingLeft: "10px" }}
                          >
                            {item.client}
                          </td>
                          <td
                            style={{ textAlign: "left", paddingLeft: "10px" }}
                          >
                            {item.role}
                          </td>
                          <td>
                            <FontAwesomeIcon
                              className={
                                item["jd_pdf_present"]
                                  ? "view_jd_option"
                                  : "avoid_view_jd_option"
                              }
                              data-tooltip-id={
                                item["jd_pdf_present"] !== true
                                  ? "my-tooltip"
                                  : "random-tooltip"
                              }
                              data-tooltip-content="JD not available"
                              icon={faBook}
                              onClick={() => {
                                if (item["jd_pdf_present"]) jdApiCall(item);
                              }}
                              style={{ color: "#795548" }}
                              aria-disabled={true}
                            />
                            <ReactTooltip
                              style={{ zIndex: 999, padding: "4px" }}
                              place="bottom"
                              variant="error"
                              id="my-tooltip"
                            />
                          </td>
                          <td>
                            <div onClick={() => {
                              console.log(item)
                              setSelectedRow({ id: item.id, client: item.client, role: item.role })
                              setShowModal(true)
                            }}>
                              <img style={{ height: "20px", cursor: "pointer" }} src={ResumeIcon} alt="resume" />
                            </div>
                          </td>
                          <td
                            onClick={() => {
                              if (item["job_status"].toLowerCase() === "active") {
                                let l = [];
                                l.push(item.id);
                                localStorage.setItem("page_no", id);
                                navigate("/AssignedRequirements/AddCandidate", {
                                  state: {
                                    id: l,
                                    profile: item.role,
                                    client: item.client,
                                    path: window.location.pathname,
                                  },
                                });
                              }
                            }}
                          >
                            {" "}
                            <FaUserPlus
                              data-tooltip-id={
                                item["job_status"].toLowerCase() !== "active"
                                  ? "addcandidate-tooltip"
                                  : "random-tooltip"
                              }
                              data-tooltip-content="Can't add to Hold Jobs"
                              style={{
                                cursor:
                                  item["job_status"].toLowerCase() === "active"
                                    ? "pointer"
                                    : "not-allowed",
                                marginRight: "5px",
                                color: "#336699",
                                fontSize: "18px",
                              }}
                            />{" "}
                            {/* Icon */}
                            <ReactTooltip
                              style={{ zIndex: 999, padding: "4px" }}
                              place="bottom"
                              variant="error"
                              id="addcandidate-tooltip"
                            />
                          </td>
                          <td>
                            <FontAwesomeIcon
                              onClick={() => {
                                handleDetails(item);
                              }}
                              icon={faInfoCircle}
                              style={{
                                color: "5E5C6C",
                                cursor: "pointer",
                                fontSize: "18px",
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}

                    {/* <tr>
                         <td></td>
                         <td></td>
                         <td>
                          */}
                    {/* <button class="job_status-button active-button">
                                 Active
                             </button>

                             <button class="job_status-button hold-button">
                                 Hold
                             </button> */}

                    {/* </td>
                         <td></td>
                         <td> */}

                    {/* <a type="button" style={{
                                         color: "blue",
                                         textDecoration: "underline",}}
                                      data-bs-toggle="modal" data-bs-target="#jobDetailsModal_{{ job_post.id }}">
                                 view Recruiters
                             </a> */}

                    {/* <div class="modal fade" id="jobDetailsModal_{{ job_post.id }}" tabindex="-1"
                                 role="dialog" aria-labelledby="jobDetailsModalLabel_{{ job_post.id }}"
                                 aria-hidden="true">
                                 <div class="modal-dialog" role="document" style={{maxWidth: "350px"}}>
                                     <div class="modal-content">
                                         <div class="modal-header">
                                             <h5 class="modal-title" id="jobDetailsModalLabel_{{ job_post.id }}">
                                                 Recruiters
                                             </h5>
                                             <button type="button" class="close" data-bs-dismiss="modal"
                                                 aria-label="Close" style={{
                                                         padding: "0px 7px",
                                                         fontSize:" 20px"
                                                 }}>
                                                 <span aria-hidden="true">&times;</span>
                                             </button>
                                         </div>
                                         <div class="modal-body">
                                             <div style="
                                                         max-height: 300px;
                                                         overflow-y: auto;
                                                         margin-top: 0px;
                                                     ">
                                                 <table>
                                                     <tbody>
                                                         
                                                         <tr style="
                                                                     height: 23px;
                                                                     padding: 0px;
                                                                 ">
                                                             <th scope="row" style="
                                                                         text-align: justify;
                                                                         font-size: 14px;
                                                                         padding: 0px;
                                                                     ">
                                                         
                                                             </th>
                                                             <td style="
                                                                         font-size: 14px;
                                                                         text-align: left;
                                                                         padding: 0px;
                                                                     ">
                                                         
                                                             </td>
                                                         </tr>
                                                 
                                                     </tbody>
                                                 </table>
                                             </div>
                                         </div>
                                         <div class="modal-footer">
                                             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                 Close
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             </div> */}

                    {/* </td>
                         <td></td>
                         <td style={{display: "none"}}>
                     
                         </td>
                         <td></td>
                     
                     </tr> */}
                  </tbody>
                </table>
                {displayItems()?.length === 0 && (
                  <div
                    style={{
                      backgroundColor: "",
                      textAlign: "center",
                      padding: "10px 0px 10px 0px",
                    }}
                  >
                    No data available in table
                  </div>
                )}
              </div>
            </div>

            <div
            className="dashbottom"
            >
              <div>
                {console.log(id)}
                Showing {belowCount === 0 ? 0 : (id - 1) * 30 + 1} to{" "}
                {id * 30 <= belowCount ? id * 30 : belowCount} of {belowCount}{" "}
                entries
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
                className="pagination"
              >
                <ul className="page">
                  <li
                    className="page__btn newpage_btn"
                    style={{
                      padding: "1px 5px",
                      marginRight: "5px",
                      cursor: "pointer",
                      alignItems: "center",
                      color: "#32406d",
                    }}
                    onClick={() => {
                      id !== 1 ? setId(id - 1) : setId(id);
                    }}
                  >
                    <FaAngleLeft style={{ marginTop: "3px" }} />
                  </li>
                  <div style={{ display: "flex", columnGap: "10px" }}>
                    <div>
                      {getPageRange().map((pageNumber, index) => (
                        <button
                          className={
                            pageNumber === id ? "pag_buttons" : "unsel_button"
                          }
                          key={index}
                          onClick={() => goToPage(pageNumber)}
                          style={{
                            fontWeight: pageNumber === id ? "bold" : "normal",
                            marginRight: "10px",
                            color: pageNumber === id ? "white" : "#000000", // Changed text color
                            backgroundColor:
                              pageNumber === id ? "#32406d" : "#ffff", // Changed background color
                            borderRadius: pageNumber === id ? "0.2rem" : "",
                            fontSize: "15px",
                            border: "none",
                            padding: "1px 10px", // Adjusted padding
                            cursor: "pointer", // Added cursor pointer
                          }}
                          class="page__numbers"
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                  <li
                    className="page__btn newpage_btn"
                    style={{
                      padding: "1px 5px",
                      cursor: "pointer",
                      color: "#32406d",
                      marginLeft: "3px"
                    }}
                    onClick={() => {
                      if (belowCount > id * 30) setId(id + 1);
                      else {
                        toast.warn("Reached the end of the list", {
                          position: "top-right",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                          transition: Bounce,
                        });
                        setId(id);
                      }
                    }}
                  >
                    <FaAngleRight style={{ marginTop: "3px" }} />
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Logout Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background to show blurred content
            backdropFilter: "blur(0.5px)", // Blur effect for the entire screen
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            width: "400px", // 270
            minHeight: "300px",  // 110
            overflow: "auto",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            padding: "20px 20px 10px",
          },
        }}
      >
        <div className="modal-actions" style={{ marginBottom: "10px" }}>
          {/* <div style={{display:"flex",justifyContent:"right"}}> 
            
          </div> */}
          <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "70px" }}>
            <h2 style={{ color: "#32406d" }}>Resume Match</h2>
            <MdCancel onClick={handleCloseModal} style={{ cursor: "pointer", color: "#32406d", height: "30px", width: "30px" }} />
          </div>

          <div>
            <table id={"details"}>
              <tr id={'tr'}>
                <th style={{ ...thstyle }} id={'tha'}>Id</th>
                <td style={{ overFlow: "auto", wordWrap: "break-word", ...tdstyle }} id={'tda'}>{selectedRow.id}</td>
              </tr>
              <tr id={'tr'}>
                <th style={{ ...thstyle }} id={'tha'}>Client</th>
                <td style={{ overFlow: "auto", wordWrap: "break-word", ...tdstyle }} id={'tda'}>{selectedRow.client}</td>
              </tr>
              <tr id={'tr'}>
                <th style={{ ...thstyle }} id={'tha'}>Role</th>
                <td style={{ ...tdstyle }} id={'tda'}>{selectedRow.role}</td>
              </tr>
            </table>
            {/* id:{selectedRow.id}
            client:{selectedRow.client} */}
          </div>
          {/* <p
            style={{
              fontSize: "17px",
              fontFamily: "roboto",
              // fontWeight: "50",
              color: "black",
            }}
          >
            Are you sure you want to Delete?
          </p> */}
          <form action="" onSubmit={handleSubmit} style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#32406d" }}>
              <label htmlFor="resume" style={{ marginBottom: "5px" }}>Resume:</label>
            </div>
            <input
              style={{ margin: "0px 5px 5px 0px", border: "1px solid #aaa", padding: "10px 15px", borderRadius: "5px" }}

              type="file"
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
             <label htmlFor="resume">Candidate Experience (Optional):</label>
                    <input
                   style={{ margin: "5px",border: "1px solid #aaa", padding: "8px 12px", borderRadius: "5px" }}
                  type="text"
                  name="candidate_experenece"
                  id="candidate_experenece"
         
                />
            <div style={{ textAlign: "center" }}>
              <button id="addCandidateSubmit"
                //  style={{ display: "block", margin: "3px", width: "100px" }} 
                type="submit"
                style={{
                  borderRadius: "4px",
                  background: "#32406D",
                  color: "#fff",
                  width: "100px",
                  position: "relative",
                }}
              >
                {waitForSubmission ? "" : "Submit"}
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

          </form>
          {
            showResults && (<div>
              <h3 style={{ color: "#32406d" }}>Matching Percentages</h3>

              {/* Experience Match */}
              <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                <div style={{ textAlign: "right", marginRight: "10px" }}>Experience Match</div>
                <div style={{ flex: "3", position: "relative", height: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: "5px", width: `${matchData.experience_match_percentage}%`, backgroundColor:
                      matchData.experience_match_percentage >= 75 ? '#4caf50' : (matchData.experience_match_percentage >= 50 ? '#ff9800' : '#f44336')
                  }}></div>
                </div>
                <div style={{ flex: "1", marginLeft: "10px" }}>{matchData.experience_match_percentage}%</div>
              </div>
              {/* Skill Match */}
              <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                <div style={{ textAlign: "right", marginRight: "10px" }}>Skill Match</div>
                <div style={{ flex: "3", position: "relative", height: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: "5px", width: `${matchData.skill_match_percentage}%`, backgroundColor:
                      matchData.skill_match_percentage >= 75 ? '#4caf50' : (matchData.skill_match_percentage >= 50 ? '#ff9800' : '#f44336')
                  }}></div>
                </div>
                <div style={{ flex: "1", marginLeft: "10px" }}>{matchData.skill_match_percentage}%</div>
              </div>

              {/* Overall Match */}
              <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                <div style={{ textAlign: "right", marginRight: "10px" }}>Overall Match</div>
                <div style={{ flex: "3", position: "relative", height: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: "5px", width: `${matchData.overall_match_percentage}%`, backgroundColor:
                      matchData.overall_match_percentage >= 75 ? '#4caf50' : (matchData.overall_match_percentage >= 50 ? '#ff9800' : '#f44336')
                  }}></div>
                </div>
                <div style={{ flex: "1", marginLeft: "10px" }}>{matchData.overall_match_percentage}%</div>
              </div>
            </div>)
          }

        </div>
      </Modal>
    </div>
  );
}

export default AssignedRequirements;
