import React, { useState } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import "./changepassword.css";
// import { IoIosLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "oldPassword":
        setShowOldPassword(!showOldPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const errors = {};
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!formData.username?.trim()) {
      setwaitForSubmission(false);
      errors.username = "Username is required.";
    }

    if (!oldPassword?.trim()) {
      setwaitForSubmission(false);
      errors.oldPassword = "Please enter your old password.";
    }

    if (!newPassword?.trim()) {
      setwaitForSubmission(false);
      errors.newPassword = "Please enter your new password.";
    } else if (newPassword.length < 8) {
      setwaitForSubmission(false);
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword?.trim()) {
      setwaitForSubmission(false);
      errors.confirmPassword = "Please confirm your new password.";
    }
    setFormErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      const errors = validateForm();
      if (Object.keys(errors).length === 0) {
        // if (formData.oldPassword === formData.newPassword) {
        //   toast.warn("New password should not be the same as the old password.");
        //   setwaitForSubmission(false);
        //   return;
        // }
        // if (formData.newPassword !== formData.confirmPassword) {
        //   toast.warn("New password and confirm password must match.");
        //   setwaitForSubmission(false);
        //   return;
        // }
        try {
          const response = await fetch(
            "http://144.126.254.255/change_password", // Your API endpoint
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: localStorage.getItem("user_id"),
                username: formData.username,
                old_password: formData.oldPassword,
                new_password: formData.newPassword,
                confirm_password: formData.confirmPassword,
              }),
            },
          );
          const data = await response.json();
          if (data.status === "success") {
            setFormData({
              username: "",
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            // setMessage('Password changed successfully!');
            // showToast("Password changed successfully!");
            toast.success(data.message);
            setwaitForSubmission(false);
            setFormErrors({});
          } else {
            setwaitForSubmission(false);
            toast.error(data.message);
            // setMessage(errorMessage);
            // showErrorToast(errorMessage);
          }
        } catch (error) {
          setwaitForSubmission(false);
          toast.error(
            "An error occurred while changing the password. Please try again later.",
          );
        }
      }
    }
  };

  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <section className="signup">
          <div className="containeracco" >
            <div className="signup-content">
              <form className="signup-form"  style={{ marginBottom: "0px" }} onSubmit={handleSubmit}>
                <h3 className="form-title">Change Password</h3>

                <div className="form-group_cp">
                  <label htmlFor="username" style={{ marginBottom: "5px" }}>
                    Username:
                  </label>
                  <div className="input-icon">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-input"
                      value={formData.username}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "30px" }}
                    />
                    <FaUser
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#5c5a5a",
                      }}
                    />

                    {formErrors.username && (
                      <div
                        className="error"
                        id="error_username"
                        style={{
                          marginTop: "0px",
                          height: "0px",
                          marginLeft: "-5px",
                        }}
                      >
                        {formErrors.username}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group_cp">
                  <label htmlFor="old_password" style={{ marginBottom: "5px" }}>
                    Old Password:
                  </label>
                  <div className="input-icon">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      id="old_password"
                      name="oldPassword"
                      className="form-input"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "30px" }}
                    />
                    <RiLockPasswordFill
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "5px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#5c5a5a",
                      }}
                    />

                    {formErrors.oldPassword && (
                      <div
                        className="error"
                        id="error_old_password"
                        style={{
                          marginTop: "0px",
                          height: "0px",
                          marginLeft: "-5px",
                        }}
                      >
                        {formErrors.oldPassword}
                      </div>
                    )}
                    <span
                      className="show-passwords"
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "20px",
                        marginRight:"-40px"
                      }}
                    >
                      {showOldPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                    </span>
                  </div>
                </div>

                <div className="form-group_cp">
                  <label htmlFor="new_password" style={{ marginBottom: "5px" }}>
                    New Password:
                  </label>
                  <div className="input-icon">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="new_password"
                      name="newPassword"
                      className="form-input"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "30px" }}
                    />
                    <RiLockPasswordFill
                      style={{
                        position: "absolute",
                        top: "45%",
                        left: "5px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#5c5a5a",
                      }}
                    />

                    <span
                      className="show-passwords"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "20px", 
                        marginRight:"-40px"
                      }}
                    >
                      {showNewPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                    </span>
                  </div>
                  {formErrors.newPassword && (
                    <div
                      className="error"
                      id="error_new_password"
                      style={{
                        marginTop: "0px",
                        height: "0px",
                        marginLeft: "-5px",
                      }}
                    >
                      {formErrors.newPassword}
                    </div>
                  )}
                </div>

                <div className="form-group_cp">
                  <label
                    htmlFor="confirm_password"
                    style={{ marginBottom: "5px" }}
                  >
                    Confirm New Password:
                  </label>
                  <div className="input-icon">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm_password"
                      name="confirmPassword"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "30px" }}
                    />
                    <RiLockPasswordFill
                      style={{
                        position: "absolute",
                        top: "45%",
                        left: "5px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#5c5a5a",
                      }}
                    />

                    <span
                      className="show-passwords"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "20px",
                        marginRight:"-40px"
                      }}
                    >
                      {showConfirmPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                    </span>
                  </div>
                  {formErrors.confirmPassword && (
                    <div
                      className="error"
                      id="error_confirm_password"
                      style={{
                        marginTop: "0px",
                        height: "0px",
                        marginLeft: "-5px",
                      }}
                    >
                      {formErrors.confirmPassword}
                    </div>
                  )}
                </div>
                <div className="form-group" style={{ marginTop: "25px" }}>
                  <button
                    value="Change Password"
                    className="form-submit"
                    style={{ height: "40px" }}
                  >
                    {waitForSubmission ? "" : " Change Password"}
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChangePassword;
