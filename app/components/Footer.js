import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
  const date = new Date().getFullYear()
  return (
    <>
      <footer className='border-top text-center small text-muted py-3'>
        <p>
          <Link to='/' className='mx-1'>
            Home
          </Link>{" "}
          |
          <Link className='mx-1' to='/about'>
            About Us
          </Link>{" "}
          |
          <Link className='mx-1' to='/terms'>
            Terms
          </Link>
        </p>
        <p className='m-0'>
          Copyright &copy; 2016 - {date}{" "}
          <Link to='#' className='text-muted'>
            www.ajax27.com.
          </Link>{" "}
          All rights reserved.
        </p>
      </footer>
    </>
  )
}

export default Footer
