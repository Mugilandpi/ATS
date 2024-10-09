import { setDashboardData } from "../store/slices/dashboardSlice";
import { setStoredCandidateData } from "../store/slices/storeCandidateSlice";
import { setAllJobs } from "../store/slices/jobSlice";
import { setRecruiters, setManagers } from "../store/slices/userSlice";
import { setMeetings, setError } from "../store/slices/meetingslice";
import { store } from "../store/store";

// const dispatch = us

export async function getDashboardData() {
  console.log("calling getDashboardData");
  let response = await fetch(
    //'/api/dashboard', {
     "https://ats-9.onrender.com/dashboard", {
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
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("utilities getDashboardData", data);
  store.dispatch(setDashboardData({ data }));
}

export async function getAllJobs() {
  console.log("Calling getAllJobs");
  try {
    const response = await fetch(
      //'/api/view_all_jobs', 
        "https://ats-9.onrender.com/view_all_jobs",
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("user_name"),
          // username:'username'
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const list = [...data["job_posts_active"], ...data["job_posts_hold"]];
    store.dispatch(setAllJobs({ jobs: list }));
  } catch (err) {
    console.log(err);
  }
}

export async function getAllRecruitersManagers() {
  console.log("Calling getAllRecruitersManagers");
  try {
    const response = await fetch(
      //'/api/active_users', {
       "https://ats-9.onrender.com/active_users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: localStorage.getItem("user_name"),
        new_status: false,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("getAllRecruitersManagers,", data);
      store.dispatch(
        setRecruiters({ recruiters: data["active_users_recruiter"] }),
      );
      store.dispatch(setManagers({ managers: data["active_users_manager"] }));
    } else {
      console.error(response.statusText);
    }
  } catch (err) {
    console.error("handle error", err);
  }
}

export async function fetchMeetings() {
  try {
    console.log("Calling fetchMeetings");

    const response = await fetch(
      'https://ats-9.onrender.com/get_all_meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recruiter_id: localStorage.getItem("user_id"),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }

    const data = await response.json();
    console.log('Raw data from API:', data);

    // Access the meetings array from the response object
    const meetingsArray = data.meetings;

    if (!Array.isArray(meetingsArray)) {
      throw new Error('API response does not contain an array of meetings');
    }

    // Transform data into the desired format
    const formattedMeetings = meetingsArray.map(meeting => ({
      title: meeting.subject,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      start_date: meeting.start_date,
      end_date: meeting.end_date,
      meeting_id: meeting.meeting_id,
      event_id: meeting.event_id,
      join_url: meeting.join_url,
      time_zone: meeting.time_zone,
      attendees: meeting.attendees,
      cc_recipients: meeting.cc_recipients,
      rec_email:meeting.email,
    }));

    console.log('Formatted meetings:', formattedMeetings);

    // Dispatch the formatted meetings to the Redux store
    store.dispatch(setMeetings(formattedMeetings));

  } catch (error) {
    console.error('Fetch error:', error);
    store.dispatch(setError(error.message));
  }
}

export async function storedCandidates() {
 // const [alldata, setAlldata] = useState([]);
 console.log("calling storedCandidates");
  try {
    const response = await fetch("https://ats-9.onrender.com/get_all_candidates", {
        method: "GET",
        headers:{
           "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("storedcandidateData", data);
    store.dispatch(
      setStoredCandidateData({ StoredCandidateData: data["candidate_records"] }),
    );

   

}catch (error) {
    console.error('Fetch error:', error);
    store.dispatch(setError(error.message));
  }
}