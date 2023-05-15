import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosPrivate from '#/api/axios';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getToken, removeToken, setToken } from '#/helpers/token';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
  auth: {},
  setAuth: () => ({})
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getToken() || {});
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  if (auth?.accessToken) {
    axiosPrivate.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`;
  }

  const value = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

  async function refreshAccessToken() {
    const { refreshToken } = getToken();
    try {
      const response = await axios.post('/user/generate-access-token', null, {
        baseURL: import.meta.env.VITE_BASE_URL,
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      const newAccessToken = response.data.data.accessToken;
      const localTokens = getToken();
      setToken({ ...localTokens, accessToken: newAccessToken });
      setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));
      return newAccessToken;
    } catch (error) {
      removeToken();
      setAuth({});
      navigate('/login');

      throw error;
    }
  }

  async function fetchUserData() {
    const { accessToken, refreshToken } = auth;
    if (accessToken) {
      try {
        const response = await axiosPrivate.get('/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const { id, name, email } = response.data.data;
        setAuth({ id, name, email, accessToken, refreshToken });
      } catch (error) {
        if (error) {
          messageApi.error(error?.response?.data?.message);
        }
      }
    }
  }

  useEffect(() => {
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refreshAccessToken(auth.refreshToken);
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        if (error?.code === 'ERR_NETWORK') {
          messageApi.error("Couldn't connect to the server. Please try again later");
          return Promise.reject();
        }

        return Promise.reject(error);
      }
    );
    fetchUserData();
    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export default AuthProvider;
