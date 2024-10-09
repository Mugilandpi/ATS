import React from 'react';
import GaugeChart from 'react-gauge-chart';
import "../Views/Overview.css";

const DualGaugeCharts = ({ minBudget = 0, maxBudget = 0, candidate }) => {
    // Define max value for gauges, default to 1 to avoid division by zero
    const maxValue = Math.max(minBudget, maxBudget) || 1;

    return (
        <div>
            {/* <div style={{ marginTop: "-25px" }}>
                <h5> Budget Recommendation for the Candidate </h5>
            </div> */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0' }}>{candidate}</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', height: '100%' }}>
                {/* Min Budget Gauge */}
                <div style={{ width: '54%' }}>
                    <GaugeChart
                        id="min-budget-gauge"
                        nrOfLevels={30}
                        percent={minBudget / maxValue}
                        needleColor="transparent"
                        textColor="#000000"
                        colors={['#ff4c4c', '#ffcc00']}
                        arcWidth={0.2}
                        formatTextValue={() => `Min: ${minBudget}LPA`}
                        
                    />
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <strong>Min Budget</strong>
                    </div>
                </div>

                {/* Max Budget Gauge */}
                <div style={{ width: '54%' }}>
                    <GaugeChart
                        id="max-budget-gauge"
                        nrOfLevels={30}
                        percent={maxBudget / maxValue}
                        needleColor="transparent"
                        textColor="#000000"
                        colors={['#00bfae', '#00bfae']}
                        arcWidth={0.2}
                        formatTextValue={() => `Max: ${maxBudget}LPA`}
                    />
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <strong>Max Budget</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DualGaugeCharts;
