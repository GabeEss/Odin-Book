import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import HeaderComponent from "../features/header/header-component";

function HomePage () {
    const {
        isAuthenticated,
    } = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    
    return(
    <div className="home-page page">
        <h1>Home Page</h1>
        { guestInit ? <p>Guest user initialized</p> : null}
        { isAuthenticated || guestInit ? 
        <div>
            <div className="home-page page">
            <HeaderComponent/>
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