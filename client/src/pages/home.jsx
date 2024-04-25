import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import SearchbarComponent from "../features/searchbar/searchbar-component";

function HomePage () {
    const {
        logout,
        isAuthenticated,
    } = useAuth0();
    const {guestInit, setGuestInit} = useContext(GuestInitializeContext);
    
    const nav = useNavigate();

    const handleLogout = () => {
        if(isAuthenticated) {
            logout({ returnTo: window.location.origin });
        }

        if(guestInit) {
            setGuestInit(false);
            nav('/');
        }
    }
    
    return(
    <div className="home-page page">
        <h1>Home Page</h1>
        { guestInit ? <p>Guest user initialized</p> : null}
        { isAuthenticated || guestInit ? 
        <div>
            <div className="home-page page">
            <div className="header">
                <SearchbarComponent/>
                <div className="header-dropdown">
                    <button className="friends-nav">Friends</button>
                    <button className="events-nav">Events</button>
                    <button className="notifications-nav">Notifications</button>
                    <div className="dropdown-content">
                        <button className='logout-nav' onClick={handleLogout}>
                            Log out
                        </button>
                        <button className='signup-nav' onClick={() => nav('/signup')}>Update User</button>
                    </div>
                </div>
            </div>
            <div className="sidebar-left sidebar">
                <div className="sidebar-content">
                </div>
            </div>
            <div className="main-component"></div>
            <div className="sidebar-right sidebar"></div>
        </div>
        </div>
         : null
        }
    </div>
    )
}

export default HomePage;