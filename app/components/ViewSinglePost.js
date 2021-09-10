import React, { useState, useEffect, useContext } from "react"
import { useParams, Link, withRouter } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import Axios from "axios"
import Page from "./Page"
import LoadingIcon from "./LoadingIcon"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

const ViewSinglePost = (props) => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: myRequest.token,
        })
        setPost(response.data)
        setLoading(false)
      } catch (error) {
        console.log("Problem fetching posts")
      }
    }
    fetchPost()
    return () => {
      myRequest.cancel()
    }
  }, [id])

  if (!loading && !post) {
    return <NotFound />
  }

  if (loading)
    return (
      <Page title='...'>
        <LoadingIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username
    }
    return false
  }

  const deleteHandler = async () => {
    const areYouSure = window.confirm(
      "Are you sure, this will be permanently deleted!"
    )
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        })
        if (response.data === "Success") {
          // display flash message
          appDispatch({
            type: "flashMessage",
            value: "Post successfully deleted!",
          })
          // redirect to current users profile
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log("There was a problem", error.response.data)
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link
              to={`/post/${post._id}/edit`}
              data-tip='EDIT'
              data-for='edit'
              data-background-color='#00c7ff'
              className='text-primary mr-2'>
              <i className='fas fa-edit'></i>
            </Link>
            <ReactTooltip id='edit' className='custom-tooltip' />{" "}
            <Link
              to='#'
              onClick={deleteHandler}
              data-tip='DELETE'
              data-for='delete'
              data-background-color='#f76060'
              className='delete-post-button text-danger'>
              <i className='fas fa-trash'></i>
            </Link>
            <ReactTooltip id='delete' className='custom-tooltip' />
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className='body-content'>
        <ReactMarkdown children={post.body} disallowedElements={["html"]} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
