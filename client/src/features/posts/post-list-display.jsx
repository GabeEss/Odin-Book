import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import {useParams} from 'react-router-dom';
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { usePosts } from "./use-posts-hook";
import handleSendPost from './create-post';
import handleDeletePost from './post-delete';
import handleEditPost from './post-edit';
import CommentListDisplay from '../comments/comment-list-display';

const socket = io(`${import.meta.env.VITE_API_URL}`);

function PostListDisplay() {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {id} = useParams();
    const { data, error, isLoading } = usePosts(getAccessTokenSilently, id, guest, guestInit);
    const [post, setPost] = useState('');
    const [edit, setEdit] = useState('');
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(-5);
    const [loadComments, setLoadComments] = useState(true);
    const [deletePostId, setDeletePostId] = useState(null);
    const [editPostId, setEditPostId] = useState(null);

    // Handle scrolling down to render more posts
    const handleScroll = (e) => {
        const {scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight && !rendering && numItems < posts.length) {
          setIsRendering(true);
          setTimeout(() => {
              setNumItems(prevNumItems => prevNumItems + 5);
              setIsRendering(false);
          }, 1000);
      }
    };

    // Set up user for socket, handle user joining and leaving
    // Handle user joining and leaving the posts chat room
    useEffect(() => {
      if(!currentUser || !id) return;

      socket.emit('userJoined', currentUser);
      socket.emit('userJoinsPostedTo', id);

      return () => {
          socket.emit('userLeft', currentUser);
          socket.emit('userLeavesPostedTo', id);
          socket.off('post');
      }
    }, [currentUser, id]);

    // Fetches previous posts
    useEffect(() => {
        if(data) {
          const sortedPosts = [...data.posts].sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
          setPosts(sortedPosts);
        }
    }, [data]);

    // Listens for new posts
    useEffect(() => {
        socket.on('post', (postData) => {
          setPosts((prevPosts) => {
            const newPosts = [...prevPosts, postData];
            return newPosts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
          });
        });

        return () => {
            socket.off('post');
        }
    }, []);

    // Listens for deleted posts
    useEffect(() => {
        socket.on('deletePost', (deletedPostId) => {
            setPosts((prevPosts) => prevPosts.filter(post => post._id !== deletedPostId));
        });

        return () => {
            socket.off('deletePost');
        }
      }, []);

    // Listens for updated posts
    useEffect(() => {
      socket.on('editPost', (editedPost) => {
        setPosts((prevPosts) => {
          // Filter out old post
          let updatedPosts = prevPosts.filter(post => post._id !== editedPost._id);
          // Add updated post
          updatedPosts = [...updatedPosts, editedPost];
          // Return sorted posts
          return updatedPosts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        })
      })

      return () => {
        socket.off('editPost');
      }
    }, []);

    // Initializes current user
    useEffect(() => {
        if(guestInit) setCurrentUser(guest);
        else setCurrentUser(user.sub);
    }, [user.sub]);

    const sendPost = (event) =>
      handleSendPost(event, socket, setPost, currentUser, id, post);

    const deletePost = async (event, postId) => {
      await handleDeletePost(event, socket, postId, id);
      setDeletePostId(null);
    }

    const editPost = async (event, postId) => {
      // id is the page id
      await handleEditPost(event, socket, setEdit, id, postId, edit);
      setEditPostId(null);
    }

    const handleCancel = () => {
      setEdit('');
      setDeletePostId(null);
      setEditPostId(null);
    }
      
    const handleComments = () => {
      setLoadComments(true);
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error occurred: {error.message}</div>;
    }

  return (
    <div className={'posts-container'} onScroll={handleScroll}>
      <form onSubmit={sendPost}>
        <input
          type="text"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button type="submit">Post</button>
      </form>
      {posts.slice(numItems).map((post, index) => (
                <div key={index}>
                    <div className='post-container'>
                        <p className='post-info'>{post.post}</p>
                        <p className='post-owner'>Posted by {post.owner.username}</p>
                        <p className='post-date'>Posted on {post.date_created}</p>
                        <div className='post-likes-container'>
                          <button className='post-likes-button'>Likes</button>
                          <p className='post-likes-number'>{post.likes.length}</p>
                        </div>
                        {post.owner.userId !== currentUser ? null :
                        !deletePostId && !editPostId ? 
                          <div className='post-options'>
                              <button onClick={() => setEditPostId(post._id)}>Edit Post</button>
                              <button onClick={() => setDeletePostId(post._id)}>Delete Post</button>
                          </div> : editPostId === post._id ? 
                          <form onSubmit={(event) => editPost(event, post._id)}>
                            <label>
                              Update Post:
                              <input 
                              type='text'
                              placeholder={post.post}
                              value={edit}
                              onChange={(e) => setEdit(e.target.value)}
                              />
                            </label>
                            <button className='edit-post-button' type='submit'>Submit Update</button>
                            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                          </form> :
                          deletePostId === post._id ? 
                          <div>
                            <button onClick={(event) => deletePost(event, post._id)}>Confirm Delete</button>
                            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                          </div> :
                          null }
                        {!loadComments ? 
                          <button onClick={handleComments}>Comments...</button> :
                          <CommentListDisplay postId={post._id}/>}
                    </div>
                </div>
        ))}
    </div>
  );
}

export default PostListDisplay;