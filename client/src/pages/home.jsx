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
            <button className='logout-button' onClick={() => logout({ returnTo: window.location.origin })}>
                Log out
            </button>
            <button className='login-button' onClick={() => nav('/')}>Back to login</button>
        </div>
         : null
        }
    </div>
    )
}

export default HomePage;