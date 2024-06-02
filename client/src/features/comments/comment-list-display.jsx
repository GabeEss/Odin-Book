import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { useComments } from "./use-comments-hook";
import handleSendComment from './create-comment';
import handleDeleteComment from './comment-delete';

const socket = io(`${import.meta.env.VITE_API_URL}`);

function CommentListDisplay({postId}) {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const { data, error, isLoading } = useComments(getAccessTokenSilently, postId, guest, guestInit);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(-5);

    // Handle scrolling down to render more comments
    const handleScroll = (e) => {
        const {scrollTop, clientHeight, scrollHeight} = e.target;
        if(scrollTop + clientHeight >= scrollHeight && !rendering && numItems < comments.length) {
            setIsRendering(true);
            setTimeout(() => {
                setNumItems(prevNumItems => prevNumItems + 5);
                setIsRendering(false);
            }, 1000);
        }
    }

    // User joins a specific post chatroom to listen for comments
    // User leaves chatroom on disconnect
    useEffect(() => {
        if(!currentUser || !postId) return;
        socket.emit('userJoinsPost', postId)
        return () => {
            socket.emit('userLeavesPost', postId);
            socket.off('comment');
        }

    }, [currentUser, postId]);

    // Fetch past comments
    useEffect(() => {
        if(data)
            setComments(data.post.comments);
    }, [data]);

    // Listens for new comments
    useEffect(() => {
        socket.on('comment', (commentData) => {
            if(commentData.post._id === postId) {
                setComments((prevComments) => [...prevComments, commentData]);
            }              
        });

        return () => {
            socket.off('comment');
        }
    }, []);

    // Listens for deleted comments
    useEffect(() => {
        socket.on('deleteComment', (commentData) => {
            if(commentData.post === postId) {
                setComments((prevComments) => prevComments.filter(comment => comment._id !== commentData._id));
            }            
        });

        return () => {
            socket.off('deleteComment');
        }
    }, []);

    // Initializes current user
    useEffect(() => {
        if(guestInit) setCurrentUser(guest);
        else setCurrentUser(user.sub);
    }, [user.sub]);

    const sendComment = (event) =>
        handleSendComment(event, socket, setComment, currentUser, postId, comment);

    const deleteComment = async (event, commentId) => {
        await handleDeleteComment(event, socket, commentId, postId);
        setDeleteCommentId(null);
    }

    const handleCancel = () => {
        setDeleteCommentId(null);
    }

    if(isLoading) return <div>Loading...</div>

    if (error) {
        return <div>An error occurred: {error.message}</div>;
    }

    return(
        <div className='comments-container' onScroll={handleScroll}>
            <form onSubmit={sendComment}>
                <input
                 type='text'
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 placeholder='Write a comment...'
                />
                <button type='submit'>Send</button>
            </form>
            {comments && comments.slice(numItems).map((comment, index) => (
                <div key={index}>
                    <div className='comment-container'>
                        <p className='comment-info'>{comment.comment}</p>
                        <p className='comment-owner'>Posted by {comment.owner.username}</p>
                        <p className='comment-date'>Posted on {comment.date_created}</p>
                        <div className='comment-likes-container'>
                            <button className='comment-likes-button'>Likes</button>
                            <p className='comment-likes-number'>{comment.likes.length}</p>
                        </div>
                        {comment.owner.userId !== currentUser ? null :
                        !deleteCommentId ?
                            <div className='comment-options'>
                                <button onClick={() => setDeleteCommentId(comment._id)}>Delete Comment</button>
                            </div>                            
                        : deleteCommentId === comment._id ?
                        <div>
                            <button onClick={(event) => deleteComment(event, comment._id)}>Confirm Delete</button>
                            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                        </div> : null
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CommentListDisplay;