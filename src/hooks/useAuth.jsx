import { createContext, useContext, useState } from 'react'

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {

  const [cookie, setCookie] = useState('');
  const [session, setSession] = useState([]);
    
  return <AuthContext.Provider value={{ cookie, session, setCookie, setSession }}>
    { children }
  </AuthContext.Provider>
}

export default AuthProvider