import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const { logout, isAuthenticated } = useAuth0();
    const nav = useNavigate();

    return (
        <div className='error-page'>
            <h1 className='error-heading'>Error</h1>
            {isAuthenticated ? 
                    <button onClick={() => {logout()}}>
                        Logout
                    </button>
                : <button onClick={() => {nav('/')}}>
                    To the Login Page
                    </button>
            }
        </div>
    )
}

export default ErrorPage;