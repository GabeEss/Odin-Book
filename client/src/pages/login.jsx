import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginComponent from '../features/user/login-component';

function LoginPage() {
    const {
        logout,
        isAuthenticated,
    } = useAuth0();

    const navigate = useNavigate();

    const handleHome = () => {
        if(isAuthenticated)
            navigate('/home');
    }

    return(
        <div className='login-page page'>
            <h1 className='login-heading'>Welcome to Name Book</h1>
            {!isAuthenticated ? 
                <div className='login-section section'>
                    <LoginComponent/>
                </div>
            : 
                <div className='welcome-section section'>
                    <button className='home-button' onClick={handleHome}>Home</button>
                    <button className='logout-button' onClick={() => logout({ returnTo: window.location.origin })}>
                    Log out
                    </button>
                </div>
            }            
        </div>
    )
}

export default LoginPage;