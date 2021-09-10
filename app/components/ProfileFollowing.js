import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingIcon from "./LoadingIcon"

const ProfileFollowing = () => {
  const { username } = useParams()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/following`, {
          cancelToken: myRequest.token,
        })
        setPosts(response.data)
        setLoading(false)
      } catch (error) {
        console.log("Problem fetching posts")
      }
    }
    fetchPosts()
    return () => {
      myRequest.cancel()
    }
  }, [username])

  if (loading) return <LoadingIcon />

  return (
    <div className='list-group'>
      {posts.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className='list-group-item list-group-item-action'>
            <img className='avatar-tiny' src={follower.avatar} />{" "}
            {follower.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollowing
