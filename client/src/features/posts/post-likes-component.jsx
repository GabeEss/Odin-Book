import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";

function PostLikesComponent({id, postLikes, currentUser}) {
    const {getAccessTokenSilently} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const [likes, setLikes] = useState(postLikes.length);
    const [userIds, setUserIds] = useState([]);
    const [awaitingResponse, setAwaitingResponse] = useState(false);


    useEffect(() => {
        if(postLikes.length !== 0) {
            setUserIds(postLikes.map(postLike => postLike.userId))
        }   
    }, []);

    const handleLike = async (likeUnlike) => {
        setAwaitingResponse(true);
        const response = await makeAuthenticatedRequest(
            getAccessTokenSilently,
            'put',
            `${import.meta.env.VITE_API_URL}/post/${id}/${likeUnlike}`,
            {id},
            guest,
            guestInit
        )
        if(response.data.success) {
            let newPostLikes = response.data.post.likes;
            if(newPostLikes) {
                if(likeUnlike === 'like') setLikes(likes + 1);
                if(likeUnlike === 'unlike') setLikes(likes - 1);
                if(newPostLikes.length !== 0) {
                    setUserIds(newPostLikes.map(postLike => postLike.userId));
                } else setUserIds([]);
            }
        } else {
            console.log("Response data returned false on post like.");
            console.log(response.message);
        }
        setAwaitingResponse(false);
    }

    return(
        <div className="post-likes-container">
            {awaitingResponse ? null : userIds && userIds.includes(currentUser) ? 
            <button className='post-likes-button unlike' onClick={() => handleLike("unlike")}>Unlike</button> : 
            <button className='post-likes-button like' onClick={() => handleLike("like")}>Like</button>}
            <p className='post-likes-number'>{likes}</p>
        </div>
    )
}

export default PostLikesComponent;