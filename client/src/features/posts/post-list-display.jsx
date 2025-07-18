import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import {useParams, Link} from 'react-router-dom';
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { SocketContext } from "../sockets/socket-context";
import { usePosts } from "./use-posts-hook";
import handleSendPost from './create-post';
import handleDeletePost from './post-delete';
import handleEditPost from './post-edit';
import handlePostLike from './post-like';
import CommentListDisplay from '../comments/comment-list-display';

function PostListDisplay({location}) {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {socket} = useContext(SocketContext);
    const {id} = useParams();
    const { data, error, isLoading, refetch } = usePosts(getAccessTokenSilently, id, guest, guestInit);
    const [post, setPost] = useState('');
    const [edit, setEdit] = useState('');
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(-5);
    const [awaitResponse, setAwaitResponse] = useState(false);

    const [deletePostId, setDeletePostId] = useState(null);
    const [editPostId, setEditPostId] = useState(null);
    const [loadCommentsId, setLoadCommentsId] = useState(null);
    
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
    }, [currentUser, id, location]);

    // Fetches previous posts
    useEffect(() => {
        if(data) {
          const sortedPosts = [...data.posts].sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
          setPosts(sortedPosts);
        }
    }, [data]);

    // Refetch posts on location change
    useEffect(() => {
      refetch();
    }, [location])

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
    }, [location]);

    // Listens for deleted posts
    useEffect(() => {
        socket.on('deletePost', (deletedPostId) => {
            setPosts((prevPosts) => prevPosts.filter(post => post._id !== deletedPostId));
        });

        return () => {
            socket.off('deletePost');
        }
      }, [location]);

    // Listens for updated posts
    useEffect(() => {
      socket.on('editPost', (editedPost) => {
        setPosts((prevPosts) => {
          // Filter out old post
          let updatedPosts = prevPosts.filter(post => post._id !== editedPost._id);
          // Add updated post
          updatedPosts = [...updatedPosts, editedPost];

          // Allow user to like or unlike again
          setAwaitResponse(false);

          // Return sorted posts
          return updatedPosts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        })
      })

      return () => {
        socket.off('editPost');
      }
    }, [location]);

    // Initializes current user
    useEffect(() => {
        if(guestInit) setCurrentUser(guest);
        else setCurrentUser(user.sub);
    }, [user]);

    const sendPost = async (event) =>
      await handleSendPost(event, socket, setPost, currentUser, id, post);

    const deletePost = async (event, postId) => {
      await handleDeletePost(event, socket, postId, id);
      setDeletePostId(null);
    }

    const editPost = async (event, postId) => {
      // id is the page id
      await handleEditPost(event, socket, setEdit, id, postId, edit);
      setEditPostId(null);
    }

    const handleLike = async (postId, likeUnlike) => {
      setAwaitResponse(true);
      await handlePostLike(socket, currentUser, id, postId, likeUnlike);
    }

    const handleCancel = () => {
      setEdit('');
      setDeletePostId(null);
      setEditPostId(null);
    }
      
    const handleComments = (postId) => {
      setLoadCommentsId(postId);
    }

    if (isLoading) {
      return <div className='spinner'></div>;
    }

    if (error) {
        return <div>An error occurred: {error.message}</div>;
    }

  return (
    <div className={'posts-container'} onScroll={handleScroll}>
      <form className='post-submit-container' onSubmit={sendPost}>
        <textarea
          className='post-submit'
          rows="4"
          cols="50"
          maxLength={100}
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button className='post-submit-button' type="submit">Post</button>
      </form>
      {posts.slice(numItems).map((post, index) => (
                <div key={index}>
                    <div className='post-container'>
                      <div className='post-top-row'>
                      {post.owner.userId !== currentUser ? null :
                          !deletePostId && !editPostId ? 
                            <div className='post-options'>
                                <button className='edit-post' onClick={() => setEditPostId(post._id)}>✏️</button>
                                <button className='delete-post' onClick={() => setDeletePostId(post._id)}>🗑️</button>
                            </div> : null }
                        <p className='post-info'>{post.post}</p>
                        </div>
                        <div className='post-middle-row'>
                          <p className='post-owner'><Link to={`/user/${post.owner._id}`}>{post.owner.username}</Link></p>
                          <p className='post-date'>{new Date(post.date_created).toLocaleString()}</p>
                          <div className='post-likes-container'>                         
                            {awaitResponse ? null : post.likes.map(user => user.userId).includes(currentUser) ?
                              <button className='unlike-button' onClick={() => handleLike(post._id, 'unlike')}>👎</button> : 
                              <button className='like-button' onClick={() => handleLike(post._id, 'like')}>👍</button>
                            }
                            <p className='post-likes'>Likes: {post.likes.length}</p>
                          </div> 
                        </div>
                            <form 
                            className={`edit-post-form ${editPostId === post._id ? 'active' : ''}`}
                            onSubmit={(event) => editPost(event, post._id)}>
                                <textarea 
                                row='4'
                                cols='50'
                                maxLength={100}
                                placeholder={post.post}
                                value={edit}
                                onChange={(e) => setEdit(e.target.value)}
                                />
                              <button className='edit-post-button' type='submit'>Update</button>
                              <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                            </form> 
                            <div className={`delete-post-form ${deletePostId === post._id ? 'active' : ''}`}>
                              <button className='delete-post-button' onClick={(event) => deletePost(event, post._id)}>Confirm Delete</button>
                              <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                            </div>
                          <div className='post-comments-section'>
                          {loadCommentsId !== post._id ? 
                              <button onClick={() => handleComments(post._id)}>Comments...</button> :
                              <CommentListDisplay postId={post._id}/>}
                          </div>
                    </div>
                </div>
        ))}
    </div>
  );
}

export default PostListDisplay;