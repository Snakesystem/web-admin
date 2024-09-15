import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../app/App';
import moment from 'moment';

export default function ModalProfile() {


  const user = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : {};
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove('token', { path: '' });
    navigate(appRoutes.LOGIN);
    localStorage.removeItem('session');
  }

  return (
    <form action="">
      <div className="row">
        <div className="col-md-12 d-flex justify-content-center align-items-center">
          <i className="bi bi-person-fill border py-3 px-5" style={{ fontSize: "4rem" }}></i>
        </div>
        <div className="col-md-6">
          <div className="mb-3 text-center">
            <label htmlFor={user.userid} className="form-label">User ID</label>
            <input type="text" className="form-control text-center" id={user.userid} value={user?.userid} disabled />
          </div>
          <div className="mb-3 text-center">
            <label htmlFor={user.roles} className="form-label">Job Title</label>
            <input type="text" className="form-control text-center" id={user.roles} value={user?.roles} disabled />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3 text-center">
            <label htmlFor={user.username} className="form-label">User Name</label>
            <input type="text" className="form-control text-center" id={user.username} value={user?.username} disabled />
          </div>
          <div className="mb-3 text-center">
            <label htmlFor={user.expired} className="form-label">Expired User</label>
            <input type="text" className="form-control text-center" id={user.expired} value={moment(user?.expired).format("DD MMMM YYYY")} disabled />
          </div>
        </div>
      </div>
      <button onClick={() => logout()} className="btn btn-primary w-100">Logout</button>
    </form>
  )
}
