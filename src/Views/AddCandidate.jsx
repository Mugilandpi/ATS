import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LeftNav from "../Components/LeftNav";
import "../Components/leftnav.css";
import TitleBar from "../Components/TitleBar";
import "../Components/titlenav.css";
import { MdCancel } from "react-icons/md";
import "../Views/JobAssignment/jobassignment.css";
import { FaArrowLeft } from "react-icons/fa";
import "./AddCandidate.css";
// import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Modal1 from "../Components/AddCandidateModals/Modal1.jsx";
import Modal2 from "../Components/AddCandidateModals/Modal2.jsx";
import { getDashboardData } from "./utilities.js";
import { ThreeDots } from "react-loader-spinner";

import CandidateDetails from "./Dashboard/CandidateDetails";

function AddCandidate() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const [closeNProceedRef, setCloseNProceedRef] = useState(null)
  const hidden_ref = useRef();
  const [profileValue, setProfileValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [showDuplicate1, setShowDuplicate1] = useState(false);
  const [showDuplicate2, setShowDuplicate2] = useState(false);
  const [duplicate, setDuplicate] = useState([]);
  const [duplicateCandidate, setDuplicateCandidate] = useState([]);
  const notify = () => toast.success("Candidate added successfully");
  const notifyError = () =>
    toast.error("Unable to add candidate, Please try again.");
  const [showConfirmationWindow, setShowConfirmationWindow] = useState();
  // const [ allJobs, setAllJobs ] = useState(null);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [waitForSubmission2, setwaitForSubmission2] = useState(false);
  const initialState = {
    job_id:
      localStorage.path === "/AssignedRequirements" ||
        localStorage.path === "/JobListing"
        ? location.state.id[0]
        : "",
    name: "",
    mobile: "",
    email: "",
    client: "",
    profile: location.state.profile,
    skills: "",
    qualifications: "",
    reason_for_job_change: "",
    resume: null,
    current_company: "",
    position: "",
    current_job_location: "",
    preferred_job_location: "",
    total_experience_years: "",
    total_experience_months: "",
    relevant_experience_years: "",
    relevant_experience_months: "",
    current_ctc_type: "INR",
    current_ctc_value: "",
    expected_ctc_type: "INR",
    expected_ctc_value: "",
    serving_notice_period: "", //serving notice period
    holding_offer: "",
    period_of_notice: "", // 1 Month, 3 Months etc..
    total_offers: "",
    linkedin: "",
    remarks: "",
    last_working_date: "",
    buyout: false,
    highest_package: "",
  };
  const exp_yrs = new Array(21).fill(0).map((_, idx) => idx);
  const exp_months = new Array(12).fill(0).map((_, idx) => idx);
  const [selectedFile, setSelectedFile] = useState(null);
  const [candidate_details, setDetails] = useState(initialState);
  // useEffect(()=>{
  //   const closeAddCandidateConfirmation = (e)=>{
  //     const element = document.getElementById("confirmSubmitWindowId")
  //     const submitBtn = document.getElementById("addCandidateSubmit")
  //     const closeNProceed = document.getElementById(closeNProceedRef)
  //     // console.log(!submitBtn.contains(e.target))
  //     // console.log(!document.getElementById(closeNProceedRef).contains(e.target))
  //     // console.log(!element.contains(e.target))
  //     if(element && submitBtn && closeNProceedRef && (!closeNProceed.contains(e.target) && !submitBtn.contains(e.target) && !element.contains(e.target) )){
  //       handleCloseDetails()
  //     }
  //   }
  //   window.addEventListener("click",closeAddCandidateConfirmation)
  //   return ()=>{
  //     window.addEventListener("click",closeAddCandidateConfirmation)
  //   }
  // },[closeNProceedRef])

  useEffect(() => {
    // console.log("lcoation", location)
    if (location.state) {
      setDetails((prev) => ({
        ...prev,
        client: location.state.client,
      }));
    }
  }, [location]);

  const handleCloseDetails = () => {
    setwaitForSubmission(false);
    setShowDetails(false);
  };
  // useEffect(() => {
  //     console.log(candidate_details);
  // }, [ candidate_details ]);

  const handleCloseNProceed = (id) => {
    setShowDuplicate1(false);
    // setShowDetails(false);
    confirmAddCandidate();
    setCloseNProceedRef(id)
  };

  const handleChange = (e) => {
    if (e.target.name === "buyout") {
      setDetails({ ...candidate_details, buyout: e.target.checked });
      return;
    }

    if (e.target.name === "qualifications") {
      const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
      setDetails({ ...candidate_details, qualifications: alphanumericValue });
    } else {
      setDetails({ ...candidate_details, [e.target.name]: e.target.value });
    }

    // if(e.target.value == 'Select a Job ID'){
    //     setProfileValue('');
    // }else{
    //     console.log(location?.state.role)
    //     setProfileValue(location?.state.role);
    // }
  };

  const handleJobId = (e) => {
    setDetails({ ...candidate_details, [e.target.name]: e.target.value });
    if (e.target.value == "") {
      setProfileValue("");
    } else {
      const val = e.target.value;
      // console.log(location?.state.obj[val]);
      setProfileValue(location?.state.obj[val]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  //   const fileToBase64 = (file) => {
  //     console.log("Selected File:", file); // Check the type and value of the selected file
  //     return new Promise((resolve, reject) => {
  //       if (!file || !(file instanceof Blob)) {
  //         reject(new Error("Invalid file object"));
  //         return;
  //       }

  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         resolve(reader.result.split(",")[1]);
  //       };
  //       reader.onerror = (error) => {
  //         reject(error);
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const notify1 = () => toast.error("resume is mandatory");

  const notify2 = () => toast.warn("Email format is incorrect");

  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    return nameRegex.test(name);
  };

  const confirmAddCandidate = async () => {
    if (!waitForSubmission2) {
      setwaitForSubmission2(true);
      try {
        const base64String = await fileToBase64(selectedFile);
        const add_candidate_data = {
          ...candidate_details,
          job_id: localStorage.path === "/AssignedRequirements" ||
            localStorage.path === "/JobListing"
            ? Number(location.state.id[0])
            : Number(candidate_details.job_id),
          // recruiter: ,
          user_id: localStorage.getItem("user_id"),
          profile:
            (localStorage.getItem("path") === "/JobListing" || localStorage.getItem("path") === "/AssignedRequirements")
              ? candidate_details.profile : profileValue,
          resume: base64String,
          expected_ctc: `${candidate_details["current_ctc_type"]} ${candidate_details["current_ctc_value"]}`,
          current_ctc: `${candidate_details["expected_ctc_type"]} ${candidate_details["expected_ctc_value"]}`,
          experience: `${candidate_details["total_experience_years"]}.${candidate_details["total_experience_months"]}`,
          relevant_experience: `${candidate_details["relevant_experience_years"]}.${candidate_details["relevant_experience_months"]}`,
        };
        console.log(add_candidate_data, "add_candidate_data");

        const response = await fetch(
          // "/api/add_candidate",
          "https://ats-9.onrender.com/add_candidate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(add_candidate_data),
          },
        );

        const data = await response.json();
        if (data.status !== "error") {
          // console.log(data);
          getDashboardData().then(() => {
            setwaitForSubmission2(false);
            toast.success("Candidate added successfully!");
            navigate("/dashboard");
          });
          // navigate(localStorage.getItem('path'))
          // setTimeout(()=>{

          // },2000)
        } else {
          // console.log(data);
          notifyError();
          setwaitForSubmission2(false);
        }
      } catch (err) {
        setwaitForSubmission2(false);
        console.log(err);
        notifyError();
      }
    }
  };

  const { dashboardData } = useSelector((state) => state.dashboardSliceReducer);

  const isValidMobileNumber = (mobileNumber) => {
    return /^\d{10}$/.test(mobileNumber); // Check if the mobile number consists of exactly 10 digits
  };

  const handleSubmit = async (e) => {
    setwaitForSubmission(true);
    e.preventDefault();

    const candidate_data = {
      name: candidate_details.name,
      mobile: candidate_details.mobile,
      email: candidate_details.email,
      total_experience_years: candidate_details.total_experience_years,
      total_experience_months: candidate_details.total_experience_months,
      relevant_experience_years: candidate_details.relevant_experience_years,
      relevant_experience_months: candidate_details.relevant_experience_months,
      qualifications: candidate_details.qualifications,
      last_working_date: candidate_details.last_working_date,
      serving_notice_period: candidate_details.serving_notice_period,
    };

    const currentDate = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(candidate_details.last_working_date).setHours(
      0,
      0,
      0,
      0,
    );

    if (!selectedFile) {
      notifyAlert();
      setwaitForSubmission(false);
      return;
    }

    if (selectedDate < currentDate) {
      toast.warn("Last working date cannot be in past");
      setwaitForSubmission(false);
      return;
    }

    const qualifications = candidate_data.qualifications;
    const containsOnlyNumbers = /^\d+$/.test(qualifications);
    if (containsOnlyNumbers) {
      toast.warn("Qualifications must contain alphabets along with numbers");
      setwaitForSubmission(false);
      return;
    }

    if (!isValidMobileNumber(candidate_data.mobile)) {
      toast.warn("Mobile number must contain 10 digits");
      setwaitForSubmission(false);
      return;
    }
    if (!isValidName(candidate_data.name)) {
      toast.warn("Candidate name  should contain alphabetics only.");
      setwaitForSubmission(false);
      return;
    }
    if (!isValidEmail(candidate_data.email)) {
      toast.warn("Please enter a valid email address");
      setwaitForSubmission(false);
      return;
    }
    const totalExperienceYears = candidate_data.total_experience_years;
    const totalExperienceMonths = candidate_data.total_experience_months;
    const relevantExperienceYears = candidate_data.relevant_experience_years;
    const relevantExperienceMonths = candidate_data.relevant_experience_months;

    if (Number(relevantExperienceYears) > Number(totalExperienceYears)) {
      // console.log("lmk", Number(relevantExperienceYears)>Number(totalExperienceYears))
      toast.warn("Relevant experience must be less than total experience");
      setwaitForSubmission(false);
      return;
    } else if (
      Number(relevantExperienceYears) === Number(totalExperienceYears)
    ) {
      if (Number(relevantExperienceMonths) > Number(totalExperienceMonths)) {
        // console.log("el", relevantExperienceYears, totalExperienceYears)
        setwaitForSubmission(false);
        toast.warn("Relevant experience must be less than total experience");
        return;
      }
    }
    console.log("candidate_data", candidate_data);
    try {
      const response = await fetch(
        "https://ats-9.onrender.com/check_candidate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/JSON",
          },
          body: JSON.stringify(candidate_data),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Success:", data);
      if (data.jobIds) {
        const jobId = localStorage.path === "/AssignedRequirements" || localStorage.path === "/JobListing"
          ? Number(location.state.id[0]) : Number(candidate_details.job_id);
        const index = data.jobIds.indexOf(jobId);

        console.log("index: ", index);
        if (index != -1) {
          setDuplicateCandidate({
            job_id: data.jobIds[index],
            date: data.dates[index],
            client: data.clients[index],
            profile: data.profiles[index],
            status: data.status[index],
          });

          setShowDuplicate2(true);
        } else {
          let result = [];
          const len = data.jobIds.length;
          for (let i = 0; i < len; i++) {
            const jobDetail = {
              job_id: data.jobIds[i],
              date: data.dates[i],
              client: data.clients[i],
              profile: data.profiles[i],
              status: data.status[i],
            };
            console.log(jobDetail);
            result.push(jobDetail);
          }
          console.log(result);
          setDuplicate(result);
          setShowDuplicate1(true);
        }
      } else {
        setShowDetails(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const styles1 = {
    marginBottom: "0px",
    fontSize: "13px",
    marginTop: "4px",
    paddingRight: "4px",
    fontWeight: 480,
    color: "#2e2e2e",
    textAlign: window.innerWidth <= 542 ? "left" : "initial",
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.querySelector("body").classList.toggle("active");
  };

  // useEffect(() => {
  //     console.log('rendered');
  //     const fetchData = async () => {
  //         try {
  //             const response = await fetch(
  //                 'https://ats-9.onrender.com/view_all_jobs', {
  //                 method: 'POST',
  //                 headers: {
  //                     'Content-Type': 'application/json'
  //                 },
  //                 body: JSON.stringify({ username: localStorage.getItem('user_name') })
  //             }
  //             );
  //             if (response.ok) {
  //                 const data = await response.json();
  //                 setAllJobs(data[ "job_posts_active" ]);
  //                 console.log('data', data);
  //             } else {
  //                 console.log('Response not ok:', response.statusText);
  //             }
  //         } catch (err) {
  //             console.log('Handle error:', err);
  //         }
  //     };
  //     fetchData();
  // }, []);

  useEffect(() => {
    // console.log("required", location.state.id);
  }, [location.state.id]);
  useEffect(() => {
    localStorage.setItem("path", location.state.path);
    setProfileValue(location.state.profile)
  }, []);
  const notifyAlert = () => toast.warn("Please upload a file for resume.");
  const handleSubmitResume = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // console.log("Selected File:", file);
    setSelectedFile(file); // Update the selectedFile state with the selected file

    // setSelectedFile(file);

    if (!file) {
      notifyAlert();
      return;
    }

    try {
      // console.log(file);
      const base64String = await fileToBase64(file);

      const resumeData = {
        resume: base64String,
      };

      const response = await fetch(
       // "/api/parse_resume",
         "https://ats-9.onrender.com/parse_resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resumeData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        const { name, mail, skill1, skill2, phone } = data;
        // console.log(mail);
        const combineSkill = skill1 + " " + skill2;

        setDetails({
          ...candidate_details,
          name: name,
          email: mail,
          skills: combineSkill,
          mobile: phone,
        });
      } else {
        // console.log(response.statusText);
        toast.error(
          "Unable to Parse the uploaded resume. Please change it or enter details manually.",
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(
        "Unable to Parse the uploaded resume. Please change it or enter details manually.",
      );
    }
  };

  const handleButtonClick = () => {
    if (showDuplicate1 && duplicate.length > 0) {
      setShowDuplicate1(false);
      setwaitForSubmission(false);
    } else {
      // Proceed with adding the candidate
      confirmAddCandidate();
    }
  };
  return (
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
            id={"confirmSubmitWindowId"}
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
              // overflowY:'auto',
            }}
            animate={{ scale: 1 }}
            initial={{ scale: 0 }}
            transition={{ duration: 1 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ paddingTop: "0px" }}>Confirm the Submission</h3>

              <MdCancel onClick={handleCloseDetails} style={{ cursor: "pointer", height: "30px", width: "30px" }} />

            </div>
            <div
              style={{
                width: "100%",
                height: "85%",
                overflowY: "auto",
              }}
            >
              <table id={"details"}>
                <tr id={"tr"}>
                  <th id={"th"}>Job ID:</th>
                  <td id={"td"}>{localStorage.path === "/AssignedRequirements" ||
                    localStorage.path === "/JobListing"
                    ? Number(location.state.id[0])
                    : Number(candidate_details.job_id)}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Name:</th>
                  <td id={"td"}>{candidate_details.name}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Mobile:</th>
                  <td id={"td"}>{candidate_details.mobile}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Email:</th>
                  <td id={"td"}>{candidate_details.email}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Client:</th>
                  <td id={"td"}>{location.state.client}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Current company:</th>
                  <td id={"td"}>{candidate_details.current_company}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Current job position:</th>
                  <td id={"td"}>{candidate_details.position}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Profile:</th>
                  <td id={"td"}>{profileValue}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Skills:</th>
                  <td id={"td"}>{candidate_details.skills}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Current job location:</th>
                  <td id={"td"}>{candidate_details.current_job_location}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Preferred job location:</th>
                  <td id={"td"}>{candidate_details.preferred_job_location}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Qualifications:</th>
                  <td id={"td"}>{candidate_details.qualifications}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Experience:</th>
                  <td id={"td"}>{candidate_details.total_experience_years}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Relevant Experience:</th>
                  <td id={"td"}>
                    {candidate_details.relevant_experience_years}
                  </td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Current CTC:</th>
                  <td id={"td"}>{candidate_details.current_ctc_value}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Expected CTC:</th>
                  <td id={"td"}>{candidate_details.expected_ctc_value}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Notice period:</th>
                  <td id={"td"}>{candidate_details.serving_notice_period}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Last working date:</th>
                  <td id={"td"}>{candidate_details.last_working_date}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Holding offer:</th>
                  <td id={"td"}>{candidate_details.holding_offer}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Total offers:</th>
                  <td id={"td"}>{candidate_details.total_offers}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Highest Package:</th>
                  <td id={"td"}>{candidate_details.highest_package}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Linkedin:</th>
                  <td id={"td"}>{candidate_details.linkedin}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Reason for job change:</th>
                  <td id={"td"}>{candidate_details.reason_for_job_change}</td>
                </tr>
                <tr id={"tr"}>
                  <th id={"th"}>Remarks:</th>
                  <td id={"td"}>{candidate_details.remarks}</td>
                </tr>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
                height: "32px",
              }}
            >
              {!waitForSubmission2 && (
                <button
                  style={{
                    padding: "6px",
                    backgroundColor: "gray",
                    border: "none",
                    color: "white",
                    width: "60px",
                    borderRadius: "5px",
                  }}
                  onClick={handleCloseDetails}
                >
                  Edit
                </button>
              )}
              {/* <button
                style={{
                  border: "none",
                  backgroundColor: "green",
                  color: "white",
                  marginLeft: "20px",
                  width: "80px",
                  borderRadius: "5px",
                  position: "relative",
                }}
                onClick={handleCloseNProceed}
              ></button> */}

              <button
                style={{
                  border: "none",
                  backgroundColor: "green",
                  color: "white",
                  marginLeft: "20px",
                  width: "80px",
                  borderRadius: "5px",
                  position: "relative",
                }}
                onClick={handleButtonClick}
              >
                {!waitForSubmission2 ? (
                  "Confirm"
                ) : (
                  <ThreeDots
                    wrapperClass="ovalSpinner"
                    wrapperStyle={{
                      position: "absolute",
                      top: "-4px",
                      left: "20px",
                    }}
                    visible={waitForSubmission2}
                    height="40"
                    width="40"
                    color="white"
                    ariaLabel="oval-loading"
                  />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <div className={`wrapper ${sidebarOpen ? "active" : ""}`}>
        <LeftNav />
        <div className="section">
          <TitleBar />
          <div
            style={{
              display: "flex",
              margin: "30px 0 5px",
              paddingLeft: "20px",
            }}
          >
            <button
              className="back-button"
              onClick={() => navigate(localStorage.getItem("path"))}
              style={{ marginTop: "2px" }}
              id="addcanbackbutton"
            >
              <FaArrowLeft />
            </button>
            <h5
              className="headingtwo"
              id="addcandidate"
              style={{ fontSize: "18px", marginLeft: "37%" }}
            >
              Add Candidate Details
            </h5>
          </div>
          <div className="addCandidateContainer">
            {/* <div className="addCandidatesubContainer"> */}
            <form
              className="addCandidateForm"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span> Job ID:
                </label>
                {localStorage.path === "/JobListing" ||
                  localStorage.path === "/AssignedRequirements" ? (
                  <input
                    className="input_style"
                    style={{ width: "100%" }}
                    type="text"
                    value={location.state.id[0]}
                  />
                ) : (
                  <select
                    className="input_style"
                    style={{ width: "100%" }}
                    onChange={handleJobId}
                    id="jobs"
                    name="job_id"
                    value={candidate_details.job_id}
                    required
                  >
                    <option value="" disabled>
                      Select a Job ID
                    </option>

                    {location.state?.id.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Name:
                </label>
                <input
                  className="input_style"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  value={candidate_details.name}
                  required
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Mobile:
                </label>
                <input
                  required
                  className="input_style"
                  type="text"
                  name="mobile"
                  style={{ width: "100%" }}
                  value={candidate_details.mobile}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Email:
                </label>
                <input
                  required
                  className="input_style"
                  name="email"
                  style={{ width: "100%" }}
                  value={candidate_details.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Client:
                </label>
                <input
                  required
                  className="input_style"
                  name="client"
                  style={{ width: "100%" }}
                  value={candidate_details.client}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Profile:
                </label>
                <input
                  readOnly
                  required
                  className="input_style"
                  onChange={handleChange}
                  name="profile"
                  value={
                    localStorage.getItem("path") === "/JobListing" ||
                      localStorage.getItem("path") === "/AssignedRequirements"
                      ? candidate_details.profile
                      : profileValue
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Skills:
                </label>
                <input
                  required
                  className="input_style"
                  onChange={handleChange}
                  value={candidate_details.skills}
                  name="skills"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Qualifications:
                </label>
                <input
                  required
                  value={candidate_details.qualifications}
                  className="input_style"
                  onChange={handleChange}
                  name="qualifications"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <label style={styles1}>Reason for Job Change:</label>
                {/* <input style={{width:'100%'}} /> */}
                <textarea
                  className="input_style"
                  style={{ width: "100%" }}
                  id="detailed_jd"
                  name="reason_for_job_change"
                  value={candidate_details.reason_for_job_change}
                  // value={formData.detailed_jd}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Resume:
                </label>
                <input
                  className="input_style"
                  style={{ width: "100%" }}
                  type="file"
                  name="resume"
                  id="jd_pdf"
                  accept=".pdf,.doc,.docx"
                  onChange={handleSubmitResume}
                />
                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
              </div>

              <div>
                <label style={styles1}>Current Company:</label>
                <input
                  className="input_style"
                  name="current_company"
                  onChange={handleChange}
                  value={candidate_details.current_company}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>Current Job Position:</label>
                <input
                  className="input_style"
                  name="position"
                  onChange={handleChange}
                  value={candidate_details.position}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>Current Job Location:</label>
                <input
                  className="input_style"
                  name="current_job_location"
                  onChange={handleChange}
                  value={candidate_details.current_job_location}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>Preferred Job Location:</label>
                <input
                  className="input_style"
                  name="preferred_job_location"
                  onChange={handleChange}
                  value={candidate_details.preferred_job_location}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Total Experience:
                </label>
                <div style={{ display: "flex", columnGap: "5px" }}>
                  <select
                    required
                    className="input_style"
                    type="number"
                    style={{ flex: 1 }}
                    id="jobs"
                    name="total_experience_years"
                    onChange={handleChange}
                    value={candidate_details.total_experience_years}
                  >
                    <option value="" disabled>
                      Select Years
                    </option>
                    {exp_yrs.map((val) => (
                      <option type="number" key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    className="input_style"
                    style={{ flex: 1 }}
                    id="jobs"
                    name="total_experience_months"
                    onChange={handleChange}
                    value={candidate_details.total_experience_months}
                  >
                    <option value="" disabled>
                      Select Months
                    </option>
                    {exp_months.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Relevant Experience:
                </label>
                <div style={{ display: "flex", columnGap: "5px" }}>
                  <select
                    required
                    className="input_style"
                    style={{ flex: 1 }}
                    id="jobs"
                    name="relevant_experience_years"
                    onChange={handleChange}
                    value={candidate_details.relevant_experience_years}
                  >
                    <option value="" disabled>
                      Select Years
                    </option>
                    {exp_yrs.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    className="input_style"
                    style={{ flex: 1 }}
                    id="jobs"
                    name="relevant_experience_months"
                    onChange={handleChange}
                    value={candidate_details.relevant_experience_months}
                  >
                    <option value="" disabled>
                      Select Months
                    </option>
                    {exp_months.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="JSS">
                <label htmlFor="current_ctc"  style={{fontWeight:"normal",fontSize:"13px"}}>
                  <span className="required-field">*</span>Current CTC:
                </label>
                <div className="currency-input">
                  <select
                    name="current_ctc_type"
                    onChange={handleChange}
                    required
                    className="input_style" // Add a class for styling
                    value={candidate_details.current_ctc_type}
                  >
                    <option value="INR">INR (LPA)</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>
                  </select>
                  <input
                    value={candidate_details.current_ctc_value}
                    type="number"
                    name="current_ctc_value"
                    onChange={handleChange}
                    className="large-input" // Add a class for styling
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="JSS">
                <label htmlFor="expected_ctc" style={{fontWeight:"normal",fontSize:"13px"}}>
                  <span className="required-field">*</span>Expected CTC:
                </label>
                <div className="currency-input">
                  <select
                    name="expected_ctc_type"
                    onChange={handleChange}
                    required
                    className="input_style" // Add a class for styling
                    value={candidate_details.expected_ctc_type}
                  >
                    <option value="INR">INR (LPA)</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>
                  </select>

                  <input
                    type="number"
                    name="expected_ctc_value"
                    value={candidate_details.expected_ctc_value}
                    onChange={handleChange}
                    className="large-input" // Add a class for styling
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Serving Notice
                  Period:
                </label>

                <select
                  required
                  className="input_style"
                  style={{ width: "100%" }}
                  name="serving_notice_period"
                  onChange={handleChange}
                  value={candidate_details.serving_notice_period}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="completed">completed</option>
                </select>
                {candidate_details.serving_notice_period === "yes" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "6px",
                    }}
                  >
                    <div style={{}}>
                      <label style={styles1}>
                        <span style={{ color: "red" }}>*</span>Last Working
                        Date:{" "}
                      </label>
                      <input
                        type="date"
                        name="last_working_date"
                        id="last_working_date"
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "4px", height: "28px" }}
                        value={candidate_details.last_working_date}
                      />
                    </div>

                    <div style={{}}>
                      <label style={styles1}>Buyout:</label>
                      <input
                        style={{ height: "25px", width: "25px" }}
                        name="buyout"
                        type="checkbox"
                        onChange={handleChange}
                        value={candidate_details.buyout}
                      />
                    </div>
                  </div>
                ) : candidate_details.serving_notice_period === "no" ? (
                  <div
                    style={{
                      display: "flex",
                      marginTop: "6px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{}}>
                      <label style={styles1}>
                        <span style={{ color: "red" }}>*</span>Notice period:{" "}
                      </label>
                      <select
                        onChange={handleChange}
                        name="period_of_notice"
                        value={candidate_details.period_of_notice}
                      >
                        <option value="">any</option>
                        <option value="0-15 days">0-15 days</option>
                        <option value="1 Month">1 Month</option>
                        <option value="2 Months">2 Months</option>
                        <option value="3 Months">3 Months</option>
                        <option value="More than 3 Months">
                          More than 3 Months
                        </option>
                      </select>
                    </div>
                    <div style={{}}>
                      <label style={styles1}>Buyout:</label>
                      <input
                        style={{ height: "25px", width: "25px" }}
                        name="buyout"
                        type="checkbox"
                        onChange={handleChange}
                        value={candidate_details.buyout}
                      />
                    </div>
                  </div>
                ) : (
                  <div> </div>
                )}
              </div>
              <div>
                <label style={styles1}>
                  <span style={{ color: "red" }}>*</span>Holding Offer:
                </label>
                <select
                  required
                  className="input_style"
                  style={{ width: "100%" }}
                  name="holding_offer"
                  onChange={handleChange}
                  value={candidate_details.holding_offer}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="pipeline">pipeline</option>
                </select>

                {candidate_details.holding_offer === "yes" ? (
                  <div
                    style={{
                      display: "flex",
                      marginTop: "6px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{}}>
                      <label style={styles1}>
                        <span style={{ color: "red" }}>*</span>Total Offers:
                      </label>
                      <input
                        type="number"
                        required
                        name="total_offers"
                        onChange={handleChange}
                        style={{ borderRadius: "4px", height: "28px" }}
                        value={candidate_details.total_offers}
                      />
                    </div>

                    <div style={{}}>
                      <label style={styles1}>
                        <span style={{ color: "red" }}>*</span>Highest Package
                        in LPA:
                      </label>
                      <input
                        type="number"
                        name="highest_package"
                        required
                        onChange={handleChange}
                        style={{ borderRadius: "4px", height: "28px" }}
                        value={candidate_details.highest_package}
                      />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div>
                <label style={styles1}>LinkedIn url:</label>
                <input
                  className="input_style"
                  name="linkedin"
                  onChange={handleChange}
                  value={candidate_details.linkedin}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={styles1}>Remarks:</label>
                <input
                  className="input_style"
                  name="remarks"
                  value={candidate_details.remarks}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <input
                ref={hidden_ref}
                type="submit"
                style={{ display: "none" }}
              />
            </form>
            {/* </div> */}
          </div>
          <div
            className="addCandidateButton"
            style={{ position: "relative", marginTop: "5px" }}
          >
            <input
              onClick={() => {
                // console.log('clicked')
                hidden_ref.current.click();
              }}
              type="submit"
              value={waitForSubmission ? "" : "Submit"}
              id="addCandidateSubmit"
              disabled={waitForSubmission}
            />
            <ThreeDots
              wrapperClass="ovalSpinner"
              wrapperStyle={{ position: "absolute" }}
              visible={waitForSubmission}
              height="45"
              width="45"
              color="white"
              ariaLabel="oval-loading"
            />
          </div>
        </div>
      </div>
      <Modal1
        showDuplicate1={showDuplicate1}
        handleCloseNProceed={handleCloseNProceed}
        duplicate={duplicate}
        setShowDuplicate1={setShowDuplicate1}
        setwaitForSubmission={setwaitForSubmission}
      />

      <Modal2
        showDuplicate2={showDuplicate2}
        duplicateCandidate={duplicateCandidate}
        setShowDuplicate2={setShowDuplicate2}
        setwaitForSubmission={setwaitForSubmission}
      />
    </>
  );
}
export default AddCandidate;
