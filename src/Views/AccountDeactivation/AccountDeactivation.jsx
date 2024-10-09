import React, { useState, useEffect } from "react";
import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { toast } from "react-toastify";
import { useRef } from "react";
import { Bounce } from "react-toastify";
// import "../UserAccounts/UserAccount.css";
import { Hourglass } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { MdFilterAlt } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa6";
import filter_icon from '../../assets/filter_icon.svg'
import clear_search from '../../assets/clear_search.svg'
import { FaAngleRight } from "react-icons/fa6";
import { } from // setActiveUsers,

  "../../store/slices/userSlice";
import "../AccountDeactivation/AccountDeactivation.css";

import {
  getDashboardData,
  getAllJobs,
  getAllRecruitersManagers,
} from "../utilities.js";

function AccountDeactivation() {
  const uniRef = useRef(null);
  const dispatch = useDispatch();
  const { recruiters, managers } = useSelector(
    (state) => state.userSliceReducer,
  );

  useEffect(() => {
    if (recruiters.length === 0 || managers.length === 0) {
      setLoading(true);
    } else {
      console.log("fetchUsers useff");
      fetchUsers();
      setLoading(false);
    }
  }, [recruiters, managers]);

  const [belowCount, setBelowCount] = useState(0);
  const [id, setId] = useState(1);
  const [countItems, setCountItems] = useState(0);
  const [filteredId, setFilteredId] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [deactivateusers, setdeactivateUsers] = useState([]);
  const [toggleDisabled, setToggleDisabled] = useState(false);

  //filter
  const [selectAll, setSelectAll] = useState(false);
  const [uniqueDataname, setUniqueDataname] = useState([]);
  const [nameSelected, setnameSelected] = useState([]);

  const [selectAllUsername, setSelectAllUsername] = useState(false);
  const [uniqueDataUsernames, setUniqueDataUsernames] = useState([]);
  const [usernameSelected, setUsernameSelected] = useState([]);

  const [selectAllEmail, setSelectAllEmail] = useState(false);
  const [uniqueDataEmails, setUniqueDataEmails] = useState([]);
  const [emailSelected, setEmailSelected] = useState([]);

  const [selectAllUserType, setSelectAllUserType] = useState(false);
  const [uniqueDataUserTypes, setUniqueDataUserTypes] = useState([]);
  const [userTypeSelected, setUserTypeSelected] = useState([]);

  useEffect(() => {
    const closeFilterPop = (e) => {
      const allRefIds = [
        "username_ref",
        "name_ref",
        "email_ref",
        "usertype_ref",

        "user_label_nameRef",
        "usertype_label_ref",
        "name_label_ref",
        "email_label_ref",


      ];
      let bool = false;
      for (const ref of allRefIds) {
        if (document.getElementById(ref)?.contains(e.target)) {
          bool = true;
          return;
        }
      }
      if (uniRef.current?.contains(e.target) || bool) {
        console.log("yes");
      } else {
        console.log("no");
        setshowSearchUseraccount((prev) => ({
          ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
        }));
      }
    };
    document.addEventListener("click", closeFilterPop);
    return () => {
      document.removeEventListener("click", closeFilterPop);
    };
  }, []);

  const [showSearchUseraccount, setshowSearchUseraccount] = useState({
    showSearchname: false,
    showSearchUsername: false,
    showSearchEmail: false,
    showSearchUsertype: false,
  });

  const [isnameFiltered, setIsNameFiltered] = useState(false);
  const [isemailFiltered, setIsEmailFiltered] = useState(false);
  const [isusertypeFiltered, setIsUsertypeFiltered] = useState(false);
  const [isusernameFiltered, setIsUsernameFiltered] = useState(false);

  const handleOkClick = () => {
    setId(1)
    updateFilteredRows({
      usernameSelected,
      nameSelected,
      emailSelected,
      userTypeSelected,

      setUsernameSelected,
      setnameSelected,
      setUniqueDataEmails,
      setUserTypeSelected,

      setSelectAll,
      setSelectAllUsername,
      setSelectAllEmail,
      setSelectAllUserType,

      setUniqueDataname,
      setUniqueDataUsernames,
      setUniqueDataEmails,
      setUniqueDataUserTypes,
    });
    // Set the filtered rows
    setIsNameFiltered(nameSelected.length > 0);
    setIsEmailFiltered(emailSelected.length > 0);
    setIsUsernameFiltered(usernameSelected.length > 0);
    setIsUsertypeFiltered(userTypeSelected.length > 0);
    // Hide the filter popups
    // setshowSearchUseraccount((prev) =>
    //   Object.fromEntries(
    //     Object.entries(prev).map(([key, value]) => [key, false]),
    //   ),
    // );
  };

  useEffect(() => {
    // console.log("handleOkClick Called");
    handleOkClick();
  }, [nameSelected, userTypeSelected, usernameSelected, emailSelected]);

  const [filteredRows, setFilteredRows] = useState([]);
  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);
  const updateFilteredRows = ({
    usernameSelected,
    nameSelected,
    emailSelected,
    userTypeSelected,

    setUniqueDataname,
    setUniqueDataUsernames,
    setUniqueDataEmails,
    setUniqueDataUserTypes,
  }) => {
    let prevfilteredRows = [...recruiters, ...managers];
    console.log("prevfilteredRows 1", prevfilteredRows);
    if (usernameSelected.length > 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        usernameSelected.includes(row.username.toLowerCase()),
      );
    }
    if (nameSelected.length > 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        nameSelected.includes(row.name.toLowerCase()),
      );
    }
    if (emailSelected.length > 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        emailSelected.includes(row.email.toLowerCase()),
      );
    }

    if (userTypeSelected.length > 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        userTypeSelected.includes(row.user_type.toLowerCase()),
      );
    }

    const arrayNames = [
      "usernameSelected",
      "nameSelected",
      "emailSelected",
      "userTypeSelected",
    ];
    const arrays = [
      usernameSelected,
      nameSelected,
      emailSelected,
      userTypeSelected,
    ];
    let NamesOfNonEmptyArray = [];

    arrays.forEach((arr, index) => {
      if (arr.length > 0) {
        // NameOfNonEmptyArray = arrayNames[index];
        NamesOfNonEmptyArray.push(arrayNames[index]);
        // setNonEmptyArray(prev => ([
        //   ...prev,
        //   arrayNames[index]
        // ]))
      }
    });


    if (!NamesOfNonEmptyArray.includes("nameSelected")) {
      setUniqueDataname(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.name;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("usernameSelected")) {
      setUniqueDataUsernames(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.username;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("emailSelected")) {
      setUniqueDataEmails(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.email;
            }),
          ),
        );
      });
    }
    if (!NamesOfNonEmptyArray.includes("userTypeSelected")) {
      setUniqueDataUserTypes(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.user_type;
            }),
          ),
        );
      });
    }
    console.log("prevfilteredRows 2", prevfilteredRows);
    setFilteredRows(prevfilteredRows);
    // console.log(prevfilteredRows.length)
    setBelowCount(prevfilteredRows?.length);
  };
  useEffect(() => {
    // console.log(belowCount)
  }, [belowCount]);
  const handleSelectAll = () => {
    const allChecked = !selectAll;
    setSelectAll(allChecked);

    if (allChecked) {
      setnameSelected(uniqueDataname.map((d) => d.toLowerCase()));
    } else {
      setnameSelected([]);
    }
  };

  const handleCheckboxChangename = (name) => {
    const isSelected = nameSelected.includes(name);
    if (isSelected) {
      setnameSelected((prevSelected) =>
        prevSelected.filter((item) => item !== name),
      );
      setSelectAll(false);
    } else {
      setnameSelected((prevSelected) => [...prevSelected, name]);
      setSelectAll(nameSelected.length === uniqueDataname.length - 1);
    }
  };
  const handleSelectAllForUsername = () => {
    const allChecked = !selectAllUsername;
    setSelectAllUsername(allChecked);

    if (allChecked) {
      setUsernameSelected(uniqueDataUsernames.map((d) => d.toLowerCase()));
    } else {
      setUsernameSelected([]);
    }
  };

  const handleCheckboxChangeUsername = (username) => {
    const isSelected = usernameSelected.includes(username);
    if (isSelected) {
      setUsernameSelected((prevSelected) =>
        prevSelected.filter((item) => item !== username),
      );
      setSelectAllUsername(false);
    } else {
      setUsernameSelected((prevSelected) => [...prevSelected, username]);
      setSelectAllUsername(
        usernameSelected.length === uniqueDataUsernames.length - 1,
      );
    }
  };

  const handleSelectAllForEmail = () => {
    const allChecked = !selectAllEmail;
    setSelectAllEmail(allChecked);

    if (allChecked) {
      setEmailSelected(uniqueDataEmails.map((d) => d.toLowerCase()));
    } else {
      setEmailSelected([]);
    }
  };

  const handleCheckboxChangeEmail = (email) => {
    const isSelected = emailSelected.includes(email);
    if (isSelected) {
      setEmailSelected((prevSelected) =>
        prevSelected.filter((item) => item !== email),
      );
      setSelectAllEmail(false);
    } else {
      setEmailSelected((prevSelected) => [...prevSelected, email]);
      setSelectAllEmail(emailSelected.length === uniqueDataEmails.length - 1);
    }
  };

  const handleSelectAllForUserType = () => {
    const allChecked = !selectAllUserType;
    setSelectAllUserType(allChecked);

    if (allChecked) {
      setUserTypeSelected(uniqueDataUserTypes.map((d) => d.toLowerCase()));
    } else {
      setUserTypeSelected([]);
    }
  };

  const handleCheckboxChangeUserType = (userType) => {
    const isSelected = userTypeSelected.includes(userType);
    if (isSelected) {
      setUserTypeSelected((prevSelected) =>
        prevSelected.filter((item) => item !== userType),
      );
      setSelectAllUserType(false);
    } else {
      setUserTypeSelected((prevSelected) => [...prevSelected, userType]);
      setSelectAllUserType(
        userTypeSelected.length === uniqueDataUserTypes.length - 1,
      );
    }
  };

  useEffect(() => {
    // Save users to local storage whenever users change
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // useEffect(() => {
  //   // Retrieve users from local storage on component mount
  //   const storedUsers = localStorage.getItem("users");
  //   if (storedUsers) {
  //     setUsers(JSON.parse(storedUsers));
  //   }
  // }, []);

  const fetchUsers = async () => {
    console.log("fetchUsers");
    try {
      // const data =
      // console.log('active_users',data)
      const loggedInUserName = localStorage.getItem("user_name");
      const combinedUsers = [...managers, ...recruiters].filter(
        (user) => user.username !== loggedInUserName,
      );
      // console.log("combinedUsers", combinedUsers);
      setUsers(combinedUsers);
      // dispatch(setActiveManagers({users:data.active_users_manager}))
      // dispatch(setActiveRecruiters({users:data.active_users_recruiter}))
      setBelowCount(combinedUsers.length);
      if (combinedUsers.length > 0) {
        console.log("combinedUsers.lengt", combinedUsers.length);
        // setUsers(combinedUsers); // Assign fetched data to state
        // console.log(combinedUsers.length);
        const temp = combinedUsers.length;
        if (temp % 30 === 0) {
          setCountItems(temp / 30);
        } else {
          setCountItems(temp / 30 + 1);
        }

        // Set unique data for filters
        setUniqueDataname([...new Set(combinedUsers.map((d) => d.name))]);
        setUniqueDataUsernames([
          ...new Set(combinedUsers.map((d) => d.username)),
        ]);
        setUniqueDataEmails([...new Set(combinedUsers.map((d) => d.email))]);
        setUniqueDataUserTypes([
          ...new Set(combinedUsers.map((d) => d.user_type)),
        ]);

        setFilteredRows(
          combinedUsers?.filter(
            (item) => item.username !== localStorage.getItem("user_name"),
          ),
        );
      }
      // dispatch(setActiveUsers({ users: combinedUsers }));
      // console.log("active users",activeUsers)
    } catch (err) {
      setError(err.message);
    }
  };

  // useEffect(() => {
  //   // Indicate loading has completed

  //   const fun1 = async () => {
  //     setBelowCount(activeUsers.length);
  //     // console.log(activeUsers)
  //     if (activeUsers.length > 0) {
  //       setUsers(activeUsers); // Assign fetched data to state
  //       // console.log(combinedUsers.length);
  //       const temp = activeUsers.length;
  //       if (temp % 30 === 0) {
  //         setCountItems(temp / 30);
  //       } else {
  //         setCountItems(temp / 30 + 1);
  //       }
  //       setLoading(false);

  //       // Set unique data for filters
  //       setUniqueDataname([...new Set(activeUsers.map((d) => d.name))]);
  //       setUniqueDataUsernames([
  //         ...new Set(activeUsers.map((d) => d.username)),
  //       ]);
  //       setUniqueDataEmails([...new Set(activeUsers.map((d) => d.email))]);
  //       setUniqueDataUserTypes([
  //         ...new Set(activeUsers.map((d) => d.user_type)),
  //       ]);

  //       setFilteredRows(
  //         activeUsers?.filter(
  //           (item) => item.username !== localStorage.getItem("user_name"),
  //         ),
  //       );
  //     }
  //   };
  //   fun1();
  //   // Set unique data for filters
  //   // Set filtered rows initially to all users
  //   // console.log('filteredRows:',active_users_recruiter)
  // }, [activeUsers]);

  const toggleUsers = async (username, userStatus) => {
    try {
      setToggleDisabled(true); // Disable toggle during API call

      const response = await fetch(
        "https://ats-9.onrender.com/deactivate_user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: username,
            user_status: userStatus ? false : true,
            user_id: localStorage.getItem("user_id"),
          }),
        },
      );

      if (response.ok) {
        await getAllRecruitersManagers().then(() => {
          const updatedUsers = users.map((user) =>
            user.username === username
              ? { ...user, is_active: !userStatus }
              : user,
          );
          // console.log("Updated Users:", updatedUsers); // Debugging log
          setUsers(updatedUsers);
          const action = userStatus ? "deactivated" : "activated";
          const message = `Account ${username} is ${action}`;
          if (userStatus) {
            toast.success(message, { className: "toast-error" }); // Red color for deactivated
          } else {
            toast.success(message, { className: "toast-success" }); // Green color for activated
          }
        });
        // console.log("API Response:", data);
      } else {
        console.log("API Error:", response.statusText);
        notify();
      }
    } catch (err) {
      console.error("API Request Error:", err);
    } finally {
      setToggleDisabled(false); // Enable toggle after API call completes (success or failure)
    }
  };

  const notify = () => toast.error("Select other than the current account");
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= countItems) {
      setId(pageNumber);
    }
  };

  // Calculate the range of pages to display in pagination
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
  function extractKeyValuePairs(object, keysToExtract) {
    return keysToExtract.reduce((acc, key) => {
      if (key in object) {
        acc[key] = object[key];
      }
      return acc;
    }, {});
  }
  const fun = (update) => {
    const list = update.filter((it) => {
      return filteredRows.some((item) => item.id === it.id);
    });
    // console.log(list);
    setBelowCount(list?.length);
    setId(1);
    // setUniqueDataname([...new Set(list.map((d) => d.name))]);
    // setUniqueDataUsernames([...new Set(list.map((d) => d.username))]);
    // setUniqueDataEmails([...new Set(list.map((d) => d.email))]);
    // setUniqueDataUserTypes([...new Set(list.map((d) => d.user_type))]);
  };
  useEffect(() => {
    // console.log(searchValue)
    if (users?.length > 0) {
      const update = users?.filter((item) => {
        const extractedObj = extractKeyValuePairs(item, [
          "id",
          "username",
          "name",
          "email",
          "user_type",
        ]);
        // console.log(extractedObj);
        for (const key in extractedObj) {
          if (key === "id") {
            continue;
          }
          // console.log('key',key)
          let val = extractedObj[key];
          // console.log(val)
          if (val !== null && val !== undefined) {
            if (typeof val !== "string") {
              val = val.toString();
            }
            if (val.toLowerCase().includes(searchValue.toLowerCase())) {
              // console.log('yes working good')
              return true;
            }
          } else {
            console.log("Value is null or undefined for key:", key);
          }
        }
        console.log("No match found for searchValue:", searchValue);
        return false;
      });

      // console.log(update)
      fun(update);
      // setBelowCount(update.length)
      let extract = [];
      for (const item of update) {
        extract.push(item.id);
      }
      setFilteredId(extract);
      // console.log(extract)
    }
  }, [searchValue]);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  useEffect(() => {
    if (belowCount % 30 != 0) setCountItems(parseInt(belowCount / 30) + 1);
    else setCountItems(parseInt(belowCount / 30));
  }, [belowCount]);

  const filteredData = (data) => {
    if (data?.length > 3) {
      const data1 = data.filter(
        (_, idx) => idx + 1 <= id * 30 && idx + 1 > (id - 1) * 30,
      );
      return data1;
    } else {
      return data;
    }
  };

  const displayItems = () => {
    // console.log('filteredRows:',filteredRows)
    const data = filteredRows?.filter((item) => {
      if (filteredId.length > 0) {
        for (const it of filteredId) {
          if (it === item.id) {
            return true;
          }
        }
        // Return false only if none of the elements in filteredId match item.id
        return false;
      } else {
        if (searchValue === "") return true;
        else return false;
      }
    });

    const data1 = filteredData(data);
    return data1;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }


  const removeAllFilter = () => {
    setnameSelected([])
    setUsernameSelected([])
    setEmailSelected([])
    setUserTypeSelected([])
  }

  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        {loading ? (
          <div className="loader-container">
            <Hourglass
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

              <div style={{ display: 'flex', alignItems: 'center',zIndex:'2' }}>
                <IoMdSearch style={{ display: 'flex', alignItems: 'center', height: "22px", width: "22px", marginRight: "-25px", marginTop: "5px" }} />
                <input
                className="UAsearch"
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
            </div>
            <div className="AUheading">
            <h5 style={{ paddingTop: "0px", margin: "-35px 0 10px" }} className="users">
              Users Accounts
            </h5>
            </div>
            <div
              className="container"
              style={{ marginTop: "0px" }}
            >
              <div
                className="table-container"
                style={{ overflowY: "auto", overflowX: "auto", marginTop: "3px" }}
              >
                <table
                  style={{
                    width: "100%",
                    overflow: "auto",
                    tableLayout: "fixed",
                    margin: "0"
                  }}
                  className="table userac"
                  id="myTable"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "250px", color: showSearchUseraccount.showSearchUsername ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"user_label_nameRef"}
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchUsername"
                                    ? !prev.showSearchUsername
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Username</span>
                        <MdFilterAlt
                          style={{
                            color: isusernameFiltered ? "orange" : "white",
                          }}
                          id={"username_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchUsername"
                                    ? !prev.showSearchUsername
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchUseraccount.showSearchUsername && (
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
                                    checked={selectAllUsername}
                                    onChange={handleSelectAllForUsername}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      fontSize: '13px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelectAllForUsername()}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataUsernames
                                    .slice()
                                    .filter((name) => name !== undefined)
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = usernameSelected.includes(trimmedA);
                                      const inArray2B = usernameSelected.includes(trimmedB);

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
                                          style={{ width: "12px" }}
                                          checked={usernameSelected.includes(
                                            username.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeUsername(
                                              username.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeUsername(
                                            username.toLowerCase(),
                                          )}>
                                          {username}
                                        </label>
                                      </div>
                                    ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchUseraccount((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>

                      {/* Similarly, you can add filter popups for name, email, user_type, and is_verified */}

                      <th style={{ width: "280px", color: showSearchUseraccount.showSearchname ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"name_label_ref"}
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchname"
                                    ? !prev.showSearchname
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
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchname"
                                    ? !prev.showSearchname
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchUseraccount.showSearchname && (
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
                                    onChange={handleSelectAll}
                                  />
                                  <label
                                    style={{
                                      marginBottom: "0px",
                                      fontWeight: "400",
                                      fontSize: '13px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelectAll()}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataname
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
                                    .map((name, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{ width: "12px" }}
                                          checked={nameSelected.includes(
                                            name.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangename(
                                              name.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangename(
                                            name.toLowerCase(),
                                          )}>
                                          {name}
                                        </label>
                                      </div>
                                    ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchUseraccount((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "320px", color: showSearchUseraccount.showSearchEmail ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"email_label_ref"}
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchEmail"
                                    ? !prev.showSearchEmail
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        >Email{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isemailFiltered ? "orange" : "white",
                          }}
                          id={"email_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchEmail"
                                    ? !prev.showSearchEmail
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchUseraccount.showSearchEmail && (
                          <div
                            ref={uniRef}
                            className="Filter-popup"
                            style={{ width: "auto" }}
                          >
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
                                    checked={selectAllEmail}
                                    onChange={handleSelectAllForEmail}
                                  />
                                  <label
                                    onClick={() => handleSelectAllForEmail()}
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '400',
                                      cursor: 'pointer',
                                      marginBottom: "0px",

                                    }}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataEmails
                                    .slice()
                                    .sort((a, b) => {
                                      // const array2 = ["kiwi", "papaya", "orange"]; // Replace this with your actual array
                                      const trimmedA = a?.trim().toLowerCase();
                                      const trimmedB = b?.trim().toLowerCase();

                                      const inArray2A = emailSelected.includes(trimmedA);
                                      const inArray2B = emailSelected.includes(trimmedB);

                                      if (inArray2A && !inArray2B) {
                                        return -1;
                                      } else if (!inArray2A && inArray2B) {
                                        return 1;
                                      } else {
                                        return 0;
                                      }
                                    })
                                    .map((email, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{ width: "12px" }}
                                          checked={emailSelected.includes(
                                            email.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeEmail(
                                              email.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeEmail(
                                            email.toLowerCase(),
                                          )}>
                                          {email}
                                        </label>
                                      </div>
                                    ))}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchUseraccount((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "120px", color: showSearchUseraccount.showSearchUsertype ? "orange" : "white" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={"usertype_label_ref"}
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchUsertype"
                                    ? !prev.showSearchUsertype
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        > User Type{" "}</span>
                        <MdFilterAlt
                          style={{
                            color: isusertypeFiltered ? "orange" : "white",
                          }}
                          id={"usertype_ref"}
                          className="arrow"
                          onClick={() => {
                            setshowSearchUseraccount((prev) => ({
                              ...Object.fromEntries(
                                Object.keys(prev).map((key) => [
                                  key,
                                  key === "showSearchUsertype"
                                    ? !prev.showSearchUsertype
                                    : false,
                                ]),
                              ),
                            }));
                          }}
                        />
                        {showSearchUseraccount.showSearchUsertype && (
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
                                    checked={selectAllUserType}
                                    onChange={handleSelectAllForUserType}
                                  />
                                  <label
                                    onClick={() => handleSelectAllForUserType()}
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '400',
                                      cursor: 'pointer',
                                      marginBottom: "0px",

                                    }}>
                                    Select all
                                  </label>
                                </li>
                                <li>
                                  {uniqueDataUserTypes.map(
                                    (user_type, index) => (
                                      <div
                                        key={index}
                                        className="filter-inputs"
                                      >
                                        <input
                                          type="checkbox"
                                          style={{ width: "12px" }}
                                          checked={userTypeSelected.includes(
                                            user_type.toLowerCase(),
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeUserType(
                                              user_type.toLowerCase(),
                                            )
                                          }
                                        />
                                        <label style={{ marginBottom: "0px", cursor: 'pointer' }}
                                          onClick={() => handleCheckboxChangeUserType(
                                            user_type.toLowerCase(),
                                          )}>
                                          {user_type}
                                        </label>
                                      </div>
                                    ),
                                  )}
                                </li>
                              </ul>
                            </form>
                            {/* <div className="filter-popup-footer">
                              <button onClick={handleOkClick}>OK</button>
                              <button
                                onClick={() => {
                                  setshowSearchUseraccount((prev) =>
                                    Object.fromEntries(
                                      Object.entries(prev).map(
                                        ([key, value]) => [key, false],
                                      ),
                                    ),
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        )}
                      </th>
                      <th style={{ width: "140px" }}>Account Deactivation</th>
                    </tr>
                  </thead>
                  <tbody className="td_UA">
                    {displayItems()?.map((user, index) => (
                      <tr
                        className="candidate-row fade-in-element slide-in-element row-animation-delay"
                        key={index}
                      >
                        <td style={{ paddingLeft: "25px" }}>{user.username}</td>
                        <td style={{ paddingLeft: "25px" }}>{user.name}</td>
                        <td style={{ paddingLeft: "25px" }}>{user.email}</td>
                        <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                          {user.user_type}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={!user.is_active}
                              onChange={() =>
                                toggleUsers(user.username, user.is_active)
                              }
                              disabled={toggleDisabled}
                              style={{ marginTop: "15px" }}
                            />
                            <span className="sliderAccountDeactivation round"></span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {displayItems()?.length === 0 && (
                  <div
                    style={{
                      backgroundColor: "",
                      textAlign: "center",
                      padding: "10px 0px 10px 0px",
                    }}
                  >
                    No data availible in table
                  </div>
                )}
              </div>
            </div>
            <div
              className="dashbottom"
             
            >
              <div>
                Showing {belowCount === 0 ? 0 : (id - 1) * 30 + 1} to{" "}
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
                  <div style={{ display: "flex", columnGap: "10px" }}>
                    <div>
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
                      if (filteredRows.length > id * 30) setId(id + 1);
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
          </>
        )}
      </div>
    </div>
  );
}

export default AccountDeactivation;
