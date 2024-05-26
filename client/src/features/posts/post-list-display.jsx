import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import {useParams} from 'react-router-dom';
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { usePosts } from "./use-posts-hook";
import handleSendPost from './create-post';

const socket = io(`${import.meta.env.VITE_API_URL}`);

function PostListDisplay() {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {id} = useParams();
    const { data, error, isLoading } = usePosts(getAccessTokenSilently, id, guest, guestInit);
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(-5);

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
      if(!currentUser) return;
      if(!id) return;

      socket.emit('userJoined', currentUser);
      socket.emit('userJoinsPostedTo', id);

      return () => {
          socket.emit('userLeft', currentUser);
          socket.emit('userLeavesPostedTo', id);
          socket.off('message');
      }
    }, [currentUser, id]);

    // Fetches previous posts
    useEffect(() => {
        if(data) {
            setPosts(data.posts);
        }
    }, [data]);

    // Listens for new posts
    useEffect(() => {
        socket.on('post', (postData) => {
            setPosts((prevPosts) => [...prevPosts, postData])
        });

        return () => {
            socket.off('post');
        }
    }, []);

    // Initializes current user
    useEffect(() => {
        if(guestInit) setCurrentUser(guest);
        else setCurrentUser(user.sub);
    }, [user.sub]);

    const sendPost = (event) =>
      handleSendPost(event, socket, setPost, currentUser, id, post);

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
                    <div>
                        <p>{post.post}</p>
                        <p>Posted by {post.owner.username}</p>
                        <p>Posted on {post.date_created}</p>
                        <div>
                          <button>Likes</button>
                          <p>{post.likes.length}</p>
                        </div>
                        <p>Comments go here.</p>
                    </div>
                </div>
        ))}
    </div>
  );
}

export default PostListDisplay;