import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingIcon from "./LoadingIcon"
import Post from "./Post"

const ProfilePosts = () => {
  const { username } = useParams()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
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
      {posts.map((post) => {
        return <Post noAuthor={true} key={post._id} post={post} />
      })}
    </div>
  )
}

export default ProfilePosts
