import React, { useState, useEffect } from "react";
import LeftNav from "../Components/LeftNav";
import TitleBar from "../Components/TitleBar";
import { ThreeDots } from "react-loader-spinner";
import {
    storedCandidates
  } from "../Views/utilities";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { FcCheckmark } from "react-icons/fc";
import { TailSpin } from "react-loader-spinner";
import { FcOk } from "react-icons/fc";
import "../Components/leftnav.css";
import "../Components/titlenav.css";
import "../Views/Dashboard/dashboard.css";
import "../Views/resumesearch.css";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch } from "react-redux";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";

//import { useSelector } from "react-redux";
import {
    faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
 
function ResumeSearching() {
    const dispatch = useDispatch();
    const { jobs } = useSelector((state) => state.jobSliceReducer);
    console.log(jobs,"alldatas")
    const [showItems, setShowItems] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [candidatesData, setCandidatesData] = useState([]);
    const [alldata, setAlldata] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [waitForSubmission, setWaitForSubmission] = useState(false);
    const [showAllCandidates, setShowAllCandidates] = useState(false);

    //page count for get all candidates
    const [belowCount, setBelowCount] = useState(0);
    const [countItems, setCountItems] = useState(0);
    const [id, setId] = useState(1);
   // const [id, setId] = useState(1);

    // search all candidates
    const [lowCount, setLowCount] = useState(0); // Total candidates count
    
const [increasItems, setIncreasItems] = useState(0); // Page count
const [currentPage, setCurrentPage] = useState(1); // Current page
// const [60, setItemsPerPage] = useState(60); // Candidates per page

    const notify = () => toast.success("Resume downloaded successfully!");
    const profiles =jobs
        ? Array.from(new Set(jobs.map((candidate) => candidate.role)))
        : [];
 
        console.log(profiles,"all profiles")
    const filteredProfiles = profiles.filter((profile) =>
        profile.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(filteredProfiles,"filteredprofiles")
 
    const handleProfileChange = (profile) => {
        setSelectedProfile(profile);
        setSearchTerm(profile);
        setIsOpen(false);
    };
    const { StoredCandidateData } = useSelector((state) => state.storeCandidateSliceReducer);
    console.log(StoredCandidateData,"cxadd")
   // console.log(storedCandidates(),"cxadd")
 
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        if (e.target.value === "") {
          setShowAllCandidates(true);
      }
    };
 
    useEffect(() => {
        //  fetchAllCandidates();
          storedCandidates()
        }, []);
    useEffect(() => {
        if (StoredCandidateData) {
          setAlldata(StoredCandidateData); 
          setBelowCount(StoredCandidateData.length); // Set total number of candidates
          setCountItems(Math.ceil(StoredCandidateData.length / 60)); // Calculate total number of pages (60 candidates per page)
          setShowAllCandidates(true) // Set Redux data into local state
          const initial = (alldata && alldata.length > 0)
          ? new Array(alldata.length).fill().map((_, idx) => ({
              id: alldata[idx]?.id || "", // Safe access to id with fallback value
              email: false,
              skills: false,
            }))
          : [];
          // console.log(initial);
          setShowItems(initial);

        }
      }, [StoredCandidateData]);
      //console.log(alldata,"alldata")

    // const fetchAllCandidates = async () => {
    //     try {
    //         const response = await fetch("http://144.126.254.255/get_all_candidates", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             }
    //         });
 
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
 
    //         const data = await response.json();
    //         console.log("Fetched data:", data); // Log the full response
 
    //         // Check if candidate_records exists and is an array
    //         if (data.candidate_records && Array.isArray(data.candidate_records)) {
    //             setAlldata(data.candidate_records); // Set state to candidate_records
    //             setShowAllCandidates(true); // Adjust as needed
    //         } else {
    //             console.error("Fetched data does not contain candidate_records or is not an array:", data);
    //             setAlldata([]); // Set to an empty array
    //         }
    //     } catch (error) {
    //         console.error("Error fetching candidates:", error.message);
    //         setAlldata([]); // Ensure alldata is empty in case of an error
    //     }
    // };
 
    
    //   console.log(storedCandidates(),'allcandidates')
    const handleSubmit = async () => {
        if (!waitForSubmission) {
            setWaitForSubmission(true);
        //    console.log(searchTerm,"searchedvalue")
        if (!searchTerm) {
          // If searchTerm is empty, show all candidates
          setShowAllCandidates(true);
          setWaitForSubmission(false);
          return;
      }
            if (selectedProfile) {
                try {
                    const response = await fetch("https://ats-9.onrender.com/search_resumes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ job_role: selectedProfile }),
                    });
 
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
 
                    const data = await response.json();
                    if (data && Array.isArray(data)) {
                        setCandidatesData(data);
                        setLowCount(data.length); // Update the total count based on the response
                        setIncreasItems(Math.ceil(data.length / 60)); 
                        setShowAllCandidates(false); // Reset to show only searched data
                    } else {
                        setCandidatesData([]);
                        setLowCount(0); // No data found
                        setIncreasItems(1);
                    }
                  
                   // fetchAllCandidates()
                 
                } catch (error) {
                    console.error("Error submitting profile:", error);
                } finally {
                    setWaitForSubmission(false);
                }
            }
        }
    };
  //  const  handelgetalldata = () =>{
  //   storedCandidates(); 
  //   setShowAllCandidates(true)
  //   }
    const resumeApiCall = async (candidate) => {
        // console.log("Fetching resume...");
        try {
          const response = await fetch(
            `https://ats-9.onrender.com/view_resume_research/${candidate.id}`,
            {
              method: "GET",
            }
          );
      
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // Create a link element to trigger the download
            const a = document.createElement("a");
            a.href = url;
      
            // Optionally, set a name for the downloaded file
            const fileName = candidate.name || `resume_${candidate.id}.pdf`; // You can customize the file name here
            a.download = fileName; 
      
            // Append the link to the body (required for Firefox)
            document.body.appendChild(a);
      
            // Trigger the download
            a.click();
      
            // Clean up and remove the link
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Free up memory
            notify();
          } else {
            console.log("Failed to fetch resume:", response.statusText);
          }
        } catch (err) {
          console.log("Error fetching resume:", err);
        }
      };
      const resumeApisearchCall = async (candidate) => {
        // console.log("Fetching resume...");
        try {
          const response = await fetch(
            `https://ats-9.onrender.com/view_resume_research/${candidate.candidate_id}`,
            {
              method: "GET",
            }
          );
      
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // Create a link element to trigger the download
            const a = document.createElement("a");
            a.href = url;
      
            // Optionally, set a name for the downloaded file
            const fileName = candidate.candidate_name || `resume_${candidate.id}.pdf`; // You can customize the file name here
            a.download = fileName; 
      
            // Append the link to the body (required for Firefox)
            document.body.appendChild(a);
      
            // Trigger the download
            a.click();
      
            // Clean up and remove the link
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Free up memory
            notify();
          } else {
            console.log("Failed to fetch resume:", response.statusText);
          }
        } catch (err) {
          console.log("Error fetching resume:", err);
        }
      };  

      // page number 

      const getPageRange = () => {
        const pageRange = [];
        const maxPagesToShow = 5; // Adjust this value to show more or fewer page numbers
    
        let startPage = Math.max(1, id - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(countItems, startPage + maxPagesToShow - 1);
    
        if (endPage - startPage < maxPagesToShow - 1) {
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
    
        if (startPage > 1) {
          pageRange.push(1);
          if (startPage > 2) {
            pageRange.push("...");
          }
        }
    
        for (let i = startPage; i <= endPage; i++) {
          pageRange.push(i);
        }
    
        if (endPage < countItems) {
          if (endPage < countItems - 1) {
            pageRange.push("...");
          }
          pageRange.push(countItems);
        }
    
        return pageRange;
      };
    //console.log(countItems,"countsnumber")
      const goToPage = (pageNumber) => {
        console.log(pageNumber,"searchnumbers")
        if (typeof pageNumber === "number") {
          setId(pageNumber);
        }
      };
    // search candidates page count

    const getPageRangesearch = () => {
        const pageRange = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(increasItems, startPage + maxPagesToShow - 1);
    
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
    
        if (startPage > 1) {
            pageRange.push(1);
            if (startPage > 2) {
                pageRange.push("...");
            }
        }
    
        for (let i = startPage; i <= endPage; i++) {
            pageRange.push(i);
        }
    
        if (endPage < increasItems) {
            if (endPage < increasItems - 1) {
                pageRange.push("...");
            }
            pageRange.push(increasItems);
        }
    
        return pageRange;
    };
    
    const goToPagesearch = (pageNumber) => {
     //console.log(pageNumber,"searchnumbers")
        if (pageNumber >= 1 && pageNumber<= increasItems) {
            setCurrentPage(pageNumber);
          }
        
    };

    

    const [list, setList] = useState([]);
    
 
    useEffect(() => {
      const handleClick = (e) => {
        const target = e.target;
        console.log(target);
        console.log("click detected");
        console.log(alldata);
  
        const idx = alldata.findIndex((candidate) => {
          return (
            candidate.id.toString() === target.id.substring(0, target.id.length - 1)
          );
        });
        console.log(idx);
  
        if (idx !== -1) {
          console.log(alldata[idx]);
  
          // Update the state of showItems based on the clicked target
          const update = new Array(alldata.length)
            .fill()
            .map((_, index) => ({
              id: alldata[index].id.toString(),
              skills: false,
              email: false,
             // role: false,
            }));
  
          if (target.id.endsWith("1")) {
            update[idx] = {
              ...showItems[idx],
              skills: !showItems[idx]?.skills,
              email: false,
             // role: false,
            };
          } else if (target.id.endsWith("2")) {
            update[idx] = {
              ...showItems[idx],
              skills: false,
              email: !showItems[idx]?.email,
              //role: false,
            };
             console.log(target.id,"endsdefault")
          }
          console.log(update);
          setShowItems(update);
        } else {
          if (
            target.id === "default1" ||
            target.id === "default2" ,

            console.log(target.id,"default calling")
            //target.id === "default3"
          )
            return;
  
          const initial = new Array(alldata.length).fill().map((_, index) => ({
            id: alldata[index].id.toString(),
            skills: false,
            email: false,
           // role: false,
          }));
          setShowItems(initial);
          console.log("outside");
        }
      };
  
      window.addEventListener("click", handleClick);
      return () => {
        window.removeEventListener("click", handleClick);
      };
    }, [alldata, showItems]);

    return (
        <div className="wrapper">
            <LeftNav />
            <div className="section">
                <TitleBar />
                <div
            className="mobiledash"
            >
              <label
                style={{
                  marginTop: "1vh",
                  fontWeight: "500",
                  paddingRight: "5px",
                }}
              >
                {/* search */}
              </label>
              <div style={{ display: 'flex', alignItems: 'center',zIndex:'2' }}>
              <div style={{paddingTop:"5px" }}>
                <IoMdSearch style={{ display: 'flex', alignItems: 'center', height: "22px", width: "22px", marginRight: "-25px", marginBottom: "-29px" }} />
                <input 
                  placeholder="Select a profile..."
                  style={{
                    marginTop: "4px",
                    paddingLeft: "26px",
                    height: "30px",
                    width: "300px",
                    backgroundColor: "rgba(255, 255, 255, 0.80)",
                    border: "none",
                    borderRadius: "5px",
                    padding: "0 25px"
                  }}
                  className="searching"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  //onClear={handelgetalldata}
                  onClick={() => setIsOpen(!isOpen)}
                />
                 {isOpen && (
                                <ul style={{
                                    position: "absolute",
                                    top: "90px",
                                    left: "",
                                   // right:"-100px",
                                    width: "300px",
                                    maxHeight: "350px",
                                    overflowY: "auto",
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    listStyle: "none",
                                    padding: "0",
                                    margin: "0",
                                    zIndex: "1000",
                                }}>
                                    {filteredProfiles.length > 0 ? (
                                        filteredProfiles.map((profile, index) => (
                                            <li key={index} onClick={() => handleProfileChange(profile)} style={{ padding: "8px", cursor: "pointer" }} className="dropdown-item">
                                                {profile}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="dropdown-item no-results" style={{ padding: "8px", color: "#888" }}>
                                            No profiles found
                                        </li>
                                    )}
                                </ul>
                            )}
                {/* <button style={{marginLeft:'20px',backgroundColor: "#32406d",color:'white',border:'none',padding:'4px',borderRadius:'5px'}}
                  onClick={removeAllFilter}
>clear all filters</button> */}
                {/* <img style={{marginLeft:'20px',height:'24px'}} src={clear_search} alt="svg_img" /> */}
              </div>
              <div className="remove_filter_icons" onClick={handleSubmit} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center', borderRadius: "5px", marginTop: "4px" }}>
               
                 
               {waitForSubmission ?  <TailSpin
         visible={true}
         height="25"
         width="25"
         color="#4fa94d"
         ariaLabel="tail-spin-loading"
         radius="1"
         wrapperStyle={{}}
         wrapperClass=""
       /> :  <FcCheckmark
              
       style={{ cursor: 'pointer', height: '25px', width: "25px", color: "#32406d" }} data-tooltip-id={"Submit"}  data-tooltip-content="Submit"/>
               }
                <ReactTooltip
               style={{ zIndex: 999, padding: "4px", backgroundColor: "#32406d" }}
               place="top-start"
               id="Submit"
             />
              
           </div>
                <div className="remove_filter_icons" onClick={() => {
                  setSearchTerm('');
                //  setIsOpen(true);      // Ensure the dropdown or suggestions are open
        setShowAllCandidates(true); 
                }} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center', borderRadius: "5px", marginTop: "4px" }}>
                  {/* <img style={{ cursor: 'pointer', height: '24px' }} src={clear_search} alt="svg_img"
                        data-tooltip-id={"remove_search"}
                        data-tooltip-content="Clear search"
                    /> */}
                  <MdOutlineYoutubeSearchedFor style={{ cursor: 'pointer', height: '25px', width: "25px", color: "#32406d" }} data-tooltip-id={"remove_search"}
                    data-tooltip-content="Clear search" />
                  <ReactTooltip
                    style={{ zIndex: 999, padding: "2px", backgroundColor: "#32406d" }}
                    place="top-start"
                    id="remove_search"
                  />
                </div>
               
              </div>

            </div>
            <div>
            <h5
              id="theader"
              className="joblisthead"
              style={{ padding: "0px", fontSize: "18px", fontWeight: "700", margin: "-35px 0 10px" }}
            >
              Resume Portal
            </h5>
            </div>
                <div className="dashcontainer" style={{
                    position: "relative",
                    width: "100%",
                    padding: "5px 5px",
                    background: "rgba(255, 255, 255, 0.25)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    backdropFilter: "blur(11.5px)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    height: "100%",
                    overflow: "hidden",
                }}>

                    {/* <div style={{ display: "flex", marginBottom: "5px" }}>
                        <div style={{ width: "250px", position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Select a profile..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                //onClear={handelgetalldata}
                                onClick={() => setIsOpen(!isOpen)}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    height: "40px",
                                }}
                                className="profile-input"
                            />
                            {isOpen && (
                                <ul style={{
                                    position: "absolute",
                                    top: "42px",
                                    left: "",
                                    width: "100%",
                                    maxHeight: "350px",
                                    overflowY: "auto",
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    listStyle: "none",
                                    padding: "0",
                                    margin: "0",
                                    zIndex: "1000",
                                }}>
                                    {filteredProfiles.length > 0 ? (
                                        filteredProfiles.map((profile, index) => (
                                            <li key={index} onClick={() => handleProfileChange(profile)} style={{ padding: "8px", cursor: "pointer" }} className="dropdown-item">
                                                {profile}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="dropdown-item no-results" style={{ padding: "8px", color: "#888" }}>
                                            No profiles found
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                        <div style={{ marginLeft: "30px" }}>
                            <button style={{ height: "35px", width: "120px", backgroundColor: "#32406D", color: "white", border: "none", borderRadius: "3px" }} onClick={handleSubmit}>
                                {waitForSubmission ? "" : "Submit"}
                                <ThreeDots
                                    wrapperClass="ovalSpinner"
                                    wrapperStyle={{
                                        position: "relative",
                                        top: "-4px",
                                        left: "35px",
                                    }}
                                    visible={waitForSubmission}
                                    height="45"
                                    width="45"
                                    color="white"
                                    ariaLabel="oval-loading"
                                />
                            </button>
                             <button onClick={fetchAllCandidates} style={{ marginLeft: "10px" }}>
                                Fetch All Candidates
                            </button> 
                        </div>
                    </div> */}
                    <div className="table-container" style={{
                        //height: "520px",
                        overflow: "auto",
                        marginTop:"5px"
                    
                    }}>
                        {showAllCandidates ? (
                            <table className="max-width-fit-content table" style={{ width: "100%", tableLayout: "fixed", marginTop: "0" }} id="candidates-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "100px" }}>Name</th>
                                        <th style={{ width: "110px" }}>Email</th>
                                        <th style={{ width: "100px" }}>Mobile</th>
                                        <th style={{ width: "110px" }}>Skills</th>
                                        <th style={{ width: "80px" }}>Resume</th>
                                    </tr>
                                </thead>
                                <tbody className="scrollable-body">
                                   { console.log(alldata.length,"length")}
                                    {alldata?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        Array.isArray(alldata) && alldata.slice((id - 1) * 60, id * 60).map((candidate, idx) => (
                                            <tr key={candidate.candidate_id || idx}>
                                                <td style={{  textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word", }}>{candidate.name}</td>
                                                <td
                                                 name="email_td"
                                                 id={showItems[idx]?.id + "2"}
                                                style={{ padding: "5px",
                            borderBottom: "1px solid #ddd",
                            textAlign:"left",
                            // whiteSpace: "normal",
                            // wordWrap: "break-word",
                             }}>

                              {candidate.email}
                              {showItems && showItems[idx] && showItems[idx].email ? (
                            <div
                              id={"default2"}
                              style={{
                                position: "absolute",
                                Width: "auto",
                                maxWidth: "350px",
                                height: "auto",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #666",
                                borderRadius: "10px",
                                padding: "10px",
                                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                                zIndex: "9999", // Ensure the div appears above other content
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {candidate.email}
                            </div>
                          ) : (
                            ""
                          )}
                              </td>
                                                <td style={{ padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word", }}>{candidate.phone}</td>
                                                <td  id={showItems[idx]?.id + "1"}
                          style={{
                            // position:'relative',
                            textAlign: "left",
                            padding: "5px",
                            borderBottom: "1px solid #ddd",
                          }}>
                                               {candidate.skills}
                          {showItems && showItems[idx] && showItems[idx].skills ? (
                            <div
                              id={"default1"}
                              style={{
                                position: "absolute",
                                Width: "auto",
                                maxWidth: "350px",
                                height: "auto",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #666",
                                borderRadius: "10px",
                                padding: "10px",
                                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                                zIndex: "9999", // Ensure the div appears above other content
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                       {Array.isArray(candidate.skills) ? candidate.skills.join(", ") : "No skills available"}
                            </div>
                          ) : null}
                                              
                                                    
                                                </td>
 
                                                <td style={{ width: "60px" }}>
                          <FontAwesomeIcon
                            // data-tooltip-id={
                            //     candidate["resume_present"] !== true
                            //     ? "my-tooltip"
                            //     : "random-tooltip"
                            // }
                            // data-tooltip-content="Resume not available"
                            icon={faFileAlt}
                            // className={
                            //     candidate["resume_present"] === true
                            //     ? "resume_option"
                            //     : "avoid_resume_option"
                            // }
                            style={{
                              color: candidate.resume_base64 ? "green" : "gray",
                              fontSize: "18px",
                              cursor:"pointer"
                            }}
                            onClick={() => {
                          
                                  resumeApiCall(candidate);
                              
                              }}
                          />
                          {/* {console.log(item.resume,"dashboardresume")} */}
                          {/* <ReactTooltip
                            style={{ zIndex: 999, padding: "4px" }}
                            place="bottom"
                            variant="error"
                            id="my-tooltip"
                          /> */}
                        </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="max-width-fit-content table" style={{ width: "100%", tableLayout: "fixed", marginTop: "0" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "100px" }}>Name</th>
                                        <th style={{ width: "200px" }}>Email</th>
                                        <th style={{ width: "150px" }}>Mobile</th>
                                        <th style={{ width: "150px" }}>Skills</th>
                                        <th style={{ width: "100px" }}>Resume</th>
                                    </tr>
                                </thead>
                                <tbody className="scrollable-body">
                                    {candidatesData.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        candidatesData.slice((currentPage - 1) * 60, currentPage * 60).map((candidate, index) => (
                                            <tr key={candidate.candidate_id || index}>
                                                <td style={{  padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word", }}>{candidate.candidate_name}</td>
                                                <td style={{  padding: "5px",
                            borderBottom: "1px solid #ddd",
                               textAlign:"left"
                            // whiteSpace: "normal",
                            // wordWrap: "break-word", 
                            }}>{candidate.email}</td>
                                                <td style={{  padding: "5px",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "normal",
                            wordWrap: "break-word", 
                            }}>{candidate.phone}</td>
                                                <td style={{  padding: "5px",
                            borderBottom: "1px solid #ddd",
                            textAlign:"left"
                            // whiteSpace: "normal",
                            // wordWrap: "break-word",
                            }}>
                                                    {candidate.candidate_skills.join(", ")}
                                                </td>
                                               
                                                <td style={{ width: "60px" }}>
                          <FontAwesomeIcon
                            // data-tooltip-id={
                            //     candidate["resume_present"] !== true
                            //     ? "my-tooltip"
                            //     : "random-tooltip"
                            // }
                            // data-tooltip-content="Resume not available"
                            icon={faFileAlt}
                            // className={
                            //     candidate["resume_present"] === true
                            //     ? "resume_option"
                            //     : "avoid_resume_option"
                            // }
                            style={{
                              color: candidate.resume_base64 ? "green" : "gray",
                              fontSize: "18px",
                               cursor:"pointer"
                            }}
                            onClick={() => {
                          
                                  resumeApisearchCall(candidate);
                              
                              }}
                          />
                          {/* {console.log(item.resume,"dashboardresume")} */}
                          {/* <ReactTooltip
                            style={{ zIndex: 999, padding: "4px" }}
                            place="bottom"
                            variant="error"
                            id="my-tooltip"
                          /> */}
                        </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                  
                    </div>
                </div>
                {showAllCandidates ? (
                <div
              style={{

              }}
              className="dashbottom"
            >
              <div>
                Showing {belowCount === 0 ? 0 : (id - 1) * 60 + 1} to{" "}
                {id * 60 <= belowCount ? id * 60 : belowCount} of {belowCount}{" "}
                entries
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
                className="pagination"
              >
                <ul className="page">
                  <li
                    className="page__btn newpage_btn"
                    style={{
                      padding: "1px 5px",
                      marginRight: "5px",
                      cursor: "pointer",
                      alignItems: "center",
                      color: "#32406d",
                    }}
                    onClick={() => {
                      id !== 1 ? setId(id - 1) : setId(id);
                    }}
                  >
                    <FaAngleLeft style={{ marginTop: "3px" }} />
                  </li>
                  <div className="gap" style={{ display: "flex", columnGap: "10px" }}>

                    {getPageRange().map((pageNumber, index) => (
                      <button
                        className={
                          pageNumber === id ? "pag_buttons" : "unsel_button"
                        }
                        key={index}
                        onClick={() => goToPage(pageNumber)}
                        style={{
                          fontWeight: pageNumber === id ? "bold" : "normal",
                          marginRight: "10px",
                          color: pageNumber === id ? "white" : "#000000", // Changed text color
                          backgroundColor:
                            pageNumber === id ? "#32406d" : "#ffff", // Changed background color
                          borderRadius: pageNumber === id ? "0.2rem" : "",
                          fontSize: "15px",
                          border: "none",
                          padding: "1px 10px", // Adjusted padding
                          cursor: "pointer", // Added cursor pointer
                        }}
                        class="page__numbers"
                      >
                        {pageNumber}
                      </button>
                    ))}

                  </div>
                  <li
                    className="page__btn newpage_btn"
                    style={{
                      padding: "1px 5px",
                      cursor: "pointer",
                      color: "#32406d",
                      marginLeft: "3px"
                    }}
                    onClick={() => {
                      if (belowCount > id * 60) setId(id + 1);
                      else {
                        toast.warn("Reached the end of the list", {
                          position: "top-right",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                          transition: Bounce,
                        });
                        setId(id);
                      }
                    }}
                  >
                    <FaAngleRight style={{ marginTop: "3px" }} />
                  </li>
                </ul>
              </div>
            </div>
            ) : (
                <div
                style={{
  
                }}
                className="dashbottom"
              >
                <div>
                  Showing {lowCount === 0 ? 0 : (currentPage - 1) * 60 + 1} to{" "}
                  {currentPage * 60 <= lowCount ? currentPage * 60 : lowCount} of {lowCount}{" "}
                  entries
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                  className="pagination"
                >
                  <ul className="page">
                    <li
                      className="page__btn newpage_btn"
                      style={{
                        padding: "1px 5px",
                        marginRight: "5px",
                        cursor: "pointer",
                        alignItems: "center",
                        color: "#32406d",
                      }}
                      onClick={() => {
                        currentPage !== 1 ? setCurrentPage(currentPage - 1) : setCurrentPage(currentPage);
                      }}
                    >
                      <FaAngleLeft style={{ marginTop: "3px" }} />
                    </li>
                    <div className="gap" style={{ display: "flex", columnGap: "10px" }}>
  
                      {getPageRangesearch().map((pageNumber, index) => (
                        
                        <button
                          className={
                            pageNumber === currentPage ? "pag_buttons" : "unsel_button"
                          }
                          key={index}
                          onClick={() => goToPagesearch(pageNumber)}
                      
                          style={{
                            fontWeight: pageNumber === currentPage ? "bold" : "normal",
                            marginRight: "10px",
                            color: pageNumber === currentPage ? "white" : "#000000", // Changed text color
                            backgroundColor:
                              pageNumber === currentPage ? "#32406d" : "#ffff", // Changed background color
                            borderRadius: pageNumber === currentPage ? "0.2rem" : "",
                            fontSize: "15px",
                            border: "none",
                            padding: "1px 10px", // Adjusted padding
                            cursor: "pointer", // Added cursor pointer
                          }}
                          class="page__numbers"
                        >
                          {pageNumber}
                        </button>
                      ))}
  
                    </div>
                    <li
                      className="page__btn newpage_btn"
                      style={{
                        padding: "1px 5px",
                        cursor: "pointer",
                        color: "#32406d",
                        marginLeft: "3px"
                      }}
                      onClick={() => {
                        if (lowCount > currentPage * 3) setCurrentPage(currentPage + 1);
                        else {
                          toast.warn("Reached the end of the list", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            transition: Bounce,
                          });
                          setCurrentPage(currentPage);
                        }
                      }}
                    >
                      <FaAngleRight style={{ marginTop: "3px" }} />
                    </li>
                  </ul>
                </div>
              </div>
            )}
            </div>
            <ReactTooltip />
        </div>
    );
}
 
export default ResumeSearching;
 
 