import { BrowserRouter, useLocation, useNavigate, useRoutes } from "react-router-dom";
import ErrorBoundary from "../components/template/ErrorBoundary";
import MPCLoader, { lazyLoadComponents } from "../utils/utility";
import { Fragment, Suspense, useEffect } from "react";
import ResponseHandlerProvider from '../hooks/useResponseHandler';
import AuthProvider, { useAuth } from "../hooks/useAuth";
import SweetAlertProvider, { useAlert } from "../hooks/useAlert";
import DepositPage from "./admin/deposit";
import InstruksiPage from "./admin/instruksi";
import ModalProvider from "../hooks/useModal";
import DashboardPage from "./admin/dashboard";
import MenuProvider from "../context/menu";
import RebuildTableProvider from "../hooks/useRebuildTable";
import PrivateRoute, { UserGuest } from "../context/PrivateRoute";

const HomePage = lazyLoadComponents(import('./admin/home'));
const LoginPage = lazyLoadComponents(import('./auth/login'));
const GustPage = lazyLoadComponents(import('./auth/guest'));

export default function App() {
  return (
    <Fragment>
      <ErrorBoundary fallback={<div>Error</div>}>
        <BrowserRouter>
          <Suspense fallback={<MPCLoader/>}>
            <SweetAlertProvider>
              <ResponseHandlerProvider>
                <AuthProvider>
                  <MenuProvider>
                    <ModalProvider>
                      <RebuildTableProvider>
                        <RouteContainer/>
                      </RebuildTableProvider>
                    </ModalProvider>
                  </MenuProvider>
                </AuthProvider>
              </ResponseHandlerProvider>
            </SweetAlertProvider>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </Fragment>
  )
}

const RouteContainer = () => {

  const { pathname } = useLocation();
  const { setSession } = useAuth();
  const transformTitle = (route) => {
    return route
      .replace(/^\//, '') 
      .split('/') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(' '); 
  };

  useEffect(() => {
    document.title = `${pathname === '/' ? 'Home' : transformTitle(pathname)} - Cash Management System`;
    setSession(localStorage.getItem('session'));
  }, [pathname, setSession]);

  const routes = useRoutes(routesConfig);
  return routes;
}

export const appRoutes = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DEPOSIT: '/deposit/:bankid',
  INSTRUKSI: '/instruksi/:bankid',
  PROFILE: '/profile',
  GUEST: '/guest',
  UNKNOW: '*',
}

const NotFound = () => {

  const { showAlert } = useAlert();
  const navigate = useNavigate()

  useEffect(() => {
    showAlert({
      html: <img className="swal2-image-notfound" src='/img/404.svg' alt='404'/>,
      confirmButtonText: 'Reload',
      showDenyButton: true,
      denyButtonText: "Back to Home"
    }, 'notfound',
      'default-popup-background',
      'default-backdrop')
      .then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        } else if (result.isDenied) {
          navigate(appRoutes.HOME)
        }
      });
  }, [showAlert, navigate])

  return null;
}

const routesConfig = [
  {
    path: appRoutes.HOME,
    element: <PrivateRoute>
      <HomePage/>
    </PrivateRoute>,
      
    children: [ 
      {
        path: appRoutes.DASHBOARD,
        element: <DashboardPage/>,
      },
      {
        path: appRoutes.DEPOSIT,
        element: <DepositPage/>,
      },
      {
        path: appRoutes.INSTRUKSI,
        element: <InstruksiPage/>,
      },
    ]
  },  
  {
    path: appRoutes.LOGIN,
    element: <LoginPage/>,
  },  
  {
    path: appRoutes.GUEST,
    element:
      <UserGuest>
        <GustPage/>
      </UserGuest>
  },  
  {
    path: appRoutes.UNKNOW,
    element: <NotFound/>,
  },  
  
]