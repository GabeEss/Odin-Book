import { useState } from 'react';
import { makeAuthenticatedRequest } from '../auth/makeAuthRequest';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function SignUpForm () {
    const {
        getAccessTokenSilently,
        user
    } = useAuth0();

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [worksAt, setWorksAt] = useState('');
    const [livesIn, setLivesIn] = useState('');
    const [from, setFrom] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/user/register`,
                    {   
                        username,
                        worksAt,
                        livesIn,
                        from
                    },
                    { user },
                );
                if(response.data.success === true) {
                    navigate('/home');
                } else {
                    setError('Faied to update user information. Please try again.');
                }
            } catch (error) {
                setError(error.response.data.message);
            }
        }

    return(
        <form className='signup-form form' onSubmit={handleSignUp}>
        <label>
            Username:
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </label>
        <label>
            Works At:
            <input
            type="text"
            value={worksAt}
            onChange={(e) => setWorksAt(e.target.value)}
            />
        </label>
        <label>
            Lives In:
            <input
            type='text'
            value={livesIn}
            onChange={(e) => setLivesIn(e.target.value)}
            />
        </label>
        <label>
            From:
            <input
            type='text'
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            />
        </label>
            <button className='signup-button' type='submit'>Sign Up</button>
            <p className="error-message">{error}</p>
        </form>
    )
}

export default SignUpForm;