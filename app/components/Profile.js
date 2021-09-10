import React, { useContext, useEffect } from "react"
import { useImmer } from "use-immer"
import Axios from "axios"
import { useParams, NavLink, Switch, Route } from "react-router-dom"
import StateContext from "../StateContext"
import Page from "./Page"
import ProfilePosts from "./ProfilePosts"
import ProfileFollowers from "./ProfileFollowing"
import ProfileFollowing from "./ProfileFollowers"

const Profile = () => {
  const { username } = useParams()
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  })

  const appState = useContext(StateContext)
  const nameDisplay = state.profileData.profileUsername

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, {
          token: appState.user.token,
          cancelToken: myRequest.token,
        })
        setState((draft) => {
          draft.profileData = response.data
        })
      } catch (error) {
        console.log("error", error.response.data)
      }
    }
    fetchData()
    return () => {
      myRequest.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true
      })
      const myRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          await Axios.post(`/addFollow/${state.profileData.profileUsername}`, {
            token: appState.user.token,
            cancelToken: myRequest.token,
          })
          setState((draft) => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followingCount++
            draft.followActionLoading = false
          })
        } catch (error) {
          console.log("error", error.response.data)
        }
      }
      fetchData()
      return () => {
        myRequest.cancel()
      }
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true
      })
      const myRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
              cancelToken: myRequest.token,
            }
          )
          setState((draft) => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followingCount--
            draft.followActionLoading = false
          })
        } catch (error) {
          console.log("error", error.response.data)
        }
      }
      fetchData()
      return () => {
        myRequest.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])

  const startFollowing = () => {
    setState((draft) => {
      draft.startFollowingRequestCount++
    })
  }

  const stopFollowing = () => {
    setState((draft) => {
      draft.stopFollowingRequestCount++
    })
  }

  return (
    <Page
      title={
        !state.loggedIn
          ? `${
              nameDisplay[0].toUpperCase() + nameDisplay.substring(1)
            }'s Profile`
          : `Ajax27 Development`
      }>
      <h2>
        <img className='avatar-small' src={state.profileData.profileAvatar} />{" "}
        {nameDisplay[0].toUpperCase() + nameDisplay.substring(1)}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={startFollowing}
              className='btn btn-primary btn-sm ml-2'
              disabled={state.followActionLoading}>
              Follow <i className='fas fa-user-plus'></i>
            </button>
          )}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={stopFollowing}
              className='btn btn-danger btn-sm ml-2'
              disabled={state.followActionLoading}>
              UnFollow <i className='fas fa-user-times'></i>{" "}
            </button>
          )}
      </h2>

      <div className='profile-nav nav nav-tabs pt-2 mb-4'>
        <NavLink
          exact
          to={`/profile/${nameDisplay}`}
          className='nav-item nav-link'>
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className='nav-item nav-link'>
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className='nav-item nav-link'>
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route exact path='/profile/:username' component={ProfilePosts} />
        <Route
          path='/profile/:username/following'
          component={ProfileFollowers}
        />
        <Route
          path='/profile/:username/followers'
          component={ProfileFollowing}
        />
      </Switch>
    </Page>
  )
}

export default Profile
