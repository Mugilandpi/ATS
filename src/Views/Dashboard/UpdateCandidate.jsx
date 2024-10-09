import React, { useState, useEffect } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "../Dashboard/UpdateCandidate.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

import { ThreeDots } from "react-loader-spinner";

import { getDashboardData } from "../utilities.js";

// Initialize toast notifications
//toast.configure();

const statusToLevelMapping = {
  "screening selected": "Screening",
  "screen rejected": "Screening",
  "L1 - schedule": "Level1",
  "L1 - feedback": "Level1",
  "L1 - selected": "Level1",
  "L1 - rejected": "Level1",
  "L1 - candidate reschedule": "Level1",
  "L1 - panel reschedule": "Level1",
  "L2 - schedule": "Level2",
  "L2 - feedback": "Level2",
  "L2 - selected": "Level2",
  "L2 - rejected": "Level2",
  "L2 - candidate reschedule": "Level2",
  "L2 - panel reschedule": "Level2",
  "L3 - schedule": "Level3",
  "L3 - feedback": "Level3",
  "L3 - selected": "Level3",
  "L3 - rejected": "Level3",
  "L3 - candidate reschedule": "Level3",
  "L3 - panel reschedule": "Level3",
  "hr - round": "Additional Rounds",
  "managerial round": "Additional Rounds",
  negotiation: "Final Outcomes",
  selected: "Final Outcomes",
  "offer - rejected": "Final Outcomes",
  "offer - declined": "Final Outcomes",
  "on - boarded": "Final Outcomes",
  hold: "Other Status",
  drop: "Other Status",
  duplicate: "Other Status",
  "candidate no-show": "Other Status",
};

function UpdateCandidate() {
  const [option_selected, setOptionSelected] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state.item || {};
  const [statusChanged, setStatusChanged] = useState(false);

  const [waitForSubmission, setwaitForSubmission] = useState(false);

  const [candidateStatus, setCandidateStatus] = useState("Select Level");
  const [comments, setComments] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    if (item && item.status) {
      const lowerCaseStatus = item.status.toLowerCase();
      setCandidateStatus(lowerCaseStatus);
      setLevel(statusToLevelMapping[lowerCaseStatus]);
      console.log(
        "Initial candidate status and level set:",
        lowerCaseStatus,
        statusToLevelMapping[lowerCaseStatus],
      );
    }
  }, [item]);

  useEffect(() => {
    if (candidateStatus) {
      const lowerCaseStatus = candidateStatus.toLowerCase();
      setLevel(statusToLevelMapping[lowerCaseStatus]);
      console.log(
        "Candidate status changed, new level set:",
        lowerCaseStatus,
        statusToLevelMapping[lowerCaseStatus],
      );
    }
  }, [candidateStatus]);

  const handleFormSubmit = async (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      if (!statusChanged || candidateStatus === "Select Level") {
        toast.error("Please change the candidate status before submitting.");
        setwaitForSubmission(false);
        return;
      }
      try {
        const userId =
          localStorage.getItem("user_id") || location.state?.user_id;
        if (!userId) {
          throw new Error("User ID is required");
        }

        const response = await fetch(
          `http://144.126.254.255/update_candidate/${item.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              candidate_status: candidateStatus.toLocaleUpperCase(),
              comments: comments,
              user_id: userId,
            }),
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to update candidate");
        }
        // console.log("Candidate updated successfully:", data);
        // toast.success("Candidate updated successfully!");
        // localStorage.setItem("isUpdated", true);
        getDashboardData().then(() => {
          setwaitForSubmission(false);
          toast.success(data.message);
          navigate("/dashboard");
        });
      } catch (error) {
        console.error("Error updating candidate:", error);
        toast.error("Error updating candidate");
        setwaitForSubmission(false);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("path", location.state.path);
    console.log("Path set in local storage:", location.state.path);
  }, []);

  const handleLevelChange = (e) => {
    setLevel(e.target.innerText?.trim());
    setCandidateStatus(""); // Reset candidate status when level changes
    console.log("Level changed:", e.target.innerText?.trim());
  };

  const handleStatusChange = (e) => {
    setCandidateStatus(e.target.innerText?.trim());
    console.log("Status changed:", e.target.innerText?.trim());
    setStatusChanged(true);
    setOptionSelected(false);
  };
  const handleMouseEnter = () => {
    console.log("mouse enter");
    setOptionSelected(true);
  };
  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div
        className="updatecandidatetable"
          style={{  }}
        >
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
          </button>
          <h5
            className="title"
            style={{ }}
          >
            Update Candidate Status
          </h5>
        </div>
        <div className="update-container">
          <form className="Form_UC" onSubmit={handleFormSubmit}>
            <table className="tbuc">
              <thead>
                <tr style={{ color: "black" }}>
                  <th className="th">Name</th>
                  <th className="th">Mobile</th>
                  <th className="th">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "black", textAlign: "center" }}>
                  <td className="tr">{item.name}</td>
                  <td className="tr">{item.mobile}</td>
                  <td className="tr">{item.email}</td>
                </tr>
              </tbody>
            </table>

            <h6
              style={{ marginTop: "10px", color: "darkblue", fontSize: "16px" }}
            >
              Candidate Current Status
            </h6>

            <div>
              {/* <select value={level} onChange={handleLevelChange}>
                <option value="">Select Level</option>
                {Object.keys(levels).map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>

              {level && (
                <select value={candidateStatus} onChange={handleStatusChange}>
                  <option value="">Select Status</option>
                  {levels[level].map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              )} */}

              <div class="menu" onMouseEnter={handleMouseEnter}>
                <ul>
                  <li>
                    <label
                      class="for-dropdown"
                      style={{ justifyContent: "center", bottom: "-5px" }}
                    >
                      {" "}
                      Level: {candidateStatus}{" "}
                    </label>
                    {option_selected && (
                      <ul>
                        <li
                          onClick={handleLevelChange}
                          style={{ display: "none" }}
                        >
                          Screening{" "}
                        </li>
                        <li>
                          Screening
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              Screening selected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Screen Rejected
                            </li>
                          </ul>
                        </li>
                        <li>
                          Level1
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              L1 - Schedule
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L1 - Feedback
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L1 - Selected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L1 - Rejected{" "}
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L1 - Candidate Reschedule{" "}
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L1 - Panel Reschedule{" "}
                            </li>
                          </ul>
                        </li>
                        <li>
                          Level 2
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              L2 - Schedule
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L2 - Feedback
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L2 - Selected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L2 - Rejected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L2 - Candidate Reschedule
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L2 - Panel Reschedule
                            </li>
                          </ul>
                        </li>
                        <li>
                          Level 3
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              L3 - Schedule
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L3 - Feedback
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L3 - Selected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L3 - Rejected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L3 - Candidate Reschedule
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              L3 - Panel Reschedule
                            </li>
                          </ul>
                        </li>
                        <li>
                          Additional Rounds
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              HR - Round
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Managerial Round
                            </li>
                          </ul>
                        </li>
                        <li>
                          Final Outcomes
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              Negotiation
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Selected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Offer - Rejected
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Offer - Declined
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              On - boarded
                            </li>
                          </ul>
                        </li>
                        <li>
                          Other Statuses
                          <ul>
                            <li class="link" onClick={handleStatusChange}>
                              Hold
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Drop
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Duplicate
                            </li>
                            <li class="link" onClick={handleStatusChange}>
                              Candidate No - show
                            </li>
                          </ul>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              </div>
            </div>
            {/* <div class="sec-center">
            <input class="dropdown" type="checkbox" id="dropdown" name="dropdown" />
              <label class="for-dropdown" for="dropdown">Level: {candidateStatus}   <FaAngleDown style={{alignItems:"right"}} /></label>
              <div class="section-dropdown">
                <li onClick={handleLevelChange} style={{display:"none"}}>Screening <i class="uil uil-arrow-right"></i></li>
                <input class="dropdown-sub" type="checkbox" id="dropdown-sub" name="dropdown-sub" />
                <label class="for-dropdown-sub" for="dropdown-sub">Screening<FaAngleRight  /></label>
                <div class="section-dropdown-sub">
                  <li onClick={handleStatusChange}>Screening selected</li>
                  <li onClick={handleStatusChange}>Screen Rejected</li>
                </div>
                <input class="dropdown-sub1" type="checkbox" id="dropdown-sub1" name="dropdown-sub" />
                <label class="for-dropdown-sub1" for="dropdown-sub1">Level1 <FaAngleRight  /></label>
                <div class="section-dropdown-sub1">
                  <li onClick={handleStatusChange}>L1-Schedule</li>
                  <li onClick={handleStatusChange}>L1-Feedback</li>
                  <li onClick={handleStatusChange}>L1-Selected</li>
                  <li onClick={handleStatusChange}>L1-Rejected</li>
                  <li onClick={handleStatusChange}>Candidate Reschedule</li>
                  <li onClick={handleStatusChange}>Panel Reschedule</li>
                </div>
                <input class="dropdown-sub2" type="checkbox" id="dropdown-sub2" name="dropdown-sub" />
                <label class="for-dropdown-sub2" for="dropdown-sub2">Level2 <FaAngleRight  /></label>
                <div class="section-dropdown-sub2">
                  <li onClick={handleStatusChange}>L2-Schedule</li>
                  <li onClick={handleStatusChange}>L2-Feedback</li>
                  <li onClick={handleStatusChange}>L2-Selected</li>
                  <li onClick={handleStatusChange}>L2-Rejected</li>
                  <li onClick={handleStatusChange}>Candidate Reschedule</li>
                  <li onClick={handleStatusChange}>Panel Reschedule</li>
                </div>
                <input class="dropdown-sub3" type="checkbox" id="dropdown-sub3" name="dropdown-sub" />
                <label class="for-dropdown-sub3" for="dropdown-sub3">Level3 <FaAngleRight  /></label>
                <div class="section-dropdown-sub3">
                  <li onClick={handleStatusChange}>L3-Schedule</li>
                  <li onClick={handleStatusChange}>L3-Feedback</li>
                  <li onClick={handleStatusChange}>L3-Selected</li>
                  <li onClick={handleStatusChange}>L3-Rejected</li>
                  <li onClick={handleStatusChange}>Candidate Reschedule</li>
                  <li onClick={handleStatusChange}>Panel Reschedule</li>
                </div>
                <input class="dropdown-sub4" type="checkbox" id="dropdown-sub4" name="dropdown-sub" />
                <label class="for-dropdown-sub4" for="dropdown-sub4">Additional Rounds <FaAngleRight  /></label>
                <div class="section-dropdown-sub4">
                  <li onClick={handleStatusChange}>HR-Round</li>
                  <li onClick={handleStatusChange}>Managerial Round</li>
                </div>
                <input class="dropdown-sub5" type="checkbox" id="dropdown-sub5" name="dropdown-sub" />
                <label class="for-dropdown-sub5" for="dropdown-sub5">Final Outcomes <FaAngleRight  /></label>
                <div class="section-dropdown-sub5">
                  <li onClick={handleStatusChange}>Negotiation</li>
                  <li onClick={handleStatusChange}>Selected</li>
                  <li onClick={handleStatusChange}>Offer-Rejected</li>
                  <li onClick={handleStatusChange}>Offer-Declined</li>
                  <li onClick={handleStatusChange}>On-boarded</li>
                </div>
                <input class="dropdown-sub6" type="checkbox" id="dropdown-sub6" name="dropdown-sub" />
                <label class="for-dropdown-sub6" for="dropdown-sub6">Other Status<FaAngleRight  /></label>
                <div class="section-dropdown-sub6">
                  <li onClick={handleStatusChange}>Hold</li>
                  <li onClick={handleStatusChange}>Drop</li>
                  <li onClick={handleStatusChange}>Duplicate</li>
                  <li onClick={handleStatusChange}>L2-REJECTED</li>
                  <li onClick={handleStatusChange}>Candidate No-show</li>
                </div>
              </div>
            </div> */}

            <div className="input-fied">
              <label htmlFor="comments" style={{ color: "darkblue" }}>
                Comment
              </label>
              <br />
              <textarea
                name="comments"
                id="comments"
                className="Textarea"
                style={{
                  marginTop: "-25px",
                  height: "100px",
                  width: "250px",
                  marginBottom: "20px",
                }}
                onChange={(e) => setComments(e.target.value)}
                value={comments}
              ></textarea>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="submit"
                value={waitForSubmission ? "" : "Update Candidate"}
              />
              <ThreeDots
                wrapperClass="ovalSpinner"
                wrapperStyle={{
                  position: "absolute",
                  top: "-3px",
                  left: "60px",
                }}
                visible={waitForSubmission}
                height="45"
                width="45"
                color="white"
                ariaLabel="oval-loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCandidate;
