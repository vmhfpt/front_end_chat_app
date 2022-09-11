import messageApi from "../api/message/messageApi";
//
import React,{ useEffect, useState, useRef} from "react";

const  PrivateChat = ({data, socket}) => {
    // const [conversationID.current, setconversationID.current] =  useState(() => {
    //     return (data.conversation);
    // })
    const demo = useRef(false);
  
    const conversationID = useRef(data.conversation);
   
    const [demoState, setDemo] = useState(conversationID.current);
    //conversationID.current = data.conversation;
   // console.log(conversationID.current)
    const [message, setMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [listChatPrivate, setListChatPrivate] = useState(false); 
    useEffect(() => {
       conversationID.current = data.conversation;
       const getListPrivate = async () => {
          if(conversationID.current){
            const response = await messageApi.getChatDetailPrivate(conversationID.current);
            if(response) setListChatPrivate(response);
          }else {
            setListChatPrivate(false);
          }
           
       }
       getListPrivate();
       socket.on("sendDataServerPrivateAddNewChat", (item) => {
          if(item.dataMessenger.user_id._id === data.user_current_id){
            conversationID.current = item.dataMessenger.conversation_id;
          
           // conversationID.current = true;
          //  demo.current = true;
            //console.log("change current")
            setListChatPrivate(() => {
                return [item.dataMessenger];
            });
          //  console.log(item.dataMessenger.conversation_id)
           
          }
         // console.log("+++++++++++++++++++++++++++++++++++", item)
       // const dataGroupMembers = item.dataResponse.dataGroupMember ;
       });
       socket.on("sendDataServerPrivate", (item) => {
        if(item.dataMessage.conversation_id === conversationID.current){
            setListChatPrivate((prev) => {
                return [...prev, item.dataMessage];
            });
            scrollToBottom("private-chat");
        }
         
      });

      socket.on("sendDataServerTypingPrivate", (item) => {
         if(item.data === null){
             setTyping(false);
         }else {
             if(item.data.user_id !== data.user_current_id && item.data.conversation_id === conversationID.current){
                 setTyping(true);
                 scrollToBottom("private-chat");
             }else {
                 setTyping(false);
             }
         }
       // console.log(item);
        
    });

      scrollToBottom("private-chat");
      return () => {
        socket.off("sendDataServerPrivateAddNewChat");
        socket.off("sendDataServerPrivate");
        socket.off("sendDataServerTypingPrivate");
      };
    }, [data]);
    const scrollToBottom = (id) => {
        setTimeout(() => {
         const element = document.getElementById(id);
         element.scrollTop = element.scrollHeight;
       }, 100);
     };
    const onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
          postMessage();
        }
      };
    const postMessage = () => {
        if (message !== "" && message[0] !== " ") {
          const msg = {
            content: message,
            user_id:  data.user_current_id,
            conversation_id : conversationID.current,
            user_second_id : data.user_second_id,
          };
      //    console.log(conversationID.current);
          //console.log(msg)
          socket.emit("sendDataClientPrivate", msg);
          setMessage("");
        }
      };
      const onTyping = () => {
        if(message !== ''){
          socket.emit("sendDataClientTypingPrivate", {user_id:  data.user_current_id,
            conversation_id : conversationID.current});
        }else {
         socket.emit("sendDataClientTypingPrivate", null);
        }
         //sendDataClientTyping
       };
    return (    <div className="col-md-6">
    <div className="card direct-chat direct-chat-primary">
      <div className="card-header">
        <h3  className="card-title">
           {data.name}
        </h3>

        <div className="card-tools">
          <span title="3 New Messages" className="badge badge-warning">
            3
          </span>
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            type="button"
            className="btn btn-tool"
            title="Contacts"
            data-widget="chat-pane-toggle"
          >
            <i className="fas fa-comments"></i>
          </button>
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="remove"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div id="private-chat" className="direct-chat-messages">
          {listChatPrivate &&
            listChatPrivate.map((item, key) => {
              if (item.user_id._id === data.user_current_id) {
                return (
                  <div key={key} className="direct-chat-msg right">
                    <div className="direct-chat-infos clearfix">
                      <span className="direct-chat-name float-right">
                        {item.user_id.name}
                      </span>
                      <span className="direct-chat-timestamp float-left">
                        {item.createdAt}
                      </span>
                    </div>

                    <img
                      className="direct-chat-img"
                      src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
                      alt="message user "
                    />

                    <div className="direct-chat-text">
                      {item.content}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={key} className="direct-chat-msg">
                    <div className="direct-chat-infos clearfix">
                      <span className="direct-chat-name float-left">
                        {item.user_id.name}
                      </span>
                      <span className="direct-chat-timestamp float-right">
                        {item.createdAt}
                      </span>
                    </div>

                    <img
                      className="direct-chat-img"
                      src="https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png"
                      alt="message user "
                    />

                    <div className="direct-chat-text">
                      {item.content}
                    </div>
                  </div>
                );
              }
            })}
             {typing && <div >
                    
                    <img
                      className="direct-chat-img"
                      src="https://static.thenounproject.com/png/79618-200.png"
                      alt="message user "
                    />

                    <div className="direct-chat-text">
                          {data.name} đang nhập ...
                    </div>
                 
        </div>}
        </div>
       
      </div>
      
      <div className="card-footer">
        <div className="input-group">
          <input
            onKeyUp={onTyping}
            onKeyDown={onEnterPress}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="Type Message ..."
            className="form-control"
          />
          <span className="input-group-append">
            <button
              onClick={() => postMessage()}
              type="button"
              className="btn btn-primary"
            >
              Gửi
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>)
}
export default React.memo(PrivateChat);