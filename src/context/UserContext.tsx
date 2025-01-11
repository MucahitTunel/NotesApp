import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../storage/mmkv';

type UserContextType = {
  username: string | null;
  setUsername: (username: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Load user data when app starts
    const userData = getUser();
    if (userData?.username) {
      setUsername(userData.username);
    }
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 