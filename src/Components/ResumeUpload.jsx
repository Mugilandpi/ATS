import React, { useState } from "react";
import Modal from "react-modal";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Views/Dashboard/dashboard.css";
import { ThreeDots } from "react-loader-spinner";

const ResumeUpload = ({ ResumeModal, handleCloseResume }) => {
  const [waitForSubmission, setWaitForSubmission] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadOption, setUploadOption] = useState("file"); // Set default to 'file'
  
  const notify = () => toast.success("Resumes uploaded successfully!");
   const notifyError = () => toast.error("Error uploading files.");

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFolderChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setSelectedFiles(Array.from(files));
      console.log("Selected folder files:", files);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      console.log(newFiles, "Newly selected files");
    }
  };

  const handleresume = async (e) => {
    e.preventDefault();
 
    if (selectedFiles.length > 0) {
      setWaitForSubmission(true);
 
      const base64Files = await Promise.all(
        selectedFiles.map(fileToBase64)
      );
 
      const payload = {
        resumes: base64Files,
      };
 
      console.log("Payload being sent:", payload);
 
      try {
        const response = await fetch("https://ats-9.onrender.com/extract_resumes", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
 
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
  
        const data = await response.json();
        console.log("Upload response:", data);
  
        // If there are duplicate emails, show a warning toast
        if (data.duplicate_emails && Array.isArray(data.duplicate_emails) && data.duplicate_emails.length > 0) {
          console.log(data.duplicate_emails, "duplicate email");
          toast.warn(`Duplicate emails found: ${data.duplicate_emails.join(", ")}`, {
            position: "top-right",
            autoClose: 3000,
            zIndex: 9999,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
  
        // Proceed with success logic if valid candidates were processed
        if (data.resume_data && Array.isArray(data.resume_data) && data.resume_data.length > 0) {
          // Display a success toast if non-duplicate resumes are processed
          notify(); // Success notification
          console.log("Valid candidates:", data.valid_candidates);
        }
  
        setSelectedFiles([]);
        handleCloseResume();
  
      } catch (error) {
        console.error("Error uploading files:", error);
        notifyError();
      } finally {
        setWaitForSubmission(false);
      }
    } else {
      console.log("No files to upload");
    }
  };

  const handleUploadOptionChange = (e) => {
    setUploadOption(e.target.value); // Update the selected option
    setSelectedFiles([]); // Reset selected files when changing option
  };

  return (
    <div>
      <Modal
        isOpen={ResumeModal}
        onRequestClose={handleCloseResume}
        contentLabel="Resume Upload"
        className="modal-content"
        overlayClassName="modal-overlay"
        id='resumeupload'
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(0.5px)",
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
            width: "400px",
            minHeight: "300px",
            overflow: "auto",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            padding: "5px 10px 10px",
          },
        }}
      >
        <div className="modal-actions" style={{ marginBottom: "10px" }}>
          <div style={{  }} className="Resumehead">
            <h2 style={{ color: "#32406d" }}>Resume Upload</h2>
            <MdCancel onClick={handleCloseResume} style={{ cursor: "pointer", color: "#32406d", height: "30px", width: "30px" }} />
          </div>

          <form onSubmit={handleresume} style={{ marginTop: "10px", display: "flex", flexDirection: "column" }} className="resumehub">
            <div style={{ color: "#32406d" }}>
              <label htmlFor="uploadOption" style={{ marginBottom: "5px", color: "#32406d" }}>Upload Type:</label>
              <select
                id="uploadOption"
                value={uploadOption}
                onChange={handleUploadOptionChange}
                style={{ marginBottom: "15px", borderRadius: "5px", border: "1px solid #aaa",width:"50%" }}
              >
                <option value="file">Upload File</option>
                <option value="folder">Upload Folder</option>
              </select>
            </div>

            {uploadOption === "file" && (
              <>
                <label htmlFor="resumeFile" style={{ marginBottom: "5px", color: "#32406d" }}>Upload File:</label>
                <input
                  style={{ margin: "0px 5px 5px 0px", border: "1px solid #aaa", padding: "10px 15px", borderRadius: "5px" }}
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="*/*"
                />
              </>
            )}

            {uploadOption === "folder" && (
              <>
                <label htmlFor="resumeFolder" style={{ marginBottom: "5px", color: "#32406d" }}>Upload Folder:</label>
                <input
                  style={{ margin: "0px 5px 5px 0px", border: "1px solid #aaa", padding: "10px 15px", borderRadius: "5px" }}
                  type="file"
                  onChange={handleFolderChange}
                  webkitdirectory="true"
                  multiple
                  accept=".pdf,.doc,.docx"
                />
              </>
            )}

            <div style={{ textAlign: "center" }}>
              <button
                id="addCandidateSubmit"
                type="submit"
                style={{
                  borderRadius: "4px",
                  background: "#32406D",
                  color: "#fff",
                  marginTop:'5px',
                  width: "100px",
                  position: "relative",
                }}
              >
                {waitForSubmission ? "" : "Submit"}
                <ThreeDots
                  wrapperClass="ovalSpinner"
                  wrapperStyle={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  visible={waitForSubmission}
                  height="45"
                  width="45"
                  color="white"
                  ariaLabel="oval-loading"
                />
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ResumeUpload;
