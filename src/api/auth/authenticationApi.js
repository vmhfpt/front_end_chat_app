import axiosClient from '../handleApi';

const authenticationApi = {
    login: (params) => {
      const url = '/login';
      return axiosClient.post(url,  params );
    },
    logout : (params, accessToken) => {
        const url = '/admin/logout';
        return axiosClient.post(url,  params );
    },
    getListUser :  () => {
      const url = '/user-get';
      return axiosClient.get(url);
  },
    register : (data) => {
    const url = '/register';
    return axiosClient.post(url, data);
  }
  
  }
  
  export default authenticationApi; 