import LeftNav from "../../Components/LeftNav";
import "../../Components/leftnav.css";
import TitleBar from "../../Components/TitleBar";
import "../../Components/titlenav.css";
import "./Assign_Tekspot_App.css";

function Assign_Tekspot_App() {
  return (
    <div className="wrapper">
      <LeftNav />
      <div className="section">
        <TitleBar />
        <h3
          style={{
            display: "flex",
            paddingTop: "60px",
            textAlign: "center",
            justifyContent: "center",
            color: "black",
            marginTop: "-28px",
          }}
        >
          Assign Website Candidates to Recruiters
        </h3>
        <div style={{ display: "flex" }}>
          <form method="post" className="box">
            <div>
              <label className="ATA_label">Select Recruiter:</label>
              <select name="selected_recruiter_id" id="recruiters">
                <option value="">-- Select a Recruiter --</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "flex",
                  marginTop: "48px",
                  marginLeft: "-294px",
                }}
              >
                Select All Candidates{" "}
              </label>
            </div>
            <div>
              <input
                type="complete"
                value="Assign Selected Candidates"
                class="button1"
                style={{
                  display: "flex",
                  width: "195px",
                  textAlign: "center",
                  marginLeft: "-357px",
                  marginTop: "90px",
                }}
              />
            </div>
            <div>
              <input
                type="checkbox"
                style={{
                  width: "12px",
                  marginRight: "5px",
                  marginLeft: " -352px",
                  marginTop: "54px",
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Assign_Tekspot_App;
