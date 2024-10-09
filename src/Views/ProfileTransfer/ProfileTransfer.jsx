import React, { useEffect, useState, useRef } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import filter_icon from '../../assets/filter_icon.svg'
import clear_search from '../../assets/clear_search.svg'
import "../../Components/titlenav.css";
import "./Profiletransfer.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { TailSpin } from "react-loader-spinner";
import { MdFilterAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../utilities";
import { text } from "@fortawesome/fontawesome-svg-core";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";


function ProfileTransfer() {
  const navigate = useNavigate();
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [assignedRecruiter, setAssignedRecruiter] = useState(null);
  const [showRecruiters, setShowRecruiters] = useState([]);
  const [showCandidates, setShowCandidates] = useState([]);
  const [selectItems, setSelectItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [waitForSubmission, setwaitForSubmission] = useState(false);
  const [noCandidatesError, setNoCandidatesError] = useState(false);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState([]);
  const uniRef = useRef(null);
  const [filteredId, setFilteredId] = useState([])

  const [isColorFiltered, setIsColorFiltered] = useState(false);

  useEffect(() => {
    const closeFilterPop = (e) => {
      const allRefIds = [
        "name_ref",
        "client_ref",
        "profile_ref",
        "status_ref",

        "name_label_ref",
        "client_label_ref",
        "profile_label_ref",
        "status_label_ref",
      ];
      let bool = false;
      for (const ref of allRefIds) {
        if (document.getElementById(ref)?.contains(e.target)) {
          bool = true;
          return;
        }
      }
      if (uniRef?.current?.contains(e.target) || bool) {
        // console.log("yes");
      } else {
        // console.log("no");
        setshowSearchjobassignment((prev) => ({
          ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
        }));
      }
    };
    document.addEventListener("click", closeFilterPop);
    return () => {
      document.removeEventListener("click", closeFilterPop);
    };
  }, []);
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const selectedItem = filteredRows?.filter((item) => {
        return (
          item.id.toString() === target.id.substring(0, target.id.length - 1)
        );
      });
      // console.log("selected item:", selectedItem);
      if (selectedItem?.length > 0) {
        const idx = list.findIndex(
          (item) => item.id === target.id.substring(0, target.id.length - 1),
        );
        let n = parseInt(target.id.substring(target.id.length - 1));
        // console.log(idx)/
        const update = new Array(filteredRows.length).fill().map((_, idx) => {
          return {
            id: filteredRows[idx].id.toString(),
            username: false,
            client: false,
            profile: false,
            status: false,
            // email_ref:useRef(),
            // skills_ref:useRef()
          };
        });
        update[idx] =
          n === 1
            ? {
              // id:data['candidates'][idx].id.toString(),
              ...list[idx],
              name: !list[idx].username,
              client: false,
              profile: false,
              skills: false,
            }
            : n === 2
              ? {
                ...list[idx],
                username: false,
                client: !list[idx].client,
                profile: false,
                skills: false,
              }
              : {
                ...list[idx],
                username: false,
                client: false,
                profile: false,
                skills: !list[idx].skills,
              };
        // console.log(update[ idx ])
        setList(update);
      } else {

        const tempList = new Array(filteredRows?.length)
          .fill()
          .map((_, idx) => {
            return {
              id: filteredRows[idx].id.toString(),
              username: false,
              client: false,
              profile: false,
              skills: false,
              // email_ref:useRef(),
              // skills_ref:useRef()
            };
          });
        // console.log(tempList)
        // const update = list.map(()=>({

        // }))
        if (
          target.id === "default1" ||
          target.id === "default2" ||
          target.id === "default3"
        )
          return;
        setList(tempList);
        // console.log('handle else case')
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  });
  const [selectAll, setSelectAll] = useState(false);
  const [uniqueDataNames, setuniqueDataNames] = useState([]);
  const [nameSelected, setNameSelected] = useState([]);
  const [selectAllClient, setSelectAllClient] = useState(false);
  const [uniqueDataClient, setuniqueDataClient] = useState([]);
  const [clientSelected, setclientSelected] = useState([]);
  const [selectAllProfile, setSelectAllProfile] = useState(false);
  const [uniqueDataProfile, setuniqueDataProfile] = useState([]);
  const [profileSelected, setprofileSelected] = useState([]);
  const [selectAllStatus, setSelectAllStatus] = useState(false);
  const [uniqueDataStatus, setuniqueDataStatus] = useState([]);
  const [statusSelected, setstatusSelected] = useState([]);
  const [isnameFiltered, setIsNameFiltered] = useState(false);
  const [isclientFiltered, setIsClientFiltered] = useState(false);
  const [isprofileFiltered, setIsProfileFiltered] = useState(false);
  const [isstatusFiltered, setIsStatusFiltered] = useState(false);
  const [belowCount, setBelowCount] = useState(0);



  const handleOkClick = () => {
    console.log("calling handle ok click");


    updateFilteredRows({
      nameSelected,
      clientSelected,
      profileSelected,
      statusSelected,
      setuniqueDataNames,
      setuniqueDataClient,
      setuniqueDataProfile,
      setuniqueDataStatus,
    });
    setIsNameFiltered(nameSelected.length > 0);
    setIsClientFiltered(clientSelected.length > 0);
    setIsProfileFiltered(profileSelected.length > 0);
    setIsStatusFiltered(statusSelected.length > 0);
  };
  useEffect(() => {
    handleOkClick();
  },
    [
      nameSelected,
      clientSelected,
      profileSelected,
      statusSelected,
    ]
  )
  const handleCheckboxChange = (username) => {
    const isSelected = nameSelected.includes(username);
    if (isSelected) {
      setNameSelected((prevSelected) =>
        prevSelected.filter((item) => item !== username),
      );
      setSelectAll(false);
    } else {
      setNameSelected((prevSelected) => [...prevSelected, username]);
      setSelectAll(nameSelected.length === uniqueDataNames.length - 1);
    }
  };
  const handleSelectAllForName = () => {
    const allChecked = !selectAll;
    setSelectAll(allChecked);
    if (allChecked) {
      setNameSelected(uniqueDataNames.map((d) => d?.toLowerCase()));
    } else {
      setNameSelected([]);
    }
  };
  const handleCheckboxChangeClient = (client) => {
    const isSelected = clientSelected.includes(client);
    if (isSelected) {
      setclientSelected((prevSelected) =>
        prevSelected.filter((item) => item !== client),
      );
      setSelectAllClient(false);
    } else {
      setclientSelected((prevSelected) => [...prevSelected, client]);
      setSelectAllClient(clientSelected.length === uniqueDataClient.length - 1);
    }
  };
  const handleSelectAllForClient = () => {
    const allChecked = !selectAllClient;
    setSelectAllClient(allChecked);
    if (allChecked) {
      setclientSelected(uniqueDataClient.map((d) => d?.toLowerCase()));
    } else {
      setclientSelected([]);
    }
  };
  const handleCheckboxChangeProfile = (profile) => {
    const isSelected = profileSelected.includes(profile);
    if (isSelected) {
      setprofileSelected((prevSelected) =>
        prevSelected.filter((item) => item !== profile),
      );
      setSelectAllProfile(false);
    } else {
      setprofileSelected((prevSelected) => [...prevSelected, profile]);
      setSelectAllProfile(
        profileSelected.length === uniqueDataProfile.length - 1,
      );
    }
  };
  const handleSelectAllForProfile = () => {
    const allChecked = !selectAllProfile;
    setSelectAllProfile(allChecked);
    if (allChecked) {
      setprofileSelected(uniqueDataProfile.map((d) => d?.toLowerCase()));
    } else {
      setprofileSelected([]);
    }
  };
  const handleCheckboxChangeStatus = (status) => {
    const isSelected = statusSelected.includes(status);
    if (isSelected) {
      setstatusSelected((prevSelected) =>
        prevSelected.filter((item) => item !== status),
      );
      setSelectAllStatus(false);
    } else {
      setstatusSelected((prevSelected) => [...prevSelected, status]);
      setSelectAllStatus(statusSelected.length === uniqueDataStatus.length - 1);
    }
  };
  const handleSelectAllForStatus = () => {
    const allChecked = !selectAllStatus;
    setSelectAllStatus(allChecked);
    if (allChecked) {
      setstatusSelected(uniqueDataStatus.map((d) => d?.toLowerCase()));
    } else {
      setstatusSelected([]);
    }
  };
  const [showSearchjobassignment, setshowSearchjobassignment] = useState({
    showSearchName: false,
    showSearchClient: false,
    showSearchProfile: false,
    showSearchStatus: false,
  });
  const [filteredRows, setFilteredRows] = useState([]);
  const updateFilteredRows = ({

    nameSelected,
    clientSelected,
    profileSelected,
    statusSelected,

    setuniqueDataNames,
    setuniqueDataClient,
    setuniqueDataProfile,
    setuniqueDataStatus,
  }) => {
    let prevfilteredRows = showCandidates;
    if (nameSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        nameSelected.includes(row.username?.toLowerCase()),
      );
    }
    if (clientSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        clientSelected.includes(row.client?.toLowerCase()),
      );
    }
    if (profileSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        profileSelected.includes(row.profile?.toLowerCase()),
      );
    }
    if (statusSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        statusSelected.includes(row.status?.toLowerCase()),
      );
    }
    const arrayNames = [
      "nameSelected",
      "clientSelected",
      "profileSelected",
      "statusSelected",
    ];
    const arrays = [
      nameSelected,
      clientSelected,
      profileSelected,
      statusSelected,
    ];
    let NamesOfNonEmptyArray = [];
    arrays.forEach((arr, index) => {

      if (arr.length > 0) {
        NamesOfNonEmptyArray.push(arrayNames[index]);
      }
    });

    if (!NamesOfNonEmptyArray.includes("nameSelected")) {
      setuniqueDataNames(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.username?.trim();
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("clientSelected")) {
      setuniqueDataClient(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.client;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("profileSelected")) {
      setuniqueDataProfile(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.profile;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("statusSelected")) {
      setuniqueDataStatus(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.status;
            }),
          ),
        );
      });
    }
    setFilteredRows(prevfilteredRows);
    // console.log("hi here is a change in table filter");
  };
  const { recruiters, managers } = useSelector(
    (state) => state.userSliceReducer,
  );
  useEffect(() => {
    setShowRecruiters(recruiters.map((item) => item.name));
  }, [recruiters]);

  const listOfCandidates = async (recruiter) => {
    if (!isLoading) {
      setIsLoading(true);
      setNoCandidatesError(false);
      try {
        const response = await fetch(
          "https://ats-9.onrender.com/get_recruiters_candidate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_name: recruiter }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length === 0) {
            setNoCandidatesError(true);
          } else {
            setShowCandidates(data);
            console.log("uniquedata", showCandidates);
            const arr = data.map((item) => ({ id: item.id, isShow: false }));
            setuniqueDataNames([...new Set(data.map((d) => d.username?.trim()))]);
            setuniqueDataClient([
              ...new Set(data.map((d) => d.client)),
            ]);
            setuniqueDataProfile([
              ...new Set(data.map((d) => d.profile)),
            ]);
            setuniqueDataStatus([
              ...new Set(data.map((d) => d.status)),
            ]);
            setSelectItems(arr);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.error(response.statusText);
        }
      } catch (err) {
        setIsLoading(false);
        console.error("handle error", err);
      }
    }
  };
  const handleRecruiterChange = (e) => {
    setSearchValue("")
    const selectedRecruiterId = e.target.value;
    setSelectedRecruiter(selectedRecruiterId);
    listOfCandidates(selectedRecruiterId);
    // Disable the assigned recruiter dropdown based on the selected recruiter
    const assignRecruiterDropdown = document.getElementById(
      "assign_recruiter_id",
    );
    Array.from(assignRecruiterDropdown?.options)?.forEach((option) => {
      option.disabled = option.value === selectedRecruiterId;
    });
  };
  const handleAssignedRecruiter = (e) => {
    setAssignedRecruiter(
      e.target.value !== selectedRecruiter ? e.target.value : null,
    );
  };
  const handleSelectIndividual = (id, e) => {
    const idx = selectItems.findIndex((item) => item.id === id);
    if (idx !== -1) {
      const updateSelectItems = [...selectItems];
      updateSelectItems[idx].isShow = e.target.checked;
      setSelectItems(updateSelectItems);
      document.getElementById("all").checked = !updateSelectItems.some(
        (item) => !item.isShow,
      );
    }
  };
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectItems(selectItems.map((item) => ({ ...item, isShow: isChecked })));
  };
  const handleAssignCandidates = async () => {
    const sendList = selectItems
      .filter((item) => item.isShow)
      .map((item) => ({
        candidate_id: item.id,
        new_recruiter: assignedRecruiter,
        current_recruiter: selectedRecruiter,
      }));
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      try {
        const response = await fetch(
          "https://ats-9.onrender.com/assign_candidate_new_recuriter",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ candidates: sendList }),
          },
        );
        if (response.ok) {
          await response.json();
          getDashboardData().then(() => {
            toast.success(`Assigned candidates to ${assignedRecruiter}`);
            navigate("/dashboard");
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleSubmit = (e) => {
    if (!waitForSubmission) {
      setwaitForSubmission(true);
      e.preventDefault();
      const selectedCandidates = selectItems.filter((item) => item.isShow);
      if (!selectedRecruiter) {
        setwaitForSubmission(false);
        toast.error("Please select a recruiter.");
        return;
      }
      if (selectedCandidates.length === 0) {
        setwaitForSubmission(false);
        toast.error("Please select at least one candidate.");
        return;
      }
      if (!assignedRecruiter) {
        setwaitForSubmission(false);
        toast.error("Please assign the selected candidates to a recruiter.");
        return;
      }
    }
    handleAssignCandidates();
  };
  const statusColorMapping = {
    "selected": "green",
    "boarded": "green",
    "rejected": "red",
    "hold": "red",
    "drop": "red",
    "duplicate": "red",
    "show": "red",
  };
  const getStatusColor = (status) => {
    const statusLowerCase = status.toLowerCase();
    if (statusColorMapping.hasOwnProperty(statusLowerCase)) {
      return statusColorMapping[statusLowerCase];
    }
    if (statusLowerCase.includes("selected") ||
      statusLowerCase.includes("boarded")) {
      return "green";
    } else if (
      statusLowerCase.includes("rejected") ||
      statusLowerCase.includes("hold") ||
      statusLowerCase.includes("drop") ||
      statusLowerCase.includes("duplicate") ||
      statusLowerCase.includes("show")
    ) {
      return "red";
    } else {
      return "orange";
    }
  };

  const [selectedColors, setselectedColors] = useState([false, false, false])

  const handleSelectedColors = (index) => {
    setselectedColors(prev => {
      let updatedColors = [...prev]
      updatedColors[index] = !updatedColors[index]

      const anyColorSelected = updatedColors.some(color => color);
      setIsColorFiltered(anyColorSelected);
      // setShowCandidates(prevCand => {
      //   if(new Set(updatedColors).size === 1){
      //     return prevCand
      //   }
      //   console.log("prevCand", prevCand)
      //   console.log("updatedColors", updatedColors)
      //   let filteredCand = prevCand.filter(cand => {
      //     if(updatedColors[0] && (cand.status.toLowerCase().includes("selected") || cand.status.toLowerCase().includes("boarded") )){
      //       return true
      //     }
      //     if(updatedColors[2] && (cand.status.toLowerCase().includes("rejected") || cand.status.toLowerCase().includes("hold") || cand.status.toLowerCase().includes("drop") || cand.status.toLowerCase().includes("show") || cand.status.toLowerCase().includes("duplicate") )){
      //       return true
      //     }if (updatedColors[1] && (!cand.status.toLowerCase().includes("selected") && !cand.status.toLowerCase().includes("boarded") && !cand.status.toLowerCase().includes("rejected") && !cand.status.toLowerCase().includes("hold") && !cand.status.toLowerCase().includes("drop") && !cand.status.toLowerCase().includes("show") && !cand.status.toLowerCase().includes("duplicate")  )){
      //       return true
      //     }
      //     return false
      //   })
      //   console.log("filteredCand", filteredCand)
      //   return filteredCand;
      // })
      return updatedColors
    })
  }
  function extractKeyValuePairs(object, keysToExtract) {
    return keysToExtract.reduce((acc, key) => {
      if (key in object) {
        acc[key] = object[key];
      }
      return acc;
    }, {});
  }
  useEffect(() => {
    console.log("filteredRows changed", filteredRows);
  }, [filteredRows]);

  useEffect(() => {
    setBelowCount(showCandidates?.length);
    setFilteredRows(showCandidates); // Initially, display all rows
  }, [showCandidates]);
  const fun = (data) => {
    // console.log(filteredRows, "filteredRows");
    // console.log(data, "data length from useEffect");
    const list = data.filter((it) => {
      return filteredRows.some((item) => item.id === it.id);
    });
    // console.log(list);
    setBelowCount(list.length);
    // setUniqueDataname([...new Set(list.map((d) => d.name))]);
    // setUniqueDataUsernames([...new Set(list.map((d) => d.username))]);
    // setUniqueDataEmails([...new Set(list.map((d) => d.email))]);
    // setUniqueDataUserTypes([...new Set(list.map((d) => d.user_type))]);
    // setUniqueDataIsVerified([
    //   ...new Set(list.map((d) => (d.is_verified ? "Yes" : "No"))),
    // ]);
  };
  useEffect(() => {
    console.log(searchValue);
    if (showCandidates?.length > 0) {
      console.log("in if block");
      const update = showCandidates?.filter((item) => {
        const extractedObj = extractKeyValuePairs(item, [
          "username",
          "client",
          "profile",
          "status",
        ]);
        console.log(extractedObj);
        for (const key in extractedObj) {
          console.log("key", key);
          let val = extractedObj[key];
          console.log(val);
          if (val !== null && val !== undefined) {
            if (typeof val !== "string") {
              val = val.toString();
            }
            if (val.toLowerCase().includes(searchValue.toLowerCase())) {
              console.log("yes working good");
              return true;
            }
          } else {
            console.log("Value is null or undefined for key:", key);
          }
        }
        console.log("No match found for searchValue:", searchValue);
        return false;
      }, []);


      console.log("update:", update);
      fun(update);
      // setBelowCount(update.length)
      let tempList = [];
      for (const item of update) {
        tempList.push(item.id);
      }
      setFilteredId(tempList);
      // console.log(tempList);
      // console.log(filteredRows);
    }
  }, [filteredRows, searchValue]);


  const filteredCandidates = () => {
    // console.log('filteredRows:',filteredRows)
    const data = filteredRows.filter((item) => {
      if (filteredId.length > 0) {
        for (const it of filteredId) {
          if (it === item.id) {
            return true;
          }
        }
        // Return false only if none of the element s in filteredId match item.id
        return false;
      } else {
        if (searchValue === "") return true;
        else return false;
      }
    });

    return data;
  };

  const removeAllFilter = () => {
    setNameSelected([])
    setclientSelected([])
    setprofileSelected([])
    setstatusSelected([])
    setselectedColors([false, false, false])
    setIsColorFiltered(false)
  }


  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <div
          style={{
            display: "flex",
            marginTop: "30px",
            justifyContent: "right",
          }}
        >

        </div>
        <h5 className="pth5" style={{ paddingTop: "0px", marginTop: "0px" }}>Assign candidate to recruiter</h5>
        <form onSubmit={handleSubmit} id="pf_form">
          <div className="selectrec" style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="selected_recruiter_id">Select Recruiter:</label>
            <select
              name="selected_recruiter_id"
              id="selected_recruiter_id"
              onChange={handleRecruiterChange}
              value={selectedRecruiter || ""}
            >
              <option value="" disabled>
                ---- Select Recruiter ----
              </option>
              {recruiters
                .map((item) => item.name)
                .map((item, idx) => (
                  <option value={item} key={idx}>
                    {item}
                  </option>
                ))}
              <option value="" disabled>
                ---- Select Manager ----
              </option>
              {managers
                .map((item) => item.name)
                .map((item, idx) => (
                  <option value={item} key={idx}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
          {!selectedRecruiter ? (
            <p style={{ color: "green", display: "flex" }}>
              Please select a recruiter!
            </p>
          ) : (
            <p style={{ color: "black", display: "flex", fontWeight: "bold" }}>
              Selected recruiter/manager:{" "}
              <span className="spanpf" classtyle={{ color: "green", paddingLeft: "5px" }}>
                {selectedRecruiter}
              </span>
            </p>
          )}
          {isLoading ? (
            <TailSpin
              visible={true}
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : noCandidatesError ? (
            <p style={{ color: "red" }}>No candidates are there for selected recruiter.</p>
          ) : (
            selectedRecruiter && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                  <h4 style={{ display: "flex", justifyContent: "left" }}>Select Candidates:</h4>
                  </div>
                  
                  </div>
                  <div className="pfcontent" style={{ display: 'flex', alignItems: 'center',justifyContent:"flex-end",marginTop:"-45px" }}>
                    <IoMdSearch style={{ display: 'flex', alignItems: 'center', height: "22px", width: "22px", marginRight: "-25px", marginTop: "5px" }} />
                    <input
                      placeholder="Search"
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
                      className="pfsearch"
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
                    <div className="remove_filter_icons" onClick={() => {
                      setSearchValue('');
                    }} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center', borderRadius: "5px", marginTop: "4px" }}>
                      {/* <img style={{ cursor: 'pointer', height: '24px' }} src={clear_search} alt="svg_img"
                        data-tooltip-id={"remove_search"}
                        data-tooltip-content="Clear search"
                    /> */}
                      <MdOutlineYoutubeSearchedFor style={{ cursor: 'pointer', height: '24px', width: "24px", color: "#32406d" }} data-tooltip-id={"remove_search"}
                        data-tooltip-content="Clear search" />
                      <ReactTooltip
                        style={{ zIndex: 999, padding: "2px", backgroundColor: "#32406d" }}
                        place="top-start"
                        id="remove_search"
                      />
                    </div>
                    <div className="remove_filter_icons" onClick={removeAllFilter} style={{ display: 'flex', marginLeft: '10px', padding: '3px', justifyContent: 'center', alignItems: 'center', borderRadius: "5px", marginTop: "4px" }}>
                      <img style={{ cursor: 'pointer', height: '24px' }} src={filter_icon} alt="svg_img"
                        data-tooltip-id={"remove_filter"}
                        data-tooltip-content="Clear all filters"
                      />
                      <ReactTooltip
                        style={{ zIndex: 999, padding: "4px", backgroundColor: "#32406d" }}
                        place="top-start"
                        id="remove_filter"
                      />
                    </div>
                  </div>
          
                <div
                  className="table-container"
                  style={{
                    overflowY: "auto",
                    marginTop: "5px",
                    overflowX: "auto",
                    position: "relative",
                    minHeight: "250px",
                    height: "65%"
                  }}
                >
                  <table
                    className="max-width-fit-content table"
                    style={{
                      tableLayout: "fixed",
                      width: "100%",
                      marginTop: "-5px",
                    }}
                    id="candidates-table"
                  >
                    <thead style={{ backgroundColor: "#32406d" }}>
                      <tr>
                        <th style={{ width: "50px" }}>
                          <input
                            style={{ cursor: "pointer" }}
                            id="all"
                            type="checkbox"
                            onChange={handleSelectAll}
                            data-tooltip-id={"select_all"}
                            data-tooltip-content="Select All"

                          />
                          <ReactTooltip
                            style={{ zIndex: 999, padding: "4px", backgroundColor: "#32406D", }}
                            place="bottom"
                            id="select_all"
                          />

                        </th>
                        <th style={{ width: "100px", color: showSearchjobassignment.showSearchName ? "orange" : "white", }}>
                          <span
                            id={"name_label_ref"}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchName"
                                      ? !prev.showSearchName
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          >Name{" "}</span>
                          <MdFilterAlt
                            style={{ color: isnameFiltered ? "orange" : "white" }}
                            id={"name_ref"}
                            className="arrow"
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchName"
                                      ? !prev.showSearchName
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          />
                          {showSearchjobassignment.showSearchName && (
                            <div ref={uniRef} className="Filter-popup">
                              <form
                                id="filter-form"
                                className="Filter-inputs-container"
                              >
                                <ul>
                                  <li>
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "12px",
                                        marginRight: "5px",
                                      }}
                                      checked={selectAll}
                                      onChange={handleSelectAllForName}
                                    />
                                    <label

                                      style={{
                                        marginBottom: "0px",
                                        fontWeight: "400",
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => handleSelectAllForName()}>
                                      Select all
                                    </label>
                                  </li>
                                  <li>
                                    {uniqueDataNames
                                      .slice()
                                      .filter((name) => name !== undefined)
                                      .sort((a, b) => {
                                        // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                        const trimmedA = a?.trim().toLowerCase();
                                        const trimmedB = b?.trim().toLowerCase();

                                        const inArray2A = nameSelected.includes(trimmedA);
                                        const inArray2B = nameSelected.includes(trimmedB);

                                        if (inArray2A && !inArray2B) {
                                          return -1;
                                        } else if (!inArray2A && inArray2B) {
                                          return 1;
                                        } else {
                                          return trimmedA.localeCompare(trimmedB);
                                        }
                                      })
                                      .map((username, index) => (
                                        <div
                                          key={index}
                                          className="filter-inputs"
                                        >
                                          <input
                                            type="checkbox"
                                            style={{
                                              width: "12px",
                                            }}
                                            checked={nameSelected.includes(
                                              username.toLowerCase(),
                                            )}
                                            onChange={() =>
                                              handleCheckboxChange(
                                                username.toLowerCase(),
                                              )
                                            }
                                          />
                                          <label
                                            style={{
                                              marginBottom: "0px",
                                              fontWeight: "400",
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => handleCheckboxChange(
                                              username.toLowerCase(),
                                            )}
                                          >
                                            {username}
                                          </label>
                                        </div>
                                      ))}
                                  </li>
                                </ul>
                              </form>
                            </div>
                          )}
                        </th>
                        <th style={{ width: "70px", color: showSearchjobassignment.showSearchClient ? "orange" : "white", }}>
                          <span
                            id={"client_label_ref"}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchClient"
                                      ? !prev.showSearchClient
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          >Client{" "}</span>
                          <MdFilterAlt
                            style={{
                              color: isclientFiltered ? "orange" : "white",
                            }}
                            id={"client_ref"}
                            className="arrow"
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchClient"
                                      ? !prev.showSearchClient
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          />
                          {showSearchjobassignment.showSearchClient && (
                            <div ref={uniRef} className="Filter-popup">
                              <form
                                id="filter-form-client"
                                className="Filter-inputs-container"
                              >
                                <ul>
                                  <li>
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "12px",
                                        marginRight: "5px",
                                      }}
                                      checked={selectAllClient}
                                      onChange={handleSelectAllForClient}
                                    />
                                    <label
                                      style={{
                                        marginBottom: "0px",
                                        fontWeight: "400",
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                      }}
                                      onClick={() => handleSelectAllForClient()} >
                                      Select all
                                    </label>
                                  </li>
                                  <li>
                                    {uniqueDataClient
                                      .slice()
                                      .sort((a, b) => {
                                        // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                        const trimmedA = a?.trim().toLowerCase();
                                        const trimmedB = b?.trim().toLowerCase();

                                        const inArray2A = clientSelected.includes(trimmedA);
                                        const inArray2B = clientSelected.includes(trimmedB);

                                        if (inArray2A && !inArray2B) {
                                          return -1;
                                        } else if (!inArray2A && inArray2B) {
                                          return 1;
                                        } else {
                                          return trimmedA.localeCompare(trimmedB);
                                        }
                                      })
                                      .map((client, index) => (
                                        <div
                                          key={index}
                                          className="filter-inputs"
                                        >
                                          <input
                                            type="checkbox"
                                            style={{
                                              width: "12px",
                                            }}
                                            checked={clientSelected.includes(
                                              client.toLowerCase(),
                                            )}
                                            onChange={() =>
                                              handleCheckboxChangeClient(
                                                client.toLowerCase(),
                                              )
                                            }
                                          />
                                          <label
                                            style={{
                                              marginBottom: "0px",
                                              fontWeight: "400",
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => handleCheckboxChangeClient(
                                              client.toLowerCase(),
                                            )}
                                          >
                                            {client}
                                          </label>
                                        </div>
                                      ))}
                                  </li>
                                </ul>
                              </form>
                            </div>
                          )}
                        </th>
                        <th style={{
                          width: "75px", color: showSearchjobassignment.showSearchProfile ? "orange" : "white",
                        }}>
                          <span
                            id={"profile_label_ref"}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchProfile"
                                      ? !prev.showSearchProfile
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          >Profile{" "}</span>
                          <MdFilterAlt
                            style={{
                              color: isprofileFiltered ? "orange" : "white",
                            }}
                            id={"profile_ref"}
                            name=""
                            className="arrow"
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchProfile"
                                      ? !prev.showSearchProfile
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          />
                          {showSearchjobassignment.showSearchProfile && (
                            <div ref={uniRef} className="Filter-popup">
                              <form
                                id="filter-form-profile"
                                className="Filter-inputs-container"
                              >
                                <ul>
                                  <li>
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "12px",
                                        marginRight: "5px",
                                      }}
                                      checked={selectAllProfile}
                                      onChange={handleSelectAllForProfile}
                                    />
                                    <label
                                      style={{
                                        marginBottom: "0px",
                                        fontWeight: "400",
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                      }}
                                      onClick={() => handleSelectAllForProfile()} >
                                      Select all
                                    </label>
                                  </li>
                                  <li>
                                    {uniqueDataProfile
                                      .slice()
                                      .sort((a, b) => {
                                        // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                        const trimmedA = a?.trim().toLowerCase();
                                        const trimmedB = b?.trim().toLowerCase();

                                        const inArray2A = profileSelected.includes(trimmedA);
                                        const inArray2B = profileSelected.includes(trimmedB);

                                        if (inArray2A && !inArray2B) {
                                          return -1;
                                        } else if (!inArray2A && inArray2B) {
                                          return 1;
                                        } else {
                                          return 0;
                                        }
                                      })
                                      .map((profile, index) => (
                                        <div
                                          key={index}
                                          className="filter-inputs"
                                        >
                                          <input
                                            type="checkbox"
                                            style={{
                                              width: "12px",
                                            }}
                                            checked={profileSelected.includes(
                                              profile?.toLowerCase(),
                                            )}
                                            onChange={() =>
                                              handleCheckboxChangeProfile(
                                                profile.toLowerCase(),
                                              )
                                            }
                                          />
                                          <label
                                            style={{
                                              marginBottom: "0px",
                                              fontWeight: "400",
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => handleCheckboxChangeProfile(
                                              profile.toLowerCase(),
                                            )}
                                          >
                                            {profile}
                                          </label>
                                        </div>
                                      ))}
                                  </li>
                                </ul>
                              </form>
                            </div>
                          )}
                        </th>
                        <th style={{ width: "80px", color: showSearchjobassignment.showSearchStatus ? "orange" : "white" }}>
                          <span
                            id={"status_label_ref"}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchStatus"
                                      ? !prev.showSearchStatus
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          >Status{" "}</span>
                          <MdFilterAlt
                            style={{
                              color: isstatusFiltered || isColorFiltered ? "orange" : "white",
                            }}
                            id={"status_ref"}
                            className="arrow"
                            onClick={() => {
                              setshowSearchjobassignment((prev) => ({
                                ...Object.fromEntries(
                                  Object.keys(prev).map((key) => [
                                    key,
                                    key === "showSearchStatus"
                                      ? !prev.showSearchStatus
                                      : false,
                                  ]),
                                ),
                              }));
                            }}
                          />
                          {showSearchjobassignment.showSearchStatus && (
                            <div ref={uniRef} className="Filter-popup" style={{ marginLeft: "0", minWidth: "195px" }}>
                              <form
                                id="filter-form-client"
                                className="Filter-inputs-container"
                              >
                                <div style={{ backgroundColor: "#cad1ff", height: "65px" }}>
                                  <p>Filter by color</p>
                                  <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>

                                    <input
                                      type="radio"
                                      id="green"
                                      name="green"
                                      value="green"
                                      checked={selectedColors[0]}
                                      onClick={() => handleSelectedColors(0)}

                                      style={{
                                        appearance: 'none',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: '2px solid green',
                                        outline: 'none',
                                        marginRight: '5px',
                                        backgroundColor: selectedColors[0] ? 'green' : 'white',
                                      }}
                                    />
                                    <input
                                      type="radio"
                                      id="red"
                                      name="red"
                                      value="red"
                                      checked={selectedColors[1]}
                                      onClick={() => handleSelectedColors(1)}
                                      style={{
                                        appearance: 'none',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: '2px solid orange', // Red border for default and selected state
                                        outline: 'none',
                                        marginRight: '5px',
                                        backgroundColor: selectedColors[1] ? 'orange' : 'white',
                                      }}
                                    />
                                    <input
                                      type="radio"
                                      id="red"
                                      name="red"
                                      value="red"
                                      checked={selectedColors[2]}
                                      onClick={() => handleSelectedColors(2)}
                                      style={{
                                        appearance: 'none',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: '2px solid red',
                                        outline: 'none',
                                        marginRight: '5px',
                                        backgroundColor: selectedColors[2] ? 'red' : 'white',
                                      }}
                                    />

                                  </div>
                                </div>
                                {/* <hr /> */}
                                <ul>
                                  <li>
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "12px",
                                        marginRight: "5px",
                                      }}
                                      checked={selectAllStatus}
                                      onChange={handleSelectAllForStatus}
                                    />
                                    <label
                                      style={{
                                        marginBottom: "0px",
                                        fontWeight: "400",
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                      }}
                                      onClick={() => handleSelectAllForStatus()} >
                                      Select all
                                    </label>
                                  </li>
                                  <li>
                                    {uniqueDataStatus
                                      .filter(
                                        (recruiter) =>
                                          recruiter != null && recruiter !== "",
                                      )
                                      .slice()
                                      .sort((a, b) => {
                                        // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                        const trimmedA = a?.trim().toLowerCase();
                                        const trimmedB = b?.trim().toLowerCase();

                                        const inArray2A = statusSelected.includes(trimmedA);
                                        const inArray2B = statusSelected.includes(trimmedB);

                                        if (inArray2A && !inArray2B) {
                                          return -1;
                                        } else if (!inArray2A && inArray2B) {
                                          return 1;
                                        } else {
                                          return trimmedA.localeCompare(trimmedB);
                                        }
                                      })
                                      .map((status, index) => (
                                        <div
                                          key={index}
                                          className="filter-inputs"
                                        >
                                          <input
                                            type="checkbox"
                                            style={{
                                              width: "12px",
                                            }}
                                            checked={statusSelected.includes(
                                              status.toLowerCase(),
                                            )}
                                            onChange={() =>
                                              handleCheckboxChangeStatus(
                                                status.toLowerCase(),
                                              )
                                            }
                                          />
                                          <label
                                            style={{
                                              marginBottom: "0px",
                                              fontWeight: "400",
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => handleCheckboxChangeStatus(
                                              status.toLowerCase(),
                                            )}
                                          >
                                            {status}
                                          </label>
                                        </div>
                                      ))}
                                  </li>
                                </ul>
                              </form>
                            </div>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const originalFilteredCandidates = filteredCandidates();
                        const filteredByColor = new Set(selectedColors).size === 1
                          ? originalFilteredCandidates
                          : originalFilteredCandidates.filter(cand => {
                            if (selectedColors[0] && (cand.status.toLowerCase().includes("selected") || cand.status.toLowerCase().includes("boarded"))) {
                              return true;
                            }
                            if (selectedColors[2] && (cand.status.toLowerCase().includes("rejected") || cand.status.toLowerCase().includes("hold") || cand.status.toLowerCase().includes("drop") || cand.status.toLowerCase().includes("show") || cand.status.toLowerCase().includes("duplicate"))) {
                              return true;
                            }
                            if (selectedColors[1] && (!cand.status.toLowerCase().includes("selected") && !cand.status.toLowerCase().includes("boarded") && !cand.status.toLowerCase().includes("rejected") && !cand.status.toLowerCase().includes("hold") && !cand.status.toLowerCase().includes("drop") && !cand.status.toLowerCase().includes("show") && !cand.status.toLowerCase().includes("duplicate"))) {
                              return true;
                            }
                            return false;
                          });


                        if (filteredByColor.length === 0) {
                          return (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', fontSize: "16px", color: "grey" }}>
                                <strong>No data found</strong>
                              </td>
                            </tr>
                          );
                        }
                        return filteredByColor.map((item, idx) => (
                          <tr key={idx}>
                            <td className="pf_td">
                              <input
                                type="checkbox"
                                checked={selectItems.find(selectItem => selectItem.id === item.id)?.isShow || false}
                                onChange={(e) => handleSelectIndividual(item.id, e)}
                                id={item.id}
                              />
                            </td>
                            <td className="pf_td" style={{ textAlign: "left", fontSize: "14px", height: "40px" }}>{item.username}</td>
                            <td className="pf_td" style={{ textAlign: "left", fontSize: "14px", height: "40px" }}>{item.client}</td>
                            <td className="pf_td" style={{ textAlign: "left", fontSize: "14px", height: "40px" }}>{item.profile}</td>
                            <td className="pf_td" style={{ textAlign: "left", fontSize: "14px", height: "40px" }}>
                              <span style={{ color: getStatusColor(item.status) }}>{item.status}</span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
                <h4 className="h4tag">
                  Assign Selected Candidates to Recruiter:
                  <select
                    id="assign_recruiter_id"
                    onChange={handleAssignedRecruiter}
                    value={assignedRecruiter || ""}
                  >
                    <option value="" disabled>Select Recruiter</option>
                    {showRecruiters.map((item, idx) =>
                      item !== selectedRecruiter && (
                        <option value={item} key={idx}>
                          {item}
                        </option>
                      ))}
                  </select>
                </h4>
                <div className="pf_button">
                  <button
                    style={{
                      cursor: "pointer",
                      height: "40px",
                      padding: "5px",
                      width: "145px",
                      backgroundColor: "#32406D",
                      color: "white",
                      borderRadius: "5px",
                      border: "1px solid",
                    }}
                    type="submit"
                  >
                    {waitForSubmission ? "" : "Assign Candidates"}
                    <ThreeDots
                      wrapperClass="ovalSpinner"
                      wrapperStyle={{
                        position: "absolute",
                        bottom: "20px",
                        left: "65px",
                      }}
                      visible={waitForSubmission}
                      height="45"
                      width="45"
                      color="white"
                      ariaLabel="oval-loading"
                    />
                  </button>
                </div>
              </>
            )
          )}
        </form>
      </div>
    </div>
  );
}
export default ProfileTransfer;

