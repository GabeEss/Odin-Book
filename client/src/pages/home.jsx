import { useAuth0 } from "@auth0/auth0-react";
import ReactModal from 'react-modal';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import InfoDisplay from "../features/user/info-display";

function HomePage () {
    const {
        logout,
        isAuthenticated,
    } = useAuth0();
    const {guestInit, setGuestInit} = useContext(GuestInitializeContext);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false); // show signup prompt
    
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
        <ReactModal
        isOpen={showSignupPrompt}
        onRequestClose={() => setShowSignupPrompt(false)}
        >
        <h2>User Update Prompt</h2>
        <p>Some of your information is not up to date. Would you like to update your information?</p>
        <button onClick={() => {
            setShowSignupPrompt(false);
            nav('/signup');
        }}>Yes</button>
        <button onClick={() => setShowSignupPrompt(false)}>No, thanks</button>
        </ReactModal>
        <h1>Home Page</h1>
        { guestInit ? <p>Guest user initialized</p> : null}
        { isAuthenticated || guestInit ? 
        <div>
            <div className="home-page page">
            <div className="header">
                <div className="header-dropdown">
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
                    <InfoDisplay setShowSignupPrompt={setShowSignupPrompt}/>
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