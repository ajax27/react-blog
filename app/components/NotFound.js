import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <Page title='Not Found'>
      <div className='text-center'>
        <h2>Oh No! We cannot find that page.</h2>
        <p className='lead text muted'>
          You can go back to the <Link to='/'>Home Page</Link> and have a fresh
          start
        </p>
      </div>
    </Page>
  )
}

export default NotFound
