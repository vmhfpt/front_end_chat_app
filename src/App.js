/*import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const host = "http://localhost:5000";

function App() {
  
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = socketIOClient.connect(host)
    socketRef.current.on('sendDataServer', dataGot => {
      setMess(oldMsgs => [...oldMsgs, dataGot.data])
    }) 

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

 
  const sendMessage = () => {
    if(message !== null) {
       const msg = {
         content: message, 
       }
       socketRef.current.emit('sendDataClient', msg)
 
       setMessage('')
     }
 }

  return (
    <div className="box-chat">
    <div className="box-chat_message">
        <ul>
        {mess.map((item, key) => (
          <li key={key}> {item.content}</li>
          ))}
        </ul>
    </div>
  
    <div className="send-box">
        <textarea 
          value={message}  
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Nhập tin nhắn ..." 
        />
        <button onClick={() => sendMessage()}>
          Send
        </button>
    </div>
  </div>
  );
}

export default App;*/
import { useSelector } from "react-redux";
import { Routes, Route, Navigate} from "react-router-dom";
import Home from "./page/home";
import Login from "./page/login";
import { getLogin } from "./page/selectUser";
import Register from "./page/register";
import ErrorNot404 from "./page/404";
function App() {
  const isLogin = useSelector(getLogin);

  return (  <Routes>
    <Route path="/" element={ isLogin.isLogin && isLogin._id.length >= 20 && isLogin._id !== null ? <Home /> : <Navigate to="/login" /> } />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<ErrorNot404 />} />
</Routes>)
}
export default App;

/* */