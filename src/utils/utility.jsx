import { lazy } from "react";
import { Mosaic } from "react-loading-indicators";
import ErrorBoundary from "../components/template/ErrorBoundary";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import { axiosInstance } from "../hooks/useApi";
import Cookies from 'js-cookie';
import { redirect } from "react-router-dom";
import moment from "moment";

export default function MPCLoader() {
  return ( 
    <div className="mpc-loader">
        <div className="item-loader d-flex flex-row justify-content-center">
          <div className="flex-column text-center">
            <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
          </div>
        </div>
    </div>
  )
}

export function LazyLoad(promise) {
  return new Promise(resolve => {
      setTimeout(resolve, 1000);
  }).then(() => promise);
}

export function lazyLoadComponents(path) {
  return lazy(() => {
      const promise = LazyLoad(path)
      if(path == null) {
          return <ErrorBoundary fallback="Please input module"/>;
      } else {
          return promise
      }
  })
}

export function LoadingSkeleton(props) {
  const { count, heignt } = props
  return (
      <Skeleton height={heignt} count={count}/>
  )
}

export const transformTitle = (route) => {
  return route
    .replace(/^\//, '') 
    .split('/') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(' '); 
};

export function formatCurrency(value) {
  // Konversi nilai ke string, pastikan mempertahankan tanda + atau -
  const sign = value < 0 ? '-' : (value > 0 && value.toString()[0] === '+' ? '+' : '');
  
  // Buang tanda dari nilai untuk pemrosesan lebih lanjut
  const absoluteValue = Math.abs(value);

  // Gunakan Intl.NumberFormat untuk memformat nilai
  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absoluteValue);

  // Tambahkan kembali tanda di depan nilai yang diformat
  return sign + formattedValue;
}

export const formatDateRange = (value) => {
  if (!value) {
      return `'' to ''`;
  }
  const [startDate, endDate] = value;
  return `${moment(startDate).format("yyyy-MM-DD")} to ${moment(endDate).format("yyyy-MM-DD")}`;
}

export function convertDateRangeToISO(inputStr) {
  if(inputStr) {
      const [startDateStr, endDateStr] = inputStr.split(' to ');
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const result = [startDate, endDate];
      return result;
  }
}

export const LockScreen = async () => {

  return Swal.fire({
    title: "Token not found",
    html: `
      <p class="text-white">Enter your user and password to unlock</p>
      <input id="userid" class="swal2-input">
      <input id="password" class="swal2-input">
    `,
    showCancelButton: false,
    background: 'transparent',
    confirmButtonText: "Unlock",
    showDenyButton: true,
    denyButtonText: `Logout`,
    color: "#fff",
    showLoaderOnConfirm: true,
    backdrop:'linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)',
    closeClick: false,
    allowOutsideClick: false,
    preConfirm: async () => {

      const userId = document.getElementById("userid").value;
      const password = document.getElementById("password").value;

      try {
        const response = await axiosInstance.post(`${axiosInstance.defaults.baseURL}/api/auth/login`, { UserID: userId, Password: password });
        if (response.status === 200) {
          Cookies.set('token', response.data.token, { expires: 1 });
          if(response.data.result) {
            return Swal.fire({
              title: `${response.data.message}`,
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            })
          } else {
            Swal.showValidationMessage(`
              Request failed: ${response.data.message}
            `);
          }
        }
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    preDeny: async () => {
      const token = Cookies.get('token');

      try {
        const response = await axiosInstance.post(`${axiosInstance.defaults.baseURL}/api/auth/logout`, {token: token});

      if (response.status === 200) {
        if(response.data.result) {
          redirect('/login');
        } else {
          Swal.showValidationMessage(`
            Request failed: ${response.data.message}
          `);
        }
      }
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    }
  });
}