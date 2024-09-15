import { useState } from "react";
import { Carousel } from "react-bootstrap";
import { axiosInstance, useApi } from "../../hooks/useApi";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../App";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {

  const [userRequest, setUserRequest] = useState({});
  const { postRequest } = useApi();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const loginRequest = async () => {
    try {
      const result = await postRequest(`${axiosInstance.defaults.baseURL}/api/auth/login`, userRequest);
      if(result.result) {
        await Swal.fire({
          icon: 'success',
          title: 'Login Success',
        })
        await Cookies.set('token', result.cookie, { expires: 0.5 });
        if(result.isGuest) {
          navigate(appRoutes.GUEST);
          window.location.reload();
        } else {
          navigate(appRoutes.HOME);
          window.location.reload();
        }
        localStorage.setItem('session', JSON.stringify(result));
        setSession(result);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message,
        })
      }
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }
  }

  return (
    <main>
      <div className="fixed-top">
        <div className="container-fluid" style={{width: "100%", height: "100vh"}}>
          <div className="row">
            <div className="col-12 col-xl-4 mx-auto">
              <div className="card shadow-sm rounded-5 overflow-hidden form-login">
                <div className="card-header border-0 text-center">
                  <img src="/img/logo-mpc.png" className="img-fluid w-30" alt="Logo" />
                </div>
                <div className="card-body p-4 p-sm-5">
                  <h3 className="text-center fs-2 fw-bold card-title">Login</h3>
                  <p className="text-center fs-5 card-text mb-5">H2H Bank Monitoring</p>
                  <form className="form-body" onSubmit={(e) => {
                    e.preventDefault();
                    loginRequest();
                  }}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label
                          htmlFor="inputEmailUsername"
                          className="form-label"
                        >
                          Enter Username
                        </label>
                        <div className="ms-auto position-relative">
                          <div className="position-absolute top-50 translate-middle-y search-icon px-3">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <input
                            type="text"
                            onChange={(e) => setUserRequest({ ...userRequest, UserID: e.target.value })}
                            className="form-control radius-30 ps-5"
                            id="inputEmailUsername"
                            placeholder="Enter Username"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <label
                          htmlFor="inputChoosePassword"
                          className="form-label"
                        >
                          Enter Password
                        </label>
                        <div className="ms-auto position-relative">
                          <div className="position-absolute top-50 translate-middle-y search-icon px-3">
                            <i className="bi bi-lock-fill"></i>
                          </div>
                          <input
                            type="password"
                            onChange={(e) => setUserRequest({ ...userRequest, Password: e.target.value })}
                            className="form-control radius-30 ps-5"
                            id="inputChoosePassword"
                            placeholder="Enter Password"
                          />
                        </div>
                      </div>

                      <div className="col-12 mt-4">
                        <div className="d-grid">
                          <button className="btn btn-primary rounded" type="submit">
                            Sign In
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Carousel className="bg-carousel">
        <Carousel.Item>
          <img src="/img/bg/bg1.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg2.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg3.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg4.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg5.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg6.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg7.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/bg/bg8.png" alt="img-carousel" className="img-carousel" />
        </Carousel.Item>
      </Carousel>
    </main>
  )
}
