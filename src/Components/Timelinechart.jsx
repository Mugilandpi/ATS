import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Default function for onPointClick to prevent errors
const defaultOnPointClick = () => {};

const LearningAttitudeChart = ({ Learningattitude, onPointClick = defaultOnPointClick }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!Learningattitude || !Array.isArray(Learningattitude)) return;

    const transformedData = Learningattitude.map(({ company, count, skills }) => ({
      name: company,
      skillCount: count,
      skills: skills
    }));

    setChartData(transformedData);
  }, [Learningattitude]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, skillCount, skills } = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", width: "300px" }}>
          <p className="label" style={{ textAlign: "left" }}>Company: <strong>{name}</strong></p>
          <p className="intro" style={{ textAlign: "left" }}>Skill Count: {skillCount}</p>
          <p className="desc" style={{ textAlign: "left" }}>Skills: {skills}</p>
        </div>
      );
    }

    return null;
  };

  const renderCustomAxisTick = ({ x, y, payload }) => {
    const words = payload.value.split(' ');
    const lines = [];
    let currentLine = [];

    words.forEach(word => {
      if (currentLine.join(' ').length + word.length > 25) {
        lines.push(currentLine.join(' '));
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });

    if (currentLine.length) {
      lines.push(currentLine.join(' '));
    }

    return (
      <g transform={`translate(${x},${y}) rotate(-30)`}>
        <text textAnchor="end" fill="#666">
          {lines.map((line, index) => (
            <tspan x={0} dy={index === 0 ? 0 : 12} key={index}>{line}</tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: '100%' }}>
     
      <div style={{ width: '100%' }}>
        <div style={{ width: '1000px' }}>
          <ResponsiveContainer width="100%" height={370}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 50,
                bottom: 60,
              }}
              onClick={(e) => {
                if (e && e.activeLabel) {
                  const clickedData = chartData.find(d => d.name === e.activeLabel);
                  onPointClick(clickedData);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                padding={{ left: 100, right: 30 }}
                interval={0}
                tick={renderCustomAxisTick}
                height={80} 
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="skillCount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LearningAttitudeChart;
