// import  LeftNav  from "../Components/LeftNav";
import "../../Components/leftnav.css";
// import TitleBar from "../Components/TitleBar";
import "../../Components/titlenav.css";
import "./Tekspot_Curr_Opp.css";
function Tekspot_Curr_Opp() {
  // document.body.style.backgroundColor = 'white';
  return (
    <div className="wrapper">
      <h1
        style={{
          display: "flex",
          paddingTop: "10px",
          textAlign: "center",
          justifyContent: "center",
          marginLeft: "485px",
          color: "red",
        }}
      >
        Tekspot - Current Opportunities
      </h1>
      <div style={{ display: "flex" }}>
        <label
          style={{
            display: "flex",
            marginTop: "93px",
            marginLeft: "-348px",
            fontSize: "20px",
          }}
        >
          Recipient's Email:
        </label>
        <div>
          <button
            style={{
              marginTop: "150px",
              marginLeft: "358px",
              backgroundColor: "red",
              padding: "16px",
              borderRadius: "10px",
              fontSize: "20px",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            Send Email
          </button>
        </div>
      </div>
      <div class="bar">
        <div class="batch">
          <table className="TCO">
            <thead>
              <tr style={{ color: "black" }}>
                <th>ID</th>
                <th>Role</th>
                <th>Details</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Tekspot_Curr_Opp;
