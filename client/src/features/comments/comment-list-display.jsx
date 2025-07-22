import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { SocketContext } from "../sockets/socket-context";
import { UserContext } from '../user/context/user-context';
import { useComments } from "./use-comments-hook";
import handleSendComment from './create-comment';
import handleDeleteComment from './comment-delete';
import handleCommentLike from './comment-like';

function CommentListDisplay({postId}) {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(UserContext);
    const { data, error, isLoading } = useComments(getAccessTokenSilently, postId, guest, guestInit);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(-5);
    const [awaitResponseId, setAwaitResponseId] = useState(null);

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
        if(data) {
            const sortedComments = data.post.comments.sort((a, b) => new Date(a.date_created) - new Date(b.date_created))
            setComments(sortedComments);
        }
    }, [data]);

    // Listens for new comments
    // No need to set location as a dependency, this event listener will mount when the user opens the comments
    useEffect(() => {
        socket.on('comment', (commentData) => {
            if(commentData.post._id === postId) {
                setComments((prevComments) => {
                    let updatedComments = [...prevComments, commentData];
                    return updatedComments.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
                } );
            }              
        });

        return () => {
            socket.off('comment');
        }
    }, []);

    // Listens for edited (liked) comments
    useEffect(() => {
        socket.on('editComment', commentData => {
            setComments((prevComments) => {
                // Filter out old comment
                let updatedComments = prevComments.filter(prevComment => prevComment._id !== commentData._id);
                // Add updated comment
                updatedComments = [...updatedComments, commentData];

                // Allow user to like or unlike post again
                setAwaitResponseId(null);

                // Return sorted comments
                return updatedComments.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
            })
        })

        return () => {
            socket.off('editComment');
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

    const sendComment = async (event) =>
        await handleSendComment(event, socket, setComment, currentUser.userId, postId, comment);

    const deleteComment = async (event, commentId) => {
        await handleDeleteComment(event, socket, commentId, postId);
        setDeleteCommentId(null);
    }

    const handleLike = async (commentId, likeUnlike) => {
        setAwaitResponseId(commentId);
        await handleCommentLike(socket, currentUser.userId, postId, commentId, likeUnlike);
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
                <textarea 
                className='comment-textarea'
                row='4'
                cols='50'
                maxLength={100}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />
                <button className='comment-submit-button' type='submit'>Send</button>
            </form>
            {comments && comments.slice(numItems).map((comment, index) => (
                <div key={index}>
                    <div className='comment-container'>
                        <div className='comment-options-info'>
                        {comment.owner.userId !== currentUser.userId ? null :
                        !deleteCommentId ?
                            <div className='comment-options'>
                                <button className='delete-comment-button' onClick={() => setDeleteCommentId(comment._id)}>🗑️</button>
                            </div> : null }
                        <p className='comment-info'>{comment.comment}</p>
                        </div>
                        <div className='comment-middle-row'>
                            <p className='comment-owner'><Link to={`/user/${comment.owner._id}`}>{comment.owner.username}</Link></p>
                            <p className='comment-date'>{new Date(comment.date_created).toLocaleString()}</p>
                            <div className='comment-likes-container'>
                                {awaitResponseId && awaitResponseId === comment._id ? null : comment.likes.map(user => user.userId).includes(currentUser.userId) ?
                                <button className='unlike-button' onClick={() => handleLike(comment._id, 'unlike')}>👎</button> : 
                                <button className='like-button' onClick={() => handleLike(comment._id, 'like')}>👍</button>
                                }
                                <p>Likes: {comment.likes.length}</p>
                            </div>
                        </div>
                        <div className={`delete-comment-form ${deleteCommentId === comment._id ? 'active' : ''}`}>
                            <button onClick={(event) => deleteComment(event, comment._id)}>Confirm Delete</button>
                            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CommentListDisplay;