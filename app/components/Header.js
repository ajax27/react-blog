import React, { useContext } from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"
import HeaderLogin from "./HeaderLogin"
import LoggedIn from "./LoggedIn"

const Header = () => {
  const appState = useContext(StateContext)

  return (
    <>
      <header
        style={{ backgroundColor: "#ffe500", objectFit: "contain" }}
        className='header-bar mb-3'>
        <div className='container d-flex flex-column flex-md-row align-items-center p-3'>
          <img
            src='https://res.cloudinary.com/ajax27/image/upload/v1630069109/logos/ajax27__Initial01_5.png'
            width='65'
            height='40'
            alt='Logo'
            className='d-flex align-start'
          />{" "}
          <h4 className='my-0 mr-md-auto ml-3 font-weight-normal'>
            <Link to='/' className='text-black app-name'>
              DevApp
            </Link>
          </h4>
          {appState.loggedIn ? <LoggedIn /> : <HeaderLogin />}
        </div>
      </header>
    </>
  )
}

export default Header
