import Cookies from 'js-cookie';
import { appRoutes } from '../app/App';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const userSession = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : {};

// 4C461F6B5A7D35F265BE659E4533CC4E password Farid Lukmana

export default function PrivateRoute({ children }) {

    const token = Cookies.get('token');
    const location = useLocation();
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if(!token || token === '' || token === undefined) {
        localStorage.removeItem('session');
      }
      
    }, [token, navigate]);

  return token && token !== '' && token !== undefined && 
    session?.isGuest === false || userSession?.isGuest === false ? children :
    session?.isGuest || userSession?.isGuest ? <Navigate state={{ from: location }} to={appRoutes.GUEST} /> :
    <Navigate state={{ from: location }} to={appRoutes.LOGIN} />
}

export const UserGuest = ({ children }) => {

  const token = Cookies.get('token');
  const location = useLocation();
  const { session } = useAuth();

  return token && token !== '' && token !== undefined && 
  session?.isGuest === false || userSession?.isGuest === false ? <Navigate state={{ from: location }} to={appRoutes.HOME} /> :
    session?.isGuest || userSession?.isGuest ? children :
  <Navigate state={{ from: location }} to={appRoutes.LOGIN} />
}
