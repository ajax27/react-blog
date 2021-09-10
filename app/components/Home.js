import React, { useContext, useEffect } from "react"
import { useImmer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"
import LoadingIcon from "./LoadingIcon"
import Page from "./Page"
import Post from "./Post"

const Home = () => {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    loading: true,
    feed: [],
  })

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.post(`/getHomeFeed`, {
          token: appState.user.token,
          cancelToken: myRequest.token,
        })
        setState((draft) => {
          draft.loading = false
          draft.feed = response.data
        })
      } catch (error) {
        console.log("error", error.response.data)
      }
    }
    fetchData()
    return () => {
      myRequest.cancel()
    }
  }, [])

  if (state.loading) {
    return <LoadingIcon />
  }

  const nameDisplay = appState.user.username

  return (
    <Page title='Your Feed'>
      {state.feed.length > 0 && (
        <>
          <h2 className='text-center mb-4'>The Latest From Those You Follow</h2>
          <div className='list-group'>
            {state.feed.map((post) => {
              return <Post key={post._id} post={post} />
            })}
          </div>
        </>
      )}
      {state.feed.length === 0 && (
        <>
          <h2 className='text-center'>
            Hello{" "}
            <strong>
              {nameDisplay[0].toUpperCase() + nameDisplay.substring(1)}
            </strong>
            , your feed is empty.
          </h2>
          <p className='lead text-muted text-center'>
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  )
}

export default Home
