import axiosClient from '../handleApi';

const messageApi = {
    getList: () => {
      const url = '/get-message';
      return axiosClient.get(url);
    },
    getListPrivate : (user_id) => {
        
        const url = '/get-chat-room';
        return axiosClient.post(url, {user_id : user_id});
    },
    getChatDetailPrivate : (conversation) => {
      const url = '/get-chat-private';
      return axiosClient.post(url, {id : conversation});
    },
    getChatMemberDetail : (data) => {
        const url = '/get-member-chat';
        return axiosClient.post(url, data);
    }
  }
  
  export default messageApi; 