import React from "react";
import "../../styles/chat.css";
import ChatList from "../PageComponents/chat/ChatList";
import ChatContent from "../PageComponents/chat/ChatContent";

export default function Chat() {
  return (
    <div className="main__chatbody">
      <ChatList />
      <ChatContent />
    </div>
  );
}
