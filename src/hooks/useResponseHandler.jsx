import { createContext, useContext, useState } from 'react';
import Swal from 'sweetalert2';

const ResponseHandlerContext = createContext();

export const useResponseHandler = () => useContext(ResponseHandlerContext);

const ResponseHandlerProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const setErrorMsg = (msg) => setError(msg);
  const clearError = () => setError(null);

  return (
    <ResponseHandlerContext.Provider 
      value={{ isLoading, error, startLoading, stopLoading, setErrorMsg, clearError }}>
      {children}
    </ResponseHandlerContext.Provider>
  );
};

export default ResponseHandlerProvider;

export const SwalError = (response) => {

  return Swal.fire({
    title: response,
    html: `
      <p class="text-white">Please check url and connection server</p>
    `,
    showCancelButton: false,
    background: 'transparent',
    confirmButtonText: "Reload",
    color: "#fff",
    showLoaderOnConfirm: true,
    backdrop:'linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)',
    closeClick: false,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  })
}