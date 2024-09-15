// src/api.js

import axios from 'axios';
import Swal from 'sweetalert2';
import { SwalError, useResponseHandler } from './useResponseHandler';
import { useAlert } from './useAlert';

var base_url = window.location.origin;

export const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8012', // untuk Ganti dengan URL dasar API
  baseURL: base_url,
  timeout: 10000, // Waktu timeout request
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Accept': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     'Access-Control-Allow-Credentials': 'true',
// },
});

export const useApi = () => {
  const { startLoading, stopLoading, clearError } = useResponseHandler();
  const { showAlert } = useAlert();

  const getRequest = async (url, params = {}) => {
    startLoading();
    clearError();
    try {
      const response = await axiosInstance.get(url, { params });
      if(response.status !== 200) {
        showAlert({
            icon: 'error',
            title: `Oops..., ${response.status}`,
            html: <p>Please check url <span className="text-info">{response.statusText}</span></p>,
            confirmButtonText: 'Ok',
            closeClick: false,
            allowOutsideClick: false,
          }, '')
      } 
      return response.data;
    } catch (error) {
      SwalError(error.message);
      throw error;
    } finally {
      stopLoading();
    }
  };

  const postRequest = async (url, data) => {
    startLoading();
    clearError();
    try {
      const response = await axiosInstance.post(url, data);
      if(response.status !== 200) {
        Swal.error({
          title: "Error",
          text: response.message,
          icon: "error"
        })
      }
      return response.data;
    } catch (error) {
      SwalError(error.message);
      throw error;
    } finally {
      stopLoading();
    }
  };

  return { getRequest, postRequest };
};
