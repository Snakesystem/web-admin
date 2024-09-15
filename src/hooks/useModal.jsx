import { createContext, useContext, useState } from "react";
import { Modal } from "react-bootstrap";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({});

  const openModal = (id, content) => setModals(prev => ({ ...prev, [id]: { show: true, content } }));
  const closeModal = (id) => setModals(prev => ({ ...prev, [id]: { ...prev[id], show: false } }));

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

export const ModalContentProvider = ({ id, title, size }) => {
    const { modals, closeModal } = useModal();
    const modal = modals[id];
  
    if (!modal || !modal.show) return null;
  
    return (
      <Modal centered backdrop="static" show={modal.show} onHide={() => closeModal(id)} className={`modal modal-${size} fade modal-dialog-scrollable z-index-1`}>
        <div className="modal-content p-2">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" onClick={() => closeModal(id)} className="btn-close" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {modal.content}
          </div>
        </div>
      </Modal>
    );
  };