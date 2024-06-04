import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";

function CommentLikesComponent({id, commentLikes, currentUser}) {
    const {getAccessTokenSilently} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const [likes, setLikes] = useState(commentLikes.length);
    const [userIds, setUserIds] = useState([]);
    const [awaitingResponse, setAwaitingResponse] = useState(false);


    useEffect(() => {
        if(commentLikes.length !== 0) {
            setUserIds(commentLikes.map(commentLike => commentLike.userId))
        }   
    }, []);

    const handleLike = async (likeUnlike) => {
        setAwaitingResponse(true);
        const response = await makeAuthenticatedRequest(
            getAccessTokenSilently,
            'put',
            `${import.meta.env.VITE_API_URL}/comment/${id}/${likeUnlike}`,
            {id},
            guest,
            guestInit
        )
        if(response.data.success) {
            let newCommentLikes = response.data.comment.likes;
            if(newCommentLikes) {
                if(likeUnlike === 'like') setLikes(likes + 1);
                if(likeUnlike === 'unlike') setLikes(likes - 1);
                if(newCommentLikes.length !== 0) {
                    setUserIds(newCommentLikes.map(commentLike => commentLike.userId));
                } else setUserIds([]);
            }
        } else {
            console.log("Response data returned false on comment like.");
            console.log(response.message);
        }
        setAwaitingResponse(false);
    }


    return(
        <div className="comment-likes-container">
            {awaitingResponse ? null : userIds && userIds.includes(currentUser) ? 
            <button className='comment-likes-button unlike' onClick={() => handleLike("unlike")}>Unlike</button> : 
            <button className='comment-likes-button like' onClick={() => handleLike("like")}>Like</button>}
            <p className='comment-likes-number'>{likes}</p>
        </div>
    )
}

export default CommentLikesComponent;