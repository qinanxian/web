const myStorage = localStorage || {};
const __cache = {};

export const setCache = (key, value) => {
  __cache[key] = value;
};

export const getCache = (key) => {
  return __cache[key];
};

export const deleteCache = (key) => {
  delete __cache[key];
};

export const getSessionId = () => {
  return myStorage.getItem('SessionId');
};

export const setSessionId = (SessionId) => {
  myStorage.setItem('SessionId', SessionId);
};

export const setCachePwd = (p) => {
  myStorage.setItem('userPwd', p);
};

export const getCachePwd = () => {
  myStorage.getItem('userPwd');
};

export const rmCachePwd = () => {
  myStorage.removeItem('userPwd');
};

export const getUser = () => {
  return JSON.parse(myStorage.getItem('user') || '{}');
};

export const setUser = (user) => {
  myStorage.setItem('user', JSON.stringify(user || {}));
};

export const setItem = (key, value) => {
  myStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value || {}));
};

export const getItem = (key) => {
  return myStorage.getItem(key);
};

export const clear = () => {
  myStorage.clear();
};
