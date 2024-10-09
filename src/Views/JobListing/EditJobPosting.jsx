import React, { useEffect, useRef, useState } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "../JobListing/editjobposting.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Multiselect from "multiselect-react-dropdown";
import { getAllJobs, getDashboardData } from "../utilities";
import { ThreeDots } from "react-loader-spinner";

function EditJobPosting() {
  const dispatch = useDispatch();
  const option_ref = useRef();
  const openRef = useRef();
  const { activeUsers } = useSelector((state) => state.userSliceReducer);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  // console.log(activeUsers)
  const [showRecruiters, setShowRecruiters] = useState(1);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const location = useLocation();
  const loc = location.state.item;
  // console.log("loc", loc);
  const navigate = useNavigate();
  const jd_ref = useRef(null);
  const [show, setShow] = useState(true);
  const [recruiters, setRecruiters] = useState([]);
  const [budget_min_type, budget_min_value] = loc.budget_min.split(" ");
  const [budget_max_type, budget_max_value] = loc.budget_max.split(" ");
  const initialState = {
    client: loc.client,
    role: loc.role,
    skills: loc.skills,
    location: loc["location"],
    Job_Type: loc.job_type,
    mode: loc.mode,
    Job_Type_details: loc.contract_in_months,
    experience_min: loc.experience_min,
    experience_max: loc.experience_max,
    no_of_positions:loc.no_of_positions,
    budget_min_type,
    budget_min_value,
    budget_max_type,
    budget_max_value,
    // budget_min: loc.budget_min.split(" ")[1],
    // currency_type_min: loc.budget_min.split(" ")[0],
    // budget_max: loc.budget_max.split(" ")[1],
    // currency_type_max: loc.budget_max.split(" ")[0],
    shift_timings: loc.shift_timings,
    notice_period: loc.notice_period,
    job_status: loc.job_status,
    recruiter: loc.recruiter.split(", "),
    detailed_jd: loc.detailed_jd,
    jd_pdf: null,
  };
  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    console.log("edint formData", formData);
  }, [formData]);

  useEffect(() => {
    const handleClick = (e) => {
      console.log("found click");
      if (option_ref?.current?.contains(e.target)) {
        setShowRecruiters(2);
        return;
      }
      if (showRecruiters === 2) {
        if (!option_ref?.current?.contains(e.target)) {
          console.log("matched");
          if (formData.recruiter.length === 0) {
            setShowRecruiters(1);
          } else {
            setShowRecruiters(3);
          }
        } else {
          console.log("not matched");
        }
      }
      // else{
      //     if(option_ref.current.contains(e.target)){
      //         setShowRecruiters(2)
      //     }
      // }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  const { recruiters: rdxRecruiters, managers } = useSelector(
    (state) => state.userSliceReducer,
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let arr = [];
        for (const item of rdxRecruiters) {
          if (item["is_active"] && item["is_verified"]) {
            arr.push(item["username"]);
          }
        }
        setRecruiters([...arr]);
      } catch (err) {
        console.error("Error fetching users:", err); // Log any errors
      }
    };
    fetchUsers(); // Call the fetch function inside useEffect
  }, [rdxRecruiters]);

  const [marginTopForDetailJD, setmarginTopForDetailJD] = useState("0");

  useEffect(() => {
    const sourceElement = document.getElementsByClassName("searchWrapper")[0];
    const targetElement = document.getElementById("detailedJdInput");

    if (sourceElement && targetElement) {
      const updateMarginTop = () => {
        const computedHeight = window.getComputedStyle(sourceElement).height;
        setmarginTopForDetailJD(computedHeight);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    if (e.target.name != "recruiter")
      setFormData({ ...formData, [name]: value });
    else {
      let recruiter_data = [];
      recruiter_data.push(e.target.value);
      // setFormData({...formData,recruiter:recruiter_data})
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
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, jd_pdf: file });
  };

  const notify = () => toast.success("submitted successfully");

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
        parseFloat(formData.budget_min_value) >
        parseFloat(formData.budget_max_value)
      ) {
        toast.warn("Minimum Budget must be less than maximum Budget");
        setwaitForSubmission(false);
        return;
      }

      // Ensure that jd_pdf is properly set in formData
      const base64String = await fileToBase64(formData.jd_pdf);

      const body_data = {
        user_id: localStorage.getItem("user_id"),
        client: formData.client,
        experience_min: formData.experience_min,
        experience_max: formData.experience_max,
        currency_type_min: formData.currency_type_min,
        currency_type_max: formData.currency_type_max,
        budget_min: `${formData.budget_min_type} ${formData.budget_min_value}`,
        budget_max: `${formData.budget_max_type} ${formData.budget_max_value}`,
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
        no_of_positions:formData.no_of_positions
      };

      const job_id = loc.id;
      console.log("body_data", body_data);

      try {
        const response = await fetch(
          `https://ats-9.onrender.com/edit_job_post/${job_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body_data),
          },
        );

        const data = await response.json();
        console.log("data", data)
        if (data.status === "success") {
          // console.log("response data", data);
          // setFormData(initialState);
          getDashboardData();
          getAllJobs().then(() => {
            toast.success(data.message);
            navigate("/JobListing");

            fetch('https://ats-9.onrender.com/send_edit_notifications', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                job_post_id: data.job_post_id,
                    old_recruiter_usernames: data.old_recruiter_usernames,
                    new_recruiter_usernames: data.new_recruiter_usernames
               })
            });
          });
        } else {
          console.log(response.statusText);
          toast.error(data.message);
          setwaitForSubmission(false);
        }
      } catch (err) {
        console.log("handle error", err);
        setwaitForSubmission(false);
        toast.error("An Error Occurred Please Try Again Later");
      }
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // console.log(showRecruiters);
    console.log("1");
    if (
      recruiters.length > 1 &&
      !recruiters.includes("Select All") &&
      formData.recruiter.length !== recruiters.length
    ) {
      console.log("3");
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
    // console.log("udpaetd recruiters",  [...recruiters.slice(1)])
    console.log("recruiters", recruiters);
    console.log("selectedList", selectedList);
    console.log("selectedList len", selectedList.length);
    console.log("selectedRecruiters", selectedRecruiters);
    setFormData({
      ...formData,
      recruiter: [...selectedRecruiters],
    });
    // setShowRecruiters(selectedRecruiters.length > 0 ? 3 : 1);
  };

  useEffect(() => {
    localStorage.setItem("path", location.state.path);
  }, []);
  return (
    <div className={`wrapper ${sidebarOpen ? "active" : ""}`}>
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div
          style={{  }}
          className="editjobpost"
        >
          <button
            className="back-button"
            onClick={() => navigate("/JobListing")}
            style={{ marginTop: "4px" }}
          >
            <FaArrowLeft />
          </button>
          <h3 className="headingtwo3" style={{ paddingLeft: "37%" }}>
            Edit Job Posting
          </h3>
        </div>
        <div className="Container">
          <form className="forms" encType="multipart/form-data">
            <div className="group">
              <div className="JS">
                <label htmlFor="client">
                  <span className="required-field">*</span>Client:
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Select Existing Client or Enter New Client"
                  className="form-control"
                  list="clients"
                  autoComplete="off"
                />
                <datalist id="clients">{/* Options */}</datalist>
                <small></small>
              </div>

              {/* Role */}
              <div className="JS">
                <label htmlFor="role">
                  <span className="required-field">*</span>Role:
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                />
                <small></small>
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
                  <span style={{ display: "flex", marginTop: "10px", justifyContent:"space-around" }}>
                    <label
                      htmlFor="Job_Type_details"
                      style={{ fontSize: "12px", paddingTop: "5px" }}
                    >
                      <span className="required-field">*</span>Contract in
                      months:
                    </label>
                    <input
                      type="text"
                      id="Job_Type_details"
                      name="Job_Type_details"
                      value={formData.Job_Type_details}
                      onChange={handleChange}
                      className="form-control"
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

              {/* Mode of Work */}
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
                    name="budget_min_type"
                    value={formData.budget_min_type}
                    onChange={handleChange}
                    required
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
                    name="budget_min_value"
                    value={formData.budget_min_value}
                    onChange={handleChange}
                    className="large-input" // Add a class for styling
                    placeholder="Numerics"
                    min="0"
                    step="0.1"
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
                    name="budget_max_type"
                    value={formData.budget_max_type}
                    onChange={handleChange}
                    required
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
                    name="budget_max_value"
                    value={formData.budget_max_value}
                    onChange={handleChange}
                    className="large-input" // Add a class for styling
                    placeholder="Numerics"
                    min="0"
                    step="0.1"
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
              {/* Detailed Job Description */}
              <div style={{ height: "auto", width: "100%" }} className="JS">
                <label htmlFor="jd_pdf">
                  Detailed JD:
                  {loc.jd_pdf_present === true ? (
                    <span style={{ color: "green" }}>  &nbsp;Previously uploaded</span>
                  ) : (
                    <span style={{ color: "red" }}>
                      &nbsp;Previously not uploaded
                    </span>
                  )}
                </label>
                <input
                  style={{ width: "100%" }}
                  type="file"
                  name="jd_pdf"
                  id="jd_pdf"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {/* Display the selected file name */}
                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
              </div>

              {/* Recruiter */}
              <div className="JS" style={{ width: "50%",marginTop:"-30px" }} id='recruiter'>
                <label htmlFor="recruiter" id='recru'>
                  <span className="required-field">*</span>Recruiter
                </label>
                <div className="recruiter-selection">
                  <Multiselect
                    options={recruiters.map((item) => ({ name: item }))} // Convert recruiters array into format required by Multiselect
                    selectedValues={formData.recruiter.map((item) => ({
                      name: item,
                    }))} // Convert selected recruiters into format required by Multiselect
                    onSelect={handleChangeRecruiter}
                    onRemove={handleChangeRecruiter}
                    displayValue="name"
                    style={{ searchWrapper: { minHeight: "10px" } }} // Adjust width as needed
                    placeholder="Select recruiters"
                    className="custom-multiselect"
                  />
                </div>
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

              {/* <div style={{height:'70px',width:'50%',backgroundColor:'blue'}}>
 
                        </div> */}
              <div
                id="detailedJdInput"
                style={{ width: "100%", marginTop: marginTopForDetailJD }}
              >
                <label
                  //  style={{backgroundColor:'blue'}}
                  htmlFor="detailed_jd"
                >
                  Detailed Job Description:
                </label>
                <textarea
                  style={{ width: "100%" }}
                  ref={jd_ref}
                  id="detailed_jd"
                  name="detailed_jd"
                  value={formData.detailed_jd}
                  onChange={handleChange}
                ></textarea>
                {/* <span style={{position: 'fixed', background: 'gray', height: '100px', width: '340px', transform: 'translate(10%, -10%)',overflowY:'auto'}}>
                                {formData.detailed_jd}
                            </span> */}
              </div>
            </div>
          </form>
        </div>
        {/* Submit Button */}
        <div className="buttons">
          <input
            onClick={handleSubmit}
            type="submit"
            value={waitForSubmission ? "" : "Submit"}
            id="submits"
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
export default EditJobPosting;
