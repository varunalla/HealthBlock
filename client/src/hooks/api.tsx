import axios from 'axios';

export const useAuthFetch = () => {
  const token = window.localStorage.getItem('user_token');
  //read jwt from context
  const fetch = (method: string, url: string, data?: any) => {
    return axios({
      url: url,
      method: method,
      data: data,
      headers: {
        token: `${token}`,
      },
    });
  };
  return { fetch };
};
