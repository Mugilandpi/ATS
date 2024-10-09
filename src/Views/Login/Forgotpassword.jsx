import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loginimg from "../../assets/User.jpg";
import "./ManagementLogin.css";
import "./otp.css";
import Logo from "../../assets/Logo.png";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const navigate = useNavigate();
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState({ username: "", email: "" });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  console.log("i lost my way");
  useEffect(() => {
    console.log("component mounted");
  }, []);
  console.log("something an issue");
  const clearError = (field) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleCredentials = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();

      const newErrors = {};

      if (!credentials.username) {
        newErrors.username = "Please enter a username.";
      }

      if (!credentials.email) {
        newErrors.email = "Please enter an email.";
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setwaitForSubmission(false);
        return;
      }

      try {
        const response = await fetch(
          // '/api/generate_otp', {
          "http://144.126.254.255/generate_otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          },
        );
        if (!response.ok) {
          setwaitForSubmission(false);
          throw new Error(`Failed to generate OTP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Response from server:", data);
        if (data.status === "success") {
          setOtp(data.otp || "");
          setwaitForSubmission(false);
          setOtpGenerated(true);
          toast.success(data.message);
          navigate("/otp")
        } else {
          toast.error(data.message);
          setwaitForSubmission(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setwaitForSubmission(false);
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleNavigateToOtp = () => {
    if (otpGenerated) {
      navigate("/Otp", { state: { otp } });
    } else {
      setMessage("Please generate OTP first.");
    }
  };

  return (
    <body>
      <img className="background1" src={Loginimg} alt="Background" />
      <div className="logo_1">
        <img className="logo" src={Logo} alt="logo" />
      </div>
      <div className="container_Recruiter">
        <form onSubmit={handleCredentials} className="ml_form">
          <h1 style={{ fontFamily: "roboto" }}>Forgot Password</h1>
          <label htmlFor="username">Username:</label>
          <input
            id="user"
            name="username"
            onChange={(e) => {
              setCredentials({ ...credentials, username: e.target.value });
              clearError("username");
            }}
          />
          {errors.username && (
            <p
              className="error-message"
              style={{ height: "10px", marginLeft: "-160px", marginTop: "0px" }}
            >
              {errors.username}
            </p>
          )}

          <label htmlFor="password">Email:</label>
          <input
            id="pass"
            name="email"
            type="email"
            onChange={(e) => {
              setCredentials({ ...credentials, email: e.target.value });
              clearError("email");
            }}
          />
          {errors.email && (
            <p
              className="error-message"
              style={{ height: "0px", marginLeft: "-180px", marginTop: "0px" }}
            >
              {errors.email}
            </p>
          )}

          {message && <p className="message">{message}</p>}
          {otp && <p className="message">Generated OTP: {otp}</p>}

          {!otpGenerated && (
            <button
              className="submitrl"
              value="Generate OTP"
              style={{
                marginTop: "20px",
                width: "100%",
                height: "45px",
                backgroundColor: "#32406D",
                color: "white",
              }}
            >
              {waitForSubmission ? "" : " Generate OTP"}
              <ThreeDots
                wrapperClass="ovalSpinner"
                wrapperStyle={{
                  position: "absolute",
                  bottom: "25px",
                  left: "175px",
                }}
                visible={waitForSubmission}
                height="45"
                width="45"
                color="white"
                ariaLabel="oval-loading"
              />
            </button>
          )}

          {otpGenerated && (
            <button
              onClick={handleNavigateToOtp}
              className="login-button_rl"
              style={{
                marginTop: "20px",
                width: "100%",
                height: "45px",
                background: "#32406D",
                color: "white",
              }}
            >
              Proceed to OTP
            </button>
          )}
        </form>
      </div>
    </body>
  );
}

export default ForgotPassword;
