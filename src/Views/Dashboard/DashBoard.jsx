import React, { useState, useRef, memo, useEffect, useMemo } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "./dashboard.css";
import { MdFilterAlt } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import filter_icon from '../../assets/filter_icon.svg'
import clear_search from '../../assets/clear_search.svg'
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { setMeetings, setError } from "../../store/slices/meetingslice";
// import { fetchMeetings } from "../Views/utilities";
// import Calendar from 'react-calendar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


import { Radio, ThreeDots } from "react-loader-spinner";

import Error from "../../assets/error.jpg"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faInfoCircle,
  faSyncAlt,
  faPen,
  faTrashAlt,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { setDashboardData } from "../../store/slices/dashboardSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { Hourglass } from "react-loader-spinner";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { motion } from "framer-motion";
import ScheduleMeet from "../../Components/schedulemeet";
import { fetchMeetings } from "../utilities";
import { getDashboardData } from "../utilities.js";

const cookies = new Cookies();

function DashBoard() {
  const leftNavRef = useRef();


  const openModals = () => {
    console.log('Opening calendar from DashBoard');
    if (leftNavRef.current) {
      leftNavRef.current.open();
    }
    setIsModalOpen(false);
    setInterviewModal(false);
  };

  const closeModals = () => {
    console.log('Closing calendar from DashBoard');
    if (leftNavRef.current) {
      leftNavRef.current.close();
    }
  };
  const USERTYPE = cookies.get("USERTYPE");
  const [dashboard, setDashboard] = useState([]);
  const navigate = useNavigate();
  const [showRadio, setshowRadio] = useState(false);
  const [interviewModal, setInterviewModal] = useState(false);

  const openModal = () => {
    setInterviewModal(true);
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|co\.uk)$/;

  // Function to validate email before adding
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleAddEmailWithValidation = () => {
    if (validateEmail(searchQuery)) {
      handleAddEmail();
    } else {
      toast.warn('Please enter a valid email address');
    }
  };
  const handleAddEmailWithValidations = () => {
    if (validateEmail(searchQuery2)) {
      handleEmailChange(searchQuery2, 'dropdown2');
      setSearchQuery2('');
    } else {
      toast.warn('Please enter a valid email address');
    }
  };

  const handlecloseModal = () => {
    setInterviewModal(false);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setSelectedTimeZone("");
    setSelectedEmails([]);
    setSelectedEmails2([]);
    setSearchQuery('');
    setSearchQuery2('');

  }

  // const InterviewcloseModal = () => {
  //   setInterviewModal(false);
  // };
  const localizer = momentLocalizer(moment);
  const InterviewcloseModal = () => {
    setInterviewModal(false);
    // setInterviewModal(false);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setSelectedTimeZone("");
    setSelectedEmails([]);
    setSelectedEmails2([]);
    setSearchQuery('');
    setSearchQuery2('');

  };
  const [startDate, setStartDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [endDate, setEndDate] = useState("");
  const [error, seterror] = useState('');
  useEffect(() => {
    if (startDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (new Date(startDate) > new Date(newEndDate)) {
      seterror('End Date is Earlier than Start Date .');
      toast.error('End Date is Earlier than Start Date.');
    } else {
      seterror(''); // Clear error if validation passes
    }

  };



  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  const inputRef = useRef(null);

  const [selectAllDate, setSelectAllDate] = useState(false);
  const [uniqueDataDate, setuniqueDataDate] = useState([]);
  const [dateSelected, setdateSelected] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [uniqueDataNames, setuniqueDataNames] = useState([]);
  const [nameSelected, setNameSelected] = useState([]);

  const [selectAllForJobId, setselectAllForJobId] = useState(false);
  const [uniqueDatajobId, setuniqueDatajobId] = useState([]);
  const [jobIdSelected, setjobIdSelected] = useState([]);

  const [selectAllEmail, setSelectAllEmail] = useState(false);
  const [uniqueDataEmail, setuniqueDataEmail] = useState([]);
  const [emailSelected, setEmailSelected] = useState([]);

  const [selectAllMobile, setSelectAllMobile] = useState(false);
  const [uniqueDataMobile, setuniqueDataMobile] = useState([]);
  const [mobileSelected, setMobileSelected] = useState([]);

  const [selectAllClient, setSelectAllClient] = useState(false);
  const [uniqueDataClient, setuniqueDataClient] = useState([]);
  const [clientSelected, setclientSelected] = useState([]);

  const [selectAllProfile, setSelectAllProfile] = useState(false);
  const [uniqueDataProfile, setuniqueDataProfile] = useState([]);
  const [profileSelected, setprofileSelected] = useState([]);

  const [selectAllSkill, setSelectAllSkill] = useState(false);
  const [uniqueDataSkill, setuniqueDataSkill] = useState([]);
  const [skillSelected, setskillSelected] = useState([]);

  const [selectAllRecruiter, setSelectAllRecruiter] = useState(false);
  const [uniqueDataRecruiter, setuniqueDataRecruiter] = useState([]);
  const [recruiterSelected, setrecruiterSelected] = useState([]);

  const [selectAllStatus, setSelectAllStatus] = useState(false);
  const [uniqueDataStatus, setuniqueDataStatus] = useState([]);
  const [statusSelected, setstatusSelected] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  // const detailsRef = useRef(null)
  // useEffect(()=>{
  //   setshowRadio(false)
  // },[])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const loggedInEmail = localStorage.getItem('email').toLowerCase();
  const handleTimeZoneChange = (e) => {
    const newTimeZone = e.target.value;
    setSelectedTimeZone(newTimeZone);
    console.log("Selected Time Zone:", newTimeZone); // Log the new value
  };

  // useEffect(() => {
  //   const handleModalClick = (e) => {
  //     const element = document.getElementById("modalId")

  //     // console.log(!detailsRef.current.contains(e.target))
  //     // console.log(document.getElementById("detailsId"))
  //     // console.log(e.target)
  //     if (element !== null) {
  //       if (!document.getElementById("detailsId").contains(e.target) && !element.contains(e.target))
  //         setShowDetails(false)
  //       else
  //         console.log("else")
  //     }
  //   };

  //   window.addEventListener("click", handleModalClick);
  //   return () => {
  //     window.removeEventListener("click", handleModalClick);
  //   }
  // }, [showDetails])


  // const modalRef = useRef(null);
  // const detailsRef = useRef(null);
  // useEffect(() => {
  //   const handleModalClick = (e) => {
  //     if (
  //       modalRef.current && !modalRef.current.contains(e.target) &&
  //       (!detailsRef.current || !detailsRef.current.contains(e.target))
  //     ) {
  //       console.log("Clicked outside the modal. Closing the modal.");
  //       setShowDetails(false);
  //     }
  //   };

  //   if (showDetails) {
  //     document.addEventListener("mousedown", handleModalClick);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleModalClick);
  //   };
  // }, [showDetails]);


  const modalRef = useRef();

  useEffect(() => {
    // Function to handle clicks outside the modal
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseDetails();
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (showDetails) {
      console.log("Details modal is now OPEN");
    } else {
      console.log("Details modal is now CLOSED");
    }
  }, [showDetails]);
  useEffect(() => {
    // console.log(
    //   "uniw list cjanged",
    //   uniqueDataDate,
    //   uniqueDataNames,
    //   uniqueDatajobId,
    //   uniqueDataEmail,
    //   uniqueDataMobile,
    //   uniqueDataClient,
    //   uniqueDataProfile,
    //   uniqueDataSkill,
    //   uniqueDataRecruiter,
    //   uniqueDataStatus,
    // );
  }, [
    uniqueDataDate,
    uniqueDataNames,
    uniqueDatajobId,
    uniqueDataEmail,
    uniqueDataMobile,
    uniqueDataClient,
    uniqueDataProfile,
    uniqueDataSkill,
    uniqueDataRecruiter,
    uniqueDataStatus,
  ]);

  var deleteRow = false;
  const uniRef = useRef(null);
  const [belowCount, setBelowCount] = useState(0);
  const dispatch = useDispatch();
  const [allData, setAllData] = useState({});
  const [isChange, setIsChange] = useState(false);

  const [details, setDetails] = useState({});
  // const [mostUpdatedFilter,setMostUpdatedFilter] = useState([])
  // const {candidateData,listOfCandidates} = useSelector((state)=>state.candidateSliceReducer)
  const { dashboardData } = useSelector((state) => state.dashboardSliceReducer);
  const { recruiters } = useSelector((state) => state.userSliceReducer);
  if (Array.isArray(recruiters)) {
    const recruiteremails = recruiters.map(recruiters => recruiters.email);
    // console.log(recruiteremails, "recruiteremails");
  } else {
    console.log("recruiters is not an array or is empty");
  }
  // console.log(recruiters, "recruiters");

  const { managers } = useSelector((state) => state.userSliceReducer);
  if (Array.isArray(managers)) {
    const emails = managers.map(manager => manager.email);
    // console.log(emails, "emails");
  } else {
    console.log("Managers is not an array or is empty");
  }
  // console.log(managers, "managers");
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [waitForSubmission1, setwaitForSubmission1] = useState(false);
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [isnameFiltered, setIsNameFiltered] = useState(false);
  const [isJobIdFiltered, setIsJobIdFiltered] = useState(false);
  const [isuseridFiltered, setIsUseridFiltered] = useState(false);
  const [ismobileFiltered, setIsMobileFiltered] = useState(false);
  const [isemailFiltered, setIsEmailFiltered] = useState(false);
  const [isclientFiltered, setIsClientFiltered] = useState(false);
  const [isprofileFiltered, setIsProfileFiltered] = useState(false);
  const [isskillFiltered, setIsSkillFiltered] = useState(false);
  const [isrecruiterFiltered, setIsRecruiterFiltered] = useState(false);
  const [isstatusFiltered, setIsStatusFiltered] = useState(false);


  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEmails1, setSelectedEmails1] = useState([]);
  const [selectedEmails2, setSelectedEmails2] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);



  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
      (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
      (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) &&
      !inputRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(null); // Close all dropdowns
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // const handleDropdownClick = (dropdown) => {
  //   setIsDropdownOpen(isDropdownOpen === dropdown ? null : dropdown);
  // };

  // const handleDropdownClick = (dropdown) => {
  //   setIsDropdownOpen(isDropdownOpen === dropdown ? null : dropdown);
  // };

  const handleDropdownClick = (dropdown) => {
    setIsDropdownOpen(isDropdownOpen === dropdown ? null : dropdown);
  };

  const handleEmailChange = (email, dropdown) => {
    if (dropdown === 'dropdown1') {
      setSelectedEmails1((prevSelectedEmails1) => {
        const emailsArray = Array.isArray(prevSelectedEmails1) ? prevSelectedEmails1 : [];
        return emailsArray.includes(email)
          ? emailsArray.filter((e) => e !== email) // Remove email if already selected
          : [...emailsArray, email]; // Add email if not selected
      });
    } else if (dropdown === 'dropdown2') {
      setSelectedEmails2((prevSelectedEmails2) => {
        const emailsArray = Array.isArray(prevSelectedEmails2) ? prevSelectedEmails2 : [];
        return emailsArray.includes(email)
          ? emailsArray.filter((e) => e !== email) // Remove email if already selected
          : [...emailsArray, email]; // Add email if not selected
      });
      setSearchQuery2('');
      setIsDropdownOpen(false);
    }
  };



  const [searchQuery, setSearchQuery] = useState('');
  const [checkedEmails, setCheckedEmails] = useState({}); // State to track checked emails
  const [newfilteredEmails, setnewFilteredEmails] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false);
  const [searchQuery2, setSearchQuery2] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = uniqueDataEmail.filter((email) =>
      email.toLowerCase().includes(query.toLowerCase())
    );
    setnewFilteredEmails(filtered);
    setShowAddButton(query && filtered.length === 0);
    setDropdownVisible(query !== '');
  };

  const handleAddEmail = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && !selectedEmails.includes(trimmedQuery)) {
      setSelectedEmails([...selectedEmails, trimmedQuery]);
    }
    setSearchQuery('');
    setShowAddButton(false);
    setDropdownVisible(false);
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleAddEmail();
  //   }
  // };

  const handleRemoveEmail = (emailToRemove) => {
    setSelectedEmails(selectedEmails.filter(email => email !== emailToRemove));
  };

  const handleCheckboxChangeEmails = (email) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email]);
    } else {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
    }
  };

  const handleSelectCheckedEmails = () => {
    const newSelectedEmails = Object.keys(checkedEmails).filter(email => checkedEmails[email]);
    setSelectedEmails(prevSelectedEmails => [
      ...new Set([...prevSelectedEmails, ...newSelectedEmails])
    ]); // Add checked emails to selectedEmails
    // Clear search query, dropdown options, and checked emails state
    setSearchQuery('');
    setCheckedEmails({});
    // setFilteredEmails([]);
  };

  const filteredEmails = uniqueDataEmail.filter((email) =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualAdd = () => {
    handleEmailChange(searchQuery2, 'dropdown2');
    setSearchQuery2(''); // Clear the search input after adding the email
  };

  const filteredManagers = Array.isArray(managers)
    ? managers.filter(manager => manager.email.toLowerCase().includes(searchQuery2.toLowerCase()))
    : [];

  const handleEmailChange1 = (email) => {
    setSelectedEmails(prevSelectedEmails => {
      let updatedEmails;
      if (prevSelectedEmails.includes(email)) {
        updatedEmails = prevSelectedEmails.filter(e => e !== email);
      } else {
        updatedEmails = [...prevSelectedEmails, email];
      }
      // Update the input field with the selected emails
      setSearchValue(updatedEmails.join(', '));
      return updatedEmails;
    });
  };

  useEffect(() => {
    // console.log("Object.keys(dashboardData)", Object.keys(dashboardData));
    if (Object.keys(dashboardData).length === 0) {
      // console.log("1");
      setLoading(true);
      setStopCount(1);
      getDashboardData();
    } else {
      fetchTableData();
      setStopCount(0);
      setLoading(false);
    }
  }, [dashboardData]);
  const [stopCount, setStopCount] = useState(0);
  useEffect(() => {
    // console.log("interval useeffect")
    // console.log(stopCount)
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

  const [id, setId] = useState(1);
  const [loading, setLoading] = useState(true);
  //                <Hourglass
  //                   visible={true}
  //                   height="60"
  //                   width="60"
  //                   ariaLabel="hourglass-loading"
  //                   wrapperStyle={{}}
  //                   wrapperClass=""
  //                   colors={['#306cce', '#72a1ed']}
  // />
  const [countItems, setCountItems] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredId, setFilteredId] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState(null);
  const location = useLocation();
  const [list, setList] = useState([]);
  // useEffect(()=>{
  //   getAllData()
  // },[])
  console
  useEffect(() => {
    console.log("firfilteredRows essst", filteredRows);
    const closeFilterPop = (e) => {
      const allRefIds = [
        "date_ref",
        "job_ref",
        "name_ref",
        "email_ref",
        "mobile_ref",
        "client_ref",
        "profile_ref",
        "skills_ref",
        "recruiter_ref",
        "status_ref",

        "date_label_ref",
        "job_label_ref",
        "name_label_ref",
        "email_label_ref",
        "mobile_label_ref",
        "client_label_ref",
        "profile_label_ref",
        "skills_label_ref",
        "recruiter_label_ref",
        "status_label_ref",
      ];
      let bool = false;
      for (const ref of allRefIds) {
        if (document.getElementById(ref)?.contains(e.target)) {
          bool = true;
          return;
        }
      }
      if (uniRef?.current?.contains(e.target) || bool) {
        // console.log("yes");
      } else {
        // console.log("no");
        setshowSearchjobassignment((prev) => ({
          ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
        }));
      }
    };
    document.addEventListener("click", closeFilterPop);
    return () => {
      document.removeEventListener("click", closeFilterPop);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const selectedItem = filteredRows?.filter((item) => {
        return (
          item.id.toString() === target.id.substring(0, target.id.length - 1)
        );
      });
      // console.log("selected item:", selectedItem);
      if (selectedItem?.length > 0) {
        const idx = list.findIndex(
          (item) => item.id === target.id.substring(0, target.id.length - 1),
        );
        let n = parseInt(target.id.substring(target.id.length - 1));
        // console.log(idx)/
        const update = new Array(filteredRows.length).fill().map((_, idx) => {
          return {
            id: filteredRows[idx].id.toString(),
            email: false,
            profile: false,
            skills: false,
            // email_ref:useRef(),
            // skills_ref:useRef()
          };
        });
        update[idx] =
          n === 1
            ? {
              // id:data['candidates'][idx].id.toString(),
              ...list[idx],
              email: !list[idx].email,
              profile: false,
              skills: false,
            }
            : n === 2
              ? {
                ...list[idx],
                email: false,
                profile: !list[idx].profile,
                skills: false,
              }
              : {
                ...list[idx],
                email: false,
                profile: false,
                skills: !list[idx].skills,
              };
        // console.log(update[ idx ])
        setList(update);
      } else {
        // console.log("filteredRows", filteredRows);
        const tempList = new Array(filteredRows?.length)
          .fill()
          .map((_, idx) => {
            return {
              id: filteredRows[idx].id.toString(),
              email: false,
              profile: false,
              skills: false,
              // email_ref:useRef(),
              // skills_ref:useRef()
            };
          });
        // console.log(tempList)
        // const update = list.map(()=>({

        // }))
        if (
          target.id === "default1" ||
          target.id === "default2" ||
          target.id === "default3"
        )
          return;
        setList(tempList);
        // console.log('handle else case')
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  const goToCandidateDetails = (candidate) => {
    console.log("Attempting to open details for candidate:", candidate);

    // Check if candidate data is valid
    if (!candidate || typeof candidate !== 'object') {
      console.error("Invalid candidate data:", candidate);
      return;
    }

    localStorage.setItem("page_no", id); // Ensure `id` is defined and valid
    setDetails(candidate);
    setShowDetails(true);
  };
  useEffect(() => {
    console.log("Current details state:", details);
  }, [details]);

  const [showSearchjobassignment, setshowSearchjobassignment] = useState({
    showSearchName: false,
    showSearchdate: false,
    showSearchuserId: false,
    showSearchMobile: false,
    showSearchEmail: false,
    showSearchClient: false,
    showSearchProfile: false,
    showSearchSkill: false,
    showSearchRecruiter: false,
    showSearchStatus: false,
  });

  const handleOkClick = () => {
    setId(1)
    console.log("calling handle ok click");
    updateFilteredRows({
      dateSelected,
      nameSelected,
      jobIdSelected,
      emailSelected,
      mobileSelected,
      clientSelected,
      profileSelected,
      skillSelected,
      recruiterSelected,
      statusSelected,

      setuniqueDataDate,
      setuniqueDataNames,
      setuniqueDatajobId,
      setuniqueDataEmail,
      setuniqueDataMobile,
      setuniqueDataClient,
      setuniqueDataProfile,
      setuniqueDataSkill,
      setuniqueDataRecruiter,
      setuniqueDataStatus,
    });

    setIsDateFiltered(dateSelected.length > 0);
    setIsJobIdFiltered(jobIdSelected.length > 0);
    setIsNameFiltered(nameSelected.length > 0);
    setIsEmailFiltered(emailSelected.length > 0);
    setIsMobileFiltered(mobileSelected.length > 0);
    setIsClientFiltered(clientSelected.length > 0);
    setIsProfileFiltered(profileSelected.length > 0);
    setIsSkillFiltered(skillSelected.length > 0);
    setIsRecruiterFiltered(recruiterSelected.length > 0);
    setIsStatusFiltered(statusSelected.length > 0);

    // setshowSearchjobassignment((prev) =>
    //   Object.fromEntries(
    //     Object.entries(prev).map(([key, value]) => [key, false]),
    //   ),
    // );
  };

  useEffect(() => {
    console.log("called handlokclick");
    handleOkClick();
  }, [
    dateSelected,
    nameSelected,
    jobIdSelected,
    emailSelected,
    mobileSelected,
    clientSelected,
    profileSelected,
    skillSelected,
    recruiterSelected,
    statusSelected,
  ]);

  const handleCheckboxChangeForDate = (date_created) => {
    const isSelected = dateSelected.includes(date_created?.toLowerCase());
    if (isSelected) {
      setdateSelected((prev) => {
        // handleOkClick()
        return dateSelected.filter((d) => d !== date_created?.toLowerCase());
      });
      setSelectAllDate(false);
    } else {
      setdateSelected((prev) => {
        // handleOkClick()
        return [...dateSelected, date_created?.toLowerCase()];
      });

      setSelectAllDate(dateSelected.length === uniqueDataDate.length - 1);
    }
  };

  const handleSelectAllForDate = () => {
    const allChecked = !selectAllDate;
    setSelectAllDate(allChecked);

    if (allChecked) {
      setdateSelected((prev) => {
        // handleOkClick()
        return uniqueDataDate.map((d) => d.toString());
      });
    } else {
      setdateSelected((prev) => {
        // handleOkClick()
        return [];
      });
    }
  };
  const handleCheckboxChange = (name) => {
    const isSelected = nameSelected.includes(name);
    if (isSelected) {
      setNameSelected((prevSelected) =>
        prevSelected.filter((item) => item !== name),
      );
      setSelectAll(false);
    } else {
      setNameSelected((prevSelected) => [...prevSelected, name]);
      setSelectAll(nameSelected.length === uniqueDataNames.length - 1);
    }
  };
  const handleSelectAllForName = () => {
    const allChecked = !selectAll;
    setSelectAll(allChecked);

    if (allChecked) {
      setNameSelected(uniqueDataNames.map((d) => d?.toLowerCase()));
    } else {
      setNameSelected([]);
    }
  };

  const handleCheckboxChangeUser = (userId) => {
    const isSelected = jobIdSelected.includes(userId);
    if (isSelected) {
      setjobIdSelected((prevSelected) =>
        prevSelected.filter((item) => item !== userId),
      );
      setselectAllForJobId(false);
    } else {
      setjobIdSelected((prevSelected) => [...prevSelected, userId]);
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

  const handleCheckboxChangeEmail = (email) => {
    const isSelected = emailSelected.includes(email);
    if (isSelected) {
      setEmailSelected((prevSelected) =>
        prevSelected.filter((item) => item !== email),
      );
      setSelectAllEmail(false);
    } else {
      setEmailSelected((prevSelected) => [...prevSelected, email]);
      setSelectAllEmail(emailSelected.length === uniqueDataEmail.length - 1);
    }
  };

  const handleSelectAllForEmail = () => {
    const allChecked = !selectAllEmail;
    setSelectAllEmail(allChecked);

    if (allChecked) {
      setEmailSelected(uniqueDataEmail.map((d) => d?.toLowerCase()));
    } else {
      setEmailSelected([]);
    }
  };

  const handleCheckBoxChangeForMobile = (mobile) => {
    const isSelected = mobileSelected.includes(mobile);
    if (isSelected) {
      setMobileSelected((prevSelected) =>
        prevSelected.filter((item) => item !== mobile),
      );
      setSelectAllMobile(false);
    } else {
      setMobileSelected((prevSelected) => [...prevSelected, mobile]);
      setSelectAllMobile(mobileSelected.length === uniqueDataMobile.length - 1);
    }
  };
  const handleSelectAllForMobile = () => {
    const allChecked = !selectAllMobile;
    setSelectAllMobile(allChecked);

    if (allChecked) {
      setMobileSelected(uniqueDataMobile.map((d) => d.toString()));
    } else {
      setMobileSelected([]);
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
      setclientSelected(uniqueDataClient.map((d) => d?.toLowerCase()));
    } else {
      setclientSelected([]);
    }
  };

  const handleCheckboxChangeProfile = (profile) => {
    const isSelected = profileSelected.includes(profile);
    if (isSelected) {
      setprofileSelected((prevSelected) =>
        prevSelected.filter((item) => item !== profile),
      );
      setSelectAllProfile(false);
    } else {
      setprofileSelected((prevSelected) => [...prevSelected, profile]);
      setSelectAllProfile(
        profileSelected.length === uniqueDataProfile.length - 1,
      );
    }
  };
  const handleSelectAllForProfile = () => {
    const allChecked = !selectAllProfile;
    setSelectAllProfile(allChecked);

    if (allChecked) {
      setprofileSelected(uniqueDataProfile.map((d) => d?.toLowerCase()));
    } else {
      setprofileSelected([]);
    }
  };

  const handleCheckboxChangeSkill = (skills) => {
    const isSelected = skillSelected.includes(skills);
    if (isSelected) {
      setskillSelected((prevSelected) =>
        prevSelected.filter((item) => item !== skills),
      );
      setSelectAllSkill(false);
    } else {
      setskillSelected((prevSelected) => [...prevSelected, skills]);
      setSelectAllSkill(skillSelected.length === uniqueDataSkill.length - 1);
    }
  };
  const handleSelectAllForSkill = () => {
    const allChecked = !selectAllSkill;
    setSelectAllSkill(allChecked);

    if (allChecked) {
      setskillSelected(uniqueDataSkill.map((d) => d?.toLowerCase()));
    } else {
      setskillSelected([]);
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
      setrecruiterSelected(uniqueDataRecruiter.map((d) => d?.toLowerCase()));
    } else {
      setrecruiterSelected([]);
    }
  };
  const handleCheckboxChangeStatus = (status) => {
    const isSelected = statusSelected.includes(status);
    if (isSelected) {
      setstatusSelected((prevSelected) =>
        prevSelected.filter((item) => item !== status),
      );
      setSelectAllStatus(false);
    } else {
      setstatusSelected((prevSelected) => [...prevSelected, status]);
      setSelectAllStatus(statusSelected.length === uniqueDataStatus.length - 1);
    }
  };
  const handleSelectAllForStatus = () => {
    const allChecked = !selectAllStatus;
    setSelectAllStatus(allChecked);

    if (allChecked) {
      setstatusSelected(uniqueDataStatus.map((d) => d?.toLowerCase()));
    } else {
      setstatusSelected([]);
    }
  };

  const deleteFunction = (id) => {
    // localStorage.setItem('deleteRow',true)
    setDelId(id);
    setShowModal(true);
  };
  // @app.route('/delete_candidate/<int:candidate_id>', methods=["POST"])
  const handleDeleteCandidate = async () => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      // console.log("delete");
      try {
        const response = await fetch(
          // `api//delete_candidate/${delId}`,{
          `https://ats-9.onrender.com/delete_candidate/${delId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
            }),
          },
        );
        const data = await response.json();
        if (data.status === "success") {
          const range = getPageRange();
          if (id === range.length && filteredRows.length % 60 === 1) {
            setId((id) => id - 1);
            // console.log(id - 1);
            setBelowCount(filteredRows.length - 1);
          }
          // console.log("ok");

          deleteRow = true;
          getDashboardData().then(() => {
            setShowModal(false);
            toast.success(data.message);
            setwaitForSubmission(false);
          });
          // to get new daata after deletion
        } else {
          setwaitForSubmission(false);
          toast.error("Error occured, Please try again.");
          // console.log("delete not happened");
          // console.log(response.statusText);
        }
      } catch (err) {
        setwaitForSubmission(false);
        console.log(err);
      }
    }
  };

  const resumeApiCall = async (item) => {
    // console.log("Fetching resume...");
    try {
      const response = await fetch(
        `https://ats-9.onrender.com/view_resume/${item.id}`,
        {
          method: "GET",
        },
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        console.log("Failed to fetch resume:", response.statusText);
      }
    } catch (err) {
      console.log("Error fetching resume:", err);
    }
  };

  const [value, setValue] = useState(new Date());

  const handleDateChange = (date) => {
    setValue(date);
  };
  const [Error, setError] = useState();
  const [meetingDetails, setMeetingDetails] = useState([]);
  const [isSuccessful, setIsSuccessful] = useState(false);


  const syncEvents = async () => {
    try {
      const response = await fetch('https://ats-9.onrender.com/sync_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recruiter_email: localStorage.getItem('email'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync events');
      }

      const data = await response.json();
      // console.log('Sync events response:', data);
    } catch (error) {
      // console.error('Sync error:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || !startTime || !endTime || !selectedTimeZone || selectedEmails.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const requiredAttendees = selectedEmails;
    const optionalAttendees = selectedEmails2;
    if (!waitForSubmission1) {
      setwaitForSubmission1(true);
      try {
        const response = await fetch('https://ats-9.onrender.com/create_event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
          },
          body: JSON.stringify({
            subject: title,
            start_date: startDate,
            start_time: startTime,
            end_date: endDate,
            end_time: endTime,
            attendees: requiredAttendees,
            cc_recipients: optionalAttendees,
            time_zone: selectedTimeZone,
            recruiter_email: localStorage.getItem('email'),
            recruiter_id: localStorage.getItem("user_id"),
          }),
        });

        if (response.ok) {
          setModalMessage('Meeting scheduled successfully!');
          setIsModalOpen(true);
          setInterviewModal(false);
          setwaitForSubmission1(false)
          setIsSuccessful(true)
          setTitle("");
          setStartDate("");
          setEndDate("");
          setStartTime("");
          setEndTime("");
          setSelectedTimeZone("");
          setSelectedEmails([]);
          setSelectedEmails2([]);
          await syncEvents();
          await fetchMeetings();
        } else {
          setModalMessage('Failed to schedule the meeting.');
          setIsModalOpen(true);
          setwaitForSubmission1(false)
          setIsSuccessful(false)
        }
      } catch (error) {
        setModalMessage('An error occurred while scheduling the meeting.');
        setIsModalOpen(true);
        setwaitForSubmission1(false)
        setIsSuccessful(false)
        console.error('Error:', error);
      }
    }
  };
  // const fetchMeetings = async () => {
  //   try {
  //     const response = await fetch('https://ats-9.onrender.com/get_all_meetings', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         recruiter_id: localStorage.getItem("user_id"),
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch meetings');
  //     }

  //     const data = await response.json();
  //     // console.log('Raw data from API:', data);

  //     // Access the meetings array from the response object
  //     const meetingsArray = data.meetings;

  //     if (!Array.isArray(meetingsArray)) {
  //       throw new Error('API response does not contain an array of meetings');
  //     }

  //     // Transform data into the desired format
  //     const formattedMeetings = meetingsArray.map(meeting => ({
  //       title: meeting.subject,
  //       start_time: meeting.start_time,
  //       end_time: meeting.end_time,
  //       start_date: meeting.start_date,
  //       end_date: meeting.end_date,
  //       meeting_id: meeting.meeting_id,
  //       event_id: meeting.event_id,
  //       join_url: meeting.join_url,
  //       time_zone: meeting.time_zone,
  //       attendees: meeting.attendees,
  //       cc_recipients: meeting.cc_recipients,
  //     }));

  //     // console.log('Formatted meetings:', formattedMeetings);

  //     // Update state with the formatted meetings

  //     dispatch(setMeetings(formattedMeetings));


  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     setError(error.message);
  //   }
  // };



  useEffect(() => {
    const initialize = async () => {
      await syncEvents();
      fetchMeetings();
    };

    initialize();
  }, []);


  const [NonEmptyArray, setNonEmptyArray] = useState([]);
  const updateFilteredRows = ({
    dateSelected,
    nameSelected,
    jobIdSelected,
    mobileSelected,
    emailSelected,
    clientSelected,
    profileSelected,
    skillSelected,
    recruiterSelected,
    statusSelected,

    setuniqueDataDate,
    setuniqueDataNames,
    setuniqueDataMobile,
    setuniqueDatajobId,
    setuniqueDataEmail,
    setuniqueDataClient,
    setuniqueDataProfile,
    setuniqueDataSkill,
    setuniqueDataRecruiter,
    setuniqueDataStatus,
  }) => {
    let prevfilteredRows = dashboard;
    if (dateSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        dateSelected.includes(row.date_created.toString()),
      );
      // console.log("ifff", dateSelected);
    }

    if (jobIdSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        jobIdSelected.includes(row.job_id.toString()),
      );
      // console.log("ifff", jobIdSelected);
    }
    if (nameSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        nameSelected.includes(row.name?.toLowerCase()),
      );
    }
    if (emailSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        emailSelected.includes(row.email?.toLowerCase()),
      );
    }
    if (mobileSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        mobileSelected.includes(row.mobile.toString()),
      );
    }
    if (clientSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        clientSelected.includes(row.client?.toLowerCase()),
      );
    }
    if (profileSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        profileSelected.includes(row.profile?.toLowerCase()),
      );
    }
    if (skillSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        skillSelected.includes(row.skills?.toLowerCase()),
      );
    }
    if (recruiterSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        recruiterSelected.includes(row.recruiter?.toLowerCase()),
      );
    }
    if (statusSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        statusSelected.includes(row.status?.toLowerCase()),
      );
    }

    const arrayNames = [
      "dateSelected",
      "nameSelected",
      "jobIdSelected",
      "emailSelected",
      "mobileSelected",
      "clientSelected",
      "profileSelected",
      "skillSelected",
      "recruiterSelected",
      "statusSelected",
    ];

    const arrays = [
      dateSelected,
      nameSelected,
      jobIdSelected,
      emailSelected,
      mobileSelected,
      clientSelected,
      profileSelected,
      skillSelected,
      recruiterSelected,
      statusSelected,
    ];

    // const emptyArraysCount = arrays.filter((arr) => arr.length !== 0).length;

    let NamesOfNonEmptyArray = [];

    // if (emptyArraysCount === 1) {
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
    // } else if (emptyArraysCount === 0) {
    //   NameOfNonEmptyArray = null;
    // }
    // console.log("prevfilteredRows", prevfilteredRows);
    // console.log("NamesOfNonEmptyArray", NamesOfNonEmptyArray);
    setNonEmptyArray(NamesOfNonEmptyArray);
    if (!NamesOfNonEmptyArray.includes("dateSelected")) {
      setuniqueDataDate(() => {
        // console.log(
        //   "first",
        //   Array.from(
        //     new Set(
        //       prevfilteredRows.map((filteredRow) => {
        //         return "date1";
        //       }),
        //     ),
        //   ),
        // );
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
              return filteredRow.job_id;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("nameSelected")) {
      setuniqueDataNames(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.name;
            }),
          ),
        );
      });
    }

    if (!NamesOfNonEmptyArray.includes("emailSelected")) {
      setuniqueDataEmail(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.email?.trim();
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("mobileSelected")) {
      setuniqueDataMobile(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.mobile;
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
              return filteredRow.client?.trim();
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
              return filteredRow.profile?.trim();
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("skillSelected")) {
      setuniqueDataSkill(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.skills?.trim();
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
              return filteredRow.recruiter?.trim();
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
              return filteredRow.status;
            }),
          ),
        );
      });
    }
    setFilteredRows(prevfilteredRows);
    setBelowCount(prevfilteredRows.length);
    // console.log("hi here is a change in table filter");
  };

  useEffect(() => {
    if (Object.keys(dashboardData).length > 0) {
      const data = dashboardData;
      setuniqueDataDate([
        ...new Set(data["candidates"].map((d) => d.date_created)),
      ]);
      setuniqueDatajobId([...new Set(data["candidates"].map((d) => d.job_id))]);
      setuniqueDataNames([...new Set(data["candidates"].map((d) => d.name))]);

      setuniqueDataEmail([...new Set(data["candidates"].map((d) => d.email?.trim()))]);
      setuniqueDataMobile([
        ...new Set(data["candidates"].map((d) => d.mobile)),
      ]);
      setuniqueDataClient([
        ...new Set(data["candidates"].map((d) => d.client?.trim())),
      ]);
      setuniqueDataProfile([
        ...new Set(data["candidates"].map((d) => d.profile?.trim())),
      ]);
      setuniqueDataSkill([...new Set(data["candidates"].map((d) => d.skills?.trim()))]);
      setuniqueDataRecruiter([
        ...new Set(data["candidates"].map((d) => d.recruiter?.trim())),
      ]);
      setuniqueDataStatus([
        ...new Set(data["candidates"].map((d) => d.status)),
      ]);
    }
  }, [dashboardData]);

  const dis1 = (data) => {
    // console.log(data);
    if (data?.length > 60) {
      const updatedData = data.filter(
        (_, idx) => idx <= id * 60 && idx >= (id - 1) * 60,
      );
      return updatedData;
    } else {
      return data;
    }
  };

  const [isColorFiltered, setIsColorFiltered] = useState(false);

  const [selectedColors, setselectedColors] = useState([false, false, false])

  console.log(dis1,"dis1") 

  const displayItems = () => {
    // console.log('filteredRows:',filteredRows)




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
        if (searchValue === "") return true;
        else return false;
      }

    });
    const data1 = dis1(data);

    // console.log(data)
    // setShowData(data)
    // if(data?.length>0)
    //   return data;
    // commonFun({...allData,candidates:data})
    return data1;
  };

  const handleSelectedColors = (index) => {
    setId(1)
    setselectedColors(prev => {
      let updatedColors = [...prev]
      updatedColors[index] = !updatedColors[index]

      const anyColorSelected = updatedColors.some(color => color);
      setIsColorFiltered(anyColorSelected);
      // setShowCandidates(prevCand => {
      //   if(new Set(updatedColors).size === 1){
      //     return prevCand
      //   }
      //   console.log("prevCand", prevCand)
      //   console.log("updatedColors", updatedColors)
      //   let filteredCand = prevCand.filter(cand => {
      //     if(updatedColors[0] && (cand.status.toLowerCase().includes("selected") || cand.status.toLowerCase().includes("boarded") )){
      //       return true
      //     }
      //     if(updatedColors[2] && (cand.status.toLowerCase().includes("rejected") || cand.status.toLowerCase().includes("hold") || cand.status.toLowerCase().includes("drop") || cand.status.toLowerCase().includes("show") || cand.status.toLowerCase().includes("duplicate") )){
      //       return true
      //     }if (updatedColors[1] && (!cand.status.toLowerCase().includes("selected") && !cand.status.toLowerCase().includes("boarded") && !cand.status.toLowerCase().includes("rejected") && !cand.status.toLowerCase().includes("hold") && !cand.status.toLowerCase().includes("drop") && !cand.status.toLowerCase().includes("show") && !cand.status.toLowerCase().includes("duplicate")  )){
      //       return true
      //     }
      //     return false
      //   })
      //   console.log("filteredCand", filteredCand)
      //   return filteredCand;
      // })
      return updatedColors
    })
  }
  const notify = () => toast.success("candidate added successfully");
  const notifyDelete = () => toast.success("candidate deleted successfully");
  const items = displayItems();

  // const

  const fetchTableData = () => {
    try {
      const data = dashboardData;
      // console.log("dashboardData", data);
      setDashboard(data["candidates"]);
      // commonFun(data);
      setAllData(data);
      // setLoading(false);
      const tempList = new Array(data["candidates"].length)
        .fill()
        .map((_, idx) => {
          return {
            id: data["candidates"][idx].id.toString(),
            email: false,
            profile: false,
            skills: false,
            // email_ref:useRef(),
            // skills_ref:useRef()
          };
        });
      // console.log(tempList, 'templist')
      setList(tempList);
      if (!data.candidates) {
        throw new Error("Expected 'candidates' property not found");
      }

      return data;
    } catch (err) {
      // console.error("Error fetching data:", err);
      return null; // Return null in case of an error
    }
  };

  // navigate("/UpdateCandidate", { state: { item, path: location.pathname } });
  const goToEdit = async (id) => {
    const data = dashboardData;
    // console.log(data);
    const sendData = data["candidates"].filter((item) => item.id === id);
    localStorage.setItem("isUpdated", false);
    navigate("/EditCandidate", {
      state: { item: sendData[0], path: location.pathname },
    });
  };

  // useEffect(()=>{
  //   console.log('id changed',id)
  //   setShowData(displayItems())
  //   console.log('done')
  // },[id])

  useEffect(() => {
    // console.log(location.state, "state");

    if (location.state != undefined) {
      // console.log("Name from location.state:", location.state?.name);
      localStorage.setItem("user_id", location.state?.user_id);
      localStorage.setItem("user_type", location.state?.user_type);
      localStorage.setItem("user_name", location.state?.user_name);
      localStorage.setItem("name", location.state?.name);


    }
  }, []);

  useEffect(() => {
    // console.log("filteredRows changed", filteredRows);
  }, [filteredRows]);

  useEffect(() => {
    setBelowCount(dashboard?.length);
    setFilteredRows(dashboard); // Initially, display all rows
  }, [dashboard]);

  function fun(data) {
    console.log("calling fun ");
    // console.log(data);
    // setBelowCount(data['candidates'].length)
    // if(Object.keys(dashboardData).length > 0){
    const tempList = new Array(data["candidates"].length)
      .fill()
      .map((_, idx) => {
        return {
          id: data["candidates"][idx].id.toString(),
          email: false,
          profile: false,
          skills: false,
          // email_ref:useRef(),
          // skills_ref:useRef()
        };
      });
    const list = data["candidates"].filter((it) => {
      return filteredRows.some((item) => item.id === it.id);
    });
    // setBelowCount(list?.length)
    const value = list?.length;
    // console.log(value, "value");
    setBelowCount(value);
    if (searchValue === "") {
      if (localStorage.getItem("page_no")) {
        setId(localStorage.getItem("page_no"));
        localStorage.removeItem("page_no");
      }
    } else {
      setId(1);
    }
    // console.log(list);
    // setuniqueDataDate([...new Set(list.map((d) => d.date_created))]);
    // setuniqueDatajobId([...new Set(list.map((d) => d.job_id))]);
    // setuniqueDataNames([...new Set(list.map((d) => d.name))]);

    // setuniqueDataEmail([...new Set(list.map((d) => d.email))]);
    // setuniqueDataMobile([...new Set(list.map((d) => d.mobile))]);
    // setuniqueDataClient([...new Set(list.map((d) => d.client))]);
    // setuniqueDataProfile([...new Set(list.map((d) => d.profile))]);
    // setuniqueDataSkill([...new Set(list.map((d) => d.skills))]);
    // setuniqueDataRecruiter([...new Set(list.map((d) => d.recruiter))]);
    // setuniqueDataStatus([...new Set(list.map((d) => d.status))]);
    // console.log(tempList, "templist");
    setList(tempList);
    // }

    // setLoading(false);

    // console.log('imp  ')
    // setDashboard(data["candidates"]); // Set dashboard data

    // let val = data[ "candidates" ].length;
    // if (val % 60 != 0)
    //   setCountItems(parseInt(val / 60) + 1)
    // else
    //   setCountItems(parseInt(val / 60))

    // console.log(countItems)
    // console.log("dashboarddatas", data)
    // Set unique data for filters
    // console.log(filteredRows);
    // console.log(data["candidates"]);
  }

  // function commonFun(data) {
  //   // console.log(data);
  //   // if(Object.keys(dashboardData).length > 0){
  //   const tempList = new Array(data["candidates"].length)
  //     .fill()
  //     .map((_, idx) => {
  //       return {
  //         id: data["candidates"][idx].id.toString(),
  //         email: false,
  //         profile: false,
  //         skills: false,
  //         // email_ref:useRef(),
  //         // skills_ref:useRef()
  //       };
  //     });
  //   // console.log(tempList, "templist");
  //   setList(tempList);
  //   // }
  //   setLoading(false);
  //   // console.log("imp  ");
  //   setDashboard(data["candidates"]); // Set dashboard data
  //   let val = data["candidates"].length;
  //   if (val % 60 != 0) setCountItems(parseInt(val / 60) + 1);
  //   else setCountItems(parseInt(val / 60));
  //   // console.log(countItems)
  //   console.log("dashboarddatas", data)
  //   // Set unique data for filters
  //   console.log("[...new Set(data[candidates].map((d) => d.date_created))]", [...new Set(data["candidates"].map((d) => d.date_created))])
  //   setuniqueDataDate([...new Set(data["candidates"].map((d) => d.date_created))]);
  //   setuniqueDatajobId([...new Set(data["candidates"].map((d) => d.job_id))]);
  //   setuniqueDataNames([...new Set(data["candidates"].map((d) => d.name))]);

  //   setuniqueDataEmail([...new Set(data["candidates"].map((d) => d.email))]);
  //   setuniqueDataMobile([...new Set(data["candidates"].map((d) => d.mobile))]);
  //   setuniqueDataClient([...new Set(data["candidates"].map((d) => d.client))]);
  //   setuniqueDataProfile([...new Set(data["candidates"].map((d) => d.profile))]);
  //   setuniqueDataSkill([...new Set(data["candidates"].map((d) => d.skills))]);
  //   setuniqueDataRecruiter([
  //     ...new Set(data["candidates"].map((d) => d.recruiter)),
  //   ]);
  //   setuniqueDataStatus([...new Set(data["candidates"].map((d) => d.status))]);
  // }

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= countItems) {
      setId(pageNumber);
    }
  };

  // Calculate the range of pages to display in pagination
  const getPageRange = () => {
    const pageRange = [];
    const maxPagesToShow = 5; // Adjust this value to show more or fewer page numbers

    // Determine the start and end page numbers to display
    // let item;
    // if (belowCount % 60 != 0)
    //   item = parseInt(belowCount / 60) + 1;
    // else
    //   item = parseInt(belowCount / 60)
    // const item = belowCount%60 !==0? belowCount/60 : (belowCount/60)+1;
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
  function extractKeyValuePairs(object, keysToExtract) {
    return keysToExtract.reduce((acc, key) => {
      if (key in object) {
        acc[key] = object[key];
      }
      return acc;
    }, {});
  }

  const removeAllFilter = () => {
    setdateSelected([])
    setjobIdSelected([])
    setNameSelected([])
    setEmailSelected([])
    setMobileSelected([])
    setclientSelected([])
    setprofileSelected([])
    setskillSelected([])
    setrecruiterSelected([])
    setstatusSelected([])
    setselectedColors([false, false, false])
    setIsColorFiltered(false)
  }


  useEffect(() => {
    // console.log(searchValue)
    if (dashboard?.length > 0) {
      // console.log(dashboard);
      const update = dashboard.filter((item) => {
        const extractedObj = extractKeyValuePairs(item, [
          "id",
          "date_created",
          "job_id",
          "name",
          "email",
          "mobile",
          "client",
          "profile",
          "skills",
          "recruiter",
          "status",
        ]);
        // console.log(extractedObj)
        for (const key in extractedObj) {
          if (key === "id") {
            continue;
          }
          // console.log('key',key)
          let val = extractedObj[key];
          // console.log(val)
          if (val !== null && val !== undefined) {
            if (typeof val !== "string") {
              val = val.toString();
            }
            if (val.toLowerCase().includes(searchValue?.toLowerCase())) {
              // console.log('yes working good')
              return true;
            }
          }
        }
        // console.log('No match found for searchValue:', searchValue);
        return false;
      });

      const originalFilteredCandidates = update;
      const filteredByColor = new Set(selectedColors).size === 1
        ? originalFilteredCandidates
        : originalFilteredCandidates.filter(cand => {
          if (selectedColors[0] && (cand.status.toLowerCase().includes("selected") || cand.status.toLowerCase().includes("boarded"))) {
            return true;
          }
          if (selectedColors[2] && (cand.status.toLowerCase().includes("rejected") || cand.status.toLowerCase().includes("hold") || cand.status.toLowerCase().includes("drop") || cand.status.toLowerCase().includes("show") || cand.status.toLowerCase().includes("duplicate"))) {
            return true;
          }
          if (selectedColors[1] && (!cand.status.toLowerCase().includes("selected") && !cand.status.toLowerCase().includes("boarded") && !cand.status.toLowerCase().includes("rejected") && !cand.status.toLowerCase().includes("hold") && !cand.status.toLowerCase().includes("drop") && !cand.status.toLowerCase().includes("show") && !cand.status.toLowerCase().includes("duplicate"))) {
            return true;
          }
          return false;
        });

      fun({ ...allData, candidates: filteredByColor });
      let extract = [];
      for (const item of filteredByColor) {
        extract.push(item.id);
      }
      setFilteredId(extract);
      // console.log(extract);
    }
  }, [selectedColors, filteredRows, searchValue]);



  // useEffect(()=>{
  //   console.log(mostUpdatedFilter)
  //   setFilteredRows(mostUpdatedFilter)
  // },[mostUpdatedFilter])
  useEffect(() => {
    // console.log(filteredRows);
    // console.log(dashboard);
  }, [filteredRows, dashboard]);
  // useEffect(()=>{
  //   // console.log(filteredRows)
  //   commonFun(filteredRows)
  // },[searchValue])

  useEffect(() => {
    const fun = async () => {
      if (localStorage.getItem("page_no")) {
        const page = parseInt(localStorage.getItem("page_no"));
        setId(page);
        localStorage.removeItem("page_no");
      }
    };
    fun();
  }, [filteredRows]);

  useEffect(() => { }, []);
  useEffect(() => {
    if (belowCount % 60 != 0) setCountItems(parseInt(belowCount / 60) + 1);
    else setCountItems(parseInt(belowCount / 60));
  }, [belowCount]);

  const statusColorMapping = {
    "selected": "green",
    "boarded": "green",
    "rejected": "red",
    "hold": "red",
    "drop": "red",
    "duplicate": "red",
    "show": "red",
  };
  const getStatusColor = (status) => {
    const statusLowerCase = status.toLowerCase();
    if (statusColorMapping.hasOwnProperty(statusLowerCase)) {
      return statusColorMapping[statusLowerCase];
    }
    if (statusLowerCase.includes("selected") ||
      statusLowerCase.includes("boarded")) {
      return "green";
    } else if (
      statusLowerCase.includes("rejected") ||
      statusLowerCase.includes("hold") ||
      statusLowerCase.includes("drop") ||
      statusLowerCase.includes("duplicate") ||
      statusLowerCase.includes("show")
    ) {
      return "red";
    } else {
      return "orange";
    }
  };
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      label: `${hour}:${minute.toString().padStart(2, '0')}`
    };
  });

  const add30Minutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newMinutes = minutes + 30;
    let newHours = hours;

    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }

    if (newHours === 24) {
      newHours = 0;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (startTime) {
      setEndTime(add30Minutes(startTime));
    } else {
      setEndTime('');
    }
  }, [startTime]);

  return (
    <div className="wrapper">
      <LeftNav ref={leftNavRef} />
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
        ) : stopCount >= 30 ? (<div style={{
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

        </div>) : (
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
                  id={"modalId"}
                  ref={modalRef}
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
                    height: "90%",
                    overflowY: "auto",
                  }}
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h3 style={{ paddingTop: "0px" }}>Candidate Details</h3>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "88%",
                      overflowY: "auto",
                    }}
                  >
                    <table id={"details"}>
                      <tr id={"tr"}>
                        <th id={"th"}>ID:</th>
                        <td id={"td"}>{details.id}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Job Id:</th>
                        <td id={"td"}>{details.job_id}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Name:</th>
                        <td id={"td"}>{details.name}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Mobile:</th>
                        <td id={"td"}>{details.mobile}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Email:</th>
                        <td id={"td"}>{details.email}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Client:</th>
                        <td id={"td"}>{details.client}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Current Company:</th>
                        <td id={"td"}>{details.current_company}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Position:</th>
                        <td id={"td"}>{details.position}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Profile:</th>
                        <td id={"td"}>{details.profile}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Current Job Location:</th>
                        <td id={"td"}>{details.current_job_location}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Preferred Job Location:</th>
                        <td id={"td"}>{details.preferred_job_location}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Qualifications:</th>
                        <td id={"td"}>{details.qualifications}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Experience:</th>
                        <td id={"td"}>{details.experience}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Relevant Experience:</th>
                        <td id={"td"}>{details.relevant_experience}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Current ctc:</th>
                        <td id={"td"}>{details.current_ctc}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Expected ctc:</th>
                        <td id={"td"}>{details.expected_ctc}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Notice period:</th>
                        <td id={"td"}>{details.notice_period}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Linkedin:</th>
                        <td id={"td"}>{details.linkedin}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Holding Offer:</th>
                        <td id={"td"}>{details.holding_offer}</td>
                      </tr>
                      <tr id={'tr'}>
                        <th id={'th'}>Recruiter:</th>
                        <td id={'td'}>{details.recruiter}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Management:</th>
                        <td id={"td"}>{details.management}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Status:</th>
                        <td id={"td"}>{details.status}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Remarks:</th>
                        <td id={"td"}>{details.remarks}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Skills:</th>
                        <td id={"td"}>{details.skills}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Period of notice:</th>
                        <td id={"td"}>{details.period_of_notice}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Last working Date:</th>
                        <td id={"td"}>{details.last_working_date}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Date created:</th>
                        <td id={"td"}>{details.date_created}</td>
                      </tr>
                      <tr id={"tr"}>
                        <th id={"th"}>Time created:</th>
                        <td id={"td"}>{details.time_created}</td>
                      </tr>
                    </table>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "15px",


                    }}
                  >
                    <button onClick={handleCloseDetails} style={{ padding: "5px 20px", background: "#32406d", color: "#fff", border: "none", borderRadius: "5px" }}>Close</button>
                  </div>
                </motion.div>
              </div>
            )}
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
              <div className="searchfield" style={{ display: 'flex', alignItems: 'center', zIndex: '2' }}>
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
                  className="Search"
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

            <div className="theader" style={{ paddingTop: "0px", margin: "-25px 0 10px" }}>
              <button style={{ backgroundColor: "#32406D", color: "white", height: "25px", border: "none", width: "120px", borderRadius: "5px" }} onClick={openModal}>New Meeting +</button>
              {/* < ScheduleMeet
                interviewModal={interviewModal}
                InterviewcloseModal={InterviewcloseModal} 
                /> */}
              <h5 style={{ }} className="usersh5">
                All Candidate Details
              </h5>
            </div>



            <div className="dashcontainer">
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
                  id="candidates-table"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "80px", color: showSearchjobassignment.showSearchdate ? "orange" : "white", }} >
                        <span
                          id={"date_label_ref"}
                          onClick={() => {
                            // console.log("Filter icon clicked!");
                            setshowSearchjobassignment((prev) => ({
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
                          style={{ cursor: "pointer" }}  > Date</span>
                        <MdFilterAlt
                          style={{ color: isDateFiltered ? "orange" : "white" }}
                          id={"date_ref"}
                          className="arrow"
                          onClick={() => {
                            // console.log("Filter icon clicked!");
                            setshowSearchjobassignment((prev) => ({
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
                        {showSearchjobassignment.showSearchdate && (
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
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChangeForDate(
                                            date_created,
                                          )}
                                        >
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "70px", color: showSearchjobassignment.showSearchuserId ? "orange" : "white", }}>

                        <span
                          style={{ cursor: "pointer" }}
                          id={"job_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                          id={"job_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                        {showSearchjobassignment.showSearchuserId && (
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
                                            style={{
                                              marginBottom: "0px",
                                              fontWeight: "400",
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => handleCheckboxChangeUser(
                                              userId.toString(),
                                            )}
                                          >
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "100px", color: showSearchjobassignment.showSearchName ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"name_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchName"
                                    ? !prev.showSearchName
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Name{" "}</span>

                        <MdFilterAlt
                          style={{ color: isnameFiltered ? "orange" : "white" }}
                          id={"name_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchName"
                                    ? !prev.showSearchName
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjobassignment.showSearchName && (
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
                                    checked={selectAll}
                                    onChange={handleSelectAllForName}
                                  />
                                  <label

                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      fontSize: '13px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelectAllForName()}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataNames
                                    .slice()
                                    .filter((name) => name !== undefined)
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = nameSelected.includes(trimmedA);
                                      const inArray2B = nameSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return trimmedA.localeCompare(trimmedB);
                                      }
                                    })
                                    .map((name, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={nameSelected.includes(
                                            name.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(
                                              name.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChange(
                                            name.toLowerCase(),
                                          )}
                                        >
                                          {name}
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "200px", color: showSearchjobassignment.showSearchEmail ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"email_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchEmail"
                                    ? !prev.showSearchEmail
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Email{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isemailFiltered ? "orange" : "white",
                          }}
                          id={"email_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchEmail"
                                    ? !prev.showSearchEmail
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjobassignment.showSearchEmail && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-email"
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
                                    checked={selectAllEmail}
                                    onChange={handleSelectAllForEmail}
                                  />
                                  <label
                                    onClick={() => handleSelectAllForEmail()}
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '400',
                                      cursor: 'pointer',
                                      marginBottom: "0px",

                                    }}>
                                    Select all
                                  </label>

                                </li>
                                <li>
                                  {uniqueDataEmail
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = emailSelected.includes(trimmedA);
                                      const inArray2B = emailSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return 0;
                                      }
                                    })
                                    .map((email, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={emailSelected.includes(
                                            email.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeEmail(
                                              email.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChangeEmail(
                                            email.toLowerCase(),
                                          )}
                                        >
                                          {email}
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "80px", color: showSearchjobassignment.showSearchMobile ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"mobile_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchMobile"
                                    ? !prev.showSearchMobile
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        > Mobile{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: ismobileFiltered ? "orange" : "white",
                          }}
                          id={"mobile_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchMobile"
                                    ? !prev.showSearchMobile
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjobassignment.showSearchMobile && (
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
                                    checked={selectAllMobile}
                                    onChange={handleSelectAllForMobile}
                                  />
                                  <label
                                    onClick={() => handleSelectAllForMobile()}
                                    style={{
                                      cursor: 'pointer',
                                      marginBottom: '0px',
                                      fontWeight: '400',
                                      fontSize: '13px',
                                    }}>
                                    Select all
                                  </label>

                                </li>
                                <li>
                                  {uniqueDataMobile
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim();
                                      const trimmedB = b?.trim();

                                      const inArray2A = mobileSelected.includes(trimmedA);
                                      const inArray2B = mobileSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return 0;
                                      }
                                    })
                                    .map((mobile, index) => (
                                      <div key={index} className="filter-inputs">
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={mobileSelected.includes(
                                            mobile,
                                          )}
                                          onChange={() =>
                                            handleCheckBoxChangeForMobile(mobile)
                                          }
                                        />
                                        <label
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckBoxChangeForMobile(mobile)}
                                        >
                                          {mobile}
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "70px", color: showSearchjobassignment.showSearchClient ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"client_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                            setshowSearchjobassignment((prev) => ({
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
                        {showSearchjobassignment.showSearchClient && (
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
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChangeClient(
                                            client.toLowerCase(),
                                          )}
                                        >
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "75px", color: showSearchjobassignment.showSearchProfile ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"profile_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                        >Profile{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isprofileFiltered ? "orange" : "white",
                          }}
                          id={"profile_ref"}
                          name=""
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                        {showSearchjobassignment.showSearchProfile && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-profile"
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
                                    .map((profile, index) => (
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
                                            profile?.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeProfile(
                                              profile.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChangeProfile(
                                            profile.toLowerCase(),
                                          )}
                                        >
                                          {profile}
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ width: "100px", color: showSearchjobassignment.showSearchSkill ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"skills_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchSkill"
                                    ? !prev.showSearchSkill
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Skills{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isskillFiltered ? "orange" : "white",
                          }}
                          id={"skills_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchSkill"
                                    ? !prev.showSearchSkill
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchjobassignment.showSearchSkill && (
                          <div
                            ref={uniRef}
                            className="Filter-popup"
                            style={{ width: "300px" }}
                          >
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
                                    checked={selectAllSkill}
                                    onChange={handleSelectAllForSkill}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                    }}
                                    onClick={() => handleSelectAllForSkill()} >
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataSkill
                                    .filter((skill) => skill !== null && skill !== "" && skill !== undefined)
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = skillSelected.includes(trimmedA);
                                      const inArray2B = skillSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return 0;
                                      }
                                    })
                                    .map((skills, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={skillSelected.includes(
                                            skills.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeSkill(
                                              skills.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChangeSkill(
                                            skills.toLowerCase(),
                                          )}
                                        >
                                          {skills}
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
                                  setshowSearchjobassignment((prev) =>
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
                      {USERTYPE === "managment" ? (
                        <th style={{ width: "90px", color: showSearchjobassignment.showSearchRecruiter ? "orange" : "white", }}>
                          <span
                            style={{ cursor: "pointer" }}
                            id={"recruiter_label_ref"}
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
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
                          > Recruiter{" "}</span>
                          <MdFilterAlt
                            style={{
                              color: isrecruiterFiltered ? "orange" : "white",
                            }}
                            id={"recruiter_ref"}
                            className="arrow"
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
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
                          {showSearchjobassignment.showSearchRecruiter && (
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
                                          recruiter != null && recruiter !== "",
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
                                              recruiter?.toLowerCase(),
                                            )}
                                            onChange={() =>
                                              handleCheckboxChangeRecruiter(
                                                recruiter?.toLowerCase(),
                                              )
                                            }
                                          />
                                          <label
                                            style={{
                                              marginBottom: "0px",
                                              fontWeight: "400",
                                              cursor: 'pointer',
                                            }}
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
                                    setshowSearchjobassignment((prev) =>
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
                      ) : null}
                      <th style={{ width: "80px", color: showSearchjobassignment.showSearchStatus ? "orange" : "white", }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"status_label_ref"}
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                        >Status{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isstatusFiltered || isColorFiltered ? "orange" : "white",
                          }}
                          id={"status_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchjobassignment((prev) => ({
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
                        {showSearchjobassignment.showSearchStatus && (
                          <div ref={uniRef} className="Filter-popup">
                            <form
                              id="filter-form-client"
                              className="Filter-inputs-container"
                            >
                              <div style={{ backgroundColor: "#cad1ff", height: "65px" }}>
                                <p>Filter by color</p>
                                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>

                                  <input
                                    type="radio"
                                    id="green"
                                    name="green"
                                    value="green"
                                    checked={selectedColors[0]}
                                    onClick={() => handleSelectedColors(0)}

                                    style={{
                                      appearance: 'none',
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      border: '2px solid green',
                                      outline: 'none',
                                      marginRight: '5px',
                                      backgroundColor: selectedColors[0] ? 'green' : 'white',
                                    }}
                                  />
                                  <input
                                    type="radio"
                                    id="red"
                                    name="red"
                                    value="red"
                                    checked={selectedColors[1]}
                                    onClick={() => handleSelectedColors(1)}
                                    style={{
                                      appearance: 'none',
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      border: '2px solid orange', // Red border for default and selected state
                                      outline: 'none',
                                      marginRight: '5px',
                                      backgroundColor: selectedColors[1] ? 'orange' : 'white',
                                    }}
                                  />
                                  <input
                                    type="radio"
                                    id="red"
                                    name="red"
                                    value="red"
                                    checked={selectedColors[2]}
                                    onClick={() => handleSelectedColors(2)}
                                    style={{
                                      appearance: 'none',
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      border: '2px solid red',
                                      outline: 'none',
                                      marginRight: '5px',
                                      backgroundColor: selectedColors[2] ? 'red' : 'white',
                                    }}
                                  />

                                </div>
                              </div>
                              {/* color for status */}
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
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                    }}
                                    onClick={() => handleSelectAllForStatus()} >
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataStatus
                                    .filter(
                                      (recruiter) =>
                                        recruiter != null && recruiter !== "",
                                    )
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = statusSelected.includes(trimmedA);
                                      const inArray2B = statusSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return trimmedA.localeCompare(trimmedB);
                                      }
                                    })
                                    .map((status, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            width: "12px",
                                          }}
                                          checked={statusSelected.includes(
                                            status.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeStatus(
                                              status.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label
                                          style={{
                                            marginBottom: "0px",
                                            fontWeight: "400",
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => handleCheckboxChangeStatus(
                                            status.toLowerCase(),
                                          )}
                                        >
                                          {status}
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
                                  setshowSearchjobassignment((prev) =>
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
                      <th style={{ display: "none" }}>
                        current company <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        current job location <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        preferred job location <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        qualifications <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        experience <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        relevant experience <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        current ctc <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        expected ctc <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        notice period <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        last working date <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        buyout <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        holding offer <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        total <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        package in lpa <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        management <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        reason for job change <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        remarks <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        Candidate ID <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        Linkedin Url <MdFilterAlt className="arrow" />
                      </th>
                      <th style={{ display: "none" }}>
                        Comments <MdFilterAlt className="arrow" />
                      </th>

                      {/* <th style={{ width: "70px" }}>Interview </th> */}

                      <th style={{ width: "64px" }}>Resume </th>
                      <th style={{ width: "60px" }}>Details </th>
                      <th style={{ width: "60px" }}>Update </th>
                      <th style={{ width: "45px" }}>Edit </th>
                      {USERTYPE === "managment" ? (
                        <th style={{ width: "60px" }}>Delete </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className="scrollable-body">
                    {items?.map((item, idx) => (
                      <tr key={item.id}>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "2px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {item.date_created}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {item.job_id}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          name="email_td"
                          id={list[idx]?.id + "1"}
                          // ref={list[idx].email_ref}
                          // onClick={()=>{toggleExpandEmail(idx)}}
                          style={{
                            // position:'relative',
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item.email}
                          {list && list[idx] && list[idx].email ? (
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
                              {item.email}
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "2px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {item.mobile}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {item.client}
                        </td>
                        <td
                          id={list[idx]?.id + "2"}
                          style={{
                            // position:'relative',
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item.profile}
                          {list && list[idx] && list[idx].profile ? (
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
                              {item.profile}
                            </div>
                          ) : (
                            ""
                          )}
                        </td>

                        <td
                          name="skills_td"
                          id={list[idx]?.id + "3"}
                          // ref={list[idx].skills_ref}
                          // onClick={()=>{toggleExpandSkills(idx)}}
                          style={{
                            // position:'relative',
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item.skills}
                          {list && list[idx] && list[idx].skills ? (
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
                              {item.skills}
                            </div>
                          ) : null}
                        </td>

                        {USERTYPE === "managment" ? (
                          <td
                            style={{
                              textAlign: "left",
                              padding: "5px",
                              borderBottom: "1px solid #ddd",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {item.recruiter ? item.recruiter : item.management}
                            <br />
                            {item.recruiter ? "" : "(Manager)"}
                          </td>
                        ) : null}
                        <td
                          style={{
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            color: getStatusColor(item.status),
                          }}
                        >
                          {item.status}
                        </td>

                        {/* <td style={{ width: "60px" }}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: "18px", color: "gray" }}  />
                          </td> */}

                        <td style={{ width: "60px" }}>
                          <FontAwesomeIcon
                            data-tooltip-id={
                              item["resume_present"] !== true
                                ? "my-tooltip"
                                : "random-tooltip"
                            }
                            data-tooltip-content="Resume not available"
                            icon={faFileAlt}
                            className={
                              item["resume_present"] === true
                                ? "resume_option"
                                : "avoid_resume_option"
                            }
                            style={{
                              color: item.resume ? "green" : "gray",
                              fontSize: "18px",
                            }}
                            onClick={() => {
                              
                              if (item["resume_present"]) resumeApiCall(item);
                            }}
                          />
                          {/* {console.log(item.resume,"dashboardresume")} */}
                          <ReactTooltip
                            style={{ zIndex: 999, padding: "4px" }}
                            place="bottom"
                            variant="error"
                            id="my-tooltip"
                          />
                        </td>
                        <td>
                          <FontAwesomeIcon
                            id={"detailsId"}
                            icon={faInfoCircle}
                            style={{
                              color: "5E5C6C",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                            onClick={() => {
                              goToCandidateDetails(item);
                            }}
                          />
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faSyncAlt}
                            style={{
                              color: "FEC601",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                            onClick={() => {
                              localStorage.setItem("page_no", id);
                              localStorage.setItem("isUpdated", false);
                              navigate("/UpdateCandidate", {
                                state: { item, path: location.pathname },
                              });
                            }}
                          />
                        </td>
                        <td>
                          <FontAwesomeIcon
                            onClick={() => {
                              localStorage.setItem("page_no", id);
                              goToEdit(item.id);
                            }}
                            icon={faPen}
                            style={{
                              color: "06908F",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          />
                        </td>
                        {USERTYPE === "managment" ? (
                          <td>
                            <FontAwesomeIcon
                              onClick={() => {
                                deleteFunction(item.id);
                              }}
                              icon={faTrashAlt}
                              style={{
                                color: "E15554",
                                cursor: "pointer",
                                fontSize: "18px",
                              }}
                            />
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {items?.length === 0 && (
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
              style={{

              }}
              className="dashbottom"
            >
              <div>
                Showing {belowCount === 0 ? 0 : (id - 1) * 60 + 1} to{" "}
                {id * 60 <= belowCount ? id * 60 : belowCount} of {belowCount}{" "}
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
                  <div className="gap" style={{ display: "flex", columnGap: "10px" }}>

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
                  <li
                    className="page__btn newpage_btn"
                    style={{
                      padding: "1px 5px",
                      cursor: "pointer",
                      color: "#32406d",
                      marginLeft: "3px"
                    }}
                    onClick={() => {
                      if (belowCount > id * 60) setId(id + 1);
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
        isOpen={interviewModal}
        onRequestClose={InterviewcloseModal}
        contentLabel="Calendar Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly lighter overlay
            zIndex: 9999,
          },
          content: {
            color: '#333', // Darker text for better readability
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', // More compact width
            maxHeight: '580px', // Restrict maximum height
            padding: '20px', // Increased padding
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Light shadow for depth
            position: 'relative', // For absolute positioning of buttons
          }
        }}
      >

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <h2 style={{ color: "#32406D", fontSize: '20px', textAlign: 'center', marginLeft: "-20px" }}>New Meeting</h2>
            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handlecloseModal}
                style={{ backgroundColor: "#e81123", color: "white", border: "none", borderRadius: "4px", padding: '0px 16px', fontSize: '16px', cursor: 'pointer', height: "30px" }}
              >
                Close
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "#32406D", color: "white", border: "none", borderRadius: "4px", padding: '0px 16px', fontSize: '16px', cursor: 'pointer', position: 'relative', height: "30px", width: "80px" }}
              >
                {waitForSubmission1 ? "" : "Save"}
                <ThreeDots
                  wrapperClass="ovalSpinner"
                  wrapperStyle={{
                    position: "absolute",
                    right: "-5px",
                    transform: "translate(-50%, -50%)",
                  }}
                  visible={waitForSubmission1}
                  height="45"
                  width="45"
                  color="white"
                  ariaLabel="oval-loading"
                />
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Title</label>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Attendees</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              height: '40px',
              position:'sticky',
              right:'0px'
            }}>
              {selectedEmails.map((email, index) => (
                <div
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    marginRight: '5px',
                  }}
                >
                  {email}
                  <span
                    onClick={() => setSelectedEmails(selectedEmails.filter((e) => e !== email))}
                    style={{
                      marginLeft: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    &times;
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', flex: '1', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search or add email"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    border: 'none',
                    paddingLeft: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    Width:'auto'
                  }}
                />
                {searchQuery && filteredEmails.length === 0 && (
                  <button
                    type="button"
                    onClick={handleAddEmailWithValidation}
                    style={{
                      position: 'sticky',
                      right: '0px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      whiteSpace:'nowrap',
                      zIndex:1
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
            {searchQuery && filteredEmails.length > 0 && (
              <ul className="dropdown-menu" style={{ border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', marginTop: '5px', width: "auto" }}>
                {filteredEmails.map((email, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleCheckboxChangeEmails(email)
                      handleSelectCheckedEmails();
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email)}
                      readOnly
                      style={{ marginRight: '10px' }}
                    />
                    {email}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Attendees (optional)</label>
            <div ref={dropdownRef2} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                fontSize: '12px',
                position: 'relative',
                overflowX: 'auto',
                height: '40px',
                position:'sticky',
                right:'0px'

              }}>
                {selectedEmails2?.map((email, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      marginRight: '5px',
                    }}
                  >
                    {email}
                    <span
                      onClick={() => handleEmailChange(email, 'dropdown2')}
                      style={{
                        marginLeft: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                  <input
                    type="text"
                    placeholder="Search or add email"
                    onClick={() => handleDropdownClick('dropdown2')}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEmailChange(e.target.value, 'dropdown2');
                        setSearchQuery2('');
                      }
                    }}
                    value={searchQuery2}
                    style={{ flex: '1', minWidth: '150px', border: 'none', paddingLeft: '10px', fontSize: '16px', outline: 'none' }}
                    ref={inputRef2}
                  />
                  {searchQuery2 && ![...managers, ...recruiters].some((item) => item.email.toLowerCase().includes(searchQuery2.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={handleAddEmailWithValidations}
                      style={{
                        position: 'sticky',
                        right: '0px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        whiteSpace:'normal'
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
              {searchQuery2 && (
                <div className="dropdown-menu" style={{ border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', marginTop: '5px', width: "auto" }}>
                  {[...new Set([
                    ...managers.map(item => item.email.toLowerCase()),
                    ...recruiters.map(item => item.email.toLowerCase())
                  ])] // Removing duplicates
                    .filter(email => email.includes(searchQuery2.toLowerCase()) && email !== loggedInEmail)
                    .map((email, index) => (
                      <label key={index} className="dropdown-item" style={{ display: 'block', padding: '8px',fontWeight:"normal", cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedEmails2?.includes(email)}
                          onChange={() => handleEmailChange(email, 'dropdown2')}
                          style={{ marginRight: '8px' }}
                        />
                        {email}
                      </label>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <div style={{ width: '48%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Start Date*</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
              />
            </div>
            <div style={{ width: '48%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>End Date*</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Time Zone</label>
            <select
              value={selectedTimeZone}
              onChange={handleTimeZoneChange}
              style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
            >
              <option value="">Select a time zone</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Start Time*</label>
              <input
                type="time"
                list="startTimeOptions"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '90%', height: '40px', borderRadius: '4px', border: '1px solid #ccc', paddingLeft: '10px', fontSize: '16px' }}
              />
              <datalist id="startTimeOptions">
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}></option>
                ))}
              </datalist>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>End Time*</label>
              <input
                type="time"
                list="endTimeOptions"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc', paddingLeft: '10px', fontSize: '16px' }}
              />
              <datalist id="endTimeOptions">
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}></option>
                ))}
              </datalist>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
          },
          content: {
            color: 'lightsteelblue',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: "450px",
            height: "150px"
          }
        }}>
        <div style={{ textAlign: 'center', marginTop: "20px" }}>
          <p>{modalMessage}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', width: '100%', marginTop: "30px" }}>
          <button
            onClick={() => {
              if (isSuccessful) {
                openModals();
              }
              setIsModalOpen(false);
            }}
            style={{
              color: "white",
              backgroundColor: "green",
              border: "none",
              width: "50px",
              height: "25px",
              borderRadius: "5px"
            }}
          >
            Ok
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              color: "white",
              backgroundColor: "red",
              border: "none",
              width: "50px",
              height: "25px",
              borderRadius: "5px"
            }}
          >
            Close
          </button>
        </div>



      </Modal>
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
            width: "270px",
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
        <div className="modal-actions" style={{ marginBottom: "10px" }}>
          <p
            style={{
              fontSize: "17px",
              fontFamily: "roboto",
              // fontWeight: "50",
              color: "black",
            }}
          >
            Are you sure you want to Delete?
          </p>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {!waitForSubmission && (
            <button
              onClick={handleCloseModal}
              style={{
                backgroundColor: "#d90000",
                // marginRight: "30px",
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
            onClick={handleDeleteCandidate}
            style={{
              // marginRight: "30px",
              backgroundColor: "green",
              color: "white",
              height: "28px",
              borderRadius: "5px",
              border: "none",
              padding: "5px",
              cursor: "pointer",
              width: waitForSubmission ? "70px" : "50px",
            }}
          >
            {!waitForSubmission ? (
              "Yes"
            ) : (
              <ThreeDots
                wrapperClass="ovalSpinner"
                wrapperStyle={{ marginTop: "-5px", marginLeft: "17px" }}
                visible={waitForSubmission}
                height="30"
                width="30"
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
export default DashBoard;




