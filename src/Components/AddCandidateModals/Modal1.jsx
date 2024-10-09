import React from "react";
import {useRef} from "react"
// eslint-disable-next-line react/prop-types
const Modal = ({
  showDuplicate1,
  handleCloseNProceed,
  duplicate,
  setShowDuplicate1,
  setwaitForSubmission,
}) => {
 
  return (
    <>
      {showDuplicate1 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "80%",
              maxWidth: "600px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Alert!</h3>
            <h5 style={{ textAlign: "left", display: "inline" }}>
              {" "}
              We have found candidate with same Email/Mobile
            </h5>
            <table
              style={{ width: "100%", marginTop: "10px", borderSpacing: "0px" }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "center",
                    backgroundColor: "#32406d",
                    color: "white",
                  }}
                >
                  <th style={{ border: "1px solid #e6e6e6" }}>Job Id</th>
                  <th style={{ border: "1px solid #e6e6e6" }}>Date</th>
                  <th style={{ border: "1px solid #e6e6e6" }}>Client</th>
                  <th style={{ border: "1px solid #e6e6e6" }}>Profile</th>
                  <th style={{ border: "1px solid #e6e6e6" }}>Status</th>
                </tr>
              </thead>
              <tbody
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  color: "black",
                }}
              >
                {duplicate.map((candidate, index) => (
                  <tr
                    key={index}
                    style={{
                      textAlign: "center",
                      backgroundColor: index % 2 === 0 ? "white" : "lightgray",
                      color: "black",
                      fontSize: "12px",
                    }}
                  >
                    <td style={{ border: "1px solid #e6e6e6" }}>
                      {candidate.job_id}
                    </td>
                    <td style={{ border: "1px solid #e6e6e6" }}>
                      {candidate.date}
                    </td>
                    <td style={{ border: "1px solid #e6e6e6" }}>
                      {candidate.client}
                    </td>
                    <td style={{ border: "1px solid #e6e6e6" }}>
                      {candidate.profile}
                    </td>
                    <td style={{ border: "1px solid #e6e6e6" }}>
                      {candidate.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  
                  fontSize: "13px",
                  color: "black",
                  alignSelf: "center",
                  border:"none",
                  backgroundColor:"#32406d",
                  color:"#fff",
                  borderRadius:"5px",
                  padding:"5px 15px"
                }}
                onClick={() => {
                  setShowDuplicate1(false);
                  setwaitForSubmission(false);
                }}
              >
                Close
              </button>
              <button
                id = {"closeNProceedId"}
                style={{
        
                  fontSize: "13px",
                  color: "black",
                  alignSelf: "center",
                  border:"none",
                  backgroundColor:"#32406d",
                  color:"#fff",
                    borderRadius:"5px",
                  padding:"5px 15px"
                }}
                onClick={() => handleCloseNProceed("closeNProceedId")}
              >
                Close and Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
