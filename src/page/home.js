import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import messageApi from "../api/message/messageApi";
import authenticationApi from "../api/auth/authenticationApi";
import PrivateChat from "./privateChat";
import { useDispatch } from "react-redux";
import { logout } from "./userReduce";
const host = "https://chat-904.herokuapp.com";
function Home() {
  const dispatch = useDispatch();
    const [nameUser , setNameUser] = useState(localStorage.getItem("name"))
  const [id, setId] = useState(() => {
    return localStorage.getItem("_id");
  });
  const [tabPrivate, setTabPrivate] = useState(false);
  const [dataMessages, setDataMessages] = useState(false);
  const [dataUser, setDataUser] = useState(false);
  const [message, setMessage] = useState("");
  const socketRef = useRef();
  
  const [typing, setTyping] = useState(false);
  const [isOnline, setIsOnline] = useState({});
  const [privateChat, setPrivateChat] = useState(false);
  const handleLogout = () => {

    localStorage.setItem('_id',null);
    localStorage.setItem('name',null);
    dispatch(logout());
  }
  const demo = useRef(false);

  demo.current = privateChat;
  useEffect(() => {
    const getPrivateChat = async () => {
         const dataPrivate = await messageApi.getListPrivate(id);
         if(dataPrivate && dataPrivate.length !== 0) setPrivateChat(dataPrivate);
     
         demo.current = dataPrivate;
    }
    const setList = async () => {
      const response = await messageApi.getList();
      if (response) setDataMessages(response);
    };
    const getListUser = async () => {
      const dataUsers = await authenticationApi.getListUser();
      if (dataUsers) setDataUser(dataUsers);
    };

    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("sendDataServerPrivateAddNewChatList", (item) => {
        //console.log(item)
       let checkNewPrivate = [item.dataGroupMember.user_first._id, item.dataGroupMember.user_second._id];
    //    console.log("array", checkNewPrivate);
    //    console.log(id);
       if(checkNewPrivate.includes(id)){ 
       
          if(demo.current){
            setPrivateChat([...demo.current, item.dataGroupMember]);
          }else {
            setPrivateChat([item.dataGroupMember]);
          }
       }
     //  console.log('-------------------------------------', item)
    });
    
    socketRef.current.emit('login',{userId: id});
    
    socketRef.current.on("sendDataServerNewTopMessage", (item) => {
      // console.log(item);
     //  console.log(demo.current)
       if(demo.current){
          var check = (demo.current.find(x => x.conversation_id === item.conversation_id));
          if(check){
               check = {...check, chat_new : item.content};
               setPrivateChat(() => {
                let updateChat =  demo.current.map(value => {
                   if(value._id === check._id){
                       value = check ;
                   }
                    return value;
                })
                return updateChat;
               })
          }
       }




       
   });
    socketRef.current.on("sendDataServerNewRegister", (item) => {
       
       setDataUser((prev) => {
          return [...prev, item.data.data]
       })
    });
    socketRef.current.on("sendDataServerOnline", (item) => {
        setIsOnline(item.users);
      });
    socketRef.current.on("sendDataServer", (item) => {
      setDataMessages((prev) => {
        return [...prev, item.dataMessage];
      });
      scrollToBottom("test");
    });
    socketRef.current.on("sendDataServerTyping", (item) => {
        if(item.data === null){
            setTyping(false);
        }else {
            if(item.data !== id){
                setTyping(true);
                scrollToBottom("test");
            }else {
                setTyping(false);
            }
        }
        
        
    });
    setList();
    getListUser();
    getPrivateChat();
    scrollToBottom("test");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
 //console.log(privateChat)
  const postMessage = () => {
    if (message !== "" && message[0] !== " ") {
      const msg = {
        content: message,
        id: id,
      };
      socketRef.current.emit("sendDataClient", msg);

      setMessage("");
    }
  };
  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      postMessage();
    }
  };
  const scrollToBottom = (id) => {
     setTimeout(() => {
      const element = document.getElementById(id);
      element.scrollTop = element.scrollHeight;
    }, 100);
  };
  const onTyping = () => {
   if(message !== ''){
     socketRef.current.emit("sendDataClientTyping", id);
   }else {
    socketRef.current.emit("sendDataClientTyping", null);
   }
    //sendDataClientTyping
  };
  const checkOnline = (id) => {
    let exists = Object.values(isOnline).includes(id);
    return(exists);
  }
  const showDetailChatPrivate = async (user_id, name) => {
     const response = await messageApi.getChatMemberDetail({id_first : id, id_second : user_id});
     const dataTab = {conversation : response.conversation_id,name : name, user_current_id : id, user_second_id : user_id};
     setTabPrivate(dataTab);
  }

  return (
    <div className="content">
        
      <section className="container">
        <div className="row">


        <div className="col-md-4">
           
            <div className="card card-widget widget-user">
             
              <div className="widget-user-header text-white img-profile-custom">
                <h3 className="widget-user-username text-right">{nameUser}</h3>
                <h5 className="widget-user-desc text-right">(Bạn)</h5>
              </div>
              <div className="widget-user-image">
                <img className="img-circle" src="https://upload.wikimedia.org/wikipedia/vi/thumb/a/a1/Man_Utd_FC_.svg/1200px-Man_Utd_FC_.svg.png" alt="User Avatar" />
              </div>
              <div className="card-footer">
                <div className="row">
                  <div className="col-sm-4 border-right">
                    <div className="description-block">
                      <h5 className="description-header">Top #</h5>
                      <span className="description-text">#5</span>
                    </div>
                    
                  </div>
                 
                  <div className="col-sm-4 border-right">
                    <div className="description-block">
                      <h5 className="description-header">...</h5>
                      <span className="description-text">...</span>
                    </div>
                    
                  </div>
                
                  <div className="col-sm-4">
                    <div className="description-block">
                     <Link to="#" onClick={() => handleLogout()}> <h5 className="description-header">Đăng xuất</h5></Link> 
                      <span className="description-text">...</span>
                    </div>
                  
                  </div>
                 
                </div>
               
              </div>
            </div>
           
          </div>





          <div className="col-md-6">
            <div className="card direct-chat direct-chat-primary">
              <div className="card-header">
                <h3  className="card-title">
                  Chat nhóm
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
                <div id="test" className="direct-chat-messages">
                  {dataMessages &&
                    dataMessages.map((item, key) => {
                      if (item.user_id._id === id) {
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
                                Ai đó đang nhập ...
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
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Thành viên chat</h3>

                <div className="card-tools">
                  <span className="badge badge-danger">
                    {dataUser.length} thành viên
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
                    data-card-widget="remove"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div className="card-body p-0">
                <ul className="users-list clearfix">
                  {dataUser &&
                    dataUser.map((item, key) => {
                        if(item._id !== id){
                            return ( <li key={key} onClick={() => showDetailChatPrivate(item._id, item.name)}>
                            <img
                              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                              alt="User "
                            />
                            <Link className="users-list-name" to="#">
                              {item.name}
                            </Link>
                           
                            {checkOnline(item._id) ?  <span className="users-list-date is-online">Online</span> :  <span className="users-list-date is-offline">Offline</span>}
                          </li>)
                        }
                       
                    }
                     
                    )}
                </ul>
              </div>

              
            </div>
          </div>

         <div className="col-md-4">
         <div className="card">
              <div className="card-header">
                <h3 className="card-title">Đoạn chat</h3>

                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus"></i>
                  </button>
                  <button type="button" className="btn btn-tool" data-card-widget="remove">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
             
              <div className="card-body p-0">
                <ul className="products-list product-list-in-card pl-2 pr-2">
                    {privateChat && privateChat.map((item, key) => (
                           <li key={key} className="item" onClick={() => setTabPrivate(() => {
                         //   let name = {item.user_first._id === id ? item.user_second.name : item.user_first.name};
                             let name = '';
                              if(item.user_first._id === id){
                                 name = item.user_second.name;
                              }else {
                                name = item.user_first.name
                              }


                               return {
                                 conversation : item.conversation_id,
                                 name : name,
                                 user_current_id : id
                               }
                           })}>
                           <div className="product-img">
                             <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" className="img-size-50" />
                           </div>
                           <div className="product-info">
                             <Link to="" className="product-title"> {item.user_first._id === id ? item.user_second.name : item.user_first.name}
                               <span className="badge badge-danger float-right">Mới</span></Link>
                             <span className="product-description">
                               {item.chat_new ? item.chat_new : "..."}
                             </span>
                           </div>
                         </li>
                    ))}
                  
                
                </ul>
              </div>
            </div>

         </div>
         
         {tabPrivate && <PrivateChat data={tabPrivate} socket={socketRef.current} />}

        </div>
      </section>
    </div>
  );
}
export default Home;
