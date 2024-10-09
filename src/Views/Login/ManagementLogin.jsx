import React, { useState, useEffect } from "react";
import Loginimg from "../../assets/User.jpg";
import "./ManagementLogin.css";
import Logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
// import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import Modal from "react-modal";
const cookies = new Cookies();

function ManagmentLogin() {
  const location = useLocation();
  const isSessionLogout = location.state?.isPopupvisible;
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const notify = () => toast.error("Invalid username or password");
  const navigate = useNavigate();
  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/ForgotPassword");
  };
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loginError, setLoginError] = useState({
    username_error: "",
    password_error: "",
  });

  const initialCredentialState = {
    username: "",
    password: "",
  };

  useEffect(() => {
    if(localStorage.getItem("profileImage")){
      localStorage.removeItem('profileImage')
    }
  }, []);

  const [credentials, setCredentials] = useState(initialCredentialState);
  const changeCredentials = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === "username") {
      setLoginError((prevError) => ({
        ...prevError,
        username_error: "",
      }));
    } else if (name === "password") {
      setLoginError((prevError) => ({
        ...prevError,
        password_error: "",
      }));
    }
  };

  const handleCredentials = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      if (/[A-Z]/.test(credentials.username)) {
        setwaitForSubmission(false);
        setLoginError((loginError) => ({
          ...loginError,
          username_error: "Only lowercase letters are allowed in username",
        }));
        return;
      }

      // Check if username contains spaces
      if (credentials.username.includes(" ")) {
        setwaitForSubmission(false);
        setLoginError((loginError) => ({
          ...loginError,
          username_error: "Spaces are not allowed in username",
        }));
        return; // Prevent further execution
      }
      // if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(credentials.username)) {
      //   setwaitForSubmission(false);
      //   setLoginError((loginError) => ({
      //     ...loginError,
      //     username_error: "Username should contain only lowercase letters",
      //   }));
      //   return; 
      // }

      // Check if username is empty
      if (credentials.username.length === 0) {
        setwaitForSubmission(false);
        setLoginError((loginError) => ({
          ...loginError,
          username_error: "Username field cannot be empty",
        }));
      } else {
        setLoginError((loginError) => ({ ...loginError, username_error: "" }));
      }

      // Check if password is empty
      if (credentials.password.length === 0) {
        setwaitForSubmission(false);
        setLoginError((loginError) => ({
          ...loginError,
          password_error: "Password field cannot be empty",
        }));
      } else {
        setLoginError((loginError) => ({ ...loginError, password_error: "" }));
      }
      try {
        const response = await fetch(
           "http://144.126.254.255/login/management",
         // "/api/login/management",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              // "user_type":"management",
              // "user_id":localStorage.getItem('user_id')
            }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          // console.log("data", data);
          cookies.set("USERNAME", credentials.username, {
            path: "/",
          });
          cookies.set("USERTYPE", "managment", {
            path: "/",
          });
          if (data.status === "error") {
            setwaitForSubmission(false);
            toast.error(data.message);
          } else {
            // Safely extract the name from API response
            const userName = data.name || 'Default Name'; // Provide a default value if name is undefined
            const userEmail =data.email || 'Default Name';
            // Store user details in local storage
            localStorage.setItem('user_id', data.user_id),
            localStorage.setItem('username', credentials.username)
            localStorage.setItem('name', userName);
            localStorage.setItem('email',userEmail)
            console.log('user Name', userName)
            
            navigate(data.redirect, {
              state: {
                user_type: "management",
                user_id: data.user_id,
                user_name: credentials.username,
                name:credentials.name,
                email:userEmail,
              },
            });
          }
        }
      } catch (err) {
        setwaitForSubmission(false);
        toast.error("An error occurred while processing your request.");
      }
    }
  };

  // const history = useHistory();
  window.addEventListener("popstate", (e) => {
    e.preventDefault();
    console.log(window.location.pathname);
    history.replace(window.location.pathname);
  });
  //   useEffect(() => {
  //     if(!isSessionLogout)
  //       return ;
  //     // Push a new entry to the history stack
  //     history.push("/current-path"); // Replace with your current route path

  //     const handlePopState = (e) => {
  //         // Prevent back navigation by pushing the same path
  //         history.push("/ManagementLogin/:isSessionLogout"); // Replace with your current route path
  //     };

  //     // Add event listener for popstate events
  //     window.addEventListener('popstate', handlePopState);

  //     return () => {
  //         // Clean up the event listener on component unmount
  //         window.removeEventListener('popstate', handlePopState);
  //     };
  // }, [history]);
  useEffect(() => {
    // console.log(loginError.username_error);
    // console.log(loginError.password_error);
  }, [loginError.username_error, loginError.password_error]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  useEffect(() => {
    if (isSessionLogout) {
      setIsPopupVisible(true);
    }
  }, []);
  return (
    <body>
      <img className="background1" src={Loginimg} alt="Background" />
      <div className="logo_1">
        <img className="logo" src={Logo} alt="logo" />
      </div>
      <div className="container_Recruiter">
        <form onSubmit={handleCredentials} className="ml_form">
          <h1 style={{fontSize:"25px",color:"#32406D" }}>Manager Login</h1>
          <label htmlFor="username">Username:</label>

          <input id="user" name="username" onChange={changeCredentials} />
          {loginError.username_error ? (
            <div
              style={{ color: "red", fontSize: "14px", marginTop: "0px" }}
              className="error-message"
            >
              {loginError.username_error}
            </div>
          ) : (
            <span></span>
          )}
          <label htmlFor="password">Password:</label>
          <div style={{display:'flex', alignItems:'center',position:'relative'}}>
          <input
            id="pass"
            name="password"
            onChange={changeCredentials}
            type={showPassword ? "text" : "password"}
          />
         
          <span
            className="show-password"
            onClick={togglePasswordVisibility}
            style={{
              position:'absolute',
              zIndex:'100',
              cursor:'pointer',
              fontSize: '20px',
              right:'14px',
              top:'10px',
            }}
            id="mangrecpass"
          >
            {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
          </span>
          </div>
          {loginError.password_error ? (
            <div
              style={{ color: "red", fontSize: "14px", marginTop: "0px" }}
              className="error-message"
            >
              {loginError.password_error}
            </div>
          ) : (
            <span></span>
          )}

          {/* {message && <p className="error-message">{message}</p>} */}

          <button
            value="Login"
            style={{ marginTop: "20px", textAlign: "center", height: "40px" }}
            className="login-button_ml"
          >
            {waitForSubmission ? "" : "Submit"}
            <ThreeDots
              wrapperClass="ovalSpinner"
              wrapperStyle={{
                position: "absolute",
                bottom: "41px",
                left: "179px",
              }}
              visible={waitForSubmission}
              height="45"
              width="45"
              color="white"
              ariaLabel="oval-loading"
            />
          </button>
          <br />
          <a
            className="forgot"
            onClick={handleForgotPassword}
            style={{ cursor: "pointer" }}
          >
            Forgot Password?
          </a>
        </form>
      </div>
      <Modal
        isOpen={isPopupVisible}
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
            // position:"fixed"
            width: "350px",
            height: "160px",
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
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Session Timeout</h2>
            </div>
            <div className="modal-body">
              <p>Your session has timed out .you have been logged out</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-ok"
                onClick={() => {
                  setIsPopupVisible(false);
                  navigate("/ManagementLogin");
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </body>
  );
}

export default ManagmentLogin;
