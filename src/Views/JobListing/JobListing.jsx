import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import { MdFilterAlt } from "react-icons/md";
import "./joblisting.css";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaTrash } from "react-icons/fa";
import { useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import filter_icon from '../../assets/filter_icon.svg'
import clear_search from '../../assets/clear_search.svg'
import { getDashboardData, getAllJobs } from "../utilities";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import {
  faRedo,
  faClock,
  faEdit,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import Modal from "react-modal";
import { Hourglass } from "react-loader-spinner";
// import { useSelector } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "../../store/slices/jobSlice";
import { setDashboardData } from "../../store/slices/dashboardSlice";
function JobListing() {
  const dispatch = useDispatch();
  const [belowCount, setBelowCount] = useState(null);
  const { jobs } = useSelector((state) => state.jobSliceReducer);

  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showItems, setShowItems] = useState([]);
  const [allJobs, setJobs] = useState();
  const [id, setId] = useState(1);
  const [countItems, setCountItems] = useState(0);
  const [filteredId, setFilteredId] = useState([]);

  const [showModal1, setShowModal1] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null); // Track the item id to delete

  const handleShowModal1 = (id) => {
    setDeleteItemId(id); // Set the item id to be deleted
    setShowModal1(true);
  };

  const handleCloseModal1 = () => {
    setShowModal1(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItemId) {
      handleDeleteJob(deleteItemId);
      setDeleteItemId(null); // Reset delete item id
    }
  };

  const uniRef = useRef(null);

  const [waitForSubmission, setwaitForSubmission] = useState(false);
  useEffect(() => {
    const closeFilterPop = (e) => {
      const allRefIds = [
        "job_postRef",
        "job_idRef",
        "job_statusRef",
        "client_ref",
        "recruiter_ref",
        "role_ref",

        "job_label_postRef",
        "job_label_idRef",
        "job_label_statusRef",
        "client_label_ref",
        "recruiter_label_ref",
        "role_label_ref",

      ];
      let bool = false;
      for (const ref of allRefIds) {
        if (document.getElementById(ref).contains(e.target)) {
          bool = true;
          return;
        }
      }
      if (uniRef.current.contains(e.target) || bool) {
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
  }, []);

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
  const [isrecruiterFiltered, setIsRecruiterFiltered] = useState(false);

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
    let prevfilteredRows = allJobs;

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
    // const emptyArraysCount = arrays.filter((arr) => arr.length !== 0).length;

    // let NameOfNonEmptyArray = nameOfNonEmptyArray;
    if (!NamesOfNonEmptyArray.includes("dateSelected")) {
      setuniqueDataDate(() => {
        return Array.from(
          new Set(
            prevfilteredRows?.map((filteredRow) => {
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
            prevfilteredRows?.map((filteredRow) => {
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
            prevfilteredRows?.map((filteredRow) => {
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
            prevfilteredRows?.map((filteredRow) => {
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
            prevfilteredRows?.map((filteredRow) => {
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
            prevfilteredRows?.map((filteredRow) => {
              return filteredRow.role;
            }),
          ),
        );
      });
    }
    if (prevfilteredRows) {
      setFilteredRows(prevfilteredRows);
      setBelowCount(prevfilteredRows?.length);
    }
  };

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
    setIsRecruiterFiltered(recruiterSelected.length > 0);
    setIsStatusFiltered(statusSelected.length > 0);
  };

  useEffect(() => {
    handleOkClick();
  }, [
    dateSelected,
    jobIdSelected,
    statusSelected,
    profileSelected,
    clientSelected,
    recruiterSelected,
  ]);

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

  const notify = () => toast.success("Job edited successfully");

  const setDashboardDatas = async () => {
    setJobs(jobs);
    const val = jobs.length;
    if (val % 20 != 0) setCountItems(parseInt(val / 20) + 1);
    else setCountItems(parseInt(val / 20));
    // console.log(countItems);

    setLoading(false);
    const activeJobs = jobs;
    // .filter((job) => job.job_status === "Active");
    setuniqueDataDate([...new Set(activeJobs.map((d) => d.date_created))]);
    setuniqueDatajobId([...new Set(activeJobs.map((d) => d.id))]);
    setuniqueDataStatus([...new Set(activeJobs.map((d) => d.job_status))]);
    setuniqueDataClient([...new Set(activeJobs.map((d) => d.client))]);
    setuniqueDataRecruiter([...new Set(activeJobs.map((d) => d.recruiter))]);
    setuniqueDataProfile([...new Set(activeJobs.map((d) => d.role))]);
    setFilteredRows(jobs);
    // setJobs(jobs);
    // console.log(jobs);
    const initial = new Array(jobs.length).fill().map((_, idx) => ({
      id: jobs[idx].id,
      client: false,
      recruiter: false,
      role: false,
    }));
    // console.log(initial);
    setShowItems(initial);
    // console.log(initial);
    setLoading(false);
    setBelowCount(jobs.length);
  };
  useEffect(() => {
    if (localStorage.getItem("page_no")) {
      setId(parseInt(localStorage.getItem("page_no")));
      localStorage.removeItem("page_no");
    }
  }, [filteredRows]);
  useEffect(() => {
    console.log(id);
  }, [id]);

  useEffect(() => {
    if (jobs.length === 0) {
      setLoading(true);
      getAllJobs();
    } else {
      setDashboardDatas();
      setLoading(false);
    }
  }, [jobs]);

  const notifydelete = () => toast.success(" Job Deleted  successfully");
  const notifyError = () => toast.error("Unable to Delete Job");
  const handleDeleteJob = async (id) => {
    // console.log("handleDeleteJob");
    if (!waitForSubmission) {
      setwaitForSubmission(true);

      console.log("delete");
      try {
        const response = await fetch(
          //`api/delete_job_post/${id}`, {
           `https://ats-9.onrender.com/delete_job_post/${id}`,
           {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        if (data.status === "success") {
          // setDashboardDatas();
          // getDashboardData()
          getAllJobs().then(() => {
            setShowModal1(false);
            setwaitForSubmission(false);
            toast.success(data.message);
          });
        } else {
          // console.log("Response not ok:", response.statusText);
          setwaitForSubmission(false);
          toast.error(data.message);
        }
      } catch (err) {
        setwaitForSubmission(false);
        toast.error("Something went wrong please try again");
      }
    }
  };
  // Ensure dependency on `filteredRows`

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      console.log(target);
      console.log("click detected");
      console.log(allJobs);

      const idx = allJobs.findIndex((item) => {
        return (
          item.id.toString() === target.id.substring(0, target.id.length - 1)
        );
      });
      console.log(idx);

      if (idx !== -1) {
        console.log(allJobs[idx]);

        // Update the state of showItems based on the clicked target
        const update = new Array(filteredRows.length)
          .fill()
          .map((_, index) => ({
            id: filteredRows[index].id.toString(),
            client: false,
            recruiter: false,
            role: false,
          }));

        if (target.id.endsWith("1")) {
          update[idx] = {
            ...showItems[idx],
            client: !showItems[idx]?.client,
            recruiter: false,
            role: false,
          };
        } else if (target.id.endsWith("2")) {
          update[idx] = {
            ...showItems[idx],
            client: false,
            recruiter: !showItems[idx]?.recruiter,
            role: false,
          };
        } else if (target.id.endsWith("3")) {
          update[idx] = {
            ...showItems[idx],
            client: false,
            recruiter: false,
            role: !showItems[idx]?.role,
          };
        }
        console.log(update);
        setShowItems(update);
      } else {
        if (
          target.id === "default1" ||
          target.id === "default2" ||
          target.id === "default3"
        )
          return;

        const initial = new Array(allJobs.length).fill().map((_, index) => ({
          id: allJobs[index].id.toString(),
          client: false,
          recruiter: false,
          role: false,
        }));
        setShowItems(initial);
        console.log("outside");
      }
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [allJobs, filteredRows, showItems]);

  const filteredData = (data) => {
    if (data?.length > 20) {
      const data1 = data.filter(
        (_, idx) => idx + 1 <= id * 20 && idx + 1 > (id - 1) * 20,
      );
      return data1;
    } else {
      return data;
    }
  };

  const filteredJobs = useCallback(() => {
    // console.log("filteredRows:", filteredRows);
    const data = filteredRows?.filter((item) => {
      if (filteredId.length > 0) {
        for (const it of filteredId) {
          if (it === item.id) {
            return true;
          }
        }
        // Return false only if none of the elements in filteredId match item.id
        return false;
      } else {
        // console.log('zero size');
        if (searchValue === "") return true;
        else return false;
      }
    });
    // .filter((_, idx) => idx + 1 <= id * 60 && idx + 1 > (id - 1) * 60);

    const data1 = filteredData(data);
    return data1;
  }, [filteredRows, filteredId, id]);
  function fun(jobs) {
    // const val = jobs.length
    // setBelowCount(val)
    // if (val % 60 != 0)
    //   setCountItems(parseInt(val / 60) + 1)
    // else
    //   setCountItems(parseInt(val / 60))
    // console.log(countItems);
    // // setLoading(false)
    // console.log(jobs);
    const list = jobs.filter((it) => {
      return filteredRows.some((item) => item.id === it.id);
    });
    // console.log(list);
    setBelowCount(list?.length);
    if (searchValue === "") {
      if (localStorage.getItem("page_no")) {
        setId(localStorage.getItem("page_no"));
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
    // setFilteredRows(jobs);
    // setAllJobs(jobs);
    // console.log(jobs)
    // console.log(filteredRows);

    const initial = new Array(jobs.length).fill().map((_, idx) => ({
      id: jobs[idx].id,
      client: false,
      recruiter: false,
      role: false,
    }));
    console.log(initial);
    setShowItems(initial);
  }

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
    let startPage = Math.max(1, id - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(countItems, startPage + maxPagesToShow - 1);

    // Adjust startPage and endPage if near the beginning or end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Include ellipsis if necessary
    if (startPage > 1) {
      pageRange.push(1);
      if (startPage > 2) {
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
      console.log("checkpoint3");
      setId(pageNumber);
    }
  };
  useEffect(() => {
    console.log(filteredRows);
    console.log(searchValue);
    if (allJobs?.length > 0) {
      console.log("in if block");
      const update = allJobs?.filter((item) => {
        const extractedObj = extractKeyValuePairs(item, [
          "id",
          "date_created",
          "job_status",
          "client",
          "recruiter",
          "role",
        ]);
        // console.log(extractedObj);
        for (const key in extractedObj) {
          // console.log("key", key);
          let val = extractedObj[key];
          // console.log(val);
          if (val !== null && val !== undefined) {
            if (typeof val !== "string") {
              val = val.toString();
            }
            if (val.toLowerCase().includes(searchValue.toLowerCase())) {
              // console.log("yes working good");
              return true;
            }
          } else {
            // console.log('Value is null or undefined for key:', key);
          }
        }
        // console.log('No match found for searchValue:', searchValue);
        return false;
      });
      // console.log(update)
      fun(update);
      let tempList = [];
      for (const item of update) {
        tempList.push(item.id);
      }
      setFilteredId(tempList);
    }
  }, [filteredRows, searchValue]);
  // useEffect(()=>{
  //   if(localStorage.getItem('page_no')){
  //     console.log('checkpoint4')
  //     setId(localStorage.getItem('page_no'))
  //     localStorage.removeItem('page_no')
  //   }

  // },[])
  useEffect(() => {
    console.log(belowCount);
    if (belowCount % 20 != 0) setCountItems(parseInt(belowCount / 20) + 1);
    else setCountItems(parseInt(belowCount / 20));
  }, [belowCount]);

  const jdApiCall = async (item) => {
    console.log("Fetching jd_file...");
    try {
      const response = await fetch(
        
        `https://ats-9.onrender.com/view_jd/${item.id}`,
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


  const removeAllFilter = () => {
    setdateSelected([])
    setjobIdSelected([])
    setstatusSelected([])
    setclientSelected([])
    setrecruiterSelected([])
    setprofileSelected([])
  }

  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        {loading ? (
          <div className="loader-container">
            <Hourglass
              // visible={true}
              height="60"
              width="340"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={["#306cce", "#72a1ed"]}
            />
          </div>
        ) : (
          <>
            <div
            className="mobiledash"
            >
              <label
                style={{
                  marginTop: "1vh",
                  fontWeight: "500",
                  paddingRight: "5px",
                }}
              >
                {/* search */}
              </label>
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
                  className="searching"
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
            <div>
            <h5
              id="theader"
              className="joblisthead"
              style={{ padding: "0px", fontSize: "18px", fontWeight: "700", margin: "-35px 0 10px" }}
            >
              All Job Posts
            </h5>
            </div>
            {/* <input style={{height:'10px'}} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} /> */}
            <div class="container">
              <div
                className="table-container"
                style={{
                  overflowY: "auto",
                  marginTop: "3px",
                  overflowX: "auto",
                }}
              >
                <table
                  className="max-width-fit-content table"
                  style={{
                    tableLayout: "fixed",
                    width: "100%",
                    marginTop: "-5px",
                  }}
                  id="candidates-tabl"
                >
                  <thead className="managmentjob">
                    <tr>
                      <th style={{ width: "87px", color: showSearchjoblisting.showSearchdate ? "orange" : "white", }}>
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
                                        <label
                                          style={{ marginBottom: "0px", cursor: 'pointer' }}
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
                      <th style={{ width: "60px", color: showSearchjoblisting.showSearchuserId ? "orange" : "white", }}>
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
                                          <label
                                            style={{ marginBottom: "0px", cursor: 'pointer' }}
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
                      <th style={{ width: "91px", color: showSearchjoblisting.showSearchStatus ? "orange" : "white", }}>
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
                      <th style={{ width: "100px", color: showSearchjoblisting.showSearchClient ? "orange" : "white", }}>
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
                                        <label
                                          style={{ marginBottom: "0px", cursor: 'pointer' }}
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
                      <th style={{ width: "100px", color: showSearchjoblisting.showSearchRecruiter ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"recruiter_label_ref"}
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchRecruiter"
                                    ? !prev.showSearchRecruiter
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Recruiter{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isrecruiterFiltered ? "orange" : "white",
                          }}
                          id={"recruiter_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjoblisting((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchRecruiter"
                                    ? !prev.showSearchRecruiter
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjoblisting.showSearchRecruiter && (
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
                                    checked={selectAllRecruiter}
                                    onChange={handleSelectAllForRecruiter}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                    }}
                                    onClick={() => handleSelectAllForRecruiter()} >
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataRecruiter
                                    .filter(
                                      (recruiter) =>
                                        recruiter != null && recruiter !== "" && recruiter !== undefined
                                    )
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = recruiterSelected.includes(trimmedA);
                                      const inArray2B = recruiterSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return trimmedA.localeCompare(trimmedB);
                                      }
                                    })
                                    .map((recruiter, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={recruiterSelected.includes(
                                            recruiter.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeRecruiter(
                                              recruiter.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label
                                          style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeRecruiter(
                                            recruiter?.toLowerCase(),
                                          )}
                                        >
                                          {recruiter}
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
                      <th style={{ width: "132px", color: showSearchjoblisting.showSearchProfile ? "orange" : "white", }}>
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
                                        <label
                                          style={{ marginBottom: "0px", cursor: 'pointer' }}
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
                      <th style={{ width: "100px" }}>No of Positions</th>
                      <th style={{ width: "108px" }}>Add Candidate </th>
                      <th style={{ width: "60px" }}>View JD </th>
                      {/* <th style={{ width: "110px" }}>Re-Assign-Job </th> */}
                      <th style={{ width: "100px" }}>Edit Job Status </th>
                      <th style={{ width: "110px" }}>Edit Job Posted </th>
                      <th style={{ width: "60px" }}>Delete </th>
                    </tr>
                  </thead>
                  <tbody style={{ overflowY: "auto" }}>
                    {filteredJobs()?.map((item, idx) => (
                      <tr key={item.id} style={{ overflowy: "auto" }}>
                        <td style={{ textAlign: "center" }}>
                          {item.date_created}
                        </td>
                        <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                          {item.id}
                        </td>
                        <td>
                          <div
                            className="job_status"
                            style={{
                              backgroundColor:
                                item.job_status === "Active" ? "green" : "red",
                              borderRadius: "5px",
                              color: "white",
                              width: "70px",
                              marginLeft: "7px",
                            }}
                          >
                            {item.job_status}
                          </div>
                        </td>
                        <td
                          id={showItems[idx]?.id + "1"}
                          style={{ textAlign: "left", paddingLeft: "5px" }}
                        >
                          {item.client}
                          {showItems[idx].client && (
                            <div
                              id={"default1"}
                              style={{
                                position: "absolute",
                                Width: "auto",
                                maxWidth: "350px",
                                height: "auto",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #666",
                                borderRadius: "10px",
                                padding: "10px",
                                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                                zIndex: "9999", // Ensure the div appears above other content
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {item.client}
                            </div>
                          )}
                        </td>
                        <td
                          id={showItems[idx]?.id + "2"}
                          style={{ textAlign: "left", paddingLeft: "5px" }}
                        >
                          {item.recruiter}
                          {showItems[idx].recruiter && (
                            <div
                              id={"default2"}
                              style={{
                                position: "absolute",
                                Width: "auto",
                                maxWidth: "350px",
                                height: "auto",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #666",
                                borderRadius: "10px",
                                padding: "10px",
                                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                                zIndex: "9999", // Ensure the div appears above other content
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {item.recruiter}
                            </div>
                          )}
                        </td>
                        <td
                          id={showItems[idx]?.id + "3"}
                          style={{ textAlign: "left", paddingLeft: "5px" }}
                        >
                          {item.role}
                          {showItems[idx].role && (
                            <div
                              id={"default3"}
                              style={{
                                position: "absolute",
                                Width: "auto",
                                maxWidth: "350px",
                                height: "auto",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #666",
                                borderRadius: "10px",
                                padding: "10px",
                                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                                zIndex: "9999", // Ensure the div appears above other content
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {item.role}
                            </div>
                          )}
                        </td>

                        <td style={{ color: item.no_of_positions == 0 ? 'red' : 'inherit' }}>
                          {item.no_of_positions == 0 ? 'Closed' : item.no_of_positions}
                        </td>
                        <td

                          onClick={() => {
                            if (item["job_status"].toLowerCase() === "active") {
                              let l = [];
                              l.push(item.id);
                              localStorage.setItem("page_no", id);
                              navigate("/JobListing/AddCandidate", {
                                state: {
                                  id: l,
                                  profile: item.role,
                                  client: item.client,
                                  path: location.pathname,
                                },
                              });
                              {console.log(location.path,"pathlocation")}
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
                              marginRight: "5px",
                              color: "#336699",
                              fontSize: "18px",
                              cursor:
                                item["job_status"].toLowerCase() === "active"
                                  ? "pointer"
                                  : "not-allowed",
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
                        {/* <td
                          onClick={() => {
                            localStorage.setItem("page_no", id);
                            navigate("/ReassignJob", {
                              state: {
                                recruiter: item.recruiter,
                                id: item.id,
                                path: location.pathname,
                              },
                            });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faRedo}
                            style={{
                              color: "#4caf50",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          />
                        </td> */}
                        <td
                          onClick={() => {
                            localStorage.setItem("page_no", id);
                            navigate("/EditJobStatus", {
                              state: { item, path: location.pathname },
                            });
                            {console.log(location.pathname,"pathlocation")}
                          }}
                         
                        >
                          <FontAwesomeIcon
                            icon={faClock}
                            style={{
                              color: "#ffc107",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td
                          onClick={() => {
                            localStorage.setItem("page_no", id);
                            navigate("/EditJobPosting", {
                              state: { item, path: location.pathname 
                              },
                            
                            });
                            {console.log(location.pathname,"pathlocation")}
                          }}
                        >
                          {" "}
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{
                              color: "#2196f3",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td
                          onClick={() => handleShowModal1(item.id)}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "#E15554",
                            display: "flex", // Align icon and text horizontally
                            alignItems: "center", // Center items vertically
                          }}
                           className="trash-icon"
                        >
                          {" "}
                          <FaTrashAlt
                            style={{
                              marginLeft: "15px",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredJobs()?.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px 0px 10px 0px",
                    }}
                  >
                    No data availible in table
                  </div>
                )}
              </div>
            </div>
            <div
              className="dashbottom"
          
            >
              <div>
                Showing {belowCount === 0 ? 0 : (id - 1) * 20 + 1} to{" "}
                {id * 20 <= belowCount ? id * 20 : belowCount} of {belowCount}{" "}
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
                        >
                          {pageNumber}
                        </button>
                      ))}
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
                      if (belowCount > id * 20) setId(id + 1);
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
        isOpen={showModal1}
        onRequestClose={handleCloseModal1}
        contentLabel="Delete Confirmation"
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
            width: "275px",
            height: "110px",
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
        <div className="modal-actions" style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "17px",
              fontFamily: "roboto",
              fontWeight: "400",
              color: "black",
            }}
          >
            Are you sure you want to Delete?
          </p>
        </div>
        <div style={{ marginTop: "-20px", marginLeft: "40px" }}>
          {!waitForSubmission && (
            <button
              onClick={handleCloseModal1}
              style={{
                backgroundColor: "Red",
                marginRight: "30px",
                color: "white",
                height: "28px",
                borderRadius: "5px",
                border: "none",
                padding: "5px",
                cursor: "pointer",
                width: "50px",
              }}
            >
              No
            </button>
          )}
          <button
            onClick={handleConfirmDelete}
            style={{
              marginRight: "30px",
              backgroundColor: "green",
              color: "white",
              height: "28px",
              borderRadius: "5px",
              border: "none",
              padding: "5px",
              cursor: "pointer",
              width: waitForSubmission ? "100px" : "50px",
            }}
          >
            {!waitForSubmission ? (
              "Yes"
            ) : (
              <ThreeDots
                wrapperClass="ovalSpinner"
                wrapperStyle={{ marginTop: "-10px", marginLeft: "23px" }}
                visible={waitForSubmission}
                height="40"
                width="40"
                color="white"
                ariaLabel="oval-loading"
              />
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
export default JobListing;
