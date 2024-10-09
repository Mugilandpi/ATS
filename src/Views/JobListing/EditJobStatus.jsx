import React, { useState, useEffect } from "react";
import LeftNav from "../../Components/LeftNav";
import TitleBar from "../../Components/TitleBar";
import Modal from "react-modal";
// Import react-modal
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../Components/leftnav.css";
import "../../Components/titlenav.css";
import "./EditJobStatus.css";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { getAllJobs } from "../utilities";
import { getDashboardData } from "../utilities";
import { ThreeDots } from "react-loader-spinner";

function EditJobStatus() {
  const [jobStatus, setJobStatus] = useState("Active"); // Default value for job status
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notify = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);
  const item = location.state.item || {};
  console.log(item, "item");

  // if (!localStorage.getItem("path", location.state.path)) {
  //   localStorage.setItem("path", location.state.path);
  // }

  const handleStatusChange = (e) => {
    setJobStatus(e.target.value);
    setStatusChanged(true);
    setErrorMessage(""); // Clear error message on status change
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleReadMore = (fullJd) => {
    setModalIsOpen(true); // Open the modal when "Read More" is clicked
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal when "OK" is clicked
  };

  const handleSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      if (!statusChanged || jobStatus === "Select Job Status") {
        toast.error("Please change the job status before submitting.");
        setwaitForSubmission(false);
        return;
      }
      try {
        const response = await fetch(
          // `api/update_job_status/${item.id}`, {
          `https://ats-9.onrender.com/update_job_status/${item.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
              new_job_status: jobStatus,
            }),
          },
        );

        const data = await response.json();
        if (data.status === "success") {
          getAllJobs().then(() => {
            notify(data.message);
            setwaitForSubmission(false);
            navigate("/JobListing");
            // getDashboardData();
          });
        } else {
          notifyError(data.message);
          setwaitForSubmission(false);
        }
      } catch (error) {
        console.error("Error updating job status:", error);
        setwaitForSubmission(false);
        notifyError("Error Occurred please Try Again");
        // Handle network errors or other exceptions here
      }
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
        {/* <div className="container"> */}
        <div
          style={{
           
          }}
          className="statusleft"
        >
          <button
            className="back-button"
            onClick={() => navigate("/JobListing")}
            style={{}}
          >
            <FaArrowLeft />
          </button>
        </div>
        <div
          className="card_EJS"
          style={{
          
          }}
        >
          {" "}
          <div
            className="card_content"
            style={{ width: "100%", width: "600px" }}
          >
            <div
              className="card_header"
              style={{
                padding: " 10px 0",
                textAlign: "center",
                width: "100%",
              }}
            >
              <span
                style={{
                  display: "inline-block",

                  marginLeft: "-15%",

                  fontWeight: "500",
                  fontSize: "19px",
                }}
              >
                Job Details
              </span>
            </div>
            <div style={{overflow:"auto"}} className="card_body p-2">
              <table>
                <tbody>
                  <tr style={{ height: "25px" }}>
                    <th className="ejs"> Job id </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.id}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Client </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.client}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Experience Min </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.experience_min}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Experience Max</th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.experience_max}</td>
                  </tr>
                  <tr>
                    <th className="ejs">Budget Min </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.budget_min}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Budget Max </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.budget_max}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Job Type </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.job_type}</td>
                  </tr>
                  <tr>
                    <th className="ejs">Location </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.location}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Shift Timings </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.shift_timings}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Notice period </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.notice_period}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Role </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.role}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Skills </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.skills}</td>
                  </tr>
                  <tr>
                    <th className="ejs"> Detailed JD </th>
                    <span>:</span>
                    <td style={{ color: "black", wordWrap: "break-word" }}>
                      {item.detailed_jd ? (
                        item.detailed_jd.length > 10 ? (
                          <>
                            {item.detailed_jd.substring(0, 10)}...{" "}
                            {/* Display first 50 words */}
                            <span
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={() => handleReadMore(item.detailed_jd)}
                            >
                              Read More
                            </span>
                          </>
                        ) : (
                          item.detailed_jd
                        )
                      ) : (
                        <span>---</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="ejs">Mode </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.mode}</td>
                  </tr>
                  <tr>
                    <th className="ejs">Recruiter </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.recruiter}</td>
                  </tr>
                  <tr>
                    <th className="ejs">Management </th>
                    <span>:</span>
                    <td style={{ color: "black" }}>{item.management}</td>
                  </tr>
                  <tr>
                    <th className="ejs" style={{ paddingTop: "3px" }}>
                      {" "}
                      Job Status
                    </th>
                    <span style={{ paddingTop: "5px" }}> :</span>
                    <td style={{ paddingTop: "3px" }}>
                      <select
                        name="job_status"
                        id="job_status"
                        className="form-select form-control-lg"
                        // value={jobStatus}
                        onChange={handleStatusChange}
                        defaultValue={item.job_status}
                        style={{ width: "160px" }}
                      >
                        <option value="" selected disabled>
                          Select Job Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </td>
                  </tr>
                  <button
                    type="submit"
                    className="btn2_EJS"
                    onClick={handleSubmit}
                  >
                    {waitForSubmission ? "" : "Update"}
                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                      }}
                      visible={waitForSubmission}
                      height="45"
                      width="45"
                      color="white"
                      ariaLabel="oval-loading"
                    />
                  </button>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Account Created Successfully"
        className="Modal editjobs"
        overlayClassName="Overlay"
      >
        <h2>Detailed JD</h2>
        <div className="logout-popup-overlay">
          <div className="logout-popup-container">
            <p style={{ color: "#000", fontWeight: "400", textAlign:"justify" }}>
              {item.detailed_jd}
            </p>
            <div>
              <button onClick={closeModal}>ok</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default EditJobStatus;
