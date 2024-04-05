import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

function HomePage () {
    const {
        logout,
        isAuthenticated,
    } = useAuth0();

    const nav = useNavigate();
    
    return(
    <div className="home-page page">
        <h1>Home Page</h1>
        <p>Welcome to the home page!</p>
        { isAuthenticated ? 
        <div>
            
            <div className="home-page page">
            <div className="header">
                <div className="header-dropdown">
                    <div className="dropdown-content">
                    <button className='logout-nav' onClick={() => logout({ returnTo: window.location.origin })}>
                        Log out
                    </button>
                    <button className='login-nav' onClick={() => nav('/')}>Back to login</button>
                    <button className='signup-nav' onClick={() => nav('/signup')}>Sign Up</button>
                    </div>
                </div>
            </div>
            <div className="sidebar-left sidebar"></div>
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