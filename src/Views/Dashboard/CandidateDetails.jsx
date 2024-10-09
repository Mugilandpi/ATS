import React, { useEffect, useMemo } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "./CandidateDetails.css";
import * as XLSX from "xlsx";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function CandidateDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const candidate = location.state;

  const exportToExcel = () => {
    const data = [
      ["Name", candidate.name],
      ["Email", candidate.email],
      ["Mobile", candidate.mobile],
      ["Client", candidate.client],
      ["Recruiter", candidate.recruiter],
      ["Date Created", candidate.date_created],
      ["Profile", candidate.profile],
      ["Skills", candidate.skills],
      ["Current Company", candidate.current_company],
      ["Position", candidate.position],
      ["Current Job Location", candidate.current_job_location],
      ["Preferred Job Location", candidate.preferred_job_location],
      ["Qualifications", candidate.qualifications],
      ["Experience", candidate.experience],
      ["Relevant Experience", candidate.relevant_experience],
      ["Current CTC", candidate.current_ctc],
      ["Expected CTC", candidate.experted_ctc],
      ["Comments", candidate.comments || "---"],
      ["LinkedIn URL", candidate.linkedin_url],
      ["Reason for Job Change", candidate.reason_for_job_change],
      ["Remarks", candidate.remarks],
      ["Reference", candidate.reference || "---"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidate Details");
    XLSX.writeFile(wb, "candidate_details.xlsx");
  };

  useMemo(() => {
    console.log(candidate);
  }, []);
  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div class="candidate-container">
          <div style={{ display: "flex", paddingLeft: "20px" }}>
            <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
              style={{ marginTop: "2px" }}
            >
              <FaArrowLeft />
            </button>
            <h3 style={{ marginRight: "20px" }} class="head-cand">
              Candidate Primary Details
            </h3>
            <button class="export-excel" onClick={exportToExcel}>
              Export to excel
            </button>
          </div>

          <div class="details">
            <table class="vertical-table">
              <tr>
                <th>Name</th>

                <td> {candidate.item.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td> {candidate.item.email}</td>
              </tr>
              <tr>
                <th>Mobile</th>
                <td>{candidate.item.mobile}</td>
              </tr>
              <tr>
                <th>Client</th>
                <td>{candidate.item.client}</td>
              </tr>

              <tr>
                <th>Recruiter</th>
                <td>{candidate.item.recruiter}</td>
              </tr>

              <tr>
                <th>Date Created</th>
                <td>{candidate.item.date_created}</td>
              </tr>
            </table>
          </div>

          <h3 style={{ textAlign: "center" }}>Candidate Additional Details</h3>
          <div class="vertical-container">
            <div class="vertical-column">
              <table class="vertical-table">
                <tbody>
                  <tr>
                    <th>Current Company</th>
                    <td>{candidate.item.current_company}</td>
                  </tr>
                  <tr>
                    <th>Position</th>
                    <td>{candidate.item.position}</td>
                  </tr>
                  <tr>
                    <th>Profile</th>
                    <td>{candidate.item.profile}</td>
                  </tr>
                  <tr>
                    <th>Skills</th>
                    <td>{candidate.item.skills}</td>
                  </tr>
                  <tr>
                    <th>Current Job Location</th>
                    <td>{candidate.item.current_job_location}</td>
                  </tr>
                  <tr>
                    <th>Job Location</th>
                    <td>{candidate.item.preferred_job_location}</td>
                  </tr>
                  <tr>
                    <th>Qualifications</th>
                    <td>{candidate.item.qualifications}</td>
                  </tr>
                  <tr>
                    <th>Experience</th>
                    <td>{candidate.item.experience}</td>
                  </tr>
                  <tr>
                    <th>Relevant Experience</th>
                    <td>{candidate.item.relevant_experience}</td>
                  </tr>
                  <tr>
                    <th>Current CTC</th>
                    <td>{candidate.item.current_ctc}</td>
                  </tr>
                  <tr>
                    <th>Expected CTC</th>
                    <td>{candidate.item.experted_ctc}</td>
                  </tr>
                  <tr>
                    <th>Comment</th>
                    <td>
                      <div style={{ display: "flex" }}>
                        {candidate.item.comments
                          ? candidate.item.comments
                          : "---"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Linkedin url</th>
                    <td>
                      <a href="{{ candidate.linkedin_url }}">
                        {candidate.item.linkedin_url}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="vertical-column">
              <table class="vertical-table">
                <tbody>
                  <tr>
                    <th>Serving Notice Period</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Last Working Date</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Buyout</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Notice Period</th>
                    <td>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {candidate.item.period_of_notice
                          ? candidate.item.period_of_notice
                          : "---"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Holding Offer</th>
                    <td>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {candidate.item.holding_offer
                          ? candidate.item.holding_offer
                          : "---"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Total Offers</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Highest Package (LPA)</th>

                    {/* <td>
                                        <p>--</p>
                                    </td> */}

                    {/* <td>package_in_lpa</td> */}
                    <td>
                      {candidate.item.package_in_lpa ? (
                        candidate.item.package_in_lpa
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ---
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Reason for Job Change</th>
                    <td>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {candidate.item.reason_for_job_change}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Remarks</th>
                    <td>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {candidate.item.remarks}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>Reference</th>
                    <td>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {candidate.item.reference
                          ? candidate.item.reference
                          : "---"}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>Resume</th>
                    <td>
                      <a href="{{ url_for('download_resume', candidate_id=candidate.id) }}">
                        Download Resume
                      </a>
                      <pre></pre>
                    </td>
                  </tr>
                  <tr>
                    <th>Detailed JD</th>
                    <td>
                      <a href="{{ url_for('download_jd', job_id=candidate.job_id) }}">
                        Download JD
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textAlign: " center" }} class="bottom-btn">
            <a
              class="btn2"
              onClick={() => navigate("/dashboard")}
              style={{ color: "#fff", textDecoration: " none" }}
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails;
