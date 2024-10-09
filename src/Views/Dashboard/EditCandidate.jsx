import React, { useState, useEffect } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
// import "./UpdateCandidate.css";
import "./EditCandidate.css";
import { getDashboardData } from "../utilities.js";

import { ThreeDots } from "react-loader-spinner";

import { useRef } from "react";

// import "../Views/UpdateCandidate.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
function EditCandidate() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const last_working_date_ref = useRef(null)

  const location = useLocation();
  const navigate = useNavigate();
  // console.log(location.state);
  const editData = location.state.item;
  console.log("all datas",editData)
  const [current_ctc_type, current_ctc_value] = editData.current_ctc.split(" ");
  const [expected_ctc_type, expected_ctc_value] =
    editData.expected_ctc.split(" ");
  let s1 = editData.relevant_experience ? editData.relevant_experience : "0";
  const a1 = s1.split(/[ .]/);
  // console.log("a1", a1);
  const [relevant_experience_years, relevant_exp_months] = a1;
  const a2 = editData.experience.split(/[ .]/);
  // console.log("a2", a2);
  const [experience_years, exp_months] = a2;
  const [waitForSubmission, setwaitForSubmission] = useState(false);

  const [formData, setFormData] = useState({
    job_id: editData.job_id,
    name: editData.name,
    mobile: editData.mobile,
    email: editData.email,
    client: editData.client,
    profile: editData.profile,
    skills: editData.skills,
    current_company: editData.current_company,
    position: editData.position,
    reason_for_job_change:
      editData.reason_for_job_change !== null && editData.reason_for_job_change!== undefined
        ? editData.reason_for_job_change
        : "none",
    resume: null,
    current_job_location: editData.current_job_location,
    preferred_job_location: editData.preferred_job_location,
    experience_years,
    exp_months: parseInt(exp_months) ? exp_months : "0",
    relevant_experience_years,
    relevant_exp_months: parseInt(relevant_exp_months)
      ? relevant_exp_months
      : "0",
    current_ctc_type,
    current_ctc_value,
    expected_ctc_type,
    expected_ctc_value,
    qualifications: editData.qualifications,
    serving_notice_period:
      editData.serving_notice_period === null
        ? ""
        : editData.serving_notice_period,
    period_of_notice:
      editData.period_of_notice === null ? "" : editData.period_of_notice,
    last_working_date: editData?.last_working_date,
    buyout: editData.buyout,
    holding_offer: editData.holding_offer,
    total_offers: editData.total_offers === null ? "0" : editData.total_offers,
    highest_package:
      editData.highest_package_in_lpa === null
        ? "0"
        : editData.highest_package_in_lpa,
    linkedin: editData.linkedin === null ? "" : editData.linkedin,
    remarks: editData.remarks,
  });

  console.log("edit formData", formData);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "resume" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          resume: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file);
    } else {
      const newValue = type === "checkbox" ? checked : value;
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const notify = () => toast.success("Candidate edited successfully");

  const notify1 = () => toast.error("Resume is mandatory");

  const notify2 = () => toast.warn("Email format is incorrect");

  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    return nameRegex.test(name);
  };

  const isValidMobileNumber = (mobileNumber) => {
    return /^\d{10}$/.test(mobileNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      if (!isValidEmail(formData.email)) {
        notify2();
        setwaitForSubmission(false);
        return;
      }

      const currentDate = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.last_working_date).setHours(
        0,
        0,
        0,
        0,
      );

      if (
        formData.serving_notice_period === "yes" &&
        selectedDate < currentDate
      ) {
        toast.warn("Last working date cannot be in the past.");
        setwaitForSubmission(false);
        return;
      }

      if (!editData.resume_present && formData.resume === null) {
        notify1();
        setwaitForSubmission(false);
        return;
      }
      const edit_candidate_data = {
        ...formData,
        id: location.state.item.id,
        user_id: localStorage.getItem("user_id"),
        expected_ctc: `${formData["expected_ctc_type"]} ${formData["expected_ctc_value"]}`,
        current_ctc: `${formData["current_ctc_type"]} ${formData["current_ctc_value"]}`,
        relevant_experience: `${formData["relevant_experience_years"]}.${formData["relevant_exp_months"]}`,
        experience: `${formData["experience_years"]}.${formData["exp_months"]}`,
        last_working_date: formData.last_working_date,
      };

      console.log("edit_candidate_data", edit_candidate_data); // Display form data in console

      if (!isValidMobileNumber(formData.mobile)) {
        toast.warn("Mobile number must contain exactly 10 digits");
        setwaitForSubmission(false);

        return;
      }
      if (!isValidName(formData.name)) {
        toast.warn("Candidate name should contain alphabetics only.");
        setwaitForSubmission(false);
 
        return;
      }
      if (
        parseFloat(formData.relevant_experience_years) >
          parseFloat(formData.experience_years) ||
        (parseFloat(formData.relevant_experience_years) ===
          parseFloat(formData.experience_years) &&
          parseFloat(formData.relevant_exp_months) >
            parseFloat(formData.exp_months))
      ) {
        toast.warn(
          "Relevant experience cannot be greater than total experience",
        );
        setwaitForSubmission(false);

        return;
      }

      try {
        // app.route('/edit_candidate/<int:candidate_id>', methods=['POST'])
        const response = await fetch(
          // `api/edit_candidate/${location.state.id}`,{
          `https://ats-9.onrender.com/edit_candidate/${location.state.item.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(edit_candidate_data),
          },
        );
        const data = await response.json();
        if (data.status==="success") {
          // console.log(data);
          // notify();
          getDashboardData().then(() => {
            setwaitForSubmission(false);

            toast.success(data.message);
            navigate("/dashboard");
          });
        }else{
          setwaitForSubmission(false);

            toast.error(data.message);
        }
      } catch (err) {
        console.log("error", err);
        toast.error("something Went wrong please try again");
      }
    }
  };
  useEffect(() => {
    // console.log(location.state.path);
    localStorage.setItem("path", location.state.path);
  }, []);
  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div
          style={{  }}
          className="candiedit"
        >
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
            style={{ marginTop: "1px" }}
          >
            <FaArrowLeft />
          </button>
          <h5 className="headingtwo2">Edit Candidate Details</h5>
        </div>

        <div className="Container2 ">
          <form className="forms1" onSubmit={handleSubmit}>
            <div className="group">
              <div className="JS">
                <label htmlFor="name">
                  <span className="required-field">*</span>Name:
                </label>
                <input
                  type="text"
                  id="client"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="mobile">
                  <span className="required-field">*</span>Mobile:
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="form-control"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="email">
                  <span className="required-field">*</span>Email:
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="client">
                  <span className="required-field">*</span>Client:
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  className="form-control"
                  value={formData.client}
                  onChange={handleChange}
                  readOnly
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="profile">
                  <span className="required-field">*</span>Profile:
                </label>
                <input
                  type="text"
                  id="profile"
                  name="profile"
                  className="form-control"
                  value={formData.profile}
                  onChange={handleChange}
                  readOnly
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="skills">
                  <span className="required-field">*</span>Skills:
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  className="form-control"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="current_company">Current Company:</label>
                <input
                  type="text"
                  id="current_company"
                  name="current_company"
                  className="form-control"
                  value={formData.current_company}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="position">Position:</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className="form-control"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="reason_for_job_change">
                  Reason for Job Change:
                </label>
                <input
                  type="text"
                  id="reason_for_job_change"
                  name="reason_for_job_change"
                  className="form-control"
                  value={formData.reason_for_job_change}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="resume">
                  <span className="required-field">*</span>Resume:{" "}
                  {editData.resume_present === true ? (
                    <span style={{ color: "green" }}>previously uploaded</span>
                  ) : (
                    <span style={{ color: "red" }}>
                      not uploaded previously
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  className="resume1"
                  accept=".pdf,.doc,.docx"
                  autoComplete="off"
                  onChange={handleChange}
                />
                <small></small>
              </div>

              <div className="JS">
                <label htmlFor="current_job_location">
                  Current Job Location:
                </label>
                <input
                  type="text"
                  id="current_job_location"
                  name="current_job_location"
                  className="form-control"
                  value={formData.current_job_location}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="preferred_job_location">
                  Preferred Job Location:
                </label>
                <input
                  type="text"
                  id="preferred_job_location"
                  name="preferred_job_location"
                  className="form-control"
                  value={formData.preferred_job_location}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="experience">Total Experience:</label>
                <input
                  type="number"
                  id="experience"
                  name="experience_years"
                  className="form-control"
                  value={formData.experience_years}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="exp_months">Months:</label>
                <input
                  type="text"
                  id="exp_months"
                  name="exp_months"
                  className="form-control"
                  value={formData.exp_months}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="relevant_experience">
                  Relevant Experience:
                </label>
                <input
                  type="text"
                  id="relevant_experience"
                  name="relevant_experience_years"
                  className="form-control"
                  value={formData.relevant_experience_years}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="relevant_exp_months">Months:</label>
                <input
                  type="text"
                  id="relevant_exp_months"
                  name="relevant_exp_months"
                  className="form-control"
                  value={formData.relevant_exp_months}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="currency_type_current">
                  Current CTC Currency Type:
                </label>
                <select
                  // id="currency_type_current"
                  name="current_ctc_type"
                  className="form-control"
                  value={formData.current_ctc_type}
                  onChange={handleChange}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  {/* Add more currency options */}
                </select>
              </div>

              <div className="JS">
                <label htmlFor="current_ctc">Current CTC:</label>
                <input
                  type="number"
                  // id="current_ctc"
                  name="current_ctc_value"
                  className="form-control"
                  value={formData.current_ctc_value}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="currency_type_except">
                  Expected CTC Currency Type:
                </label>
                <select
                  id="currency_type_except"
                  name="expected_ctc_type"
                  className="form-control"
                  value={formData.expected_ctc_type}
                  onChange={handleChange}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  {/* Add more currency options */}
                </select>
              </div>

              <div className="JS">
                <label htmlFor="expected_ctc">Expected CTC:</label>
                <input
                  type="text"
                  id="expected_ctc"
                  name="expected_ctc_value"
                  className="form-control"
                  value={formData.expected_ctc_value}
                  onChange={handleChange}
                />
              </div>

              <div className="JS">
                <label htmlFor="qualifications">Qualifications:</label>
                <input
                  type="text"
                  id="qualifications"
                  name="qualifications"
                  className="form-control"
                  value={formData.qualifications}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="JS">
                <label htmlFor="notice_period">Notice Period:</label>
                <input
                  type="text"
                  id="notice_period"
                  name="notice_period"
                  className="form-control"
                  value={formData.notice_period}
                  onChange={handleChange}
                />
              </div> */}

              {/* <div className="JS">
                <label htmlFor="last_working_date">Last Working Date:</label>
                <input
                  type="text"
                  value=
                  id="last_working_date"
                  name="last_working_date"
                  className="form-control"
                  value={formData.last_working_date}
                  onChange={handleChange}
                />
              </div> */}

              <div className="JS">
                <label htmlFor="linkedin">Linkedin Profile:</label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  className="form-control"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
              <div className="JS">
                <label>
                  <span style={{ color: "red" }}>*</span>Serving Notice Period:
                </label>
                <select
                  required
                  className="input_style"
                  style={{ width: "100%" }}
                  name="serving_notice_period"
                  onChange={handleChange}
                  value={formData.serving_notice_period}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="completed">completed</option>
                </select>
                {formData.serving_notice_period === "yes" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "6px",
                    }}
                  >
                    <div style={{}}>
                      <label style={{ paddingRight: "3px", marginTop: "4px" }}>
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
                        value={formData.last_working_date}
                      />
                    </div>

                    <div style={{}}>
                      <label style={{ paddingRight: "3px", marginTop: "4px" }}>
                        Buyout:
                      </label>
                      <input
                        style={{ height: "25px", width: "25px" }}
                        name="buyout"
                        type="checkbox"
                        onChange={handleChange}
                        value={formData.buyout}
                        checked={formData.buyout}
                      />
                    </div>
                  </div>
                ) : formData.serving_notice_period === "no" ? (
                  <div
                    style={{
                      display: "flex",
                      marginTop: "6px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{}}>
                      <label style={{ paddingRight: "3px", marginTop: "4px" }}>
                        <span style={{ color: "red" }}>*</span>Notice period:{" "}
                      </label>
                      <select
                      required
                        onChange={handleChange}
                        name="period_of_notice"
                        value={formData.period_of_notice}
                      >
                        <option
                          value=""
                          selected={formData.period_of_notice === ""}
                        >
                          any
                        </option>
                        <option
                          value="0-15 days"
                          selected={formData.period_of_notice === "0-15 days"}
                        >
                          0-15 days
                        </option>
                        <option
                          value="1 Month"
                          selected={formData.period_of_notice === "1 Month"}
                        >
                          1 Month
                        </option>
                        <option
                          value="2 Months"
                          selected={formData.period_of_notice === "2 Months"}
                        >
                          2 Months
                        </option>
                        <option
                          value="3 Months"
                          selected={formData.period_of_notice === "3 Months"}
                        >
                          3 Months
                        </option>
                        <option
                          value="More than 3 Months"
                          selected={
                            formData.period_of_notice === "More than 3 Months"
                          }
                        >
                          More than 3 Months
                        </option>
                      </select>
                    </div>
                    <div style={{}}>
                      <label style={{ paddingRight: "3px", marginTop: "4px" }}>
                        Buyout:
                      </label>
                      <input
                        style={{ height: "25px", width: "25px" }}
                        name="buyout"
                        type="checkbox"
                        onChange={handleChange}
                        value={formData.buyout}
                        checked={formData.buyout}
                      />
                    </div>
                  </div>
                ) : (
                  <div> </div>
                )}
              </div>
              <div className="JS">
                <label>
                  <span style={{ color: "red" }}>*</span>Holding Offer:
                </label>
                <select
                  required
                  className="input_style"
                  style={{ width: "100%" }}
                  name="holding_offer"
                  onChange={handleChange}
                  value={formData.holding_offer}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="pipeline">pipeline</option>
                </select>

                {formData.holding_offer === "yes" ? (
                  <div
                    style={{
                      display: "flex",
                      marginTop: "6px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{}}>
                      <label style={{ paddingRight: "3px", marginTop: "4px" }}>
                        <span style={{ color: "red" }}>*</span>Total Offers:
                      </label>
                      <input
                        type="number"
                        required
                        name="total_offers"
                        onChange={handleChange}
                        style={{
                          borderRadius: "4px",
                          height: "28px",
                          width: "150px",
                        }}
                        value={formData.total_offers}
                      />
                    </div>

                    <div style={{}}>
                      <label style={{ paddingRight: "3px", marginTop: "4px" }}>
                        <span style={{ color: "red" }}>*</span>Highest Package
                        in LPA:
                      </label>
                      <input
                        type="number"
                        name="highest_package"
                        required
                        onChange={handleChange}
                        style={{ borderRadius: "4px", height: "28px" }}
                        value={formData.highest_package}
                      />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <div className="JS">
                <label htmlFor="remarks">Remarks:</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  className="form-control"
                  value={formData.remarks}
                  onChange={handleChange}
                  style={{ marginBottom: "20px" }}
                ></textarea>
              </div>
            </div>
            <input type={'submit'} ref={last_working_date_ref} style={{visibility:'hidden'}} />
          </form>
        </div>
        <div className="buttons2">
          <div
            style={{ position: "relative", width: "160px", margin: "0 auto" }}
          >
            <input
            onClick={()=>{
                last_working_date_ref.current.click()
              }}
              // onClick={handleSubmit}
              type="submit"
              value={waitForSubmission ? "" : "Update"}
              id="submits2"
            />
            <ThreeDots
              wrapperClass="ovalSpinner"
              wrapperStyle={{ position: "absolute", top: "-5px", left: "60px" }}
              visible={waitForSubmission}
              height="45"
              width="45"
              color="white"
              ariaLabel="oval-loading"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCandidate;
