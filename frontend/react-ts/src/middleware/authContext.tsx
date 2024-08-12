import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import axios from 'axios';
import config from '../config'

export type userDataType = {
  token : string,
  role : "Admin" | "User",
  username : string  
}

type contextDataType = {
  userData : userDataType | null,
  login : (email: string, password: string) => Promise<void>,
  logout : () => void
}

//DefaultValues to prevent undefined
const AuthContext = createContext<contextDataType>({
  userData: null,
  login : () => {return Promise.resolve();},
  logout : ()=>{}
});

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [userData, setUserData] = useState<userDataType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData') !== null ? JSON.parse(localStorage.getItem('userData')!) : null;
    if (storedUser) {
      console.log("User retrieved")
      setUserData(storedUser);
    }
    else
      console.log("User not retrieved")
  }, []);

  const login = async (email : string, password : string) => {
    const response = await axios.post(config.api_url + "/api/auth/login", {
      "email" : email,
      "password" : password
    }).then(res => res.data)

    setUserData(response.data.user);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };

  const value = useMemo(() => ({ userData, login, logout }), [userData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;