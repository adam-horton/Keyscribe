import React, { createContext, useContext, useState, useEffect } from 'react';

const apiURL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);

   // This function is to prevent losing login status on referesh
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`${apiURL}/userLoggedIn`, {
               method: 'GET',
               credentials: 'include',
            });
            if (response.ok) {
               setIsAuthenticated(true);
               setLoading(false);
            }
            else {
               setIsAuthenticated(false);
               setLoading(false);
            }
         } catch(error) {
            console.error(error);
         }
      };
      fetchData();
   }, []);

   const login = async (username, password) => {
      try {
         const response = await fetch(`${apiURL}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
         });

         if (response.ok) {
            setIsAuthenticated(true);
            return true;
         }
         else {
            return false;
         }
      }
      catch (error) {
         console.error(error);
      }
      
   };

   const logout = async () => {
      console.log('AuthContext logout reached');
      setIsAuthenticated(false);
      console.log(isAuthenticated);
      try {
         const response = await fetch(`${apiURL}/logout`);
         if (!response.ok) {
            console.error('Logout request failed.');
         }
      } catch(error) {
         console.error('Error during logout: ', error);
      }
   };

   return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

