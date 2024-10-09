import { useNavigate } from "react-router-dom";
import Loginimg from "../../assets/User.jpg";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import "./Register.css";
import { useState, useEffect } from "react";
import Modal from "react-modal"; // Import react-modal
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
function Register() {
  // const navigate = useNavigate()
  const initialCredentialState = {
    username: "",
    password: "",
    name: "",
    email: "",
  };
  const [registerError, setRegisterError] = useState({
    username_error: "",
    password_error: "",
    name_error: "",
    email_error: "",
  });
  const [credentials, setCredentials] = useState(initialCredentialState);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const changeCredentials = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    // Clear the error message when the field is changed
    if (name === "username") {
      setwaitForSubmission(false);
      setRegisterError((prevError) => ({
        ...prevError,
        username_error: "",
      }));
    } else if (name === "password") {
      setwaitForSubmission(false);
      setRegisterError((prevError) => ({
        ...prevError,
        password_error: "",
      }));
    } else if (name === "name") {
      setwaitForSubmission(false);
      setRegisterError((prevError) => ({
        ...prevError,
        name_error: "",
      }));
    } else if (name === "email") {
      setwaitForSubmission(false);
      setRegisterError((prevError) => ({
        ...prevError,
        email_error: "",
      }));
    }
  };
  function isValidGmailFormat(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return gmailRegex.test(email);
  }
  // useEffect(() => {
  //   console.log("username error:", registerError.username_error);
  //   console.log("pass_error", registerError.password_error);
  //   console.log("name_error", registerError.name_error);
  //   console.log("email_error", registerError.email_error);
  // }, [
  //   registerError.username_error,
  //   registerError.password_error,
  //   registerError.name_error,
  //   registerError.email_error,
  // ]);
  const handleCredentials = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      if (
        !credentials.username ||
        !credentials.password ||
        !credentials.name ||
        !credentials.email
      ) {
        setwaitForSubmission(false);
        setRegisterError((registerError) => ({
          ...registerError,
          username_error: !credentials.username
            ? "Username field cannot be empty"
            : "",
          password_error: !credentials.password
            ? "Password field cannot be empty"
            : "",
          name_error: !credentials.name ? "Name field cannot be empty" : "",
          email_error: !credentials.email ? "Email field cannot be empty" : "",
        }));
        return;
      }

      // Reset all error messages
      setRegisterError({
        username_error: "",
        password_error: "",
        name_error: "",
        email_error: "",
      });
      if (credentials.username.includes(" ")) {
        setwaitForSubmission(false);
        setRegisterError((registerError) => ({
          ...registerError,
          username_error: "Spaces are not allowed",
        }));
        return;
      }

      // Check for uppercase, numbers, and special characters in username
      if (!/^[a-z]+$/.test(credentials.username)) {
        setwaitForSubmission(false);
        setRegisterError((registerError) => ({
          ...registerError,
          username_error: "Username should only contain lowercase letters",
        }));
        return;
      }
      console.log(credentials);
      let a = false;
      let b = false;
      if (credentials.username.length > 0) {
        for (let i = 0; i < credentials.username.length; i++) {
          let ch = credentials.username.charAt(i);
          if (b === false && !(ch >= "a" && ch <= "z")) {
            b = true;
            console.log("err");
            setwaitForSubmission(false);
            // console.log('username should only start with lowercase alphabet')
            setRegisterError((registerError) => ({
              ...registerError,
              username_error: "only include lowercase letters",
            }));
          }
        }
      } else {
        setwaitForSubmission(false);
        setRegisterError((registerError) => ({
          ...registerError,
          username_error: "user field cannot be empty",
        }));
        b = true;
      }
      if (b === false) {
        setRegisterError((registerError) => ({
          ...registerError,
          username_error: "",
        }));
      }
      if (credentials.password.length < 8) {
        setwaitForSubmission(false);
        console.log("err");
        // console.log('password should contain atleast 8 characters')
        setRegisterError((registerError) => ({
          ...registerError,
          password_error: "must be atleast 8 characters",
        }));
      } else {
        setRegisterError((registerError) => ({
          ...registerError,
          password_error: "",
        }));
      }
      if (credentials.name.length > 0) {
        for (let i = 0; i < credentials.name.length; i++) {
          let ch = credentials.name.charAt(i);
          if (a === false && !(ch >= "a" && ch <= "z")) {
            a = true;
            console.log("err");
            setwaitForSubmission(false);
            // console.log('username should only start with lowercase alphabet')
            setRegisterError((registerError) => ({
              ...registerError,
              name_error: "only include lowercase letters",
            }));
          }
        }
      } else {
        setwaitForSubmission(false);
        setRegisterError((registerError) => ({
          ...registerError,
          name_error: "user field cannot be empty",
        }));
        a = true;
      }
      if (a === false) {
        setRegisterError((registerError) => ({
          ...registerError,
          name_error: "",
        }));
      }
      if (!isValidGmailFormat(credentials.email)) {
        a = true;
        setRegisterError((registerError) => ({
          ...registerError,
          email_error: "incorrect format",
        }));
      } else {
        setRegisterError((registerError) => ({
          ...registerError,
          email_error: "",
        }));
      }
      console.log(credentials);
      if (
        b ||
        credentials.password.length < 8 ||
        credentials.username.length === 0 ||
        credentials.name.length === 0 ||
        a
      ) {
        return;
      }
      try {
        const response = await fetch(
          "http://144.126.254.255/signup-onetime",
          // '/api/signup-onetime',
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              name: credentials.name,
              email: credentials.email,
              user_type: "management",
            }),
          },
        );
        const data = await response.json();
        if (data.status === "success") {
          setwaitForSubmission(false);      
          console.log(data);
          toast.success(data.message)
        } else {
          if (data.status === "error") {
           
            setwaitForSubmission(false);
            setModalMessage(data.message);
            setModalIsOpen(true);
            // toast.error(data.message)
           
          } else {
            // setModalMessage("An error occurred. Please try again.");
            // setModalIsOpen(true);
            toast.error("An Error Occured Please try again later")
          }
        }
      } catch (err) {
        console.log("handle error");
        toast.error("An Error Occured Please try again later")
 
        setwaitForSubmission(false);
        // setModalMessage(
        //   "An error occurred while creating the account. Please try again later.",
        // );
        // setModalIsOpen(true);
      }
 
      setCredentials(initialCredentialState);
    }
  };

  

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const styles = {
    backgroundImage: `url(${Loginimg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
    paddingTop: "12px",
  };
  const overlayStyles = {
    backdropFilter: "blur(10px)",
  };

  return (
    <div style={styles}>
      <form
        style={overlayStyles}
        className="logins"
        onSubmit={handleCredentials}
      >
        <h1 style={{ fontSize: "30px" }}>REGISTER</h1>
        <div
          style={{
            paddingBottom: registerError.username_error ? "0px" : "0px",
          }}
        >
          <span
            onClick={() => {
              document.getElementById("user").focus();
            }}
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Username:
          </span>
          <input
            id="user"
            name="username"
            onChange={changeCredentials}
            value={credentials.username}
          />
          {registerError.username_error ? (
            <div className="error-message">{registerError.username_error}</div>
          ) : (
            <span></span>
          )}
        </div>
        <div
          style={{ height: registerError.username_error ? "10px" : "20px" }}
        ></div>
        <div>
          <span
            onClick={() => {
              document.getElementById("pass").focus();
            }}
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Password:
          </span>
          <input
            id="pass"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={changeCredentials}
            value={credentials.password}
          />
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              top: "43%",
              right: "35px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </span>
          {registerError.password_error ? (
            <div className="error-message">{registerError.password_error}</div>
          ) : (
            <span></span>
          )}
        </div>
        <div
          style={{ height: registerError.password_error ? "10px" : "20px" }}
        ></div>
        <div>
          <span
            onClick={() => {
              document.getElementById("name").focus();
            }}
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Name:
          </span>
          <input
            id="name"
            name="name"
            onChange={changeCredentials}
            value={credentials.name}
          />
          {registerError.name_error ? (
            <div className="error-message">{registerError.name_error}</div>
          ) : (
            <span></span>
          )}
        </div>
        <div
          style={{ height: registerError.name_error ? "10px" : "20px" }}
        ></div>
        <div>
          <span
            onClick={() => {
              document.getElementById("email").focus();
            }}
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Email:
          </span>
          <input
            id="email"
            name="email"
            onChange={changeCredentials}
            value={credentials.email}
          />
          {registerError.email_error ? (
            <div className="error-message">{registerError.email_error}</div>
          ) : (
            <span></span>
          )}
        </div>
        <div
          style={{ height: registerError.name_error ? "10px" : "20px" }}
        ></div>
        <button
          className="b"
          style={{
            backgroundColor: "#32406d",
            color: "white",
            width: "100%",
            height: "45px",
            borderRadius: "5px",
          }}
        >
          {waitForSubmission ? "" : "Sign Up"}
          <ThreeDots
            wrapperClass="ovalSpinner"
            wrapperStyle={{
              position: "absolute",
              bottom: "25px",
              left: "225px",
            }}
            visible={waitForSubmission}
            height="45"
            width="45"
            color="white"
            ariaLabel="oval-loading"
          />
        </button>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Account Created Successfully"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="logout-popup-overlay">
          <div className="logout-popup-container">
            <p style={{ color: "#000", fontWeight: "500" }}>{modalMessage}</p>
            <div>
              <button onClick={closeModal}>ok</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Register;
