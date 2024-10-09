import React, { useState, useEffect, useRef } from "react";
import "../Components/titlenav.css";
import TitleBar from "../Components/TitleBar";
import LeftNav from "../Components/LeftNav";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from 'react-redux';
import { getAllJobs } from "./utilities";
import { ThreeDots } from "react-loader-spinner";
// import Heatmap from "../Components/HeatMap";
import BargraphOV from "../Components/BargraphOV"
import "../Views/Overview.css";
import RadarChart from "../Components/RadarChart";
import DualGaugeCharts from './DualGaugeCharts';
import ScatterPlot from "./ScatterPlot";
// import RelevanceScoreChart from "./RelevanceScoreChart";
import Timelinechart from "../Components/Timelinechart";
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import Timeline from "./data/Timeline.jsx";

const cookies = new Cookies();

function OverView() {
    const userName = localStorage.getItem("user_name");
    const recruiterUserID = localStorage.getItem("recruiterUserID");
    const [candidateName, setCandidateName] = useState('');
    const [candidateExperience, setCandidateExperience] = useState('');
    const [skillsMatching, setSkillsMatching] = useState('');
    const [jobDescriptionExperience, setJobDescriptionExperience] = useState('');
    const [jobDescriptionPackage, setJobDescriptionPackage] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const jobIdRef = useRef(null);
    const [showData, setShowData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const { jobs } = useSelector((state) => state.jobSliceReducer);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [search, setSearch] = useState("");
    const [showText, setShowText] = useState(false);
    const [select, setSelect] = useState(false);
    const [client, setClient] = useState("");
    const [clickedData, setClickedData] = useState({
        category: 'Select a bar',
        count: 0,
        items: []
    });
    const [domains, setDomains] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const handleShowTable = () => {
        setShowTable(prevShowTable => !prevShowTable);
    };
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    useEffect(() => {
        const handleClick = (e) => {
            if (
                document.getElementById("drop_down") &&
                document.getElementById("drop_down").contains(e.target)
            ) {
                setSearch(e.target.textContent);
            }
            if (e.target !== document.getElementById("input_field")) {
                setShowText(false);
            }
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    // const [selectedPrompt, setSelectedPrompt] = useState('');

    useEffect(() => {
        if (jobs.length > 0) {
            console.log(jobs)
            const jobsList = jobs?.filter(job => job.recruiter.includes(localStorage.getItem("name")) && job.job_status === 'Active')
            console.log(jobsList.length)
            console.log(jobsList)
            setData(jobsList);
            setShowData(jobsList);
        } else {
            getAllJobs();
        }
    }, [jobs]);

    const handleResumeChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleJobChange = (e) => {
        setSelectedJobId(e.target.value);
    };
    const [showModal, setShowModal] = useState(false);
    const [ExperienceshowModal, setExperienceShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const handleCloseModal = () => {
        setShowModal(false);
        setExperienceShowModal(false);
        setModalContent(null);
        setShowTable(false);
        setActiveCard(null);
        setClickedData({
            category: 'Select a bar',
            count: 0,
            items: []
        });
        setShowRadarChart(false);
    };
    const handleCardClick = (cardType) => {
        setActiveCard(cardType);
        setShowModal(true);
    };

    // const handlePromptChange = (e) => {
    //     setSelectedPrompt(e.target.value);
    // };
    const [showRadarChart, setShowRadarChart] = useState(false);

    const handleLinkClick = (e) => {
        e.preventDefault();
        setShowRadarChart(prevState => !prevState);
        setShowRadarChart(!showRadarChart);
    };
    const fileToBase64 = (file) => {
        if (file === null) return;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
            console.log(file, "pdf")
        });
    };
    const [waitForSubmission, setwaitForSubmission] = useState(false);
    const [categoriesCounts, setCategoriesCounts] = useState([]);
    const [candidateInfo, setCandidateInfo] = useState({});
    const [skillsData, setSkillsData] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [Learningattitude, setLearningattitude] = useState([]);
    const [events, setEvents] = useState([])
    const [allCompanies, setAllCompanies] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [allCertificates, setAllCertificates] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const [bulletPoints, setBulletPoints] = useState({});
    const [summaryParagraph, setSummaryParagraph] = useState('');

    const extractYears = (experienceString) => {
        // Regular expression to match numeric values (both years and months)
        const match = experienceString.match(/(\d+)(?:\s*years)?(?:\s*\d+)?(?:\s*months)?/i);
        if (match) {
            return parseInt(match[1], 10);
        }
        return 0;
    };

    const extractNumberFromPercentage = (percentageString) => {
        const match = percentageString.match(/(\d+(\.\d+)?)%?/);
        if (match) {
            return parseFloat(match[1]);
        }
        return 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!search) {
            toast.warn("Please select JobID");
            return;
        }
        if (!selectedFile) {
            toast.warn("Please select a resume.");
            return;
        }
        setwaitForSubmission(true);
        try {
            const base64String = await fileToBase64(selectedFile);

            const requestData = {
                user_id: localStorage.getItem("user_id"),
                job_id: search,
                resume: base64String,
            };

            const response = await fetch("https://ats-9.onrender.com/candidate_over_view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            console.log("Response:", data);
            setwaitForSubmission(false);

            // Extracting data
            const expertiseResponse = data.expertise_response || {};
            const learningattitudeResponse = data.candidate_learning_response || {};

            // Process responses
            const technologyCounts = Object.entries(learningattitudeResponse["Technologies Used"] || {}).map(([company, technologies]) => ({
                company,
                count: technologies.length,
                skills: technologies.join(", "),
            }));

            const categoriesCounts = (expertiseResponse.categories || []).map((item) => ({
                category: item.Category,
                count: item.Items.length,
                items: item.Items,
            }));

            const domains = (expertiseResponse.domains || []).map((item) => ({
                Domain: item.Domain,
                description: item.Description,
            }));

            console.log("Domains:", domains);
            setDomains(domains);

            console.log("Categories and Counts:", categoriesCounts);
            console.log("Learning attitude:", technologyCounts);

            setCategoriesCounts(categoriesCounts);
            setLearningattitude(technologyCounts);

            const allCompanies = technologyCounts.map((item) => item.company);
            const allSkills = [...new Set(technologyCounts.flatMap((item) => item.skills.split(", ")))];
            const allCertificates = learningattitudeResponse["Certifications"] || [];

            console.log("All Companies:", allCompanies);
            console.log("All Skills:", allSkills);
            console.log("All Certificates:", allCertificates);

            setAllCompanies(allCompanies);
            setAllSkills(allSkills);
            setAllCertificates(allCertificates);

            const analyzedata = data.analyze_candidate_profile_response || [];
            const categorizeExperience = (score) => {
                if (score >= 4 && score <= 5) {
                    return "High";
                } else if (score === 3) {
                    return "Moderate";
                } else if (score >= 1 && score <= 2) {
                    return "Low";
                } else {
                    return "Unknown";
                }
            };

            const skillsData = analyzedata.map((item) => ({
                Experience: categorizeExperience(item["Relevance Score"]) || "N/A",
                "Relevance Score": item["Relevance Score"] || 0,
                "Skill/Domain": item["Skill/Domain"] || "Unknown",
            }));

            console.log("Skills Data for Scatter Plot:", skillsData);
            setSkillsData(skillsData);

            if (Array.isArray(data.job_info_response) && data.job_info_response.length > 0) {
                const jobInfo = data.job_info_response[0];
                console.log("Job Info:", jobInfo);

                const extractNumber = (value) => {
                    // Remove any non-numeric characters except decimal points
                    const numericValue = value.replace(/[^0-9.]/g, '');
                    return parseFloat(numericValue) || 0;
                };
                const jdMaxBudget = extractNumber(jobInfo["Job Description Max Package (LPA)"]) || 0;
                const jdMinBudget = extractNumber(jobInfo["Job Description Min Package (LPA)"]) || 0;

                const minExperience = Number(parseInt(jobInfo["Job Description Min Experience"], 10) || 0);
                const maxExperience = Number(parseInt(jobInfo["Job Description Max Experience"], 10) || 0);

                const skillspercentage = extractNumberFromPercentage(jobInfo["Skills Matching Percentage"] || 0);
                const candiExperiencePercentage = extractNumberFromPercentage(jobInfo["Candidate Experience Percentage"] || 0);
                const AddSkill = (skillspercentage + candiExperiencePercentage) / 200;

                const candidateExperience = Number(extractYears(jobInfo["Candidate Experience"]) || 0);
                let minBudget, maxBudget;

                console.log("Candidate Experience:", candidateExperience);
                console.log("Min Experience:", minExperience);
                console.log("Max Experience:", maxExperience);
                console.log("JD Min Budget:", jdMinBudget);
                console.log("JD Max Budget:", jdMaxBudget);
                console.log("AddSkill:", AddSkill);

                if (candidateExperience >= minExperience && candidateExperience <= maxExperience) {
                    maxBudget = (jdMaxBudget - ((jdMaxBudget - jdMinBudget) / 2) * (1 - AddSkill));
                    minBudget = (jdMinBudget + ((jdMaxBudget - jdMinBudget) / 2) * (AddSkill));
                    maxBudget = maxBudget.toFixed(2);
                    minBudget = minBudget.toFixed(2);


                    console.log(`Condition met. Calculated maxBudget: ${maxBudget}`);
                    console.log(`Condition met. Calculated minBudget: ${minBudget}`);
                    setModalMessage("");
                } else {
                    console.log(`Condition not met. Candidate Experience: ${candidateExperience}`);
                    console.log(`Min Experience: ${minExperience}`);
                    console.log(`Max Experience: ${maxExperience}`);
                    minBudget = 0;
                    maxBudget = 0;
                    setModalMessage("Candidate experience is not matching for the assigned budget.");
                }
                const formatNumber = (number) => {
                    // Check if the number has a decimal part
                    return Number.isInteger(number) ? `${number}` : number.toFixed(2);
                };
                const candidateInfo = {
                    candidate: jobInfo.Candidate || "N/A",
                    jdMinBudget,
                    jdMaxBudget,
                    maxBudget,
                    minBudget,
                    candidateExperience,
                    jdexperience: `${minExperience} - ${maxExperience}`,
                    jdPackage: `${formatNumber(jdMinBudget)} - ${formatNumber(jdMaxBudget)}`,
                    skillspercentage,
                    candiExperiencePercentage,
                    AddSkill,
                };

                console.log("Candidate Information:", candidateInfo);
                setCandidateInfo(candidateInfo);
            }

            const candidateLearningText = data.candidate_learning_textual_representation || {};
            const bulletPoints = candidateLearningText.BulletPoints || {};
            const summaryParagraph = candidateLearningText.SummaryParagraph || "";

            console.log("BulletPoints:", bulletPoints);
            console.log("SummaryParagraph:", summaryParagraph);

            setBulletPoints(bulletPoints);
            setSummaryParagraph(summaryParagraph);

            const jobExperience = data.career_progress_response || [];
            const timelineData = jobExperience.map((item) => ({
                company: item.Company || "Unknown",
                fromDate: item["From Date"] || "N/A",
                location: item.Location || "NA",
                project: item.Project || "NA",
                title: item.Title || "N/A",
                toDate: item["To Date"] || "Present",
                duration: item["Total Duration of Work"] || "N/A",
            }));

            setEvents(timelineData);

        } catch (error) {
            console.error("Error:", error.message);
            setwaitForSubmission(false);
        }
    };




    const [selectedDot, setSelectedDot] = useState(null);
    const handleDotClick = (e) => {
        setSelectedDot(e);
        console.log('Dot Clicked:', e);
    };

    const handlePointClick = (data) => {
        setModalContent(data);
        setModalIsOpen(true);
    };
    useEffect(() => {
        const filteredData = showData.filter((item) =>
            item.id.toString().includes(search)
        );
        if (search === "") {
            setData(showData);
            setClient("");
        } else {
            setData(filteredData);
        }
    }, [showData, search]);
    return (
        <div className="wrapper">
            <LeftNav />
            <div className="section">
                <TitleBar />
                <form className="ss_formanal" id='ss_formanal' style={{height:"100%", }}>
                    <div style={{  }} className="candianaly">
                        <div style={{ marginLeft: "-40px", zIndex: "4" }}>
                            <label className="analabel" htmlFor="report">Job Id</label>
                            <input
                                id="input_field"
                                onClick={() => setShowText(true)}
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                type="text"
                              
                                style={{  }}
                                className="input_fieldanal"
                                placeholder="Enter Job Id"
                            />
                            {showText && (
                                <div
                                    id="drop_down"
                                    style={{
                                        
                                    }}
                                    className="drop_downanal"
                                >
                                    {data?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{ borderBottom: "1px solid #aaa", cursor: "pointer" }}
                                            onClick={() => {
                                                setClient(item.client)
                                                setSearch(item.id.toString());
                                            }}
                                        >
                                            {item.id}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                            <label htmlFor="client">Client:</label>
                            <input
                                id="client"
                                className="clientanal"
                                type="text"
                                value={client}
                                readOnly
                                style={{  }}
                            />
                        </div>
                        <div style={{ marginLeft: "20px" }}>
                            <label htmlFor="resume" style={{ fontWeight: "bold" }}>Upload Resume:</label>
                            <input
                                style={{  }}
                                type="file"
                                name="resume"
                                id="resume"
                                className="resumeanal"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeChange}
                            />
                        </div>
                        <div  className="buttonss"style={{  }}>
                            <button
                                type="button"
                                className="button_ss"
                                name="action"
                                value="Export to Excel"
                                onClick={handleSubmit}
                                style={{
                                    
                                }}
                            >  {waitForSubmission ? "" : "Submit"}
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
                    </div>
                </form>

               <div className="analy">
                <div className="card-containers" >

                    <div className="card_new" style={{ flex: 2, margin: "10px", padding: "20px", backgroundColor: "#f0f0f0", height: "270px", overflow: "auto", borderRadius: "8px" }} onClick={() => handleCardClick('domainExpertise')}>
                        <div>
                            <h5> Expertise Level</h5>
                        </div>
                        <BargraphOV categoriesCounts={categoriesCounts} />
                    </div>

                    <div className="card_new" style={{ flex: 2, margin: "10px", padding: "20px", backgroundColor: "#f0f0f0", height: "270px", overflow: "auto", borderRadius: "8px" }} onClick={() => handleCardClick('relevance')}>
                        <div>
                            <h5> Market Relevance </h5>
                        </div>
                        <ScatterPlot skillsData={skillsData} />

                    </div>
                </div>
                <div className="card-containers" >
                    <div className="card_new" style={{ flex: 3, margin: "10px", padding: "20px", backgroundColor: "#f0f0f0", height: "270px", overflow: "auto", borderRadius: "8px" }} onClick={() => handleCardClick('learning')}>
                        <div>
                            <h5 className="card-title"> Learning Attitude</h5>
                        </div>
                        <Timelinechart Learningattitude={Learningattitude} />
                    </div>
                    <div className="card_new" style={{ flex: 2, margin: "10px", padding: "20px", backgroundColor: "#f0f0f0", height: "270px", overflow: "auto", borderRadius: "8px" }} onClick={() => handleCardClick('budget')}>
                        <div>
                            <h5 className="card-title"> Budget Estimate</h5>
                        </div>
                        <DualGaugeCharts minBudget={candidateInfo.minBudget} maxBudget={candidateInfo.maxBudget} candidate={candidateInfo.candidate} />
                    </div>
                    <div className="card_new" style={{ flex: 2, margin: "10px", padding: "20px", backgroundColor: "#f0f0f0", height: "270px", overflow: "auto", borderRadius: "8px" }} onClick={() => handleCardClick('Career')}>
                        <div>
                            <h5 className="card-title">Career Growth</h5>
                        </div>
                        <Timeline events={events} />
                    </div>
                </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        height: "90vh",
                        width: activeCard === 'Career' ? "50%" : "70%",
                        overflow: "auto",
                        padding: "0px 20px",
                        border: "2px solid #32406D",
                        backgroundColor: "#fff",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                        WebkitBackdropFilter: "blur(8px)",
                        backdropFilter: "blur(8px)",
                    },
                }}
            >
                <div>
                    {/* Flex Container for Buttons and Information */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", position: "sticky", top: "0", backgroundColor: "white", zIndex: "1", }}>
                        {/* Information Section */}
                        <div style={{ flex: 1, marginRight: "10px" }}>
                            <div style={{ top: "0", position: "sticky", backgroundColor: "white", zIndex: "1", padding: "15px" }}>
                                {activeCard === 'domainExpertise' && (
                                    <div>
                                        <div style={{ marginLeft: "40px" }}>
                                            <div><strong style={{ color: "green" }}>Category:</strong> {clickedData.category}</div>
                                            <div><strong style={{ color: "green" }}>Count:</strong> {clickedData.count}</div>
                                            <div><strong style={{ color: "green" }}>Items:</strong> {clickedData.items.join(', ')}</div>
                                        </div>
                                        <div >
                                            <h5 style={{ fontSize: "18px", color: "#32406D", marginLeft: "180px" }}>Expertise Level</h5>
                                        </div>
                                    </div>
                                )}
                                {activeCard === 'relevance' && (
                                    <div>
                                        <div style={{ marginLeft: "50px" }}>
                                            <div><strong style={{ color: "green" }}>Skill/Domain:</strong> {selectedDot ? selectedDot.payload.SkillDomain : 'N/A'}</div>
                                            <div><strong style={{ color: "green" }}>Relevance Score:</strong> {selectedDot ? selectedDot.payload.y : 0}</div>
                                            <div><strong style={{ color: "green" }}>Experience:</strong> {selectedDot ? selectedDot.payload.Experience : 'N/A'}</div>
                                        </div>
                                        <div>
                                            <h5 style={{ fontSize: "18px", color: "#32406D", marginLeft: "100px" }}> Market Relevance</h5>
                                        </div>
                                    </div>

                                )}
                                {activeCard === 'learning' && (
                                    <div>
                                        <div style={{ marginLeft: "50px" }}>
                                            <div><strong style={{ color: "green" }}>Company:</strong> {modalContent ? modalContent.name : "N/A"}</div>
                                            <div><strong style={{ color: "green" }}>Skill Count:</strong> {modalContent ? modalContent.skillCount : 0}</div>
                                            <div><strong style={{ color: "green" }}>Skills:</strong> {modalContent ? modalContent.skills : "N/A"}</div>
                                        </div>
                                        <div >
                                            <h5 style={{ fontSize: "18px", color: "#32406D", marginLeft: "180px" }}>Learning Attitude</h5>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Buttons Section */}
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: activeCard === 'learning' ? "-100px" : (activeCard === 'relevance' ? "-100px" : (activeCard === 'domainExpertise' ? "-100px" : (activeCard === 'Career' ? "5px" : (activeCard === 'budget' ? "0px" : "-120px")))) }}>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    backgroundColor: "#ff6f6f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                }}
                            >
                                Close
                            </button>
                            {(activeCard === 'domainExpertise' || activeCard === 'learning' || activeCard === 'budget') && (
                                <button
                                    onClick={handleShowTable}
                                    style={{
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {showTable ? "Hide Table" : "Show Table"}
                                </button>
                            )}
                        </div>

                    </div>
                    {/* {activeCard === 'domainExpertise' && (
                        <div style={{ position: "sticky", top: "120px", backgroundColor: "white", }}>
                            <h5 className="card-title" style={{ color: "#32406D", fontSize: "18px" }}>
                                Domain Expertise of the Candidate
                            </h5>
                        </div>
                    )} */}
                    {activeCard === 'domainExpertise' && (
                        <div className="chart-container" style={{ width: "100%", height: '100%' }}>

                            <BargraphOV categoriesCounts={categoriesCounts} setClickedData={setClickedData} />
                            {showTable && activeCard === 'domainExpertise' && (
                                <div style={{ overflowX: 'auto',marginLeft:"50px" }}>
                                    <div className="bullet-points">
                                        <div style={{ marginTop: "10px" }}>
                                            <strong style={{ color: "green" }}>Bullet Points</strong>
                                        </div>

                                        <ul>
                                            {domains.map((domain, index) => (
                                                <li key={index}>
                                                    <strong>{domain.Domain}:</strong> {domain.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                    {/* {activeCard === 'learning' && (
                        <div style={{ position: "sticky", top: "120px", backgroundColor: "white", zIndex: "1", marginTop: "-20px" }}>
                            <h5 className="card-title" style={{ color: "#32406D", fontSize: "18px" }}>
                                Learning Attitude of the Candidate
                            </h5>
                        </div>
                    )} */}
                    {activeCard === 'learning' &&
                        <div>
                            <Timelinechart Learningattitude={Learningattitude} onPointClick={handlePointClick} />
                            {showTable && activeCard === 'learning' && (
                                <div style={{ justifyContent: "center", marginTop: "-10px", marginLeft: "100px" }}>
                                    <table className="learningattitude">
                                        <tbody>
                                            <tr>
                                                <th style={{textAlign:"left"}}>Company</th>
                                                <td style={{paddingLeft:"10px"}}>{allCompanies.join(', ')}</td>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign:"left"}}>Overall Skills</th>
                                                <td style={{paddingLeft:"10px"}}>{allSkills.join(', ')}</td>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign:"left"}}>Overall Skills Count</th>
                                                <td style={{paddingLeft:"10px"}}>{allSkills.length}</td>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign:"left"}}>Certificates</th>
                                                <td style={{paddingLeft:"10px"}}>   {allCertificates.length > 0
                                                    ? allCertificates.join(', ')
                                                    : "Candidate doesn't have certificates"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="bullet-points">
                                        <div style={{ marginTop: "10px" }}>
                                            <strong style={{ color: "green" }}>Bullet Points :</strong>
                                        </div>
                                        <ul>
                                            {Object.entries(bulletPoints).map(([key, value]) => (
                                                <li key={key}>{value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 style={{ color: "green" }}>Summary Paragraph:</h3>
                                        <p style={{ textAlign: "left" }}>{summaryParagraph}</p>
                                    </div>

                                </div>)}
                        </div>
                    }

                    {activeCard === 'budget' && (
                        <div style={{ position: "sticky", top: "50px", backgroundColor: "white", zIndex: "1", marginTop: "-20px" }}>
                            <h5 className="card-title" style={{ color: "#32406D", fontSize: "18px" }}>
                            Budget Estimate

                            </h5>
                        </div>
                    )}
                    {activeCard === 'budget' && (

                        <div style={{ marginTop: "20px" }}>

                            <DualGaugeCharts minBudget={candidateInfo.minBudget} maxBudget={candidateInfo.maxBudget} candidate={candidateInfo.candidate} isOpen={showModal} />
                            <div style={{ marginTop: "10px" }}>
                                <p style={{ color: "red" }}>{modalMessage}</p>
                            </div>
                            {showTable && activeCard === 'budget' && (
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                                    <table className="learningattitude" >
                                        <tbody>
                                            <tr>
                                                <th style={{textAlign:"left"}}>Candidate Name</th>
                                                <td style={{ width: "200px",paddingLeft:"10px" }}>{candidateInfo.candidate}</td>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign:"left"}}>
                                                    Candidate overall Experience</th>
                                                <td style={{paddingLeft:"10px"}}>{candidateInfo.candidateExperience
                                                }</td>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign:"left"}}>
                                                    JD Experience(in Years)
                                                </th>
                                                <td style={{paddingLeft:"10px"}}>   {candidateInfo.jdexperience}</td>
                                            </tr>

                                            <tr>
                                                <th style={{textAlign:"left"}}>
                                                    Job Description Package (LPA)
                                                </th>
                                                <td style={{paddingLeft:"10px"}}>   {candidateInfo.jdPackage}</td>
                                            </tr>


                                        </tbody>
                                    </table>

                                </div>)}
                        </div>
                    )}
                    {activeCard === 'Career' && (
                        <div style={{ position: "sticky", top: "58px", backgroundColor: "white", zIndex: "1", marginTop: "-20px" }}>
                            <h5 className="card-title" style={{ color: "#32406D", fontSize: "18px" }}>
                            Career Growth
                            </h5>
                        </div>
                    )}
                    {activeCard === 'Career' &&
                        <div style={{ marginTop: "25px" }}>
                            <Timeline events={events} />
                        </div>
                    }
                    {/* {activeCard === 'relevance' && (
                        <div style={{ position: "sticky", top: "100px", backgroundColor: "white", zIndex: "1", marginTop: "-20px" }}>
                            <h5 className="card-title" style={{ color: "#32406D", fontSize: "18px" }}>
                                Relevance of the Candidate Profile with Market Trends
                            </h5>
                        </div>
                    )} */}

                    {activeCard === 'relevance' && (
                        <div className="ScatterPlots" >
                            <ScatterPlot skillsData={skillsData} width={1000} height={400} onDotClick={handleDotClick} />
                        </div>
                    )}
                </div>




            </Modal>
            <Modal
                isOpen={ExperienceshowModal}
                onRequestClose={handleCloseModal}
                contentLabel="Experience Confirmation"
                className="modal-content"
                overlayClassName="modal-overlay"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                        width: "30%",
                        height: "100px",
                        margin: "auto",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f7f7f7",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                        padding: "20px 40px",
                        textAlign: "center",

                    },
                }}>
                <button onClick={handleCloseModal}>Close</button>
                <p>{modalMessage}</p>

            </Modal>
        </div>
    );
};

export default OverView;
