import React, { useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

const LoggedIn = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const handleLogOut = () => {
    appDispatch({ type: "logout" })
    appDispatch({
      type: "flashMessage",
      value: "You have successfully Logged Out",
    })
  }

  const handleSearchIcon = (e) => {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className='flex-row my-3 my-md-0'>
      <a
        href='#'
        data-for='search'
        data-tip='SEARCH'
        data-background-color='#00c7ff'
        onClick={handleSearchIcon}
        className='text-black mr-2 header-search-icon'>
        <i className='fas fa-search'></i>
      </a>
      <ReactTooltip place='bottom' id='search' className='custom-tooltip' />{" "}
      <span
        onClick={() => appDispatch({ type: "toggleChat" })}
        data-for='chat'
        data-tip='CHAT'
        data-background-color='#00c7ff'
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }>
        <i className='fas fa-comment'></i>
        {appState.unreadChatCount ? (
          <span className='chat-count-badge text-white'>
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place='bottom' id='chat' className='custom-tooltip' />{" "}
      <Link
        to={`/profile/${appState.user.username}`}
        data-for='profile'
        data-tip='PROFILE'
        data-background-color='#00c7ff'
        className='mr-2'>
        <img className='small-header-avatar' src={appState.user.avatar} />
      </Link>
      <ReactTooltip place='bottom' id='profile' className='custom-tooltip' />{" "}
      <Link className='btn btn-sm btn-success mr-2' to='/create-post'>
        Create Post
      </Link>{" "}
      <button onClick={handleLogOut} className='btn btn-sm btn-secondary'>
        Sign Out
      </button>
    </div>
  )
}

export default LoggedIn
