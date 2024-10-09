/* eslint-disable react/prop-types */
import React from "react";

// eslint-disable-next-line react/prop-types
const Modal2 = ({
  showDuplicate2,
  duplicateCandidate,
  setShowDuplicate2,
  setwaitForSubmission,
}) => {
  return (
    <>
      {showDuplicate2 && (
        <div
          style={{
            padding: "10px",
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
              height: "190px",
              width: "500px",
              // display:'flex',
              // flexDirection:'column',
              borderRadius: "10px",
              padding: "10px 20px",
            }}
          >
            <h3> Alert!</h3>
            <p
              style={{
                paddingTop: "10px",
                fontSize: "15px",
                textAlign: "left",
              }}
            >
              <span style={{ color: "red" }}>
                {" "}
                Duplicate sourcing is not permitted for this candidate,{" "}
              </span>{" "}
              whose mobile or email is already associated with client{" "}
              <span style={{ fontWeight: "bolder" }}>
                {duplicateCandidate.client}{" "}
              </span>{" "}
              for profile{" "}
              <span style={{ fontWeight: "bolder" }}>
                {duplicateCandidate.profile}{" "}
              </span>{" "}
              for job id:
              <span style={{ fontWeight: "bolder" }}>
                {duplicateCandidate.job_id}{" "}
              </span>{" "}
              sourced on{" "}
              <span style={{ fontWeight: "bolder" }}>
                {duplicateCandidate.date}{" "}
              </span>
              .
            </p>
            <button
            style={{   border:"none",
              backgroundColor:"#32406d",
              color:"#fff",
                borderRadius:"5px",
              padding:"5px 15px"}}
              onClick={() => {
                setShowDuplicate2(false);
                setwaitForSubmission(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal2;
