import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../auth/make-authenticated-request";
import { useAuth0 } from "@auth0/auth0-react";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";

function FeedDisplayList() {
    const {getAccessTokenSilently} = useAuth0();
    const [newsItems, setNewsItems] = useState([]);
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(-5);

    const nav = useNavigate();

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
                setNewsItems(response.data.posts);
            } else {
                console.log(response.data.message);
            }
        }

        fetchFeed();
    }, []);

    const handleItemClick = (item) => {
        if(item.posted_to.model === "User") {
            nav(`/user/${item.posted_to.id}`);
        } else if (item.posted_to.model === "Event") {
            nav(`/event/${item.posted_to.id}`);
        }
    }

    return(
        <div className="newsfeed-container" onScroll={handleScroll}>
            {newsItems.length > 0 ? 
                newsItems.slice(numItems).map((item, index) => (
                    <div key={index}
                        role='button'
                        tabIndex="0"
                        onClick={() => handleItemClick(item)}
                    >   
                        <div className="post-container">
                            <p className='post-info'>{item.post}</p>
                            <p className='post-owner'>Posted by {item.owner.username}</p>
                            <p className='post-date'>Posted on {item.date_created}</p>
                        </div>
                    </div>
                )) : null }
        </div>
    )
}

export default FeedDisplayList;