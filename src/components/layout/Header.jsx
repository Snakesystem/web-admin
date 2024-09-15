import { Link } from "react-router-dom"
import { ModalContentProvider, useModal } from "../../hooks/useModal"
import ModalProfile from "./ModalProfile";

export default function Header(props) {

  const { toggleSidebar } = props
  const { openModal } = useModal();
  const user = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : {};

  return (
    <header className={`header`}>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className='col-8'>
          <Link to="/">
            <img src="/img/logo-mpc.png" alt="logo s21" className='mx-1 logos21' style={{width: 150}}/>
          </Link>
          <button className='header-toggle' onClick={toggleSidebar}>
            <img className="svg" src="/svg/align-center-alt.svg" alt="toggle" style={{width: 20}}/>
          </button>
          <span className='nav-logo-name'>PT MICROPIRANTI COMPUTER</span>
        </div>
        <div className='col-4 bg-success'>
          <div className="text-end menu-profile d-flex justify-content-end align-items-center">
          <span className="fw-3">{user?.username}</span> 
              <div onClick={() =>openModal('profile', <ModalProfile />)} className="icon-profile p-1 cursor-pointer" > 
                <i className="bi bi-person fs-2"></i>
               </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContentProvider id="profile" size="md" title={`PROFILE USER : ${user?.username} `}/>
    </header>
  )
}
