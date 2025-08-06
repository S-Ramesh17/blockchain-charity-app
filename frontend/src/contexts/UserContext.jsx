import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3 } from './Web3Context';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { account } = useWeb3();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!account) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // In a real app, you'd fetch user data from your backend
        const mockUser = {
          address: account,
          name: 'Anonymous',
          role: 'donor',
          totalDonated: 0,
          nftCount: 0
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [account]);

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);