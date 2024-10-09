import React, { useEffect } from "react";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import Mako from "../../assets/Mako.png";
import Logo from "../../assets/Logo.png";
import { useDispatch } from "react-redux";
import { setDashboardData } from "../../store/slices/dashboardSlice";
const Login = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  useEffect(() => {
    const modalElement = document.getElementById("myModal");
    if (modalElement) {
      const myModal = new Modal(modalElement);
      myModal.show();
    }
  }, []);
  useEffect(() => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_name");
    dispatch(setDashboardData({ data: {} }));
  }, []);
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>index</title>
      </head>
      <body>
        <img className="background" src={Mako} />
        {/* <div className="logo-div">
          <img className="logo" src={Logo} alt="logo" />
        </div> */}
      <div className="logedmob">
            <div className="top-right">
          <Link to="/Register">
            <button className="R">Register</button>
          </Link>
            </div>
             <div className="login-links">
          <Link to="/RecruitmentLogin">
            <button className="R">Recruiter Login</button>
          </Link>
          <Link to="/ManagementLogin">
            <button className="R">Manager Login</button>
          </Link>
        </div>
        </div>

       
      </body>
    </html>
  );
};

export default Login;
