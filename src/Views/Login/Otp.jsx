import React, { useState } from "react";
// import '../Components/leftnav.css';
// import '../Components/titlenav.css';
import Loginimg from "../../assets/User.jpg";
import Logo from "../../assets/Logo.png";
import "./otp.css";
import { ThreeDots } from "react-loader-spinner";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Otp = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const handleInputChange = (e) => {
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
  const togglePasswordVisibility = (field) => {
    if (field === "newPassword") {
      setShowNewPassword((prev) => !prev);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword((prev) => !prev);
    }
  };
  const errorToast = (data) => toast.error(data);
  const successToast = (data) => toast.success(data);
  const handleSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      const newErrors = {};

      if (!formData.otp) {
        newErrors.otp = "Please enter an OTP.";
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "Please enter a new password.";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please enter a confirm password.";
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setwaitForSubmission(false);
        return;
      }
      try {
        const response = await fetch(
          // '/api/reset_password',
          "http://144.126.254.255/reset_password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              otp: formData.otp,
              new_password: formData.newPassword,
              confirm_password: formData.confirmPassword,
            }),
          },
        );

        if (!response.ok) {
          setwaitForSubmission(false);
          throw new Error("Failed to change password.");
        }

        const data = await response.json();
        if (data && data.message) {
          if (data.message === "New password is the same as the old password") {
            toast.warning(data.message);
            setwaitForSubmission(false);
          } else if (
            data.message ===
            "Invalid OTP or password confirmation. Please try again."
          ) {
            toast.error(data.message);
            setwaitForSubmission(false);
          } else {
            toast.success(data.message);
            setwaitForSubmission(false);
            setTimeout(() => {
              navigate("/Login");
            }, 2000);
          }
        } else {
          setwaitForSubmission(false);
          throw new Error("Invalid response format.");
        }
      } catch (error) {
        setwaitForSubmission(false);
        console.error("Error changing password:", error);
        toast.error("An error occurred while changing the password.");
      }
    }
  };

  return (
    <div>
      <img className="background1" src={Loginimg} alt="Background" />
      <div className="logo_1">
        <img className="logo" src={Logo} alt="logo" />
      </div>
      <div className="container_Recruiter">
        <form
          className="otp_form"
          onSubmit={handleSubmit}
          style={{ height: "auto" }}
        >
          <h1 style={{ fontFamily: "roboto" }}>Change Password</h1>
          <label htmlFor="otp">Otp:</label>
          <input
            id="user"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
          />
          {errors.otp && (
            <p
              className="error-message"
              style={{
                color: "red",
                height: "10px",
                marginTop: "0px",
                marginLeft: "-200px",
              }}
            >
              {errors.otp}
            </p>
          )}
          <label htmlFor="newPassword">New Password:</label>
          <input
            id="pass"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          <span
            className="password-toggle"
            onClick={() => togglePasswordVisibility("newPassword")}
            style={{
              position: "absolute",
              top:
              window.innerWidth <= 542
                ? errors.newPassword
                  ? "44%"
                  : "46%"
                : errors.newPassword
                ? "48%"
                : "49%",
              right: "35px",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {showNewPassword ? <RiEyeLine /> : <RiEyeOffLine />}
          </span>
          {errors.newPassword && (
            <p
              className="error-message"
              style={{
                color: "red",
                height: "10px",
                marginTop: "0px",
                marginLeft: "-135px",
              }}
            >
              {errors.newPassword}
            </p>
          )}
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            id="user"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <span
            className="password-toggle"
            onClick={() => togglePasswordVisibility("confirmPassword")}
            style={{
              position: "absolute",
              top: errors.confirmPassword ? "70%" : "69%",
               top:
              window.innerWidth <= 542
                ? errors.newPassword
                  ? "68%"
                  : "65%"
                :errors.confirmPassword ? "70%" : "69%",
              right: "35px",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {showConfirmPassword ? <RiEyeLine /> : <RiEyeOffLine />}
          </span>
          {errors.confirmPassword && (
            <p
              className="error-message"
              style={{
                color: "red",
                height: "0px",
                marginTop: "0px",
                marginLeft: "-110px",
              }}
            >
              {errors.confirmPassword}
            </p>
          )}
          <button
            className="submit_otp"
            value="Confirm"
            style={{ marginTop: "20px" }}
          >
            {waitForSubmission ? "" : "Confirm"}
            <ThreeDots
              wrapperClass="ovalSpinner"
              wrapperStyle={{
                position: "absolute",
                bottom: "-5px",
                left: "155px",
              }}
              visible={waitForSubmission}
              height="45"
              width="45"
              color="white"
              ariaLabel="oval-loading"
            />
          </button>
          <br />
          <div
            className="error-container"
            style={{
              marginTop: "10px",
              textAlign: "center",
              zIndex: "9999",
              position: "relative",
            }}
          >
            {message && (
              <p
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginTop: "0px",
                  marginLeft: "0%",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Otp;
