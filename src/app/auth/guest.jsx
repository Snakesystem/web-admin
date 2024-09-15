import moment from "moment";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { appRoutes } from "../App";

export default function GustPage() {

  const user = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : {};
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove('token', { path: '' });
    navigate(appRoutes.LOGIN);
    localStorage.removeItem('session');
  }
  
  return (
    <section className="container guest-page"> 
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="card w-50 text-center p-5 shadow rounded">
          <div className="card-header">
            <h2>Selamat data di Aplikasi H2H Bank Monitoring</h2>
          </div>
          <div className="card-body">
          <div className="col-md-12 mb-3 d-flex justify-content-center align-items-center">
            <i className="bi bi-person-fill border py-3 px-5" style={{ fontSize: "4rem" }}></i>
          </div>
            <h4 className="card-title">Hello {user?.username}</h4>
            <p className="card-text">You are a <span className="fw-bold">guest</span>, here is your data.</p>
            <form action="">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor={user.userid} className="form-label">User ID</label>
                    <input type="text" className="form-control text-center" id={user.userid} value={user?.userid} disabled />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={user.roles} className="form-label">Job Title</label>
                    <input type="text" className="form-control text-center" id={user.roles} value={user?.roles} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor={user.username} className="form-label">User Name</label>
                    <input type="text" className="form-control text-center" id={user.username} value={user?.username} disabled />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={user.expired} className="form-label">Expired User</label>
                    <input type="text" className="form-control text-center" id={user.expired} value={moment(user?.expired).format("DD MMMM YYYY")} disabled />
                  </div>
                </div>
              </div>
            </form>
            <button onClick={() => logout()} className="btn btn-primary w-100">Logout</button>
          </div>
          <div className="card-footer text-muted">
            {JSON.stringify(new Date().toUTCString())}
          </div>
        </div>
      </div>
    </section>
  )
}
