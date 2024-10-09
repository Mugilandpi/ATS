import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ChatBot from "../assets/chatbot1.png";

const ChatBotComponent = ({ setTelephonic, msgs, chatMsgId })=>{
  return (<div
   
    style={{
      position: "fixed",
      // border: "1px solid red",
      padding: "3px",
    }}
  >
    <img
      style={{ height: "50px", cursor: "pointer" }}
      src={ChatBot}
      alt="chatbot"
      onClick={() => setTelephonic(true)}
    />
    <div
      style={{
        position: "absolute",
        top: "-60px",
        width: "140px",
        // right: "0px",
        marginLeft:"30px"
      }}
    >
      {msgs?.map((item, idx) => (
        chatMsgId === idx && (
          <div key={idx} className="chat-bubble">
            {item}
          </div>
        )
      ))}
    </div>
  </div>)
}

ChatBotComponent.propTypes = {
  setShowChatbotModal: PropTypes.func.isRequired,
  msgs: PropTypes.arrayOf(PropTypes.string).isRequired,
  chatMsgId: PropTypes.number.isRequired,
};

export default memo(ChatBotComponent);
