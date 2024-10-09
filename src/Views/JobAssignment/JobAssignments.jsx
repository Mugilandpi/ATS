
import React, { useEffect, useRef, useState } from "react";
 
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "./jobassignment.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setAllJobs } from "../../store/slices/jobSlice";
import { useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import Multiselect from "multiselect-react-dropdown";
import { ThreeDots } from "react-loader-spinner";
 
import { getAllJobs } from "../utilities.js";
 
function JObAssignment() {
  const [disableFreeze, setDisableFreeze] = useState(false);
 
  const openRef = useRef();
  const dispatch = useDispatch();
  const option_ref = useRef();
  const navigate = useNavigate();
  const [showRecruiters, setShowRecruiters] = useState(1);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const hidden_ref = useRef();
  const jd_ref = useRef(null);
  const [show, setShow] = useState(true);
  const [recruiters, setRecruiters] = useState([]);
  const initialState = {
    client: "",
    role: "",
    skills: "",
    location: "",
    Job_Type: "",
    mode: "",
    Job_Type_details: "",
    experience_min: "",
    experience_max: "",
    budget_min: "",
    currency_type_min: "INR",
    budget_max: "",
    currency_type_max: "INR",
    shift_timings: "",
    notice_period: "",
    job_status: "",
    recruiter: [],
    detailed_jd: "",
    jd_pdf: null,
  };
  const [formData, setFormData] = useState(initialState);
 
  //   useEffect(() => {
  //     console.log(showRecruiters);
  //   }, [showRecruiters]);
 
  useEffect(() => {
    // console.log(showRecruiters);
    // console.log("1");
    if (
      recruiters.length > 1 &&
      !recruiters.includes("Select All") &&
      formData.recruiter.length !== recruiters.length
    ) {
      // console.log("3");
      setRecruiters((prev) => ["Select All", ...prev]);
    }
  }, [recruiters]);
 
  const handleChangeRecruiter = (selectedList) => {
    let selectAll = false;
    if (
      recruiters.includes("Select All") &&
      selectedList.length === recruiters.length - 1
    ) {
      selectAll = true;
    }
    selectedList.map((item) => {
      if (item.name === "Select All") {
        selectAll = true;
      }
    });
 
    let selectedRecruiters = [];
    if (
      selectAll ||
      selectedList.map((item) => item.name).includes("Select All")
    ) {
      selectedRecruiters.push(...recruiters.slice(1));
      setRecruiters((prev) => [...prev.slice(1)]);
    } else {
      selectedRecruiters.push(...selectedList.map((item) => item.name));
      if (!recruiters.includes("Select All")) {
        setRecruiters((prev) => ["Select All", ...prev]);
      }
    }
 
    // if((recruiters.includes("Select All") && recruiters.length===selectedRecruiters.length+1)
    //    ){
    //    setRecruiters((prev) => [...prev.slice(1)]);
    //  }
 
    // console.log("udpaetd recruiters",  [...recruiters.slice(1)])
    // console.log("recruiters", recruiters);
    // console.log("selectedList", selectedList);
    // console.log("selectedList len", selectedList.length);
    // console.log("selectedRecruiters", selectedRecruiters);
    setFormData({
      ...formData,
      recruiter: [...selectedRecruiters],
    });
 
    // setShowRecruiters(selectedRecruiters.length > 0 ? 3 : 1);
  };
 
  // useEffect(() => {
  //   const handleClick = (e) => {
  //     if (option_ref.current && !option_ref.current.contains(e.target)) {
  //       setShowRecruiters(formData.recruiter.length > 0 ? 3 : 1);
  //     }
  //   };
  //   window.addEventListener("click", handleClick);
  //   return () => {
  //     window.removeEventListener("click", handleClick);
  //   };
  // }, [formData.recruiter]);
 
  const { recruiters: rdxRecruiters, managers } = useSelector(
    (state) => state.userSliceReducer,
  );
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let arr = [];
        for (const item of rdxRecruiters) {
          if (item["is_active"] && item["is_verified"]) {
            arr.push(item["name"]);
          }
        }
        setRecruiters([...arr]);
      } catch (err) {
        console.error("Error fetching users:", err); // Log any errors
      }
    };
 
    fetchUsers(); // Call the fetch function inside useEffect
  }, [rdxRecruiters]);
console.log(recruiters,"allrecruiters")
  const [waitForSubmission, setwaitForSubmission] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name != "recruiter")
      setFormData({ ...formData, [name]: value });
    else {
      let recruiter_data = [];
      recruiter_data.push(e.target.value);
      setFormData({ ...formData, recruiter: recruiter_data });
    }
  };
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
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
    });
  };
  const notify = () => toast.success("submitted successfully");
 
  const notifySelectRecruiter = () =>
    toast.error("Select atleast one recruiter");
 
  const handleSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
 
      if (
        parseFloat(formData.experience_min) >
        parseFloat(formData.experience_max)
      ) {
        toast.warn("Minimum experience must be less than maximum experience");
        setwaitForSubmission(false);
        return;
      }
 
      if (
        parseFloat(formData.budget_min) >
        parseFloat(formData.budget_max)
      ) {
        toast.warn("Minimum Budget must be less than maximum Budget");
        setwaitForSubmission(false);
        return;
      }
 
      if (formData.recruiter?.length === 0) {
        notifySelectRecruiter();
        setwaitForSubmission(false);
        return;
      }
 
      if (disableFreeze) {
        setwaitForSubmission(false);
        return;
      }
      setDisableFreeze(true);
 
      try {
        const base64String = await fileToBase64(selectedFile);
          console.log("Base64 String:"); // Add this line for debugging
        const body_data = {
          user_id: localStorage.getItem("user_id"),
          client: formData.client,
          experience_min: formData.experience_min,
          experience_max: formData.experience_max,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          currency_type_min: formData.currency_type_min,
          currency_type_max: formData.currency_type_max,
          location: formData.location,
          shift_timings: formData.shift_timings,
          notice_period: formData.notice_period,
          role: formData.role,
          detailed_jd: formData.detailed_jd,
          jd_pdf: base64String,
          mode: formData.mode,
          job_status: formData.job_status,
          Job_Type: formData.Job_Type,
          Job_Type_details: formData.Job_Type_details,
          skills: formData.skills,
          recruiter: formData.recruiter,
          no_of_positions : formData.no_of_positions,
        };
        console.log("job post Request Body:", body_data); // Add this line for debugging
 
        const response = await fetch(
            "http://144.126.254.255/post_job", {
        // "/api/post_job", {
          method: "POST",
          // mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body_data),
        });
 
        console.log(response, "response", body_data);
 
        const data = await response.json();
        console.log("data", data);
 
        if (data.status === "success") {
          // setDashboardDatas();
          getAllJobs().then(() => {
            toast.success(data.message);
            setwaitForSubmission(false);
            navigate("/JobListing");
          // console.log("calling send maisl endpoint")
            fetch(
               'http://144.126.254.255/send_notifications', {
              //'/api/send_notifications', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ job_post_id: data.job_post_id })
            });
          });
         
        } else {
          console.log(response.statusText);
          toast.error(data.message);
          setwaitForSubmission(false);
        }
      } catch (err) {
        console.log("handle error", err);
        toast.error("An error occured, try again");
        setwaitForSubmission(false);
      }
    }
  };
 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
 
  const [marginTopForDetailJD, setmarginTopForDetailJD] = useState("-40px");

  useEffect(() => {
    const sourceElement = document.getElementsByClassName("searchWrapper")[0];
    const targetElement = document.getElementById("detailedJdInput");
 
    if (sourceElement && targetElement) {
      const updateMarginTop = () => {
        const computedHeight = parseInt(window.getComputedStyle(sourceElement).height, 10);
        const screenWidth = window.innerWidth;
        if (screenWidth <= 542) {
          setmarginTopForDetailJD(`${computedHeight + 10}px`); // Set margin top to 30px for mobile view
        } else {
          setmarginTopForDetailJD(`${computedHeight - 40}px`); // Subtract 20px from the computed height for larger screens
        }
      };
 
      updateMarginTop();
 
      const resizeObserver = new ResizeObserver(() => {
        updateMarginTop();
      });
 
      resizeObserver.observe(sourceElement);
 
      return () => {
        resizeObserver.unobserve(sourceElement);
      };
    }
  }, []);

 
  useEffect(() => {
    const targetElement = document.getElementById("targetElement");
    if (targetElement) {
      targetElement.style.marginTop = marginTopForDetailJD;
    }
  }, [marginTopForDetailJD]);
 
  const set2 = new Set();
 
  const inputRef = useRef(null);
 
  const set1 = new Set();
 
  const [inputValue, setInputValue] = useState("");
  const { jobs } = useSelector((state) => state.jobSliceReducer);
 
  const [clients, setclients] = useState([])
  const [roles, setroles] = useState([])
 
  useEffect(()=> {
    const clients = jobs
    .filter((job) => job.job_status.toLowerCase() === "active")
    .filter((job) => {
      if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
        return false;
      } else {
        set1.add(job.client);
        return true;
      }
    })
    .map((job) => job.client);
    console.log("all clients", clients)
    setclients(clients)
 
    const roles = jobs
    .filter((job) => {
      if (set2.has(job.role) || set2.has(job.role?.toLowerCase())) {
        return false;
      } else {
        set2.add(job.role);
        return true;
      }
    })
    .map((job) => job.role);
 
    console.log("all roles", roles)
    setroles(roles)
  },[jobs])
 
 
 
  const [showDropdown1, setShowDropdown1] = useState(false);
  const inputRef1 = useRef(null);
  const [inputValue1, setInputValue1] = useState("");
  const [filteredRoles, setFilteredRoles] = useState(()=> {
    if(roles.length===0){
      return ["Fetching role names..."]
    }else{
      return roles
    }
  });
 
  useEffect(()=>{
    setFilteredRoles(roles)
  }),[roles]
 
  useEffect(() => {
    setFilteredRoles(prev => {
      let fltrdroles = roles.filter((role) =>
        role.toLowerCase().includes(inputValue1?.toLowerCase()),
      )
      console.log("fltrdroles", fltrdroles)
      if(fltrdroles.length>0){
        return fltrdroles
      }else{
        return ["You are adding new role"]
      }
  });
  }, [inputValue1]);
 
 
 
  const [filteredClients, setFilteredClients] = useState(()=>{
    if(clients.length===0){
      return ["Fetching client names..."]
    }else{
      return clients
    }
  });
 
 
  useEffect(()=>{
    console.log("settign clints in suefff")
    setFilteredClients(clients)
  }),[clients]
 
 
  const [showDropdown, setShowDropdown] = useState(false);
 
  useEffect(() => {
 
    setFilteredClients(prev => {
     
      let fltrdclients = clients.filter((client) =>
        client.toLowerCase().includes(inputValue?.toLowerCase()),
      )
     
      console.log("fltrdclients", fltrdclients)
      if(fltrdclients.length>0){
        return fltrdclients
      }else{
        return ["You are adding a new client"]
      }
    });
  }, [inputValue]);
 
  useEffect(() => {
    formData.client = inputValue;
    console.log(formData.client);
  }, [inputValue]);
 
  const handleFocus = () => {
    setShowDropdown(true);
  };
 
  const handleSelectClient = (name) => {
    setInputValue(name);
    setShowDropdown(false);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setShowDropdown(true);
  };
 
  const handleBlur = () => {
    // Delay to allow selection click
    setTimeout(() => setShowDropdown(false), 100);
  };
 
  useEffect(() => {
    formData.role = inputValue1;
    console.log(formData.role);
  }, [inputValue1]);
 
  const handleFocus1 = () => {
    setShowDropdown1(true);
  };
 
  const handleSelectRole = (name) => {
    setInputValue1(name);
    setShowDropdown1(false);
  };
  const handleInputChange1 = (event) => {
    setInputValue1(event.target.value);
    setShowDropdown1(true);
  };
 
  const handleBlur1 = () => {
    // Delay to allow selection click
    setTimeout(() => setShowDropdown1(false), 100);
  };
 
  // const marginTopForDetailJD = window.getComputedStyle(document.getElementsByClassName("searchWrapper")[0]).height;
 
  return (
    <div className={`wrapper ${sidebarOpen ? "active" : ""}`}>
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div
          style={{ paddingLeft: "20px",
          margin:"40px 0 10px",
           textAlign:"center" }}
        >
          <h3 className="headingtwo" style={{ }}>
            Job Posting
          </h3>
        </div>
        <div className="jobassigncont">
          <form
            className="forms_JA"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="group">
              <div className="JS">
                <label>
                  <span className="required-field">*</span>Client:
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={inputRef}
                  placeholder="Select an Existing Client or Enter New Client"
                  required
                />
                {showDropdown && (
                  <ul
                    style={{
                      listStyleType: "none",
                      padding: 0,
                      marginTop: "50px",
                      border: "1px solid #ccc",
                      position: "absolute",
                      zIndex: 1,
                      width: inputRef.current
                        ? inputRef.current.offsetWidth
                        : "100%",
                      maxHeight: "150px",
                      overflowY: "auto",
                      backgroundColor: "#F0F8FF",
                    }}
                  >
                      {clients.length===0 ? (
                        <li style={{ padding: "8px", fontSize: "13px" }}>
                      Fetching client names...
                      </li>
                      ) : (clients.filter((client) =>
                              client.toLowerCase().includes(inputValue?.toLowerCase()),
                            ).length > 0 ? (
                              clients.filter((client) =>
                              client.toLowerCase().includes(inputValue?.toLowerCase()),
                            ).map((client, ind) => (
                            <li
                              key={ind}
                              onMouseDown={() => handleSelectClient(client)}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                fontSize: "13px",
                              }}
                            >
                              {client}
                            </li>
                          ))
                        ) : (
                          <li style={{ padding: "8px", fontSize: "13px" }}>
                          You are adding a new client
                          </li>
                        )
                    )}
                  </ul>
                )}
              </div>
              {/* Role */}
              <div className="JS">
                <label>
                  <span className="required-field">*</span>Role:
                </label>
                <input
                  type="text"
                  value={inputValue1}
                  onChange={handleInputChange1}
                  onFocus={handleFocus1}
                  onBlur={handleBlur1}
                  ref={inputRef1}
                  placeholder="Select an Existing Role or Enter a New Role"
                  required
                />
                {showDropdown1 && (
                  <ul
                    style={{
                      listStyleType: "none",
                      padding: 0,
                      marginTop: "50px",
                      border: "1px solid #ccc",
                      position: "absolute",
                      zIndex: 1,
                      width: inputRef1.current
                        ? inputRef.current.offsetWidth
                        : "100%",
                      maxHeight: "150px",
                      overflowY: "auto",
                      backgroundColor: "#F0F8FF",
                    }}
                  >
                    { roles.length===0 ? (
                      <li style={{ padding: "8px", fontSize: "13px" }}>
                      Fetching role names...
                      </li>
                    ) : (roles.filter((role) =>
                      role.toLowerCase().includes(inputValue1?.toLowerCase()),
                    ).length > 0 ? (
                      roles.filter((role) =>
                      role.toLowerCase().includes(inputValue1?.toLowerCase()),
                    ).map((role, ind) => (
                        <li
                          key={ind}
                          onMouseDown={() => handleSelectRole(role)}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          {role}
                        </li>
                      ))
                    ) : (
                      <li style={{ padding: "8px", fontSize: "13px" }}>
                      You are adding new role
                      </li>
                    )
                )}
                  </ul>
                )}
              </div>
              {/* Skills */}
              <div className="JS">
                <label htmlFor="skills">
                  <span className="required-field">*</span>Skills:
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-control"
                  required // Input is required
                />
                <small></small>
              </div>
 
                {/* No Of Positions */}
              <div className="JS">
                <label htmlFor="no_of_positions">
                  <span className="required-field">*</span>No Of Positions:
                </label>
                <input
                  type="text"
                  id="no_of_positions"
                  name="no_of_positions"
                  value={formData.no_of_positions}
                  onChange={handleChange}
                  className="form-control"
                  required // Input is required
                />
                <small></small>
              </div>
 
              {/* Location */}
              <div className="JS">
                <label htmlFor="location">
                  <span className="required-field">*</span>Location:
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                  required // Input is required
                />
                <small></small>
              </div>
 
              <div className="JS">
                <label htmlFor="Job_Type">
                  <span className="required-field">*</span>Job Type:
                </label>
                <select
                  id="Job_Type"
                  name="Job_Type"
                  value={formData.Job_Type}
                  onChange={handleChange}
                  className="form-select"
                  required // Input is required
                >
                  <option value="" disabled>
                    Select Job Type
                  </option>
                  <option value="Permanent with the client">
                    Permanent with the client
                  </option>
                  <option value="Permanent with Makonis">
                    Permanent with Makonis
                  </option>
                  <option value="Contract">Contract</option>
                </select>
                <small></small>
                {formData.Job_Type === "Contract" && (
                  <span style={{ display: "flex", marginTop: "10px" , justifyContent:"space-around"}}>
                    <label
                      htmlFor="Job_Type_details"
                      style={{ fontSize: "12px", paddingTop: "5px" }}
                    >
                      <span className="required-field">*</span>Contract in
                      months:
                    </label>
                    <input
                      type="number"
                      id="Job_Type_details"
                      name="Job_Type_details"
                      value={formData.Job_Type_details}
                      onChange={handleChange}
                      className="form-control"
                      required // Input is required
                      style={{
                        width: "60%",
                        paddingLeft: "5px",
                        marginLeft: "7px",
                      }}
                    />
                    <small></small>
                  </span>
                )}
              </div>
 
              <div
                className="JS"
                style={{
                  marginTop: formData.Job_Type === "Contract" ? "-35px" : "0",
                }}
              >
                <label htmlFor="mode">
                  <span className="required-field">*</span>Mode of Work:
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="form-select"
                  required // Input is required
                >
                  <option value="" disabled>
                    Select Mode of Work
                  </option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="WFO">WFO</option>
                  <option value="WFH">WFH</option>
                </select>
                <small></small>
              </div>
 
              {/* Experience Min */}
              <div className="JS">
                <label htmlFor="experience_min">
                  <span className="required-field">*</span>Minimum Experience:
                </label>
                <input
                  type="number"
                  id="experience_min"
                  name="experience_min"
                  value={formData.experience_min}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Numerics"
                  min="0"
                  step="0.1"
                  required // Input is required
                />
                <small></small>
              </div>
 
              {/* Experience Max */}
              <div className="JS">
                <label htmlFor="experience_max">
                  <span className="required-field">*</span>Maximum Experience:
                </label>
                <input
                  type="number"
                  id="experience_max"
                  name="experience_max"
                  value={formData.experience_max}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Numerics"
                  min="0"
                  step="0.1"
                  required // Input is required
                />
                <small></small>
              </div>
 
              {/* Budget Min */}
              <div className="JS">
                <label htmlFor="budget_min">
                  <span className="required-field">*</span>Minimum Budget:
                </label>
                <div className="currency-input">
                  <select
                    id="currency_type_min"
                    name="currency_type_min"
                    value={formData.currency_type_min}
                    onChange={handleChange}
                    required // Input is required
                    className="small-select" // Add a class for styling
                  >
                    <option value="INR">INR (LPA)</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>
                  </select>
                  <input
                    type="number"
                    id="budget_min"
                    name="budget_min"
                    value={formData.budget_min}
                    onChange={handleChange}
                    className="large-input" // Add a class for styling
                    placeholder="Numerics"
                    min="0"
                    step="0.1"
                    required // Input is required
                  />
                </div>
              </div>
 
              {/* Budget Max */}
              <div className="JS">
                <label htmlFor="budget_max">
                  <span className="required-field">*</span>Maximum Budget:
                </label>
                <div className="currency-input">
                  <select
                    id="currency_type_max"
                    name="currency_type_max"
                    value={formData.currency_type_max}
                    onChange={handleChange}
                    required // Input is required
                    className="small-select" // Add a class for styling
                  >
                    <option value="INR">INR (LPA)</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>
                  </select>
                  <input
                    type="number"
                    id="budget_max"
                    name="budget_max"
                    value={formData.budget_max}
                    onChange={handleChange}
                    className="large-input" // Add a class for styling
                    placeholder="Numerics"
                    min="0"
                    step="0.1"
                    required // Input is required
                  />
                </div>
                <small></small>
              </div>
 
              {/* Shift Timings */}
              <div className="JS">
                <label htmlFor="shift_timings">
                  <span className="required-field">*</span>Shift Timings:
                </label>
                <select
                  id="shift_timings"
                  name="shift_timings"
                  value={formData.shift_timings}
                  onChange={handleChange}
                  className="form-select"
                  required // Input is required
                >
                  <option value="" disabled>
                    Select Shift Timings
                  </option>
                  <option value="General">General</option>
                  <option value="Rotational">Rotational</option>
                </select>
                <small></small>
              </div>
 
              {/* Notice Period */}
              <div className="JS">
                <label htmlFor="notice_period">
                  <span className="required-field">*</span>Notice Period:
                </label>
                <input
                  type="text"
                  id="notice_period"
                  name="notice_period"
                  value={formData.notice_period}
                  onChange={handleChange}
                  className="form-control"
                  required // Input is required
                />
                <small></small>
              </div>
 
              {/* Job Status */}
              <div className="JS">
                <label htmlFor="job_status">
                  <span className="required-field">*</span>Job Status:
                </label>
                <select
                  id="job_status"
                  name="job_status"
                  value={formData.job_status}
                  onChange={handleChange}
                  className="form-select"
                  required // Input is required
                >
                  <option value="" disabled>
                    Select Job Status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Hold">Hold</option>
                </select>
                <small></small>
              </div>
 
              {/* Recruiter */}
              <div style={{ height: "auto", width: "100%" }} className="JS">
                <label htmlFor="jd_pdf">Detailed JD :</label>
                <input
                  // style={{ width: "100%" }}
                  type="file"
                  name="jd_pdf"
                  id="jd_pdf"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {/* Display the selected file name */}
                {selectedFile && (
                  <p style={{ textAlign: "left", marginBottom: "0px" }}>
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>
 
              {/* Recruiter */}
              <div className="JS" style={{ width: "50%" }}>
                <div style={{ marginTop: "-30px" }} className="JSrecruiter">
                  <label htmlFor="recruiter">
                    <span className="required-field">*</span>Recruiter
                  </label>
                </div>
                <div className="recruiter-selection">
                  <Multiselect
                    options={recruiters.map((item) => ({ name: item }))} // Convert recruiters array into format required by Multiselect
                    selectedValues={formData.recruiter.map((item) => ({
                      name: item,
                    }))} // Convert selected recruiters into format required by Multiselect
                    onSelect={handleChangeRecruiter}
                    onRemove={handleChangeRecruiter}
                    displayValue="name"
                    style={{
                      searchWrapper: { minHeight: "10px", overflowX: "auto", whiteSpace: "nowrap",padding:"2px"  },
                      multiselectContainer: {},
                    }} // Adjust width as needed
                    placeholder="Select recruiters"
                    className="custom-multiselect"
                  />
                </div>
              </div>
              <div
                id="detailedJdInput"
                style={{
                  height: "70px",
                  width: "100%",
                  marginTop: marginTopForDetailJD,
                }}
              >
                <label htmlFor="detailed_jd">Detailed Job Description:</label>
                <textarea
                  style={{ width: "100%" }}
                  ref={jd_ref}
                  id="detailed_jd"
                  name="detailed_jd"
                  value={formData.detailed_jd}
                  onChange={handleChange}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData("text/plain");
                    // Append pasted text preserving the table structure
                    const updatedText = formData.detailed_jd + pastedText;
                    handleChange(updatedText);
                    e.preventDefault(); // Prevent the default paste action
                  }}
                ></textarea>
              </div>
            </div>
 
            {/* Submit Button */}
            <input
              ref={hidden_ref}
              style={{ visibility: "hidden" }}
              type="submit"
              value="Submit"
              id="submits"
            />
            {/* <div className="buttons">
        <input type="submit" value="Submit" id="submits" />
    </div> */}
          </form>
          {/* Submit Button */}
        </div>
        <div className="buttons_addjob">
          <input
            onClick={() => {
              console.log("clicked");
              hidden_ref?.current?.click();
            }}
            type="submit"
            value={waitForSubmission ? "" : "Submit"}
            id="submits_addjob"
            disabled={waitForSubmission}
          />
          <ThreeDots
            wrapperClass="ovalSpinner"
            wrapperStyle={{ position: "absolute", bottom: "10px" }}
            visible={waitForSubmission}
            height="45"
            width="45"
            color="white"
            ariaLabel="oval-loading"
          />
        </div>
      </div>
    </div>
  );
}
export default JObAssignment;
 
 