import React, { useState } from "react";
import axios from "axios"; // Import axios
import LeftNav from "../../Components/LeftNav";
import TitleBar from "../../Components/TitleBar";
import "../../Components/leftnav.css";
import "../../Components/titlenav.css";
import "./AccountCreation.css";
import { useNavigate } from "react-router-dom";
import {
  getDashboardData,
  getAllJobs,
  getAllRecruitersManagers,
} from "../utilities.js";
import { FaUser } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import Modal from "react-modal"; // Import react-modal
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

function AccountCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    user_type: "",
    user_id: localStorage.getItem("user_id"),
  });

  const [waitForSubmission, setwaitForSubmission] = useState(false);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // Define errors state
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const showToast = (data) => toast.success(data);

  const handleSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length === 0) {
        try {
          const response = await fetch("https://ats-9.onrender.com/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const responseData = await response.json();

          // console.log("Response:", responseData);

          if (responseData.status === "error") {
            toast.error(responseData.message);
            setwaitForSubmission(false);
          } else {
            getAllRecruitersManagers().then(() => {
              // toast.success(responseData.success_message);
              toast.success("Account created. Verification link has been sent to the mail.");
              setwaitForSubmission(false);
              setMessage("");
              setModalIsOpen(true);
              navigate("/UserAccounts");
            });
          }
        } catch (error) {
          setwaitForSubmission(false);
          setMessage(
            "An error occurred while creating the account. Please try again later.",
          );
        }
      }
    }
  };

  const validateForm = () => {
    const errors1 = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const noUppercasePattern = /^[^A-Z]+$/;
    const noNumbersPattern = /^[^\d]+$/;
    const noSpecialCharsPattern = /^[a-zA-Z]*$/;

    if (!formData.username?.trim()) {
      setwaitForSubmission(false);
      errors1.username = "Username is required";
    } else if (formData.username.includes(" ")) {
      setwaitForSubmission(false);
      errors1.username = "Spaces are not allowed in username";
    } else if (!noUppercasePattern.test(formData.username)) {
      setwaitForSubmission(false);
      errors1.username = "Username should contain lowercase letters";
    } else if (!noNumbersPattern.test(formData.username)) {
      setwaitForSubmission(false);
      errors1.username = "Username should not contain numbers";
    } else if (!noSpecialCharsPattern.test(formData.username)) {
      setwaitForSubmission(false);
      errors1.username = "Username should not special characters";
    }

    if (!formData.name?.trim()) {
      setwaitForSubmission(false);
      errors1.name = "Name is required";
    } else if (!noNumbersPattern.test(formData.name)) {
      setwaitForSubmission(false);
      errors1.name = "Name should not contain numbers";
    }

    if (!formData.email?.trim()) {
      setwaitForSubmission(false);
      errors1.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      setwaitForSubmission(false);
      errors1.email = "Invalid email format";
    }
    setErrors(errors1);
    return errors1;
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />

        {/* <form onSubmit={handleSubmit} style={{ width: '100%' }} className="newform">
                    <div>
                        <h3 style={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: '550', color: 'black', marginBottom: '15px', textAlign: 'center', paddingTop: '10px' }}>New Account</h3>
                    </div>
                    <label>Username:</label>
                    <input type="text" name="username" className="AC" value={formData.username} onChange={handleChange} required />
                    {errors.username && <p className="error">{errors.username}</p>}
 
                    <label>Name:</label>
                    <input type="text" name="name" className="AC" value={formData.name} onChange={handleChange} required />
                    {errors.name && <p className="error">{errors.name}</p>}
 
                    <label>Email:</label>
                    <input type="email" name="email" className="AC" value={formData.email} onChange={handleChange} required />
                    {errors.email && <p className="error">{errors.email}</p>}
 
                    <label>User Type:</label>
                    <select name="user_type" id="user_type" value={formData.user_type} onChange={handleChange} required className="AC">
                        <option value="recruiter">Recruiter</option>
                        <option value="management">Management</option>
                    </select>
 
                    <div style={{ display: 'flex', justifyContent: 'center', height: 'auto',width:"100%",marginTop:"10px",marginBottom:"20px" }}>
                        <button value="Create Account" className="btn2_AC" >Create Account</button>
                    </div>
                </form>
                {message && <p style={{color:"green"}}>{message}</p>}
              */}
        <section className="signup" style={{ marginTop: "-20px" }}>
          <div className="containeracco">
            <div className="signup-content">
              <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="form-title">New Account</h2>
                <div
                  className="form-group"
                  style={{
                    padding: "3px",
                    margin: "0",
                  }}
                >
                  <label className="acclabel" style={{ marginBottom: "5px" }}>Username:</label>
                  <div className="input-icon">
                    <input
                      type="text"
                      name="username"
                      className="form-input"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <FaUser className="input-icon-icon" />
                  </div>
                  {errors.username && (
                    <p
                      style={{
                        marginBottom: "0px",
                        padding: "0px",
                        marginLeft: "6px",
                      }}
                      className="error"
                    >
                      {errors.username}
                    </p>
                  )}
                </div>
                <div
                  className="form-group"
                  style={{
                    padding: "3px",
                    margin: "0",
                  }}
                >
                  <label className="acclabel" style={{ marginBottom: "5px" }}>Name:</label>
                  <div className="input-icon">
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <FaUserCheck className="input-icon-icon" />
                  </div>
                  {errors.name && (
                    <p
                      style={{
                        marginBottom: "0px",
                        padding: "0px",
                        marginLeft: "6px",
                      }}
                      className="error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div
                  className="form-group"
                  style={{
                    padding: "3px",
                    margin: "0",
                  }}
                >
                  <label className="acclabel" style={{ marginBottom: "5px" }}>Email:</label>
                  <div className="input-icon">
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <MdEmail className="input-icon-icon" />
                  </div>
                  {errors.email && (
                    <p
                      style={{
                        marginBottom: "0px",
                        padding: "0px",
                        marginLeft: "6px",
                      }}
                      className="error"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label className="acclabel" style={{ marginBottom: "5px" }}>UserType:</label>
                  <div className="input-icon">
                    <select
                      name="user_type"
                      id="user_type"
                      value={formData.user_type || ""}
                      onChange={handleChange}
                      required
                      className="form-selected"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="recruiter">Recruiter</option>
                      <option value="management">Management</option>
                    </select>
                    <FaUserGroup
                      className="input-icon-icon"
                      style={{ left: "5px" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <button
                    value="Create Account"
                    name="submit"
                    id="submit"
                    style={{ height: "40px" }}
                    className="form-submit"
                  >
                    {waitForSubmission ? "" : "Create Account"}

                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                        left: "140px",
                        bottom: "-3px",
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
              {message && (
                <p style={{ color: message === "message" ? "green" : "red" }}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AccountCreation;
