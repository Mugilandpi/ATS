import React, { useState,useEffect } from "react";
import Logo from "../assets/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../Components/titlenav.css";
function TitleBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      document.querySelector("body").classList.remove("active");
      document.querySelector("body").classList.add("barside2");
    } else {
      document.querySelector("body").classList.add("active");
      document.querySelector("body").classList.add("closebar");
    }
  };

  return (
    <div className="top_navbar">
      <div
        className="hamburger"
        onClick={toggleSidebar}
        style={{ marginLeft: "30px" }}
      >
        <a>
          <FontAwesomeIcon icon={faBars} />
        </a>
      </div>
      <div className="logo1">
        <img
          className="logo1"
          src={Logo}
          alt="logo"
          style={{ height: "45px", marginTop: "3px", marginLeft: "15px" }}
        />
      </div>
      <div className="heading">
        <h1 id="title_nav_heading_text">Makonis TalentTrack Pro</h1>
      </div>
    </div>
  );
}
export default TitleBar;
