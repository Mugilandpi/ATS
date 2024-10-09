import React, { useMemo } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "./RegisterCandidate.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiConsoleController } from "react-icons/gi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { Hourglass } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData } from "../../store/slices/dashboardSlice";

import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";

import { Tooltip as ReactTooltip } from "react-tooltip";
import clear_search from '../../assets/clear_search.svg'


function RegisterCandidate() {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboardSliceReducer);
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [namespos, setNamespos] = useState([]);
  const [holdClient, setHoldClient] = useState([]);
  const [activeClient, setActiveClient] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [filteredId, setFilteredId] = useState([]);
  ``;
  const [filteredRows, setFilteredRows] = useState([]);
  const [id, setId] = useState(1);
  const [temp, setTemp] = useState([]);
  const [countItems, setCountItems] = useState(0);
  const [belowCount, setBelowCount] = useState(0);
  const navigate = useNavigate();
  // const [jobs,setJobs] = useState([])
  const [candidates, setCandidates] = useState([]);
  const [tooltipText, setTooltipText] = useState(null);
const [hoveredClient, setHoveredClient] = useState(null);

const truncateText = (text, length = 12) => {
  if (text.length > length) {
    return`${text.substring(0, length)}...` ;
  }
  return text;
}; 
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= countItems) {
      setId(pageNumber);
    }
  };
  const [dataFound, setDataFound] = useState(true);
  useEffect(() => {
    if (filteredRows.length === 0 && !loading) {
      setDataFound(false);
    } else {
      setDataFound(true);
    }
  }, [filteredRows, loading]);

  // useEffect(() => {
  //   if (Object.keys(dashboardData).length > 0) {
  //     console.log(dashboardData);
  //     console.log("from redux");
  //     const data = dashboardData;
  //     let temp = data["jobs"];
  //     console.log(temp, "temp");
  //     // for(const candidate of data['jobs']){
  //     //   if(!temp.includes(candidate)){
  //     //     temp.push(candidate)
  //     //   }
  //     // }
  //     // console.log('temp:',temp)
  //     // setTemp(temp)
  //     const set1 = new Set();
  //     const uniqueNames1 = data["jobs"]
  //       .filter((job) => job.job_status.toLowerCase() === "active")
  //       .filter((job) => {
  //         if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
  //           return false;
  //         } else {
  //           set1.add(job.client);
  //           return true;
  //         }
  //       })
  //       .map((job) => job.client);
  //     const uniqueNames2 = data["jobs"]
  //       .filter((job) => job.job_status.toLowerCase() === "hold")
  //       .filter((job) => {
  //         if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
  //           return false;
  //         } else {
  //           set1.add(job.client);
  //           return true;
  //         }
  //       })
  //       .map((job) => job.client);
  //     console.log(uniqueNames1, "uniqueNames1");
  //     console.log(uniqueNames2, "uniqueNames2");
  //     const uniqueNames = [...uniqueNames1, ...uniqueNames2];
  //     setNames(uniqueNames);

  //     const activeJobsClients = dashboardData["jobs"]
  //       .filter((job) => job.job_status.toLowerCase() === "active")
  //       .map((job) => job.client.toLowerCase());
  //     // console.log(setHold)
  //     const holdJobsClients = dashboardData["jobs"]
  //       .filter((job) => {
  //         return !activeJobsClients.includes(job.client.toLowerCase());
  //       })
  //       .map((job) => job.client.toLowerCase());
  //     console.log(holdJobsClients);
  //     setHoldClient(holdJobsClients);
  //     setBelowCount(uniqueNames.length);
  //     setLoading(false);
  //   } else {
  //     console.log("from api");
  //     fetchTableData();
  //   }
  // }, [dashboardData]);

  const { jobs } = useSelector((state) => state.jobSliceReducer);

  // useEffect(() => {
  //   if (localStorage.user_type === "recruitment") {
  //     if (jobs.length > 0) {
  //       console.log(jobs);
  //       const data = jobs;
  //       const set1 = new Set();
  // const uniqueNames1 = data
  // .filter((job) => job.job_status.toLowerCase() === "active")
  // .filter((job) => {
  //   if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
  //     return false;
  //   } else {
  //     set1.add(job.client);
  //     return true;
  //   }
  // })
  // .map((job) => job.client);
  //       const uniqueNames2 = data
  //         .filter((job) => job.job_status.toLowerCase() === "hold")
  //         .filter((job) => {
  //           if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
  //             return false;
  //           } else {
  //             set1.add(job.client);
  //             return true;
  //           }
  //         })
  //         .map((job) => job.client);
  //       console.log(uniqueNames1, "uniqueNames1");
  //       console.log(uniqueNames2, "uniqueNames2");
  //       const uniqueNames = [...uniqueNames1, ...uniqueNames2];
  //       setNames(uniqueNames);
  //       const activeJobsClients = jobs
  //         .filter((job) => job.job_status.toLowerCase() === "active")
  //         .map((job) => job.client.toLowerCase());
  //       // console.log(setHold)
  //       const holdJobsClients = jobs
  //         .filter((job) => {
  //           return !activeJobsClients.includes(job.client.toLowerCase());
  //         })
  //         .map((job) => job.client.toLowerCase());
  //       console.log(holdJobsClients);
  //       setHoldClient(holdJobsClients);
  //       setBelowCount(uniqueNames.length);
  //       setLoading(false);
  //     }
  //     // else {
  //     //     console.log("from api");
  //     //     fetchTableData();
  //     //   }
  //   } else {
  //     if (Object.keys(dashboardData).length > 0) {
  //       console.log(dashboardData);
  //       console.log("from redux");
  //       const data = dashboardData;
  //       let temp = data["jobs"];
  //       console.log(temp, "temp");
  //       const set1 = new Set();
  //       const uniqueNames1 = data["jobs"]
  //         .filter((job) => job.job_status.toLowerCase() === "active")
  //         .filter((job) => {
  //           if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
  //             return false;
  //           } else {
  //             set1.add(job.client);
  //             return true;
  //           }
  //         })
  //         .map((job) => job.client);
  //       const uniqueNames2 = data["jobs"]
  //         .filter((job) => job.job_status.toLowerCase() === "hold")
  //         .filter((job) => {
  //           if (set1.has(job.client) || set1.has(job.client?.toLowerCase())) {
  //             return false;
  //           } else {
  //             set1.add(job.client);
  //             return true;
  //           }
  //         })
  //         .map((job) => job.client);
  //       console.log(uniqueNames1, "uniqueNames1");
  //       console.log(uniqueNames2, "uniqueNames2");
  //       const uniqueNames = [...uniqueNames1, ...uniqueNames2];
  //       setNames(uniqueNames);

  //       const activeJobsClients = dashboardData["jobs"]
  //         .filter((job) => job.job_status.toLowerCase() === "active")
  //         .map((job) => job.client.toLowerCase());
  //       // console.log(setHold)
  //       const holdJobsClients = dashboardData["jobs"]
  //         .filter((job) => {
  //           return !activeJobsClients.includes(job.client.toLowerCase());
  //         })
  //         .map((job) => job.client.toLowerCase());
  //       console.log(holdJobsClients);
  //       setHoldClient(holdJobsClients);
  //       setBelowCount(uniqueNames.length);
  //       setLoading(false);
  //     }
  //     //  else {
  //     //   console.log("from api");
  //     //   fetchTableData();
  //     // }
  //   }
  // }, [jobs]);

 useEffect(() => {
  if (localStorage.user_type === "recruitment") {
    if (jobs.length > 0) {
      console.log("jobs", jobs);
      const data = jobs.filter((job) => {
        return job.recruiter
          .split(", ")
          .includes(localStorage.getItem("name"));
      });

      console.log("data", data);

      const processJobsByStatus = (status, excludedClients = new Set()) => {
        const set = new Set();
        const clientsMap = new Map();

        data
          .filter((job) => job.job_status.toLowerCase() === status)
          .forEach((job) => {
            const client = job.client?.toLowerCase();
            if (!set.has(client) && !excludedClients.has(client)) {
              set.add(client);
              clientsMap.set(client, {
                client: job.client,
                totalPositions: job.no_of_positions ? parseInt(job.no_of_positions, 10) : 0,
                jobs: [job]
              });
            } else if (clientsMap.has(client)) {
              const clientData = clientsMap.get(client);
              clientData.totalPositions += job.no_of_positions ? parseInt(job.no_of_positions, 10) : 0;
              clientData.jobs.push(job);
            }
          });

        return { clients: Array.from(clientsMap.values()), processedClients: set };
      };

      const { clients: activeClients, processedClients } = processJobsByStatus("active");
      const { clients: holdClients } = processJobsByStatus("hold", processedClients);

      console.log(activeClients, "activeClients");
      console.log(holdClients, "holdClients");

      const uniqueClients = [...activeClients, ...holdClients];
      setNames(uniqueClients);

      const activeJobsClients = data
        .filter((job) => job.job_status.toLowerCase() === "active")
        .map((job) => job.client.toLowerCase());

      const holdJobsClients = data
        .filter((job) => !activeJobsClients.includes(job.client.toLowerCase()))
        .map((job) => job.client.toLowerCase());

      console.log("holdJobsClients", holdJobsClients);
      setActiveClient(activeJobsClients);
      setHoldClient(holdJobsClients);
      setBelowCount(uniqueClients.length);
      setLoading(false);
    }
    // else {
    //     console.log("from api");
    //     fetchTableData();
    //   }
  } else {
    if (Object.keys(dashboardData).length > 0) {
      console.log(dashboardData);
      console.log("from redux");
      const data = dashboardData;
      let temp = data["jobs"];
      console.log(temp, "temp");

      const processJobsByStatus = (status, excludedClients = new Set()) => {
        const set = new Set();
        const clientsMap = new Map();

        data["jobs"]
          .filter((job) => job.job_status.toLowerCase() === status)
          .forEach((job) => {
            const client = job.client?.toLowerCase();
            if (!set.has(client) && !excludedClients.has(client)) {
              set.add(client);
              clientsMap.set(client, {
                client: job.client,
                totalPositions: job.no_of_positions ? parseInt(job.no_of_positions, 10) : 0,
                jobs: [job]
              });
            } else if (clientsMap.has(client)) {
              const clientData = clientsMap.get(client);
              clientData.totalPositions += job.no_of_positions ? parseInt(job.no_of_positions, 10) : 0;
              clientData.jobs.push(job);
            }
          });

        return { clients: Array.from(clientsMap.values()), processedClients: set };
      };

      const { clients: activeClients, processedClients } = processJobsByStatus("active");
      const { clients: holdClients } = processJobsByStatus("hold", processedClients);

      console.log(activeClients, "activeClients");
      console.log(holdClients, "holdClients");

      const uniqueClients = [...activeClients, ...holdClients];
      setNames(uniqueClients);

      const activeJobsClients = dashboardData["jobs"]
        .filter((job) => job.job_status.toLowerCase() === "active")
        .map((job) => job.client.toLowerCase());

      const holdJobsClients = dashboardData["jobs"]
        .filter((job) => !activeJobsClients.includes(job.client.toLowerCase()))
        .map((job) => job.client.toLowerCase());

      console.log(holdJobsClients);
      setHoldClient(holdJobsClients);
      setBelowCount(uniqueClients.length);
      setLoading(false);
    }
    //  else {
    //   console.log("from api");
    //   fetchTableData();
    // }
  }
}, [jobs]);


  useEffect(() => {
    if (belowCount % 30 != 0) setCountItems(parseInt(belowCount / 30) + 1);
    else setCountItems(parseInt(belowCount / 30));
  }, [belowCount]);

  const navigateToAddCandidate = (client) => {
    console.log("name", client);
    const items = jobs.filter(
      (job) =>
        job?.client.toLowerCase() === client?.toLowerCase() &&
        job.job_status.toLowerCase() !== "hold",
    );
    console.log(items);

    const [check] = jobs
      .filter((job) => job.client?.toLowerCase() === client?.toLowerCase())
      .map((job) => job.job_status);
    console.log(check);
    let obj = {};
    let ids;
    if (check) {
      ids = items?.map((item) => item.id);
      console.log(id);
      for (const item of items) {
        obj = { ...obj, [item.id]: item.role };
      }
      console.log(obj);
    } else {
      ids = [];
    }
    console.log(items);
    const roles = items
      .filter((item) => item.client === client)
      .map((item) => item.role);
    for (let i = 0; i < id.length; i++) {
      obj[id[i]] = roles[i];
    }

    // console.log(id)
    // console.log(client)
    console.log(obj);
    localStorage.setItem("page_no", id);
    navigate("/RegisterCandidate/AddCandidate", {
      state: { client, id: ids, obj, path: location.pathname },
    });
  };
  const showTooltip = (text) => {
    setTooltipText(text);
  };

  const hideTooltip = () => {
    setTooltipText(null);
  };
  const getPageRange = () => {
    const pageRange = [];
    const maxPagesToShow = 5; // Adjust this value to show more or fewer page numbers

    // Determine the start and end page numbers to display
    let startPage = Math.max(1, id - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(countItems, startPage + maxPagesToShow - 1);

    // Adjust startPage and endPage if near the beginning or end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Include ellipsis if necessary
    if (startPage > 1) {
      pageRange.push(1);
      if (startPage > 2) {
        pageRange.push("...");
      }
    }

    // Add page numbers to the range
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }

    // Include ellipsis if necessary
    if (endPage < countItems) {
      if (endPage < countItems - 1) {
        pageRange.push("...");
      }
      pageRange.push(countItems);
    }

    return pageRange;
  };
  const fetchTableData = async () => {
    console.log("called fetchTableData");
    try {
      const response = await fetch("https://ats-9.onrender.com/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id")
            ? localStorage.getItem("user_id")
            : location.state?.user_id,
          user_type: localStorage.getItem("user_type")
            ? localStorage.getItem("user_type")
            : location.state?.user_type,
          user_name: localStorage.getItem("user_name")
            ? localStorage.getItem("user_name")
            : location.state?.user_name,
          page_no: 1,
        }),
      });

      // Check if response is OK
      console.log(body ,'login for recuriters')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
       console.log(data['candidates'])
      // const val = data['candidates'].length;

      let temp = [];
      for (const candidate of data["candidates"]) {
        if (!temp.includes(candidate)) {
          temp.push(candidate);
        }
      }
      dispatch(setDashboardData({ data }));
      setLoading(false);

      if (!data.candidates) {
        throw new Error("Expected 'candidates' property not found");
      }

      return data;
    } catch (err) {
      // console.error("Error fetching data:", err);
      return null; // Return null in case of an error
    }
  };

  useEffect(() => {
    console.log(countItems);
  }, [countItems]);

  function extractKeyValuePairs(object, keysToExtract) {
    return keysToExtract.reduce((acc, key) => {
      if (key in object) {
        acc[key] = object[key];
      }
      return acc;
    }, {});
  }

  console.log(names,"clients4r2443535")

  useEffect(() => {

    const filteredNames = names.filter((name) =>
      name.client?.toLowerCase().includes(searchValue.toLowerCase()),
    );
    console.log(filteredNames);
    if (searchValue === "") {
      setFilteredId(filteredNames);
      setBelowCount(filteredNames.length);
    } else {
      setFilteredId(filteredNames);
      setBelowCount(filteredNames.length);
    }
    if (searchValue === "") {
      if (localStorage.getItem("page_no")) {
        setId(parseInt(localStorage.getItem("page_no")));
        localStorage.removeItem("page_no");
      }
    } else {
      setId(1);
    }
  }, [searchValue, names]);
  // useEffect(()=>{
  //   console.log(searchValue)
  //   if(names.length>0){
  //   const update = names.filter((item)=>{
  //   const extractedObj = extractKeyValuePairs(item,['id','client'])
  //   console.log(extractedObj)
  //   for(const key in extractedObj){
  //     if(key === 'id'){
  //       continue;
  //     }
  //     console.log('key',key)
  //     let val = extractedObj[key]
  //     console.log(val)
  //     if(val !== null && val !== undefined){
  //         if(typeof(val) !== 'string'){
  //           val = val.toString()
  //         }
  //         if(val.toLowerCase().includes(searchValue.toLowerCase())){
  //           // console.log('yes working good')
  //           return true;
  //         }
  //     }else{
  //       console.log('Value is null or undefined for key:', key);
  //     }
  //   }
  //   console.log('No match found for searchValue:', searchValue);
  //   return false;
  // })
  // console.log(update)
  // setBelowCount(update.length)
  // setId(1)
  // if(update.length%30 === 0){
  //   setCountItems(update.length/30);
  // }else{
  //   setCountItems(update.length/30+1);
  // }
  // let extract = []
  // for(const item of update){
  //   extract.push(item.id)
  // }
  // setFilteredId(extract)
  // console.log(extract)
  //   }
  // },[searchValue])
  const displayItems = () => {
    console.log("names24r42535:", names);
    const data = filteredId?.filter(
      (_, idx) => idx + 1 <= id * 30 && idx + 1 > (id - 1) * 30,
    );

    console.log("data", data);
    // setShowData(data)
    // if(data?.length>0)
    //   return data;

    return data;
  };
  const items = displayItems();

  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        {loading ? (
          <div className="loader-container">
            <Hourglass
              visible={true}
              height="60"
              width="340"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={["#306cce", "#72a1ed"]}
            />
          </div>
        ) : (
          <>
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
              <div style={{display:'flex',alignItems:'center',zIndex:'2'}}>
              <IoMdSearch  style={{display:'flex',alignItems:'center',height:"22px",width:"22px",marginRight:"-25px",marginTop:"4px"}}/>
                <input
                 placeholder="Search"
                  style={{
                    marginTop: "5px",
                    paddingLeft:"26px",
                    height: "30px",
                    width: "300px",
                    backgroundColor: "rgba(255, 255, 255, 0.80)",
                    border: "none",
                    borderRadius: "5px",
                    padding : "0 25px"
                  }}
                  className="Searched"
                  value={searchValue}
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setSearchValue(e.target.value);
 
                    // date_created    job_id    name    email   mobile   client    profile    skills    recruiter    status
                  }}
                />
                {/* <button style={{marginLeft:'20px',backgroundColor: "#32406d",color:'white',border:'none',padding:'4px',borderRadius:'5px'}}
                  onClick={removeAllFilter}
                >clear all filters</button> */}
                {/* <img style={{marginLeft:'20px',height:'24px'}} src={clear_search} alt="svg_img" /> */}
                <div className="remove_filter_icons" onClick={()=>{
                  setSearchValue('');
                }} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center',borderRadius:"5px",marginTop:"4px"}}>
                    {/* <img style={{ cursor: 'pointer', height: '24px' }} src={clear_search} alt="svg_img"
                        data-tooltip-id={"remove_search"}
                        data-tooltip-content="Clear search"
                    /> */}
                      <MdOutlineYoutubeSearchedFor style={{ cursor: 'pointer', height: '22px',width:"22px",color:"#32406d" }}  data-tooltip-id={"remove_search"}
                        data-tooltip-content="Clear search"/>
                   
                      <ReactTooltip
                        style={{ zIndex: 999, padding: "2px",backgroundColor:"#32406d"}}
                        place="top-start"
                        id="remove_search"
                      />
                </div>
             
              </div>
            </div>
            <div className="theader">
            <h5
              className="heading2"
              style={{
                paddingTop: "0px",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "700",
                margin:"-35px 0 10px"
              }}
            >
              Add Candidate Details
            </h5>
            </div>
            <div style={{  }} className="container_rc">
              <div style={{ height: "98%", overflow: "auto" }}>
                <div
                  className="card_container col-md-4"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                    columnGap: "10px",
                    rowGap: "10px",
                    overflow: "auto",
                    justifyItems: "center",
                  }}
                >
                  {items.length > 0
                    ? items.map((item, idx) => (
                        <div key={idx} className="card">
                          <div
                            className="card-header"
                         
                          
                            style={{display:"block",padding:'0px 10px'}}
                          >

                         <h3 
                             onMouseOver={() => setHoveredClient(item.client)}
                             onMouseOut={() => setHoveredClient(null)}
                         style={
                              holdClient.includes(item.client.toLowerCase()) &&
                              !activeClient.includes(item.client.toLowerCase())
                                ? { color: "red", fontSize:"16px",fontWeight:'600' }
                                : { color: "#333", fontSize:"16px",fontWeight:'600' }
                               
                            }>{truncateText(item.client)} </h3> 
                         <h4 style={{ fontFamily: 'roboto', }}>
                              Openings:  <span  style={{ color: item.totalPositions == 0 ? 'rgb(255 79 79)' : '#05af05' }}>{item.totalPositions == 0 ? 'Closed' : item.totalPositions}</span>
                            </h4>
                            
                          </div>
                           {hoveredClient === item.client && (
                      <div className="tooltip" style={{
                        position: "relative",
                        backgroundColor: "#fff",
                        padding: "5px 10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginTop: "-10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        zIndex: 1000,
                        maxWidth: "300px"
                      }}>
                        {item.client}
                      </div>
                    )}
                    
                 

 
                       
                          <div className="card-body">
                            <button
                              className="btn_dark"
                              onClick={() => {
                                navigateToAddCandidate(item.client);
                              }}
                            >
                              Add Candidate
                            </button>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
                {items?.length === 0 && (
                  <div
                    style={{
                      backgroundColor: "",
                      textAlign: "center",
                      padding: "0px 0px",
                    }}
                  >
                    No data available
                  </div>
                )}
              </div>
            </div>

            <div
              className="dashbottom"
            >
              {/* <div>
                        Showing {(id-1)*30+1} to {id*30<=filteredRows?.length? id*30:filteredRows?.length} of {filteredRows?.length} entries
                  </div> */}
              <div className="showing">
                Showing {belowCount === 0? 0: (id - 1) * 30 + 1} to{" "}
                {id * 30 <= belowCount ? id * 30 : belowCount} of {belowCount}{" "}
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
                      marginRight:"5px",
                      cursor: "pointer",
                      alignItems: "center",
                      color: "#32406d",
                    }}
                    onClick={() => {
                      id !== 1 ? setId(id - 1) : setId(id);
                    }}
                  > 
                    <FaAngleLeft  style={{marginTop:"3px"}} />
                  </li>
                  <div style={{ display: "flex", columnGap: "10px" }}>
                    {console.log(getPageRange())}
            
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
                      marginLeft:"3px"
                    }}
                    onClick={() => {
                      if (id * 30< belowCount) setId(id + 1);
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
                    <FaAngleRight  style={{marginTop:"3px"}} />
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterCandidate;
