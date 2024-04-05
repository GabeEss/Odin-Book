import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SignUpForm from '../features/user/signup-form';

function SignUpPage () {
    const { isAuthenticated } = useAuth0();
    const nav = useNavigate();

    const handleHome = () => {
        if(isAuthenticated)
            nav('/home');
    }

    return(
        <div className="signup-page page">
            <h1 className='signup-heading'>Update User Info</h1>
            {isAuthenticated ? 
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