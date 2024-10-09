import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LeftNav from "../../Components/LeftNav";
import TitleBar from "../../Components/TitleBar";
import { useNavigate } from "react-router-dom";
import "../../Components/leftnav.css";
import "../../Components/titlenav.css";
import "./Reassignjob.css";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getAllJobs, getDashboardData } from "../utilities";
function ReassignJob() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, recruiter } = location.state || {};
  console.log(recruiter);
  const [recruiters, setRecruiters] = useState([]);
  const notify = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);
  const [rec, setrec] = useState("");

  const { recruiters: rdxRecruiters, managers } = useSelector(
    (state) => state.userSliceReducer,
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let arr = [];
        for (const item of rdxRecruiters) {
          arr.push(item["username"]);
        }
        setRecruiters(
          arr.filter((item) => {
            if (recruiter.includes(item)) {
              return false;
            }
            return true;
          }),
        );
      } catch (err) {
        console.error("Error fetching users:", err); // Log any errors
      }
    };
    const activeUsers = [...rdxRecruiters, ...managers];
    if (activeUsers.length === 0)
      fetchUsers(); // Call the fetch function inside useEffect
    else {
      const data = activeUsers.filter((item) => item.user_type === "recruiter");
      let arr = [];
      for (const item of data) {
        arr.push(item["username"]);
      }
      setRecruiters(
        arr.filter((item) => {
          if (recruiter.includes(item)) {
            return false;
          }
          return true;
        }),
      );
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!rec) {
      notifyError("Please select a recruiter.");
      return;
    }
    try {
      const response = await axios.post(
        // `api/assign_job/${id}`, {
        `https://ats-9.onrender.com/assign_job/${id}`,
        {
          user_id: localStorage.getItem("user_id")
            ? localStorage.getItem("user_id")
            : location.state?.user_id,
          recruiters: [rec],
        },
      );

      // console.log(response.data);
      if (response.status === "error") {
        notifyError(response.data.message);
      } else {
        getDashboardData();
        getAllJobs().then(() => {
          notify(response.data.message);
          navigate("/JobListing");
        });
      }
    } catch (error) {
      console.error("Error assigning job:", error);
      notifyError("Error occured, Please Try again.");
    }
  };
  useEffect(() => {
    localStorage.setItem("path", location.state.path);
  }, []);

  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div
          style={{ display: "flex", marginTop: "15px", paddingLeft: "20px" }}
        >
          <button
            className="back-button"
            onClick={() => navigate("/JobListing")}
            style={{ marginTop: "40px" }}
          >
            <FaArrowLeft />
          </button>
          <h1
            className="headingtwo"
            style={{
              paddingTop: "20px",
              textAlign: "center",
              display: "inline-block",
              width: "85%",
              fontSize: "21px",
            }}
          >
            Assign Recruiters to Job
          </h1>
        </div>
        <div className="container_RA">
          <form method="post" onSubmit={handleFormSubmit}>
            <h3 style={{ textAlign: "center" }}>Job Information</h3>
            <table
              style={{
                margin: "0 auto",
                textAlign: "center",
                marginTop: "15px",
              }}
            >
              <tbody>
                <tr style={{ verticalAlign: "top", color: "black" }}>
                  <th>Current Recruiter :</th>
                  <td>{recruiter}</td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>
                    <span className="required-field">*</span>Recruiter :
                  </th>
                  <td>
                    <select
                      id="recruiter"
                      name="recruiter"
                      className="form-select"
                      value={rec}
                      onChange={(e) => {
                        setrec(e.target.value);
                      }}
                      style={{ width: "150px", textAlign: "left" }}
                    >
                      <option value="" disabled>
                        {" "}
                        Select recruiter
                      </option>
                      {recruiters.map((item, idx) => (
                        <option key={idx}>{item}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>

            <button className="btn_RA">Assign Recruiters</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReassignJob;
