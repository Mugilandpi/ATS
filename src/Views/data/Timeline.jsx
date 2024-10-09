import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Timeline.css'; // Import the CSS file

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Timeline = ({ events }) => {
  return (
    <div>
      {/* <div style={{marginTop:"-30px"}}><h5 className="card-title">Career Progress of the Candidate </h5></div> */}
      <div className="timeline-container" style={{width:"100%"}}>
        <VerticalTimeline>
          {events?.map((event, index) => {
            // Generate a random color for each event
            const randomColor = getRandomColor();
            const iconClass = event.icon || 'fa-building'; 
            return (
              <VerticalTimelineElement
                key={index}
                date={event.date}
                iconStyle={{ background: randomColor, color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                icon={<i className={`fas ${iconClass}`} style={{fontSize:"30px",marginLeft:"17px",marginTop:"13px"}}></i>}
              >
                <h3 className="vertical-timeline-element-title">{event.title}</h3>
                <h4 className="vertical-timeline-element-subtitle"> {event.subtitle}</h4>
                <div className="vertical-timeline-element-subtitle">Projects: {event.project}</div>
                <div className="vertical-timeline-element-subtitle">Company: {event.company}</div>
                {/* <div className="vertical-timeline-element-subtitle">Company:<br/>{event.duration}</div> */}
                {/* <p>{event.description}</p> */}
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default Timeline;
