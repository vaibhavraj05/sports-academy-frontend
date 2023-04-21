const AUTH_TOKEN = 'TOKEN';

export const getToken = () => JSON.parse(localStorage.getItem(AUTH_TOKEN));

export const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};
