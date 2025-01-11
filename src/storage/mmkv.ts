import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

const USER_KEY = 'user_data';

export const saveUser = (userData: any) => {
  storage.set(USER_KEY, JSON.stringify(userData));
};

export const getUser = () => {
  const user = storage.getString(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  storage.delete(USER_KEY);
};

export const hasUser = () => {
  return storage.contains(USER_KEY);
}; 