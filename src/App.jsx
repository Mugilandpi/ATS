import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import DashBoard from "./Views/Dashboard/DashBoard";
import "react-tooltip/dist/react-tooltip.css";
import AccountCreation from "./Views/AccountCreation/AccountCreation";
import RegisterCandidate from "./Views/RegisterCandidate/RegisterCandidate";
import AddCandidate from "./Views/AddCandidate";
import JobAssignments from "./Views/JobAssignment/JobAssignments";
import JobListing from "./Views/JobListing/JobListing";
import UserAccounts from "./Views/UserAccounts/UserAccounts";
import AccountDeactivation from "./Views/AccountDeactivation/AccountDeactivation";
import ChangePassword from "./Views/ChangePassword/ChangePassword";
import SubmissionSummary from "./Views/SubmissionSummary/SubmissionSummary";
import Tekspot_Curr_Opp from "./Views/TekspotCurrentOppurtunities/Tekspot_Curr_Opp";
import Assign_Tekspot_App from "./Views/AssignTekspotApplications/Assign_Tekspot_App";
import Tekspot_Applications from "./Views/TekspotApplications/Tekspot_Applications";
import ResumeSearching from "./Views/ResumeSearching.jsx";
// import Stoxxo from "./Views/stoxxo.jsx";
import ProfileTransfer from "./Views/ProfileTransfer/ProfileTransfer";
import Otp from "./Views/Login/Otp";
import EditCandidate from "./Views/Dashboard/EditCandidate";
import Login from "./Views/Login/Login";
import Register from "./Views/Login/Register";
import ManagementLogin from "./Views/Login/ManagementLogin";
import RecruitmentLogin from "./Views/Login/RecruitmentLogin";
import Forgotpassword from "./Views/Login/Forgotpassword";
import EditJobStatus from "./Views/JobListing/EditJobStatus";
import AssignedRequirements from "./Views/AssignedRequirements/AssignedRequirements";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import ReassignJob from "./Views/JobListing/ReassignJob";
import CandidateDetails from "./Views/Dashboard/CandidateDetails";
import UpdateCandidate from "./Views/Dashboard/UpdateCandidate";
import EditJobPosting from "./Views/JobListing/EditJobPosting";
// import Assign from "./Views/AssignedRequirements/Assign.jsx"
import OverView from "./Views/OverView.jsx";
import cards from "./Components/cards.jsx";
import tablecard from "./Components/tablecard.jsx"
// import {setList } from "./store/slices/candidateSlice";
// import { setList } from "./store/slices/candidateSlice";
// import { setDashboardData } from "./store/slices/dashboardSlice";

import {
  getDashboardData,
  getAllJobs,
  getAllRecruitersManagers,
} from "./Views/utilities.js";

const cookies = new Cookies();

const AuthGuard = ({ children }) => {
  const navigate = useNavigate(); // Must be inside Router context

  useEffect(() => {
    const userCookie = cookies.get("USERNAME"); // Check the specific cookie

    if (!userCookie) {
      navigate("/Login"); // Redirect to login if cookie is absent
    } else {
      console.log("calling getuserdata");
      getDashboardData();
      getAllJobs();
      getAllRecruitersManagers();
    }
  }, []); 

  return children; 
};
function App() {
  // const [error, setError] = useState(null);
  // const fetchTableData = async () => {
  //   try {
  //     const response = await fetch(
  //       'https://ats-9.onrender.com/dashboard',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           "user_id": localStorage.getItem('user_id') ? localStorage.getItem('user_id') : location.state?.user_id,
  //           "user_type": localStorage.getItem('user_type') ? localStorage.getItem('user_type') : location.state?.user_type,
  //           "user_name": localStorage.getItem('user_name') ? localStorage.getItem('user_name') : location.state?.user_name,
  //           "page_no": 1
  //         })
  //       }
  //     );

  //     // Check if response is OK
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     console.log("candidates:", data)
  //     dispatch(setCandidateData({data:data['candidates']}))
  //     dispatch(setDashboardData({data}))
  //     // Ensure the expected structure is present
  //     // console.log(typeof (data[ 'candidates' ][ 0 ].id))
  //     const tempList = new Array(data[ 'candidates' ].length).fill().map((_, idx) => {
  //       return ({
  //         id: data[ 'candidates' ][ idx ].id.toString(),
  //         email: false,
  //         profile: false,
  //         skills: false,
  //         // email_ref:useRef(),
  //         // skills_ref:useRef()
  //       })
  //     })
  //     console.log(tempList, 'templist')

  //     dispatch(setList({list:tempList}))
  //     if (!data.candidates) {
  //       throw new Error("Expected 'candidates' property not found");
  //     }
  //     console.log('data',data)
  //     // return data;
  //   } catch (err) {
  //     // console.error("Error fetching data:", err);
  //     return null; // Return null in case of an error
  //   }
  // };

  // const fetchUsers = async () => {
  //   console.log('fetching active users')
  //   try {
  //     const response = await fetch(
  //       "https://ats-9.onrender.com/active_users",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           user_name: localStorage.getItem('user_name'),
  //           new_status: false,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch users");
  //     }

  //     const data = await response.json();
  //     const combinedUsers = [
  //       ...data.active_users_manager,
  //       ...data.active_users_recruiter,
  //     ];
  //     console.log('fetching users')
  //     console.log('combined users',combinedUsers)
  //     dispatch(setActiveManagers({users:data.active_users_manager}))
  //     dispatch(setActiveRecruiters({users:data.active_users_recruiter}))
  //     dispatch(setActiveUsers({users:combinedUsers}))
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };
  // useEffect(() => {
  //   fetchUsers();
  // },[]);
  // useEffect(() => {
  //   setDashboardData();
  // }, []);

  return (
    <Router>
      <Routes hashtype="noslash">
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/DashBoard"
          element={
            <AuthGuard>
              <DashBoard />
            </AuthGuard>
          }
        />
        <Route
          path="/AccountCreation"
          element={
            <AuthGuard>
              <AccountCreation />
            </AuthGuard>
          }
        />
        <Route
          path="/RegisterCandidate"
          element={
            <AuthGuard>
              <RegisterCandidate />
            </AuthGuard>
          }
        />
        <Route
          path="/CandidateDetails"
          element={
            <AuthGuard>
              <CandidateDetails />
            </AuthGuard>
          }
        />
        <Route
          path="/UpdateCandidate"
          element={
            <AuthGuard>
              <UpdateCandidate />
            </AuthGuard>
          }
        />
        <Route
          path="/EditCandidate"
          element={
            <AuthGuard>
              <EditCandidate />
            </AuthGuard>
          }
        />
         <Route
          path="/ResumeSearching"
          element={
            <AuthGuard>
              <ResumeSearching />
            </AuthGuard>
          }
        />
        <Route
          path="/RegisterCandidate/AddCandidate"
          element={
            <AuthGuard>
              <AddCandidate />
            </AuthGuard>
          }
        />
        <Route
          path="/JobListing/AddCandidate"
          element={
            <AuthGuard>
              <AddCandidate />
            </AuthGuard>
          }
        />
        <Route
          path="/AssignedRequirements/AddCandidate"
          element={
            <AuthGuard>
              <AddCandidate />
            </AuthGuard>
          }
        />
        {/* <Route
          path={"/assign"}
          element={<Assign/>}
        /> */}
        <Route
          path="/JobAssignments"
          element={
            <AuthGuard>
              <JobAssignments />
            </AuthGuard>
          }
        />
        <Route
          path="/JobListing"
          element={
            <AuthGuard>
              <JobListing />
            </AuthGuard>
          }
        />
        <Route
          path="/UserAccounts"
          element={
            <AuthGuard>
              <UserAccounts />
            </AuthGuard>
          }
        />
        <Route
          path="/AccountDeactivation"
          element={
            <AuthGuard>
              <AccountDeactivation />
            </AuthGuard>
          }
        />
        <Route
          path="/ChangePassword"
          element={
            <AuthGuard>
              <ChangePassword />
            </AuthGuard>
          }
        />
        <Route
          path="/SubmissionSummary"
          element={
            <AuthGuard>
              <SubmissionSummary />
            </AuthGuard>
          }
        />
          {/* <Route
          path="/Stoxxo"
          element={
            <AuthGuard>
              <Stoxxo />
            </AuthGuard>
          }
        /> */}
        <Route
          path="/Tekspot_Curr_Opp"
          element={
            <AuthGuard>
              <Tekspot_Curr_Opp />
            </AuthGuard>
          }
        />
        <Route
          path="/Assign_Tekspot_App"
          element={
            <AuthGuard>
              <Assign_Tekspot_App />
            </AuthGuard>
          }
        />
        <Route
          path="/Tekspot_Applications"
          element={
            <AuthGuard>
              <Tekspot_Applications />
            </AuthGuard>
          }
        />
        <Route
          path="/ProfileTransfer"
          element={
            <AuthGuard>
              <ProfileTransfer />
            </AuthGuard>
          }
        />
        <Route
          path="/AssignedRequirements"
          element={
            <AuthGuard>
              <AssignedRequirements />
            </AuthGuard>
          }
        />
        <Route
          path="/ReassignJob"
          element={
            <AuthGuard>
              <ReassignJob />
            </AuthGuard>
          }
        />
        <Route
          path="/EditJobStatus"
          element={
            <AuthGuard>
              <EditJobStatus />
            </AuthGuard>
          }
        />
        <Route path="/Otp" element={<Otp />} />
        <Route
          path="/EditJobPosting"
          element={
            <AuthGuard>
              <EditJobPosting />
            </AuthGuard>
          }
        />
        <Route path="/RecruitmentLogin" element={<RecruitmentLogin />} />
        <Route path="/ManagementLogin" element={<ManagementLogin />} />
        <Route
          path="/RecruitmentLogin/:isSessionLogout"
          element={
            <AuthGuard>
              {" "}
              <RecruitmentLogin />{" "}
            </AuthGuard>
          }
        />
        <Route
          path="/ManagementLogin/:isSessionLogout"
          element={
            <AuthGuard>
              {" "}
              <ManagementLogin />{" "}
            </AuthGuard>
          }
        />

        <Route path="/Forgotpassword" element={<Forgotpassword />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/OverView"
          element={
            <AuthGuard>
              <OverView />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
