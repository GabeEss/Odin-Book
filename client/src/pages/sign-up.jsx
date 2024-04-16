import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SignUpForm from '../features/login/signup-form';
import { useContext } from "react";
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";

function SignUpPage () {
    const { isAuthenticated } = useAuth0();
    const nav = useNavigate();
    const { guestInit } = useContext(GuestInitializeContext);

    const handleHome = () => {
        if(isAuthenticated || guestInit)
            nav('/home');
    }

    return(
        <div className="signup-page page">
            <h1 className='signup-heading'>Update User Info</h1>
            <p className='signup-paragraph'> Please do not provide your actual information.</p>
            {isAuthenticated || guestInit ? 
                <div className='signup-section section'>
                    <SignUpForm/>
                </div>
            : 
                <div className='welcome-section section'>
                    <button className='home-button' onClick={handleHome}>Home</button>
                </div>
            }
        </div>
    )
}

export default SignUpPage;