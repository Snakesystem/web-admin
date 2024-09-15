import { Outlet, useLocation, useParams } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { useState } from "react";
import { useMenu } from "../../context/menu";

export default function HomePage() {

    const { pathname } = useLocation()
    const { bankid } = useParams()
    const url = pathname.slice(1)
    const { menu } = useMenu()

    function removeSubstring(str, substring) {
        let regex = new RegExp(substring, 'g');
        return str.replace(regex, "");
    }

    const MenuTitle = menu?.find(item => item.MenuID === removeSubstring(url, bankid).split('/').join(''))

    const [show, setShow] = useState(true)

    const toggleSidebar = () => {
        setShow(!show)
    }

  return (
    <section className={`${show ? 'space-toggle' : ''}`}>
        <Header toggleSidebar={toggleSidebar}/>
        <Sidebar show={show}/>
        <div className="col-lg-12">
            <div className="card banner-feature new d-flex bg-white">
                {
                    MenuTitle &&
                    <div className="card-header border-0 bg-primary m-2 px-25 py-25">
                        <h3 className="card-title text-white">{MenuTitle.MenuHeader}</h3>
                    </div> 
                } 
                <div className="card-body px-25">
                    {
                    pathname === '/' ? <Home/> : <Outlet/>
                    }
                </div>
            </div>
        </div>
        <Footer/>
      </section>
  )
}


function Home() {
  return (
    <div className="row pt-2 mb-3">
        <div className="col-xl-6">
            <h1 className="banner-feature__heading color-dark fw-bold mb-4">Selamat Datang <span className=""></span>  !!! </h1>
                
                {/* <h3 className="banner-feature__heading color-dark fw-bold mb-4">
                    Selamat Datang di Aplikasi H2H Bank Monitoring 
                </h3> */}
                <p className="banner-feature__para color-dark fs-4">
                Aplikasi S21 H2H Bank Monitoring adalah sebuah platfrom yang bertujuan untuk memantau transaksi secara real time antara Bank dengan Danareksa Sekuritas
                </p>
        </div>
        <div className="col-xl-6">
            <div className="banner-feature__shape">
                <img src="/img/danial.png" alt="img" />
            </div>
        </div>
    </div>
  )
}
