import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import HeaderComponent from "../features/header/header-component";
import FeedDisplayList from "../features/feed/feed-display-list";

function HomePage () {
    const {
        isAuthenticated,
    } = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    
    return(
    <div>
        { isAuthenticated || guestInit ? 
        <div className="home-page page">
            <HeaderComponent/>
            <div className="home-main">
                <h1 className="home-header">Your Feed</h1>
                { guestInit ? <p className="guest-init">Welcome Guest!</p> : null}
                <FeedDisplayList/>
            </div>
        </div>
         : null
        }
    </div>
    )
}

export default HomePage;