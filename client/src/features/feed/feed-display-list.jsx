import { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../auth/make-authenticated-request";
import { useAuth0 } from "@auth0/auth0-react";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import {SocketContext} from '../sockets/socket-context';
import {UserContext} from '../user/context/user-context';
import handleSendPost from '../posts/create-post';
import { LoadingSpinnerContainer } from "../loading/loading-container";

function FeedDisplayList() {
    const {getAccessTokenSilently} = useAuth0();
    const [userItems, setUserItems] = useState([]);
    const [eventItems, setEventItems] = useState([]);
    const [refreshFeed, setRefreshFeed] = useState(false);
    const [post, setPost] = useState('');
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(UserContext);
    const [loadingWheel, setLoadingWheel] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/user/newsfeed`,
                {},
                guest,
                guestInit
            )
            if(response.data.success) {
                const eventItems = response.data.posts.filter((item) => item.posted_to.model === "Event");
                const sortedEvents = eventItems.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
                setEventItems(sortedEvents);

                const userItems = response.data.posts.filter((item) => item.posted_to.model === "User");
                const sortedUsers = userItems.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
                setUserItems(sortedUsers);

                setLoadingWheel(false);
            } else {
                console.log(response.data.message);
            }
        }

        fetchFeed();
    }, [refreshFeed]);

    const sendPost = async (event) => {
        await handleSendPost(event, socket, setPost, currentUser.userId, currentUser._id, post);
        setRefreshFeed(!refreshFeed);
    }

    // if(loadingWheel) return <LoadingSpinnerContainer/>;

    return(
        <div className="newsfeed-container">
            <div className="userfeed-container">
                <h2 className="feed-title">User Posts</h2>
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
                    <button className='post-submit-button' type="submit">
                        Post
                    </button>
                </form>
                {userItems.length > 0 ?
                    userItems.map((item, index) => (
                        <div className="feed-item-container" key={index}>
                            <div className="item-container">
                                <h4><Link className="item-header-link" to={`/user/${item.posted_to.id._id}`}>Posted on {item.posted_to.id.username}'s Page</Link></h4>
                                <div className="item-not-header">
                                    <p className='item-info'>{item.post}</p>
                                    <div className="item-owner-date">
                                        <p className='item-owner'><Link to={`/user/${item.owner._id}`}>{item.owner.username}</Link></p>
                                        <p className='item-date'>{new Date(item.date_created).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : null }
            </div>
            <div className="eventfeed-container">
                <h2 className="feed-title">Event Posts</h2>
                {eventItems.length > 0 ?
                    eventItems.map((item, index) => (
                        <div key={index}>
                            <div className="item-container">
                                <h4><Link className="item-header-link" to={`/event/${item.posted_to.id._id}`}>Posted on {item.posted_to.id.event} Event</Link></h4>
                                <div className="item-not-header">
                                    <p className='item-info'>{item.post}</p>
                                    <div className="item-owner-date">
                                        <p className='item-owner'><Link to={`/user/${item.owner._id}`}>{item.owner.username}</Link></p>
                                        <p className='item-date'>{new Date(item.date_created).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <div className='item-container'>You haven't joined any events. Why not try joining the 'Welcome To Name Book' event?</div> }
            </div>
        </div>
    )
}

export default FeedDisplayList;