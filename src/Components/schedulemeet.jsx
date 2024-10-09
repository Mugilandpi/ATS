
import React, { useState, useRef, memo, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { setMeetings, setError } from "../store/slices/meetingslice";
import { getDashboardData } from "../Views/utilities";
import { fetchMeetings } from "../Views/utilities";
import { toast } from "react-toastify";


const ScheduleMeet = ({ interviewModal, InterviewcloseModal, start_autoDate,
  end_autoDate,
  startautoTime,
  endautoTime, setShowCalendar, }) => {

  const dispatch = useDispatch();

  const { dashboardData } = useSelector((state) => state.dashboardSliceReducer);

  const candidateEmails = dashboardData.candidates?.map(candidates => candidates.email) || [];


  // console.log(candidateEmails, "candidate emails");



  const { managers } = useSelector((state) => state.userSliceReducer);
  if (Array.isArray(managers)) {
    const emails = managers.map(manager => manager.email);
    // console.log(emails, "emails");
  } else {
    console.log("Managers is not an array or is empty");
  }
  // console.log(managers, "managers");
  const { recruiters } = useSelector((state) => state.userSliceReducer);
  if (Array.isArray(recruiters)) {
    const recruiteremails = recruiters.map(recruiters => recruiters.email);
    // console.log(recruiteremails, "recruiteremails");
  } else {
    console.log("recruiters is not an array or is empty");
  }
  // console.log(recruiters, "recruiters");
  const [title, setTitle] = useState('');
  const [selectedEmails1, setSelectedEmails1] = useState([]);
  const [selectedEmails2, setSelectedEmails2] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [start_Date, setStartDate] = useState(start_autoDate || "");
  // const [end_Date, setEndDate] = useState(end_autoDate || "");;
  const [startTime, setStartTime] = useState(startautoTime || "");;
  const [endTime, setEndTime] = useState(endautoTime || "");;
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);



  useEffect(() => {
    if (start_autoDate) setStartDate(start_autoDate);
    if (end_autoDate) setEndDate(end_autoDate);
    if (startautoTime) setStartTime(startautoTime);
    if (endautoTime) setEndTime(endautoTime);
  }, [start_autoDate, end_autoDate, startautoTime, endautoTime]);


  // console.log(start_Date,"start Date")
  // console.log(end_Date,"End Date")
  // console.log(startTime,"Start Time")
  // console.log(endTime,"End Time")

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const dropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);

  const [waitForSubmission1, setwaitForSubmission1] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);
  const [newfilteredEmails, setnewFilteredEmails] = useState([]);
  const loggedInEmail = localStorage.getItem('email').toLowerCase();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = candidateEmails.filter((email) =>
      email.toLowerCase().includes(query.toLowerCase())
    );
    setnewFilteredEmails(filtered);
    setShowAddButton(query && filtered.length === 0);
  };

  const handleAddEmail = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && !selectedEmails.includes(trimmedQuery)) {
      setSelectedEmails([...selectedEmails, trimmedQuery]);
    }
    setSearchQuery('');
    setShowAddButton(false);
  };

  // console.log(candidateEmails, ":allcandidateschedule emails")
  const filteredEmails = candidateEmails.filter((email) =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log(filteredEmails, ":allcandidateschedule emails")

  const handleDropdownClick = (dropdown) => {
    setIsDropdownOpen(isDropdownOpen === dropdown ? null : dropdown);
  };
  const handleEmailChange = (email, dropdown) => {
    if (dropdown === 'dropdown1') {
      setSelectedEmails1(prev => {
        if (!Array.isArray(prev)) return [email]; // Ensure prev is an array
        return prev.includes(email)
          ? prev.filter(e => e !== email)
          : [...prev, email];
      });
    } else if (dropdown === 'dropdown2') {
      setSelectedEmails2(prev => {
        if (!Array.isArray(prev)) return [email]; // Ensure prev is an array
        return prev.includes(email)
          ? prev.filter(e => e !== email)
          : [...prev, email];
      });
      setSearchQuery2('');
      setIsDropdownOpen2(false);
    }
  };

  const handleTimeZoneChange = (e) => {
    const newTimeZone = e.target.value;
    setSelectedTimeZone(newTimeZone);
    console.log("Selected Time Zone:", newTimeZone); // Log the new value
  };
  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  const syncEvents = async () => {
    try {
      const response = await fetch('https://ats-9.onrender.com/sync_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recruiter_email: localStorage.getItem('email'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync events');
      }

      const data = await response.json();
      console.log('Sync events response:', data);
    } catch (error) {
      console.error('Sync error:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || !startTime || !endTime || !selectedTimeZone || selectedEmails.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const requiredAttendees = selectedEmails;
    const optionalAttendees = selectedEmails2;
    if (!waitForSubmission1) {
      setwaitForSubmission1(true);
      try {
        const response = await fetch('https://ats-9.onrender.com/create_event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
          },
          body: JSON.stringify({
            subject: title,
            start_date: startDate,
            start_time: startTime,
            end_date: endDate,
            end_time: endTime,
            attendees: requiredAttendees,
            cc_recipients: optionalAttendees,
            time_zone: selectedTimeZone,
            recruiter_email: localStorage.getItem('email'),
            recruiter_id: localStorage.getItem("user_id"),
          }),
        });

        if (response.ok) {
          setModalMessage('Meeting scheduled successfully!');
          setIsModalOpen(true);
          InterviewcloseModal();
          setwaitForSubmission1(false)
          setIsSuccessful(true)
          setTitle("");
          setStartDate("");
          setEndDate("");
          setStartTime("");
          setEndTime("");
          setSelectedTimeZone("");
          setSelectedEmails1([]);
          setSelectedEmails2([]);
          setResponseSuccess(true);
          await syncEvents();
          await fetchMeetings();
        } else {
          setModalMessage('Failed to schedule the meeting.');
          setIsModalOpen(true);
          setwaitForSubmission1(false)
          setIsSuccessful(false)
          setResponseSuccess(false);
        }
      } catch (error) {
        setModalMessage('An error occurred while scheduling the meeting.');
        setIsModalOpen(true);
        setwaitForSubmission1(false)
        setIsSuccessful(false)
        setResponseSuccess(false);
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await syncEvents();
      fetchMeetings();
    };

    initialize();
  }, []);


  const [startDate, setStartDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [endDate, setEndDate] = useState("");
  const [error, seterror] = useState('');
  useEffect(() => {
    if (startDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      label: `${hour}:${minute.toString().padStart(2, '0')}`
    };
  });

  const add30Minutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newMinutes = minutes + 30;
    let newHours = hours;

    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }

    if (newHours === 24) {
      newHours = 0;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (startTime) {
      setEndTime(add30Minutes(startTime));
    } else {
      setEndTime('');
    }
  }, [startTime]);


  const [searchQuery2, setSearchQuery2] = useState('');

  // const handleSearch = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);
  //   const filtered = uniqueDataEmail.filter((email) =>
  //     email.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setnewFilteredEmails(filtered);
  //   setShowAddButton(query && filtered.length === 0);
  // };

  // const handleAddEmail = () => {
  //   const trimmedQuery = searchQuery.trim();
  //   if (trimmedQuery && !selectedEmails.includes(trimmedQuery)) {
  //     setSelectedEmails([...selectedEmails, trimmedQuery]);
  //   }
  //   setSearchQuery('');
  //   setShowAddButton(false);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleAddEmail();
  //   }
  // };

  // const handleRemoveEmail = (emailToRemove) => {
  //   setSelectedEmails(selectedEmails.filter(email => email !== emailToRemove));
  // };

  const handleCheckboxChangeEmails = (email) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email]);
    } else {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
    }
    setSearchQuery(''); // Clear search query
    setIsDropdownOpen(false); // Close the dropdown
    setDropdownVisible(false); // Ensure dropdown is closed
  };

  // const handleSelectCheckedEmails = () => {
  //   const newSelectedEmails = Object.keys(checkedEmails).filter(email => checkedEmails[email]);
  //   setSelectedEmails(prevSelectedEmails => [...new Set([...prevSelectedEmails, ...newSelectedEmails])]); // Add checked emails to selectedEmails
  //   setSearchQuery('');
  //   // setCheckedEmails({});
  // };

  // const filteredEmails = uniqueDataEmail.filter((email) =>
  //   email.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleManualAdd = () => {
  //   handleEmailChange(searchQuery2, 'dropdown2');
  //   setSearchQuery2(''); // Clear the search input after adding the email
  //   setIsDropdownOpen(false); // Close the dropdown
  //   setDropdownVisible(false); // Ensure dropdown is closed

  // };

  // const filteredManagers = Array.isArray(managers)
  //   ? managers.filter(manager => manager.email.toLowerCase().includes(searchQuery2.toLowerCase()))
  //   : [];

  // const handleEmailChange1 = (email) => {
  //   setSelectedEmails(prevSelectedEmails => {
  //     let updatedEmails;
  //     if (prevSelectedEmails.includes(email)) {
  //       updatedEmails = prevSelectedEmails.filter(e => e !== email);
  //     } else {
  //       updatedEmails = [...prevSelectedEmails, email];
  //     }
  //     // Update the input field with the selected emails
  //     setSearchValue(updatedEmails.join(', '));
  //     return updatedEmails;
  //   });
  // };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (new Date(startDate) > new Date(newEndDate)) {
      seterror('End Date is Earlier than Start Date .');
      toast.error('End Date is Earlier than Start Date.');
    } else {
      seterror(''); // Clear error if validation passes
    }

  };

  const resetForm = () => {
    setTitle('');
    setSelectedEmails([]);
    setSearchQuery('');
    setSearchQuery2('');
    setSelectedEmails2([]);
    setSelectedTimeZone('');
    setError('');
    setStartTime('');
    setEndTime('');
    setStartDate('');
    setEndDate('');
  };
  const handleModalClose = () => {
    InterviewcloseModal();
    resetForm();
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|co\.uk)$/;


  // Function to validate email before adding
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleAddEmailWithValidation = () => {
    if (validateEmail(searchQuery)) {
      handleAddEmail();
    } else {
      toast.warn('Please enter a valid email address');
    }
  };
  const handleAddEmailWithValidations = () => {
    if (validateEmail(searchQuery2)) {
      handleEmailChange(searchQuery2, 'dropdown2');
      setSearchQuery2('');
    } else {
      toast.warn('Please enter a valid email address');
    }
  };

  return (
    <div>
      <Modal
        isOpen={interviewModal}
        onRequestClose={handleModalClose}
        contentLabel="Calendar Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly lighter overlay
            zIndex: 9999,
          },
          content: {
            color: '#333', // Darker text for better readability
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', // More compact width
            maxHeight: '580px', // Restrict maximum height
            padding: '20px', // Increased padding
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Light shadow for depth
            position: 'relative', // For absolute positioning of buttons
          }
        }}
      >

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <h2 style={{ color: "#32406D", fontSize: '20px', textAlign: 'center', marginLeft: "-20px" }}>New Meeting</h2>
            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleModalClose}
                style={{ backgroundColor: "#e81123", color: "white", border: "none", borderRadius: "4px", padding: '0px 16px', fontSize: '16px', cursor: 'pointer', height: "30px" }}
              >
                Close
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "#32406D", color: "white", border: "none", borderRadius: "4px", padding: '0px 16px', fontSize: '16px', cursor: 'pointer', position: 'relative', height: "30px", width: "80px" }}
              >
                {waitForSubmission1 ? "" : "Save"}
                <ThreeDots
                  wrapperClass="ovalSpinner"
                  wrapperStyle={{
                    position: "absolute",
                    right: "-5px",
                    transform: "translate(-50%, -50%)",
                  }}
                  visible={waitForSubmission1}
                  height="45"
                  width="45"
                  color="white"
                  ariaLabel="oval-loading"
                />
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Title</label>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Emails</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              height: '40px',
            }}>
              {selectedEmails.map((email, index) => (
                <div
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '0px 10px',
                    borderRadius: '20px',
                    marginRight: '5px',
                    fontSize: '14px'
                  }}
                >
                  {email}
                  <span
                    onClick={() => setSelectedEmails(selectedEmails.filter((e) => e !== email))}
                    style={{
                      marginLeft: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    &times;
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', flex: '1', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search or add email"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    border: 'none',
                    paddingLeft: '10px',
                    fontSize: '16px',
                    outline: 'none',
                  }}
                />
                {searchQuery && filteredEmails.length === 0 && (
                  <button
                    type="button"
                    onClick={handleAddEmailWithValidation}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
            {searchQuery && filteredEmails.length > 0 && (
              <ul className="dropdown-menu" style={{ border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', marginTop: '5px', width: "auto" }}>
                {filteredEmails.map((email, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleCheckboxChangeEmails(email)
                      handleSelectCheckedEmails();
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email)}
                      readOnly
                      style={{ marginRight: '10px' }}
                    />
                    {email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Attendees (optional)</label>
            <div ref={dropdownRef2} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                fontSize: '12px',
                position: 'relative',
                overflowX: 'auto',
                height: '40px'
              }}>
                {selectedEmails2?.map((email, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      marginRight: '5px',
                    }}
                  >
                    {email}
                    <span
                      onClick={() => handleEmailChange(email, 'dropdown2')}
                      style={{
                        marginLeft: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                  <input
                    type="text"
                    placeholder="Search or add email"
                    onClick={() => handleDropdownClick('dropdown2')}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEmailChange(e.target.value, 'dropdown2');
                        setSearchQuery2('');
                      }
                    }}
                    value={searchQuery2}
                    style={{ flex: '1', minWidth: '150px', border: 'none', paddingLeft: '10px', fontSize: '16px', outline: 'none' }}
                    ref={inputRef2}
                  />
                  {searchQuery2 && ![...managers, ...recruiters].some((item) => item.email.toLowerCase().includes(searchQuery2.toLowerCase())) && (
                    <button
                      onClick={handleAddEmailWithValidations}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
              {searchQuery2 && (
                <div className="dropdown-menu" style={{ border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', marginTop: '5px', width: "auto" }}>
                  {[...new Set([
                    ...managers.map(item => item.email.toLowerCase()),
                    ...recruiters.map(item => item.email.toLowerCase())
                  ])] // Removing duplicates
                    .filter(email => email.includes(searchQuery2.toLowerCase()) && email !== loggedInEmail)
                    .map((email, index) => (
                      <label key={index} className="dropdown-item" style={{ display: 'block', padding: '8px',fontWeight:"normal", cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedEmails2?.includes(email)}
                          onChange={() => handleEmailChange(email, 'dropdown2')}
                          style={{ marginRight: '8px' }}
                        />
                        {email}
                      </label>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <div style={{ width: '48%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Start Date*</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
              />
            </div>
            <div style={{ width: '48%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>End Date*</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Time Zone</label>
            <select
              value={selectedTimeZone}
              onChange={handleTimeZoneChange}
              style={{ width: '100%', height: "40px", borderRadius: "4px", border: "1px solid #ccc", paddingLeft: "10px", fontSize: '16px' }}
            >
              <option value="">Select a time zone</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Start Time*</label>
              <input
                type="time"
                list="startTimeOptions"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '90%', height: '40px', borderRadius: '4px', border: '1px solid #ccc', paddingLeft: '10px', fontSize: '16px' }}
              />
              <datalist id="startTimeOptions">
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}></option>
                ))}
              </datalist>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>End Time*</label>
              <input
                type="time"
                list="endTimeOptions"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc', paddingLeft: '10px', fontSize: '16px' }}
              />
              <datalist id="endTimeOptions">
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}></option>
                ))}
              </datalist>
            </div>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
          },
          content: {
            color: 'lightsteelblue',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: "450px",
            height: "150px"
          }
        }}>
        <div style={{ textAlign: 'center', marginTop: "20px" }}>
          <p>{modalMessage}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', width: '100%', marginTop: "30px" }}>
          <button
            onClick={() => {
              setIsModalOpen(false);
              if (responseSuccess) {
                setShowCalendar(true);
              }
            }}
            style={{
              color: "white",
              backgroundColor: "green",
              border: "none",
              width: "50px",
              height: "25px",
              borderRadius: "5px"
            }}
          >
            Ok
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              color: "white",
              backgroundColor: "red",
              border: "none",
              width: "50px",
              height: "25px",
              borderRadius: "5px"
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )

}

export default ScheduleMeet;