import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Helper function to convert skills to numeric indices
const getSkillsIndex = (skills) => {
    const uniqueSkills = [...new Set(skills)];
    return uniqueSkills.reduce((acc, skill, index) => {
        acc[skill] = index;
        return acc;
    }, {});
};

const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length > 0) {
        const {  y, SkillDomain, Experience } = payload[0].payload;
        return (
            <div className="custom-tooltip">
                <p className="label">{`Skill/Domain: ${SkillDomain}`}</p>
                <p className="intro">{`Relevance Score: ${y}`}</p>
                <p className="desc">{`Experience: ${Experience}`}</p>
            </div>
        );
    }
    return null;
};
const ScatterPlot = ({ skillsData, onDotClick, width = 1000, height = 300 }) => {
    const [selectedDot, setSelectedDot] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState('');

    const uniqueSkills = skillsData.map(item => item['Skill/Domain']);
    const skillsIndex = getSkillsIndex(uniqueSkills);
    const mappedData = skillsData.map(item => ({
        x: skillsIndex[item['Skill/Domain']],
        y: item['Relevance Score'],
        Experience: item.Experience,
        SkillDomain: item['Skill/Domain']
    }));


    return (
        <div>
            <div style={{ position: 'relative', marginTop: "-10px" }}>
                <ScatterChart width={width} height={height} margin={{ top: 20, right: 20, bottom: 60, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category"
                        dataKey="x"
                        name="Skill"
                        tickFormatter={(value) => uniqueSkills[value]}
                        interval={0} // Display all ticks
                        angle={-40} // Rotate labels
                        textAnchor="end" // Align text properly
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Relevance Score"
                        ticks={[0, 1, 2, 3, 4, 5]}
                        domain={[0, 5]}
                    />
                     <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Scatter name="Skills" data={mappedData} fill="#8884d8" shape="circle" onClick={onDotClick} />
                </ScatterChart>
            </div>
        </div>
    );
};

export default ScatterPlot;
