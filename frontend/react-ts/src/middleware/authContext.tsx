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
  register : (email: string, username : string, password: string) => Promise<void>,
  logout : () => void
}

//DefaultValues to prevent undefined
const AuthContext = createContext<contextDataType>({
  userData: null,
  login : () => {return Promise.resolve()},
  register : () => {return Promise.resolve()},
  logout : ()=>{}
});

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [userData, setUserData] = useState<userDataType | null>(null);

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('userData') !== null ? JSON.parse(localStorage.getItem('userData')!) : null;
    if (storedUser)
      setUserData(storedUser);

    setLoading(false)
  }, []);

  const login = async (email : string, password : string) => {
    try {
      const response = await axios.post(config.api_url + "/api/auth/login", {
        "email" : email,
        "password" : password
      }).then(res => res.data)
      setUserData(response)
      localStorage.setItem('userData', JSON.stringify(response));
    }
    catch (error:any){
      if (error.response.data.errors) {
        throw new Error(error.response.data.errors[0].msg);
      }
      else if (error.response.data)
      {
        throw new Error(error.response.data);
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  };

  const register = async (email : string, username : string, password : string) => {
    try {
      await axios.post(config.api_url + "/api/auth/register", {
        "email" : email,
        "username" : username,
        "password" : password
      }).then(res => res.data)
  
    }
    catch (error:any){
      if (error.response.data.errors) {
        throw new Error(error.response.data.errors[0].msg);
      }
      else if (error.response.data)
      {
        throw new Error(error.response.data);
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };

  const value = useMemo(() => ({ userData, login, register, logout }), [userData]);

  if (loading) {
    return <div>Loading...</div>;  // Or some other loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;