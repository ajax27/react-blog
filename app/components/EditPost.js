import React, { useEffect, useContext } from "react"
import { useParams, Link, withRouter } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import Page from "./Page"
import LoadingIcon from "./LoadingIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"

const EditPost = (props) => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  }
  const myReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.value = action.value
        draft.title.hasErrors = false
        return
      case "bodyChange":
        draft.body.value = action.value
        draft.body.hasErrors = false
        return
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestCompleted":
        draft.isSaving = false
        return
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "A Title is required!"
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "Content for the body is required!"
        }
        return
      case "notFound":
        draft.notFound = true
        return
      default:
        return draft
    }
  }

  const [state, dispatch] = useImmerReducer(myReducer, initialState)

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: myRequest.token,
        })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username !== response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to edit this post!",
            })
            props.history.push("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (error) {
        console.log("Problem fetching posts")
      }
    }
    fetchPost()
    return () => {
      myRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const myRequest = Axios.CancelToken.source()
      async function fetchPost() {
        try {
          await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: myRequest.token,
            }
          )
          dispatch({ type: "saveRequestCompleted" })
          appDispatch({
            type: "flashMessage",
            value: "Post successfully updated",
          })
        } catch (error) {
          console.log("Problem fetching posts")
        }
      }
      fetchPost()
      return () => {
        myRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title='...'>
        <LoadingIcon />
      </Page>
    )

  return (
    <Page title='Edit Post'>
      <Link to={`/post/${state.id}`} className='small p-2 font-weight-bold'>
        &laquo; Back to post permalink
      </Link>
      <form className='mt-3' onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='post-title' className='text-muted mb-1'>
            <small>Title</small>
          </label>
          <input
            value={state.title.value}
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            autoFocus
            name='title'
            id='post-title'
            className='form-control form-control-lg form-control-title'
            type='text'
            placeholder=''
            autoComplete='off'
          />
          {state.title.hasErrors && (
            <div className='alert alert-danger small liveValidateMessage'>
              {state.title.message}
            </div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='post-body' className='text-muted mb-1 d-block'>
            <small>Body Content</small>
          </label>
          <textarea
            value={state.body.value}
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            name='body'
            id='post-body'
            className='body-content tall-textarea form-control'
            type='text'
          />
          {state.body.hasErrors && (
            <div className='alert alert-danger small liveValidateMessage'>
              {state.body.message}
            </div>
          )}
        </div>

        <button className='btn btn-primary' disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Update Post"}
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
