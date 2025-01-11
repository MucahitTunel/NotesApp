import { useEffect } from 'react';
import { hasUser, getUser } from '../storage/mmkv';
import { useUser } from '../context/UserContext';

export const useCheckUser = () => {
  const { setUsername } = useUser();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = () => {
    // Check if user exists
    const userExists = hasUser();
    
    if (userExists) {
      // Get user data and set it in context
      const userData = getUser();
      if (userData?.username) {
        setUsername(userData.username);
      }
    }

    return userExists;
  };

  return { checkUser };
}; 