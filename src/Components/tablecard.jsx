import React from "react";

const SuccessfulConversionSummary = ({
    sortedSummary,
    displayColumns,
    displayColumns1,
    historical_data,
    displayColumns2,
    displayColumns3,
    displayColumns4,
    displayColumns5,
    clientSummary,
    roleSummary,
    timeToCloseData }) => {
    const styles = {
        th: {
            backgroundColor: "#32406D",
            padding: "10px 2px 10px 2px",
            fontSize: "14px",
            width:"200px"
        },
    };
    const columnWidths = {
        'clients': { width: '100px' },
        'No of candidates sourced': { width: '200px' },
        'No of candidates Accepted': { width: '210px' },
        'Closure Rate': { width: '100px' },
        'Rankings': { width: '100px' },
      };
    // const thStyle = {
    //     ...styles.th,
    //     ...columnWidths,
    // };
    let historicalData = []
    if(historical_data){
        historicalData = [...Object.entries(historical_data)]
    }
    return (
        <div className="dashcontainer" style={{ marginBottom: '10px', overflow: "auto",height:"90%" }}>
            {/* pavan */}
            {displayColumns && (
                <div className="table-container" style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    marginTop: "3px",
                    height:"100%",
                }}>
                    
                    <table className="max-width-fit-content table" id="candidates-table" style={{
                        tableLayout: "fixed",
                        width: "100%",
                        marginTop: "0px",
                    }}>
                        <thead>
                            <tr>
                                {displayColumns?.map((key, index) => (
                                    <th key={index} style={styles.th}>
                                        <span>{key}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="scrollable-body">
                            {sortedSummary.map((rec, ind) => (
                                <tr key={ind}>
                                    <td style={{textAlign:"left"}}>{rec[0]}</td>
                                    <td>{rec[1].candidate_count}</td>
                                    <td>{rec[1].selected_candidates_count}</td>
                                    <td style={{ color: "black" }}>{rec[1].rejected_candidates_count}</td>
                                    <td style={{ color: "black" }}>{rec[1].in_process_candidates_count}</td>
                                    <td style={{ color: "black" }}>
                                        {rec[1].percentage_of_selected === 0
                                            ? "0"
                                            : rec[1].percentage_of_selected.toFixed(rec[1].percentage_of_selected % 1 !== 0 ? 2 : 0)}
                                    </td>
                                    <td style={{ color: "black" }}>{rec[1].ranking === 0 ? '-' : rec[1].ranking}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* neha */}
            {displayColumns1 && (

                <div className="table-container" style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    marginTop: "3px",
                    height:"100%",
                }}>
                    
                    <table className="max-width-fit-content table" id="candidates-table" style={{
                        tableLayout: "fixed",
                        width: "100%",
                        marginTop: "0px",
                    }}>
                        <thead>
                            <tr>
                                {displayColumns1.map((key, index) => (
                                    <th key={index} style={styles.th}>
                                        <span>{key}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="scrollable-body">
                            {historicalData.map((entry, index) => {
                                const dateKey = Object.keys(entry[1].monthly_data)[0];
                                const monthlyData = entry[1].monthly_data[dateKey];

                                return (
                                    <tr key={index}>
                                        <td>{entry[0]}</td>
                                        <td>{monthlyData.total_candidates_count}</td>
                                        <td>{monthlyData.count_of_onboarded_positions}</td>
                                        <td style={{ color: "black" }}>{monthlyData.count_of_screening_candidates}</td>
                                        <td style={{ color: "black" }}>{(monthlyData.percentage_onboarded).toFixed(2)}</td>
                                        <td style={{ color: "black" }}>{entry[1].overall_summary.total_months_analyzed}</td>
                                        <td style={{ color: "black" }}>{entry[1].overall_summary.trend_in_closure_rates}</td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            )}

            {/* Fiza */}
            {displayColumns3 && (
                <div className="table-container" style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    marginTop: "3px",
                    height:"100%",
                }}>
                    
                    <table className="max-width-fit-content table" id="candidates-table" style={{
                        tableLayout: "fixed",
                        width: "100%",
                        marginTop: "0px",
                    }}>
                        <thead>
                            <tr>
                                {displayColumns3.map((key, index) => (
                                    <th key={index} style={styles.th}>
                                        <span>{key}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="scrollable-body">
                            {
                                timeToCloseData.map((item, ind) => (

                                    <tr key={ind}>
                                        <td style={{textAlign:"left"}}>{item.recruiter_name}</td>
                                        <td >{item.total_candidates_count}</td>
                                        <td >{item.count_of_onboarded_positions}</td>
                                        <td>{Number.isInteger(item.percentage_onboarded) ? item.percentage_onboarded : item.percentage_onboarded.toFixed(2)}</td>
                                        <td >{Number.isInteger(item.average_days_to_close) ? item.average_days_to_close : item.average_days_to_close.toFixed(2)}</td>
                                        <td >{item.ranking === 0 ? "-" : item.ranking}</td>
                                    </tr>
                                ))

                            }
                        </tbody>
                    </table>
                </div>
            )}
            {/* Avadhut */}
            {displayColumns2 && (
                <div className="table-container" style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    marginTop: "3px",
                    height:"100%",
                }}>
                    
                    <table className="max-width-fit-content table" id="candidates-table" style={{
                        tableLayout: "fixed",
                        width: "100%",
                        marginTop: "0px",
                    }}>
                        <thead>
                            <tr>
                                {displayColumns2.map((key, index) => (
                                    <th key={index} style={columnWidths[key]}>
                                        <span>{key}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="scrollable-body">
                            {

                                clientSummary.map((rec, ind) => (

                                    <tr key={ind}>
                                        <td style={{textAlign:"left"}} >{rec[0]}</td>
                                        <td >{rec[1][0]}</td>
                                        <td >{rec[1][1]}</td>
                                        <td style={{ color: "black" }}>{rec[1][2]}</td>
                                        <td style={{ color: "black" }}>{rec[1][2] === 0 ? "-" : ind + 1}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )}
            {/* Mugilan */}
            {displayColumns4 && (
                <div className="table-container" style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    marginTop: "3px",
                    height:"100%",
                }}>
                    
                    <table className="max-width-fit-content table" id="candidates-table" style={{
                        tableLayout: "fixed",
                        width: "100%",
                        marginTop: "0px",
                    }}>
                        <thead>
                            <tr>
                                {displayColumns4.map((key, index) => (
                                    <th key={index} style={styles.th}>
                                        <span>{key}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roleSummary.map((clientData, index) => {
                                const clientName = clientData[0];
                                const roles = clientData[1];

                                return roles.map((roleGroup, groupIndex) => (
                                    roleGroup.map((roleDetails, roleIndex) => (
                                        <tr key={`${index}-${groupIndex}-${roleIndex}`}>
                                            {roleIndex === 0 && (
                                                <td style={{textAlign:"left"}} rowSpan={roleGroup.length}>{clientName}</td>
                                            )}

                                            <td style={{textAlign:"left",zIndex:"1"}}>{roleDetails[0]}</td>
                                            <td style={{textAlign:"left"}}>{roleDetails[1][0].join(', ')}</td>
                                            <td>{roleDetails[1][1]}</td>
                                            <td>{roleDetails[1][2]}</td>
                                            <td>
                                                {roleDetails[1][3] === 0
                                                    ? "0"
                                                    : roleDetails[1][3].toFixed(roleDetails[1][3] % 1 !== 0 ? 2 : 0)}
                                            </td>
                                        </tr>
                                    ))
                                ));
                            })}
                        </tbody>

                    </table>
                </div>
            )}
            {/* neha */}
            {displayColumns5 && (
                <div className="table-container" style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    marginTop: "3px",
                    height:"100%",
                }}>
                    
                    <table className="max-width-fit-content table" id="candidates-table" style={{
                        tableLayout: "fixed",
                        width: "100%",
                        marginTop: "0px",
                    }}>
                        <thead>
                            <tr>
                                {displayColumns5.map((key, index) => (
                                    <th key={index} style={styles.th}>
                                        <span>{key}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="scrollable-body">
                            {
                                historicalData.map((rec, index) => (
                                    rec[1].line_graph_data && (
                                        Object.entries(rec[1].line_graph_data).map((item, ind) => (

                                            <tr key={ind}>
                                                {ind === 0 && (<td rowSpan={Object.entries(rec[1].line_graph_data).length}>{rec[0]} </td>)}
                                                {ind === 0 && (console.log(rec[0]))}

                                                <td style={{ zIndex: "0" }}> {item[0]}</td>
                                                {/* { console.log(item[0])} */}
                                                <td> {item[1]["Total Candidates Count"]}</td>
                                                {/* { console.log(item[1]["Total Candidates Count"])} */}
                                                <td> {item[1]["Onboarded Positions"]} </td>
                                                {/* {console.log(item[1]["Onboarded Positions"])} */}
                                                <td>
                                                    {item[1]["Average Days to Close"] === 0 ? 0 : item[1]["Average Days to Close"].toFixed(2)}

                                                </td>
                                                {/* {console.log(item[1]["Average Days to Close"])} */}
                                            </tr>



                                        ))
                                    )
                                ))

                            }
                        </tbody>
                    </table>
                </div>
            )}

        </div>


    );
};

export default SuccessfulConversionSummary;
