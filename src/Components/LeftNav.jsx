import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle, } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";
import "./leftnav.css";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import { IoLocationOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TailSpin } from "react-loader-spinner";
import ChatBotComponent from "./ChatBotComponent";
import { motion } from 'framer-motion'
import { ThreeDots } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import { saveAs } from 'file-saver';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import moment from 'moment';
import ScheduleMeet from "../Components/schedulemeet";
import ResumeUpload from "../Components/ResumeUpload";
import { getDashboardData } from "../Views/utilities";
import { fetchMeetings } from "../Views/utilities";
import 'react-big-calendar/lib/css/react-big-calendar.css';
const cookies = new Cookies();
Modal.setAppElement("#root");

const LeftNav = forwardRef(({ }, ref) => {
  const [chatMsgId, setChatMsgId] = useState(0);
  const localizer = momentLocalizer(moment);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [waitForSubmission1, setwaitForSubmission1] = useState(false);
  useImperativeHandle(ref, () => ({
    open: () => {
      console.log('Opening modal');
      setIsOpen(true);

    },
    close: () => {
      console.log('Closing modal');
      setIsOpen(false);
    },

  }));




  const { events } = useSelector((state) => state.meetingSliceReducer);
  // console.log(events, 'alldatas')
  // const recruiterEmails = events.map(event => event.recruiter_email);
  // console.log(recruiterEmails, 'recruiterEmails');

  const formats = {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
  };
  const { managers } = useSelector((state) => state.userSliceReducer);
  const dropdownRef = useRef(null);
  if (Array.isArray(managers)) {
    const emails = managers.map(manager => manager.email);
    // console.log(emails, "emails");
  } else {
    console.log("Managers is not an array or is empty");
  }
  const { recruiters } = useSelector((state) => state.userSliceReducer);
  if (Array.isArray(recruiters)) {
    const recruiteremails = recruiters.map(recruiters => recruiters.email);
    // console.log(recruiteremails, "recruiteremails");
  } else {
    console.log("recruiters is not an array or is empty");
  }


  const { dashboardData } = useSelector((state) => state.dashboardSliceReducer);

  const candidates = dashboardData.candidates || [];
  const emails = candidates.map(candidate => candidate.email).filter(email => email);
  const uniqueDataEmail = Array.from(new Set(emails));

  // console.log(candidates, "candidates");
  // console.log(dashboardData, "dashb");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [selectedEmails1, setSelectedEmails1] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState({
    title: '',
    attendees: '',
    cc_recipients: '',
    start_date: '',
    end_date: '',
    time_zone: '',
    start_time: '',
    end_time: '',
    rec_email: '',
  });
  // console.log(selectedEvent, "selectedevent");
  // const loggedInEmail = localStorage.getItem('email').toLowerCase();
  // const handleEmailChange = (email) => {
  //   setSelectedEmails1(prev => {
  //     const newSelection = prev.includes(email)
  //       ? prev.filter(e => e !== email)
  //       : [...prev, email];

  //     // Ensure the state update is reflected in the `selectedEvent` as well
  //     setSelectedEvent(prevEvent => ({
  //       ...prevEvent,
  //       attendees: newSelection
  //     }));

  //     return newSelection;
  //   });
  // };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|co\.uk)$/;
  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen1(true);
    setIsTyping(true);
  };

  // const handleFocus = () => {
  //   if (isTyping) {
  //     setIsDropdownOpen1(true);
  //   }
  // };

  // const handleBlur = () => {
  //   setTimeout(() => {
  //     if (inputRef.current && !inputRef.current.contains(document.activeElement)) {
  //       setIsDropdownOpen1(false);
  //     }
  //     setIsTyping(false);
  //   }, 100);
  // };

  // const handleAddNewEmail = (e) => {
  //   const newEmail = searchQuery.trim();
  //   if (newEmail && !selectedEmails1.includes(newEmail)) {
  //     handleCheckboxChange(newEmail);
  //     setSearchQuery('');
  //     setIsDropdownOpen1(false);
  //   }
  // };
  const handleAddNewEmail = () => {
    const newEmail = searchQuery.trim();

    if (isValidEmail(newEmail)) {
      if (newEmail && !selectedEmails1.includes(newEmail)) {
        handleCheckboxChange(newEmail);
        setSearchQuery('');
        setIsDropdownOpen1(false);
      }
    } else {
      toast.error('Enter a valid email address.');
    }
  };




  const filteredEmails = uniqueDataEmail.filter(email =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedEvent?.attendees) {
      let attendeesList = [];
      if (typeof selectedEvent.attendees === 'string') {
        attendeesList = selectedEvent.attendees.split(',').map(email => email.trim()).filter(email => email);
      } else if (Array.isArray(selectedEvent.attendees)) {
        attendeesList = selectedEvent.attendees.filter(email => email);
      }
      setSelectedEmails1(attendeesList);
    } else {
      setSelectedEmails1([]);
    }
  }, [selectedEvent]);



  const handleCheckboxChange = (email) => {
    setSelectedEmails1(prevSelectedEmails => {
      const newSelectedEmails = prevSelectedEmails.includes(email)
        ? prevSelectedEmails.filter(item => item !== email)
        : [...prevSelectedEmails, email];
      return newSelectedEmails;
    });
  };

  //PAVAN


  const [searchQuerys, setSearchQuerys] = useState(null);


  const toggleDropdown = () => {
    if (filteredManagers.length > 0) {
      setIsDropdownOpen(prev => !prev);
    }
  };


  const handleInputChange = (e) => {
    setSearchQuerys(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleEmailChange1 = (email) => {
    setSelectedEmails(prevSelectedEmails => {
      const newSelectedEmails = prevSelectedEmails.includes(email)
        ? prevSelectedEmails.filter(item => item !== email)
        : [...prevSelectedEmails, email];
      setSearchQuerys('');
      return newSelectedEmails;
    });
  };

  const handleAddManualEmail = () => {
    if (searchQuerys && !selectedEmails.includes(searchQuerys)) {
      setSelectedEmails([...selectedEmails, searchQuerys]);
      setSearchQuerys('');
    }
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loggedInEmail = localStorage.getItem('email').toLowerCase();

  // Filter managers and recruiters, excluding the logged-in user's email
  const filteredManagers = managers.filter(manager =>
    manager.email.toLowerCase().includes(searchQuerys?.toLowerCase()) &&
    manager.email.toLowerCase() !== loggedInEmail
  );

  const filteredRecruiters = recruiters.filter(recruiter =>
    recruiter.email.toLowerCase().includes(searchQuerys?.toLowerCase()) &&
    recruiter.email.toLowerCase() !== loggedInEmail
  );
  const selectedEmailsDisplay = selectedEmails.join(', ');
  const inputValues = selectedEmailsDisplay || searchQuerys;


  // useEffect(() => {
  //   if (onEmailChange) {
  //     onEmailChange(selectedEmails);
  //   }
  // }, [selectedEmails, onEmailChange]);

  const handleCloseDropdown = (e) => {
    // Close the dropdown if clicked outside
    if (!e.target.closest('.dropdown')) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener to close dropdown when clicking outside
  React.useEffect(() => {
    document.addEventListener('click', handleCloseDropdown);
    return () => {
      document.removeEventListener('click', handleCloseDropdown);
    };
  }, []);
  const [EditModal, setEditModal] = useState(false);
  const EditopenModal = () => {
    setEditModal(true);
    setShowCalendar(false);
    setIsOpen(false);
    setShowmeet(false);
  }
  const EditcloseModal = () => {
    setEditModal(false);
    setSearchQuerys('');
    setSearchQuery('');
    setIsDropdownOpen1(false);
    setIsDropdownOpen(false);


  }
  const msgs = useMemo(() => {
    return ["Welcome to Makonis", "I am Jimmy", "How can i help you?"];
  }, []);
  const [i, setI] = useState(1);
  useEffect(() => {
    if (chatMsgId !== -1) {
      const intervalId = setInterval(() => {
        setChatMsgId(chatMsgId + 1);
      }, 2000)
      return () => clearInterval(intervalId);
    } else {
      if (chatMsgId === 3) {
        setChatMsgId(-1);
      }
    }
  }, [chatMsgId])

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      label: `${hour}:${minute.toString().padStart(2, '0')}`
    };
  });
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setSelectedEvent(prevState => {
      // Calculate end time 30 minutes after the new start time
      const [hours, minutes] = newStartTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours);
      startDate.setMinutes(minutes);

      const endDate = new Date(startDate.getTime() + 30 * 60000); // Add 30 minutes

      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      const newEndTime = `${endHours}:${endMinutes}`;

      return {
        ...prevState,
        start_time: newStartTime,
        end_time: newEndTime,
      };
    });
  };
  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setSelectedEvent(prevState => ({
      ...prevState,
      end_time: newEndTime,
    }));
  };


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
  // console.log(meeting_id, 'Deleting meeurlng with ID');
  // const [waitForSubmission3, setwaitForSubmission3] = useState(false);
  const [waitForSubmissiondel, setwaitForSubmissiondel] = useState(false);
  const handleDeletemeet = async (meeting_id) => {
    if (!waitForSubmissiondel) {
      setwaitForSubmissiondel(true);

      try {
        const response = await fetch(
          `https://ats-9.onrender.com/delete_event`, // Your endpoint
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              meeting_id: meeting_id, // Send the meeting_id from Redux
            }),
          },
        );

        // Check if the response is OK
        if (response.ok) {
          setShowmeet(false)
          setShowCalendar(false)
          setIsOpen(false);
          const data = await response.json();

          //       // Show a success message
          setwaitForSubmissiondel(false);
          toast.success("Meeting deleted successfully!");
          // Update Redux state or UI here if needed
          fetchMeetings()


        } else {
          // Handle HTTP error responses
          toast.error("Failed to delete meeting. Please try again.");
          setwaitForSubmissiondel(false);
        }

      } catch (err) {
        console.error(err);
        setwaitForSubmissiondel(false);
        toast.error("Error occurred, Please try again.");
      }
    }
  };


  const handleDownloadQuestions = () => {
    if (interviewData && interviewData.response && interviewData.response[0]) {
      const heading = interviewData.response[0].heading;
      let questions = [];

      if (general === "select all") {
        Object.keys(interviewData.response[0].questions).forEach(category => {
          questions.push(`<div style="font-weight: bold; color: black;">${category}</div>`);
          questions = questions.concat(interviewData.response[0].questions[category].map(cleanQuestion));
          questions.push("<br/>");
        });
      } else {
        questions.push(`<div style="font-weight: bold; color: green;">${general}</div>`);
        questions = questions.concat(interviewData.response[0].questions[general].map(cleanQuestion));
      }
      const content = `<html><body><div><span style="font-weight: bold; color: green;">${heading}</span></div><div>${questions.join('<br/>')}</div></body></html>`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'interview_questions.doc');
    }
  };


  const [notificationCount, setNoficationCount] = useState(0);
  const { pathname } = useLocation();
  const initial = {
    dashboard: false,
    registercandidate: false,
    joblisting: false,
    assignedrequirements: false,
  };
  const [show, setShow] = useState(initial);
  const [highlight, setHighlight] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [Telephonic, setTelephonic] = useState(false);
  const navigate = useNavigate();
  const USERTYPE = cookies.get("USERTYPE");
  const [userName, setUserName] = useState(cookies.get("USERNAME"));
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  );

  const [showOptions, setShowOptions] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageForCropping, setImageForCropping] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const timeoutDuration = 9000;
  const handleUserActivity = () => {
    if (!isPopupVisible) setI(1);
  };

  useEffect(() => {
    getCountOfNotifications();
    setToInitial()
  }, []);

  useEffect(() => {
    localStorage.getItem("profileImage");
  }, []);


  useEffect(() => {
    let lastActivityTime = Date.now();

    const checkTimeout = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastActivityTime;

      if (elapsedTime > timeoutDuration * 1000) {
        setIsPopupVisible(true);
        handleConfirmLogout(2);
      }
    };

    const interval = setInterval(() => {
      checkTimeout();
    }, 1000);

    const handleUserActivity = () => {
      lastActivityTime = Date.now();
      // Additional logic if needed
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    // Cleanup function to clear the interval and event listeners
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, []);
  const optionsRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    setUserName(cookies.get("USERNAME"));
    // if (!profileImage) {
    fetchUserProfileImage();
    // }
  }, [localStorage.getItem("user_id")]);

  const fetchUserProfileImage = async () => {
    try {
      const response = await fetch(
        `https://ats-9.onrender.com/user_image/${localStorage.getItem("user_id")}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        setProfileImage(
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        );
      } else {
        // console.log("Response : ", response.statusText);
        const blob = await response.blob();
        const imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        setProfileImage(imageUrl);
        // console.log("Image URL :",decodeURIComponent(imageUrl))
        localStorage.setItem("profileImage", imageUrl);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      localStorage.removeItem("profileImage");
      setProfileImage(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      );
    }
  };

  // useEffect(()=>{
  //   setNoficationCount(localStorage.getItem('num_notification'))
  // },[])
  useEffect(() => {
    console.log(notificationCount);
  }, [notificationCount]);

  const handleLogout = () => {
    setToInitial();
    setShowModal(true);
  };
  const [showCalendar, setShowCalendar] = useState(false);
  const handleCalendar = () => {
    setShowCalendar(true);
  };
  const closeModal = () => {
    setShowCalendar(false);
    setIsOpen(false)
  };

  const [showmeet, setShowmeet] = useState(false);

  const handlemeet = () => {
    setShowmeet(true);
  };
  const closemeet = () => {
    setShowmeet(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTelephonic(false);
    setInterviewData(null);
    setgeneral("");

  };
  const handleOpenModal = () => {
    setTelephonic(true);
  };

  // const email = localStorage.getItem('email');
  // console.log(email);

  const handleConfirmLogout = async (identify) => {
    try {
      const response = await fetch("https://ats-9.onrender.com/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
        }),
      });

      if (response.ok) {
        const responselogout = await response.json();
        // console.log("logout res", responselogout);
        cookies.remove("USERNAME", { path: "/" });
        cookies.remove("USERTYPE", { path: "/" });
        localStorage.removeItem("profileImage");
        if (localStorage.getItem("user_type")) {
          setToInitial();
          if (localStorage.getItem("user_type") === "management") {
            if (identify === 1) {
              navigate("/ManagementLogin");
            } else {
              navigate("/ManagementLogin", { state: { isPopupvisible: true } });
            }
          } else {
            if (identify === 1) {
              navigate("/RecruitmentLogin");
            } else {
              navigate("/RecruitmentLogin", {
                state: { isPopupvisible: true },
              });
            }
          }
        }
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleImageClick = () => {
    setShowOptions(!showOptions);
  };

  const handleUploadClick = (event) => {
    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", handleFileChange);
    fileInput.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        setImageForCropping(imageUrl);
        setIsCropping(true);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const handleRemovePhoto = async () => {
    setShowOptions(false);

    try {
      const response = await fetch(
        `https://ats-9.onrender.com/delete_user_image/${localStorage.getItem("user_id")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Send the profile image URL to the server for deletion
            profileImage: localStorage.getItem("profileImage"),
            image_delete_status: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove image");
      }

      const result = await response.json();
      if (localStorage.getItem("profileImage")) {
        // Remove the profile image URL from local storage
        localStorage.removeItem("profileImage");
      }

      // Remove the profile image URL from local storage
      fetchUserProfileImage();
      // console.log("Image rem/oved successfully");
      // Set the profile image state to null to update the UI
      setProfileImage(null);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target) &&
      imageContainerRef.current &&
      !imageContainerRef.current.contains(event.target)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions]);

  useEffect(() => {
    setShow(initial);
  }, []);

  useEffect(() => {
    // console.log('useeffect')
    // console.log(localStorage.getItem('path'))
    if (localStorage.getItem("path")) {
      const parent = localStorage
        .getItem("path")
        ?.trim()
        .substring(1)
        .toLowerCase();
      // console.log(parent);
      setShow({
        ...initial,
        [parent]: true,
      });
      // console.log({
      //   ...initial,
      //   [parent]: true,
      // });
    } else {
      console.log("else case");
    }
  }, [localStorage.getItem("path")]);

  useEffect(() => {
    console.log(show);
  }, []);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  // @app.route('/checked_jobs_notification/<int:user_id>', methods=['POST'])
  const getCountOfNotifications = async () => {
    // console.log('getcountofnotification called')
    // console.log("in getCountOfNotifications function");
    // @app.route('/jobs_notification/<int:user_id>', methods=['GET'])
    const id = localStorage.getItem("user_id");
    try {
      const response = await fetch(
        `https://ats-9.onrender.com/jobs_notification/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // console.log('reached here')
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        // localStorage.setItem('num_notification',data[0].num_notification)
        let sum = 0;
        for (let j = 0; j < data?.length; j++) {
          sum += data[j].num_notification;
        }
        setNoficationCount(sum);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateNotificationCount = async () => {
    const id = localStorage.getItem("user_id");
    try {
      const response = await fetch(
        `https://ats-9.onrender.com/checked_jobs_notification/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked_notification_status: true,
          }),
        },
      );
      if (response.ok) {
        // console.log("in ok");
        const data = response.json();
        await getCountOfNotifications();
        // console.log(data);
      } else {
        // console.log(response.statusText);
      }
    } catch (err) {
      console.log("handle error", err);
    }
  };


  const assignRequirementClicked = async () => {
    // localStorage.setItem('num_notification')
    setToInitial();

    await updateNotificationCount();
  };

  const userNameCapitalized = userName ? capitalizeFirstLetter(userName) : "";

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = "croppedImage.jpeg";
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSaveCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageForCropping,
        croppedAreaPixels,
      );
      // console.log("Cropped Image Blob:", croppedImageBlob);
      const formData = new FormData();
      formData.append("image", croppedImageBlob, "croppedImage.jpeg");

      const reader = new FileReader();
      reader.readAsDataURL(croppedImageBlob);
      reader.onloadend = async () => {
        const base64String = reader.result.replace(
          /^data:image\/(png|jpeg);base64,/,
          "",
        );
        await uploadCroppedImage(base64String, "croppedImage.jpeg");
      };
    } catch (error) {
      console.error("Error saving cropped image:", error.message);
    }
  };

  const uploadCroppedImage = async (base64Image, filename) => {
    try {
      // console.log("Base64 Image String:", typeof base64Image);

      const response = await fetch(
        `https://ats-9.onrender.com/upload_user_image/${localStorage.getItem("user_id")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            filename,
            image_delete_status: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      // console.log("Response Status Text:", response.statusText);

      const result = await response.json();
      // console.log("Upload Result:", result);
      fetchUserProfileImage();
      const newImageUrl = result.imageUrl; // Assuming the server returns the image URL
      setProfileImage(newImageUrl);
      localStorage.setItem("profileImage", newImageUrl);
    } catch (error) {
      console.error("Error uploading cropped image:", error);
    } finally {
      setIsCropping(false);
      setShowOptions(false);
    }
  };
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
  const handleresumeChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [interviewData, setInterviewData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');

  const [general, setgeneral] = useState("")

  //console.log(events,"inleftnav")

  const transformEvents = (events) => {
    return events?.map(event => {
      const { title, start_date, end_date, start_time, end_time, join_url, meeting_id, time_zone, cc_recipients, attendees, rec_email } = event;

      // Combine date and time into Date objects
      const startDateTime = new Date(`${start_date}T${start_time}`);
      const endDateTime = new Date(`${end_date}T${end_time}`);
      return {
        title,
        start: startDateTime,
        end: endDateTime,
        join_url,
        meeting_id,
        start_time,
        end_time,
        attendees,
        cc_recipients,
        time_zone,
        rec_email
      };
    });
  };

  // console.log(transformEvents(events), "transformedEvent");
  const transformedEvents = transformEvents(events);
  // console.log(transformedEvents, "transformedEvents");
  const cleanQuestion = (question) => {
    return question.replace(/[*#]+/g, '').trim();
  };
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handlegeneralchange = (e) => {
    setgeneral(e.target.value)
  }
  const [waitForSubmission, setWaitForSubmission] = useState(false);
  const [selectAllData, setSelectAllData] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setWaitForSubmission(true)
      const base64String = await fileToBase64(selectedFile);
      console.log("Base64 String:");
      const body_data = {
        user_id: localStorage.getItem("user_id"),
        recruiter_prompt: selectedOption,
        resume: base64String

      };
      console.log("job post Request Body:", body_data);

      const response = await fetch(
        "https://ats-9.onrender.com/generate_questions", {
        // "api/generate_questions", {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body_data),
      });

      const data = await response.json();
      setWaitForSubmission(false);
      if (!data.response || !data.response[0] || data.response[0].questions === undefined || Object.keys(data.response[0].questions).length === 0) {
        setInnerModal(true);
      }
      console.log(data.response[0]?.questions)
      let tempList = []
      let tempIndexes = []
      const selectAllKeys = Object.keys(data.response[0]?.questions);
      for (let i = 0; i < Object.keys(data.response[0].questions).length; i++) {
        tempIndexes.push(tempList.length);
        tempList.push(selectAllKeys[i])
        const tempArr = data.response[0].questions[selectAllKeys[i]]
        console.log(tempArr)
        tempList = tempList.concat(tempArr)
      }
      console.log(tempList)
      setIndexes(tempIndexes)
      setSelectAllData(tempList)
      setInterviewData(data);
      console.log("data", data);

    } catch (err) {
      console.log("handle error", err);
    }

  };


  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!selectedEvent.title || !startDateValue || !endDateValue || !selectedEvent.start_time || !selectedEvent.end_time || !selectedEvent.time_zone || selectedEmails1.length === 0) {
      toast.error('Please fill in all required fields.');
      return; // Prevent further execution
    }
    const payload = {
      subject: selectedEvent.title,
      attendees: selectedEmails1,
      cc_recipients: selectedEmails,
      start_date: startDateValue,
      end_date: endDateValue,
      time_zone: selectedEvent.time_zone,
      start_time: selectedEvent.start_time,
      end_time: selectedEvent.end_time,
      recruiter_email: localStorage.getItem("email"),
      meeting_id: selectedEvent.meeting_id, // Add meeting_id
      rec_email:selectedEvent.email,
    };
    if (!waitForSubmission1) {
      setwaitForSubmission1(true);
      setResponseSuccess(false);

      try {
        // Send the request
        const response = await fetch("https://ats-9.onrender.com/update_event", {
          method: 'POST', // Method should be 'POST' if you're creating or updating the resource
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
          setwaitForSubmission1(false);
        }

        const result = await response.json();
        console.log('Success:', result);
        setwaitForSubmission1(false);
        EditcloseModal();
        fetchMeetings();
        setModalMessage('Meeting edited successfully');
        setResponseSuccess(true);
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error:', error);
        setwaitForSubmission1(false);
        setModalMessage('An error occurred. Please try again.');
        setIsModalOpen(true);
      }
    }
  };


  //   e.preventDefault();
  //   console.log("Form submitted with data:", {
  //     title: selectedEvent.title,
  //     attendees: selectedEmails1,
  //     cc_recipients: selectedEmails,
  //     start_date: startDateValue,
  //     end_date: endDateValue,
  //     time_zone: selectedEvent.time_zone,
  //     start_time: selectedEvent.start_time,
  //     end_time: selectedEvent.end_time
  //   });

  //   const eventData = {
  //     title: selectedEvent.title || '',
  //     attendees: selectedEmails1,
  //     cc_recipients: selectedEmails,
  //     start_date: startDateValue,
  //     end_date: endDateValue,
  //     time_zone: selectedEvent.time_zone || '',
  //     start_time: selectedEvent.start_time || '',
  //     end_time: selectedEvent.end_time || ''
  //   };

  //   try {
  //     const response = await fetch(`https://ats-9.onrender.com/update_event/${selectedEvent.id}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(eventData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const result = await response.json();
  //     console.log('Success:', result);

  //     // Close modal on success
  //     setEditModalOpen(false);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };


  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const setToInitial = () => {
    // if (localStorage.getItem("page_no")) {
    //   localStorage.removeItem("page_no");
    // }
    localStorage.removeItem("path");
  };
  const [innerModal, setInnerModal] = useState(false);

  const handleCloseInnerModal = () => {
    setInnerModal(false);
  }
  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    // Check if the current window width is 542px or less
    if (window.innerWidth <= 542) {
      setSidebarOpen(!sidebarOpen);

      if (sidebarOpen) {
        document.querySelector("body").classList.remove("active");
        document.querySelector("body").classList.add("barside2");
      } else {
        document.querySelector("body").classList.add("active");
        document.querySelector("body").classList.add("closebar");
      }
    }
  };

  const handleEventClick = (event) => {
    // Here you can set the event data in the state to display in the modal
    setSelectedEvent(event);
    console.log(event,"slecsf"); // Assuming you have state to hold the selected event
    setShowmeet(true); // This will open the handlemeet modal
  };
  // const closemeet = () => setShowMeet(false);
  useEffect(() => {
    if (typeof selectedEvent?.attendees === 'string') {
      const emails = selectedEvent.attendees.split(',').map(email => email.trim());
      setSelectedEmails1(emails);
    }
  }, [selectedEvent?.attendees]);

  useEffect(() => {
    if (typeof selectedEvent?.cc_recipients === 'string') {
      const emails = selectedEvent.cc_recipients.split(',').map(email => email.trim());
      setSelectedEmails(emails);
    }
  }, [selectedEvent?.cc_recipients]);

  const startDate = new Date(selectedEvent?.start);
  const endDate = new Date(selectedEvent?.end);

  const formattedStartDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long', // Full day name
    month: 'long',   // Full month name
    day: 'numeric'   // Day of the month
  });

  const formattedStartTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false    // 24-hour format
  });

  const formattedEndTime = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false    // 24-hour format
  });

  const parseDate = (dateValue) => {
    const parsedDate = new Date(dateValue);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  // Ensure default values in case selectedEvent or dates are undefined
  const startDates = parseDate(selectedEvent?.start);
  const endDates = parseDate(selectedEvent?.end);

  const startDateValue = startDates.toISOString().split('T')[0];
  const endDateValue = endDates.toISOString().split('T')[0];

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    if (!isNaN(newStartDate.getTime())) {
      setSelectedEvent({ ...selectedEvent, start: newStartDate });
    }
  };



  // const handleStartTimeChange = (e) => {
  //   const newStartTime = e.target.value;
  //   setSelectedEvent({ ...selectedEvent, start_time: newStartTime });
  // };

  // const handleEndTimeChange = (e) => {
  //   const newEndTime = e.target.value;
  //   setSelectedEvent({ ...selectedEvent, end_time: newEndTime });
  // };

  const [interviewModal, setInterviewModal] = useState(false);

  const InterviewcloseModal = () => {
    setInterviewModal(false);
    setShowCalendar(false);
    // resetForm();

  };

  const [start_autoDate, setStartautoDate] = useState("");
  const [end_autoDate, setEndautoDate] = useState("");
  const [startautoTime, setStartautoTime] = useState("");
  const [endautoTime, setEndautoTime] = useState("");

  const handleEmptySlotClick = (slotInfo) => {
    // Open the modal here


    setInterviewModal(true);
    setShowCalendar(false);

    // Optionally, set start and end times based on the slot clicked
    setStartautoDate(slotInfo.start.toLocaleDateString('en-CA'));
    setEndautoDate(slotInfo.end.toLocaleDateString('en-CA'));
    setStartautoTime(slotInfo.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    setEndautoTime(slotInfo.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  };
  const formatTimeTo24Hour = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };
  useEffect(() => {
    if (selectedEvent && selectedEvent.start_time && selectedEvent.end_time) {
      const formattedStartTime = formatTimeTo24Hour(selectedEvent.start_time);
      const formattedEndTime = formatTimeTo24Hour(selectedEvent.end_time);
      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
    }
  }, [selectedEvent]);
  const [error, seterror] = useState('');
  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    if (!isNaN(newEndDate.getTime())) {
      setSelectedEvent({ ...selectedEvent, end: newEndDate });
    }
    if (new Date(startDate) > new Date(newEndDate)) {
      seterror('End Date is Earlier than Start Date .');
      toast.error('End Date is Earlier than Start Date.');
    } else {
      seterror(''); // Clear error if validation passes
    }
  };
  const [ResumeModal, setResumeModal] = useState(false);

  const handleResumeUpload = () => {
    setResumeModal(true)
  }
  const handleCloseResume = () => {
    setResumeModal(false)
  }
  return (
    <div>
      <div className="sidebar">
        <div className="profile">
          <div
            className="image-container"
            ref={imageContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img src={profileImage} alt="" />
            {showOptions && (
              <div
                className="options"
                ref={optionsRef}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "4px",
                  zIndex: 100,
                }}
              >
                <div
                  className="img_u"
                  onClick={handleUploadClick}
                  style={{
                    padding: "2px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontFamily: "poppins,sanserif",
                  }}
                >
                  Upload Photo
                </div>
                <div
                  className="img_u"
                  onClick={handleRemovePhoto}
                  style={{
                    padding: "3px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontFamily: "poppins,sanserif",
                  }}
                >
                  Remove Photo
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          {userNameCapitalized && (
            <p
              style={{
                color: "#32406D",
                fontSize: "20px",
                fontWeight: "600",
                marginTop: "-26px",
              }}
            >
              {userNameCapitalized}
            </p>
          )}
          <p
            style={{
              color: "#32406D",
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "-15px",
            }}
          >
            {USERTYPE === "recruiter" ? "Recruiter" : "Manager"}
          </p>
          <ul>
            <li onClick={toggleSidebar}>
              <Link
                to="/Dashboard"
                onClick={() => {
                  setToInitial()
                  if (localStorage.getItem("page_no")) {
                    localStorage.removeItem("page_no");
                  }
                }}
                className={
                  pathname.toLowerCase() === "/updatecandidate" || pathname.toLowerCase() === "/editcandidate" || pathname.toLowerCase() === "/dashboard"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>Dashboard</span>
              </Link>
            </li>
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/AccountCreation"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/AccountCreation"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Account Creation</span>
                </Link>
              </li>
            ) : null}
            {/* {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/stoxxo"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/stoxxo"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Stoxxo</span>
                </Link>
              </li>
            ) : null} */}
            {USERTYPE === "recruiter" ? (
              <li style={{ position: "relative" }} onClick={toggleSidebar}>
                <Link
                  style={{ paddingRight: "0px" }}
                  onClick={assignRequirementClicked}
                  to="/AssignedRequirements"
                  className={
                    pathname === "/AssignedRequirements/AddCandidate" ||
                      pathname === "/AssignedRequirements"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Assigned Requirements</span>
                </Link>
                {/* style={{backgroundColor:'red',position:'fixed',top:0,right:0,padding:'10px',borderRadius:'5px'}} */}

                {notificationCount !== 0 && (
                  <div
                    style={{
                      position: "absolute",
                      width: "10px",
                      backgroundColor: "red",
                      top: "1px",
                      color: "white",
                      right: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px 12px 4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                    }}
                  >
                    <div>{notificationCount}</div>
                  </div>
                )}
              </li>
            ) : null}

            <li onClick={toggleSidebar}>
              <Link
                to="/RegisterCandidate"
                onClick={() => {
                  setToInitial()
                  if (localStorage.getItem("page_no")) {
                    localStorage.removeItem("page_no");
                  }
                }}
                className={
                  pathname === "/RegisterCandidate/AddCandidate" ||
                    pathname === "/RegisterCandidate"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>Register Candidate</span>
              </Link>
            </li>
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/JobAssignments"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/JobAssignments"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Job Assignments</span>
                </Link>
              </li>
            ) : null}
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  to="/JobListing"
                  className={
                    pathname === "/JobListing/AddCandidate" || pathname === "/JobListing" || pathname === "/EditJobPosting" || pathname === "/EditJobStatus"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Job Listing</span>
                </Link>
              </li>
            ) : null}
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  to="/ProfileTransfer"
                  className={
                    pathname === "/ProfileTransfer"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Profile Transfer</span>
                </Link>
              </li>
            ) : null}
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/UserAccounts"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/UserAccounts"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>User Accounts</span>
                </Link>
              </li>
            ) : null}
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/AccountDeactivation"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/AccountDeactivation"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Account Deactivation</span>
                </Link>
              </li>
            ) : null}
            {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/SubmissionSummary"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/SubmissionSummary"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Submission Summary</span>
                </Link>
              </li>
            ) : null}
            {
              localStorage.getItem("user_type") === "management" && (
                <li onClick={toggleSidebar}>
                  <Link
                    to="/Tekspot_Applications"
                    onClick={() => {
                      setToInitial()
                      if (localStorage.getItem("page_no")) {
                        localStorage.removeItem("page_no");
                      }
                    }}
                    className={
                      pathname === "/Tekspot_Applications"
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    <span>Reports Data</span>
                  </Link>
                </li>
              )
            }
            {/* {USERTYPE === "managment" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/Tekspot_Curr_Opp"
                  onClick={() => {
                    setToInitial()
                    if (localStorage.getItem("page_no")) {
                      localStorage.removeItem("page_no");
                    }
                  }}
                  className={
                    pathname === "/Tekspot_Curr_Opp"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Tekspot Current Oppurtunities</span>
                </Link>
              </li>
            ) : null} */}
            

            <li onClick={toggleSidebar}>
              <Link
                to="/ChangePassword"
                onClick={() => {
                  setToInitial()
                  if (localStorage.getItem("page_no")) {
                    localStorage.removeItem("page_no");
                  }
                }}
                className={
                  pathname === "/ChangePassword"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>Change Password</span>
              </Link>
            </li>
            {USERTYPE === "recruiter" ? (
              <li onClick={toggleSidebar}>
                <Link
                  to="/OverView"
                  // onClick={() => {
                  //   setToInitial()
                  //   if (localStorage.getItem("page_no")) {
                  //     localStorage.removeItem("page_no");
                  //   }
                  // }}
                  className={
                    pathname === "/OverView"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Profile Analysis</span>
                </Link>
              </li>
            ) : null}
            
              <li onClick={toggleSidebar}>
                <Link
                  to="/ResumeSearching"
                  // onClick={() => {
                  //   setToInitial()
                  //   if (localStorage.getItem("page_no")) {
                  //     localStorage.removeItem("page_no");
                  //   }
                  // }}
                  className={
                    pathname === "/ResumeSearching"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span>Resume Portal</span>
                </Link>
              </li>
          
              <li onClick={handleResumeUpload} className="logoutBtn" >
                  
                    <span  id="resume" >Resume Hub</span>
                  
              </li>
              < ResumeUpload
              ResumeModal={ResumeModal}
              
              handleCloseResume={handleCloseResume} />
              
            
           
            <li onClick={handleCalendar} className="logoutBtn">
              <span id="lgout">Calendar</span>
            </li>
            < ScheduleMeet
              interviewModal={interviewModal}
              start_autoDate={start_autoDate}
              end_autoDate={end_autoDate}
              startautoTime={startautoTime}
              endautoTime={endautoTime}
              //  resetForm={resetForm}
              setShowCalendar={setShowCalendar}
              InterviewcloseModal={InterviewcloseModal} />
            <li onClick={handleLogout} className="logoutBtn">
              <span id="lgout">Logout</span>
            </li>

            {
              localStorage.getItem("user_type") === "recruitment" && (<li style={{ paddingTop: "50px" }}>
                <ChatBotComponent setTelephonic={setTelephonic} msgs={pathname === "/Dashboard" ? msgs : []} chatMsgId={chatMsgId} />
              </li>)
            }
          </ul>
        </div>
        <Modal
          isOpen={showModal}
          onRequestClose={handleCloseModal}
          contentLabel="Logout Confirmation"
          className="modal-content"
          overlayClassName="modal-overlay"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(0.5px)",
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
          <div className="modal-actions" style={{ marginBottom: "60px" }}>
            <p
              style={{
                fontSize: "17px",
                fontFamily: "roboto",
                fontWeight: "400",
                color: "black",
              }}
            >
              Are you sure you want to logout?
            </p>
          </div>
          <div style={{ marginTop: "-40px" }}>
            <button
              onClick={handleCloseModal}
              style={{
                marginRight: "30px",
                backgroundColor: "green",
                color: "white",
                height: "28px",
                borderRadius: "5px",
                border: "none",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleConfirmLogout(1);
              }}
              style={{
                backgroundColor: "Red",
                color: "white",
                height: "28px",
                border: "none",
                width: "60px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={isCropping}
          contentLabel="Crop Image"
          className="modal-content"
          overlayClassName="modal-overlay"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              width: "80%",
              maxWidth: "500px",
              height: "400px",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              padding: "20px",
            },
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Cropper
              image={imageForCropping}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
              onZoomChange={setZoom}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
              }}
            >
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(zoom)}
                style={{ width: "200px" }}
              />
            </div>
            <div style={{ textAlign: "center", marginLeft: "30px" }}>
              <button
                onClick={handleSaveCroppedImage}
                style={{
                  marginRight: "30px",
                  height: "30px",
                  width: "60px",
                  color: "white",
                  backgroundColor: "green",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsCropping(false)}
                style={{
                  marginRight: "30px",
                  height: "30px",
                  width: "60px",
                  color: "white",
                  backgroundColor: "red",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={Telephonic}
          onRequestClose={handleCloseModal}
          contentLabel="Logout Confirmation"
          className="modal-content"
          id="QuestionModal"
          overlayClassName="modal-overlay"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              width: "57%",
              maxHeight: "98%",

              margin: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#f7f7f7",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              padding: "20px 40px",
              textAlign: "center",
            },
          }}
        >
          <div className="Modalleft" style={{ display: "flex", justifyContent: "space-between", paddingLeft: "70px" }}>
            <h2 className="Modalheading" style={{ marginBottom: "20px", color: "#32406D" }}>Recruiter-Candidate Interaction Support</h2>
            <MdCancel onClick={handleCloseModal} style={{ cursor: "pointer", color: "#32406d", height: "30px", width: "30px" }} />
          </div>
          <form className="leftform" onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="resume" style={{ fontWeight: "bold", marginRight: "10px" }}>Upload Resume:</label>
              <input
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #aaa" }}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleresumeChange}
              />
            </div>
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label htmlFor="generateQuestions" style={{ fontWeight: "bold", marginRight: "10px" }}>Generate Question:</label>
              <select
                id="generateQuestions"
                value={selectedOption}
                onChange={handleSelectChange}
                style={{ borderRadius: "5px", border: "1px solid #aaa", width: "100%" }}
              >
                <option value="" disabled>Select an option</option>
                <option value="Generate five questions each for location preference, availability to start, salary expectations, and questions for the recruiter.">
                  Generate five questions each for location preference, availability to start, salary expectations, and questions for the recruiter.
                </option>
                <option value="Generate five questions each for location preference, availability to start, salary expectations, and questions for the recruiter with answers.">
                  Generate five questions each for location preference, availability to start, salary expectations, and questions for the recruiter with answers.
                </option>
                <option value="Generate five technical questions for each skill in the resume.">
                  Generate five technical questions for each skill in the resume.
                </option>
                <option value="Generate five technical questions for each skill in the resume with answers.">
                  Generate five technical questions for each skill in the resume with answers.
                </option>
                {/* <option value="Generate five Questions related to only certification in the resume">
                  Generate five Questions related to only certification in the resume
                </option>
                <option value="Generate five questions about the productivity tools a candidate is proficient with, as listed in their resume">
                  Generate five questions about the productivity tools a candidate is proficient with, as listed in their resume
                </option>
                <option value="Generate five questions about how a candidate found and applied for this job">
                  Generate five questions about how a candidate found and applied for this job
                </option> */}
              </select>
            </div>
            {interviewData && interviewData.response && interviewData.response[0] && (
              <div>
                <div style={{ marginBottom: "20px", textAlign: "left" }}>
                  <label htmlFor="generateQuestions" style={{ fontWeight: "bold", marginRight: "10px" }}>Types Of Questions:</label>
                  <select className="selectQ" value={general} onChange={handlegeneralchange}>
                    <option value="">Select a category</option>
                    {
                      Object.keys(interviewData.response[0].questions)?.length > 0 && (<option value="select all">select all</option>)
                    }
                    {Object.keys(interviewData.response[0].questions).map((general, index) => (
                      <option key={index} value={general}>{general}</option>
                    ))}
                  </select>
                </div>
                <div style={{ textAlign: "left", color: "green", fontSize: "14px" }}>{interviewData.response[0].heading}</div>
              </div>

            )}
            <div >
              {general && general === "select all" ? (
                <div style={{ textAlign: "left", overflow: "auto", height: "200px" }}>
                  <ul>
                    {selectAllData?.map((question, index) => (
                      <li key={index}
                        style={{
                          fontSize: indexes && indexes.includes(index) ? "16px" : "14px",
                          fontWeight: indexes && indexes.includes(index) ? "bold" : "normal"
                        }}
                      >{cleanQuestion(question)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ textAlign: "left", overflow: "auto", maxHeight: '200px' }}>
                  <ul>
                    {interviewData?.response[0]?.questions[general]?.map((question, index) => (
                      <li key={index}>{cleanQuestion(question)}</li>

                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button id="addCandidateSubmit"

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
              <button
                type="button"
                onClick={handleDownloadQuestions}
                style={{
                  borderRadius: '4px',
                  background: '#32406D',
                  color: '#fff',
                  width: '150px',
                  // padding: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  // marginTop: '20px',
                }}
              >
                Download Word
              </button>
            </div>


          </form>


        </Modal>
        <Modal
          isOpen={innerModal}
          onRequestClose={handleCloseInnerModal}
          contentLabel="Logout Confirmation"
          className="modal-content_some"
          overlayClassName="modal-overlay"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              width: "30%",
              height: "80px",
              margin: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#f7f7f7",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              padding: "20px 40px",
              textAlign: "center",

            },
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: "red", marginTop: "10px" }}>
              something went wrong, please try again
            </div>
            <div style={{ textAlign: "right" }}>
              <MdCancel onClick={handleCloseInnerModal} style={{ cursor: "pointer", height: "30px", width: "30px", color: "#32406D", marginTop: "8px" }} />
            </div>
          </div>

        </Modal>
        <Modal
          isOpen={isOpen || showCalendar}
          onRequestClose={() => {
            setIsOpen(false);
            setShowCalendar(false);
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              width: "60%",
              height: "80%",
              margin: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#f7f7f7",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              padding: "20px 40px",
              textAlign: "center",

            },
          }}>
          {/* <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button> */}
          <MdCancel onClick={closeModal} style={{ cursor: "pointer", position: 'absolute', top: '10px', right: '10px', color: "#32406d", height: "30px", width: "30px" }} />

          <div style={{ height: 'calc(100% - 40px)' }}>
            <h2>Calendar</h2>
            <Calendar
              localizer={localizer}
              events={transformedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              formats={formats}
              onSelectEvent={handleEventClick}
              selectable
              onSelectSlot={handleEmptySlotClick}
            />
          </div>
        </Modal>

        <Modal
          isOpen={showmeet}
          onRequestClose={closemeet}
          contentLabel="Logout Confirmation"
          className="modal-content"
          id="QuestionModal"
          overlayClassName="modal-overlay"
          style={{
            overlay: {
              backgroundColor: "transparent",
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
              maxHeight: "98%",
              margin: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "#f7f7f7",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              padding: "20px 15px",
              textAlign: "center",
            },
          }}
        >
          <div className="Modalleft" style={{ display: "flex", justifyContent: "space-between", paddingLeft: "0px" }}>
            <h2 className="Modalheading" style={{ margin: "5px 0px", fontSize: "15px", color: "#000" }}>My Calendar</h2>
            {/* <MdCancel onClick={closemeet} style={{ cursor: "pointer", color: "#32406d", height: "30px", width: "30px" }} /> */}
          </div>

          <div className="Modalleft" style={{ display: "flex", justifyContent: "space-between", paddingLeft: "0px" }}>
            <h2 className="Modalheading" style={{ marginBottom: "10px", color: "rgb(70 68 68 / 95%)" }}>{selectedEvent?.title}</h2>
            {/* <MdCancel onClick={closemeet} style={{ cursor: "pointer", color: "#32406d", height: "30px", width: "30px" }} /> */}
          </div>
          <form className="leftform" onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="resume" style={{ fontWeight: "bold", marginRight: "10px", color: 'rgb(63 63 63)' }}>
                {selectedEvent ? `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}` : ""}
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "Left", marginTop: "10px" }}>
              {selectedEvent && selectedEvent.join_url && (
                <a
                  href={selectedEvent.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderRadius: "4px",
                    background: "#32406D",
                    color: "#fff",
                    padding: "10px",
                    width: "100px",
                    position: "relative",
                  }}
                >
                  Join
                </a>
              )}
              {selectedEvent && (
                <>
                  {/* {console.log('Local storage email:', localStorage.getItem('email'))}
                  {console.log('Event recruiter email:', selectedEvent.rec_email)}
                  {console.log('Emails match:', localStorage.getItem('email')?.toLowerCase() === selectedEvent.rec_email?.toLowerCase())} */}

                  {localStorage.getItem('email')?.toLowerCase() === selectedEvent.rec_email?.toLowerCase() && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          EditopenModal();
                          setShowCalendar(false);
                        }}
                        style={{
                          borderRadius: '4px',
                          marginLeft: '5px',
                          background: 'transparent',
                          border: "1px solid #000",
                          color: '#000',
                          width: '90px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      {!waitForSubmissiondel ? (
                        <button
                          type="button"
                          onClick={() => handleDeletemeet(selectedEvent.meeting_id)}
                          style={{
                            borderRadius: '4px',
                            marginLeft: '5px',
                            background: 'transparent',
                            border: "1px solid #000",
                            color: 'rgb(238 16 16)',
                            width: '40px',
                            fontSize: "20px",
                            cursor: 'pointer',
                          }}
                        >
                          <MdDelete />
                        </button>
                      ) : (
                        <div style={{ marginLeft: "10px" }}>
                          <TailSpin
                            visible={true}
                            height="40"
                            width="40"
                            color="#4fa94d"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "Left", marginTop: "10px" }}>
              <span style={{ borderRadius: "4px", fontSize: "18px", color: "#32406D", position: "relative" }}>
                <IoLocationOutline />
              </span>
              <h4 style={{ marginLeft: '5px', color: '#000' }}>
                ATS Meet Connect
              </h4>
            </div>
          </form>
        </Modal>



        <Modal
          isOpen={EditModal}
          onRequestClose={EditcloseModal}
          contentLabel="Edit Modal"
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
          <form onSubmit={handleFormSubmit}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <h2 style={{ color: "#32406D", fontSize: '20px', textAlign: 'center', marginLeft: "-20px" }}>New Meeting</h2>
              <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  style={{ backgroundColor: "#e81123", color: "white", border: "none", borderRadius: "4px", padding: '0px 16px', fontSize: '16px', cursor: 'pointer', height: "30px", width: "80px" }}
                  onClick={EditcloseModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#32406D", color: "white", border: "none", borderRadius: "4px", padding: '0px 16px', fontSize: '16px', cursor: 'pointer', height: "30px", width: "80px" }}
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
                value={selectedEvent?.title || ''}
                style={{ width: '100%', height: "35px", borderRadius: "5px", border: "1px solid gray", paddingLeft: "10px" }}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}

              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Attendees
              </label>
              <div ref={inputRef} style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  padding: '5px',
                  border: '1px solid gray',
                  borderRadius: '5px',
                  cursor: 'text',
                  height: '40px',
                  overflow: 'auto',
                  position: 'sticky',
                  right:'0px'
                }}>
                  {selectedEmails1.map((email, idx) => (
                    <span key={idx} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '0px 10px',
                      borderRadius: '20px',
                      marginRight: '5px',
                      fontSize: '14px',
                      marginTop:'5px'
                    }}>
                      {email}
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(email)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white',
                          marginLeft: '8px',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Select or search emails"
                    style={{
                      flex: '1',
                      minWidth: '300px',
                      border: 'none',
                      paddingLeft: '10px',
                      fontSize: '16px',
                      outline: 'none',
                      width: 'auto'
                    }}
                    value={searchQuery}
                    // onFocus={() => {
                    //   console.log('Input focused');
                    //   handleFocus();
                    // }}
                    // onBlur={() => {
                    //   console.log('Input blurred');
                    //   handleBlur();
                    // }}
                    onChange={(e) => {
                      console.log('Input changed:', e.target.value);
                      handleSearchChange(e);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Add button clicked');
                      handleAddNewEmail();
                    }}
                    style={{
                        position: 'sticky',
                        right: '0px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        whiteSpace: 'normal',
                        zIndex:'1',
                      display: filteredEmails.length === 0 && searchQuery.trim() ? 'inline-block' : 'none'
                    }}
                  >
                    Add
                  </button>
                </div>
                {isDropdownOpen1 && (
                  <div className="dropdown-menu" style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    marginTop: '5px',
                    width: "100%",
                    position: 'absolute',
                    zIndex: 1000,
                    background: 'white',
                    width:'auto'
                  }}>
                    {filteredEmails.length ? (
                      filteredEmails.map((email, idx) => (
                        <label key={idx} className="dropdown-item" style={{
                          display: 'block',
                          padding: '5px',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            value={email}
                            checked={selectedEmails1.includes(email)}
                            onChange={(e) => {
                              console.log('Checkbox changed:', e.target.value, e.target.checked);
                              handleCheckboxChange(email);
                              setIsDropdownOpen1(false);
                              setSearchQuery("");
                            }}
                            style={{ marginRight: '5px' }}
                          />
                          {email}
                        </label>
                      ))
                    ) : (
                      <div style={{ padding: '5px' }}>
                        No matching emails found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Attendees (optional)
              </label>
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <div ref={inputRef} style={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  padding: '5px',
                  border: '1px solid gray',
                  borderRadius: '5px',
                  cursor: 'text',
                  height: 'auto',
                  overflow: 'hidden',
                  position: 'sticky',
                  overflow: 'auto',
                  right:'0px'
                }}>
                  {selectedEmails.map((email, idx) => (
                    <span key={idx} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '0px 10px',
                      borderRadius: '20px',
                      marginRight: '5px',
                      fontSize: '14px',
                      marginTop: '5px'
                    }}>
                      {email}
                      <button
                        onClick={() => handleEmailChange1(email)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white',
                          marginLeft: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Select or search emails"
                    style={{
                      flex: '1',
                      minWidth: '300px',
                      border: 'none',
                      paddingLeft: '10px',
                      fontSize: '16px',
                      outline: 'none',
                      width: 'auto'
                    }}
                    value={searchQuerys}
                    onClick={toggleDropdown}
                    onChange={handleInputChange}
                  />
                  {isDropdownOpen && searchQuerys && filteredManagers.length === 0 && filteredRecruiters.length === 0 && (
                    <button
                      type="button"
                      onClick={handleAddManualEmail}
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        position: 'sticky',
                        right: '0px'
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
                {isDropdownOpen && (filteredManagers.length > 0 || filteredRecruiters.length > 0) && (
                  <div className="dropdown-menu" style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    marginTop: '5px',
                    width: '100%',
                    position: 'absolute',
                    zIndex: 1000,
                    background: 'white',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    width:'auto'
                  }}>
                    {[...new Set([...filteredManagers, ...filteredRecruiters].map(person => person.email))].map(email => (
                      <label key={email} className="dropdown-item" style={{
                        display: 'block',
                        padding: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        fontWeight:"normal",
                        alignItems: 'center'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(email)}
                          onChange={() => handleEmailChange1(email)}
                          style={{ marginRight: '5px' }}
                        />
                        {email}
                      </label>
                    ))}
                    {filteredManagers.length === 0 && filteredRecruiters.length === 0 && (
                      <div style={{ padding: '5px' }}>
                        No matching emails found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ width: '48%' }}>
                <label style={{ textAlign: "left" }}>Start Date</label>
                <input
                  type="date"
                  value={startDateValue}
                  style={{ width: '100%', height: "35px", borderRadius: "5px", border: "1px solid gray", paddingLeft: "10px" }}
                  onChange={handleStartDateChange}
                />
              </div>
              <div style={{ width: '48%' }}>
                <label style={{ textAlign: "left" }}>End Date</label>
                <input
                  type="date"
                  value={endDateValue}
                  style={{ width: '100%', height: "35px", borderRadius: "5px", border: "1px solid gray", paddingLeft: "10px" }}
                  onChange={handleEndDateChange}
                />
                <span>{error && <p style={{ color: 'red' }}>{error}</p>}</span>
              </div>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <label style={{ textAlign: "left" }}>Time Zone</label>
              <select
                value={selectedEvent?.time_zone || ''}
                style={{ width: '100%', height: "35px", borderRadius: "5px", border: "1px solid gray", paddingLeft: "10px" }}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, time_zone: e.target.value })}
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
                  value={selectedEvent.start_time || ''}
                  onChange={(e) => handleStartTimeChange(e)}
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
                  value={selectedEvent.end_time || ''}
                  onChange={(e) => handleEndTimeChange(e)}
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
                setIsModalOpen(false);
                if (responseSuccess) {
                  setShowCalendar(true);
                }
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

      </div>
    </div>
  );
})


export default LeftNav;