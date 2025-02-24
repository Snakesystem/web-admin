import { createContext, useContext, useMemo } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlertContext = createContext();

export const useAlert = () => {
  return useContext(SweetAlertContext);
};

const SweetAlertProvider = ({ children }) => {
  const SweetAlert = useMemo(() => withReactContent(Swal), []);

  const showAlert = (options, size = 'md', backgroundStyle="default-popup-background", backdropStyle="default-backdrop") => {

    return SweetAlert.fire({
        ...options,
      customClass: {
        container: `swal2-${size}`,
        popup: `swal2-${size} ${backgroundStyle}`,
        backdrop: backdropStyle,
        ...options.customClass
      },
      didOpen: (popup) => {

        const swalContainer = popup.parentNode;
        if (swalContainer && swalContainer.classList.contains('swal2-container')) {
        //   swalContainer.id = isDark ? 'dark' : 'light' ;
          swalContainer.classList.add(backdropStyle);
        }
      },
    });
  };

  return (
    <SweetAlertContext.Provider value={{ showAlert }}>
      {children}
    </SweetAlertContext.Provider>
  );
};

export default SweetAlertProvider;
