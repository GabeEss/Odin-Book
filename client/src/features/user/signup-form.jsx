import { useState, useEffect } from 'react';
import { makeAuthenticatedRequest } from '../auth/makeAuthRequest';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function SignUpForm () {
    const {
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();
    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [worksAt, setWorksAt] = useState('');
    const [livesIn, setLivesIn] = useState('');
    const [from, setFrom] = useState('');

    const [placeholderUsername, setPlaceholderUsername] = useState('Username');
    const [placeholderWorksAt, setPlaceholderWorksAt] = useState('Works At');
    const [placeholderLivesIn, setPlaceholderLivesIn] = useState('Lives In');
    const [placeholderFrom, setPlaceholderFrom] = useState('From');

    const navigate = useNavigate();

    useEffect(() => {
        const renderUserInfo = async () => {
            setIsLoading(true);
            await getUserInfo();
            setIsLoading(false);
        }

        renderUserInfo();
    }, [isAuthenticated]);

    const getUserInfo = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/user/update`
            );
            if(response.data.success === true) {
                setPlaceholderUsername(response.data.username);
                setPlaceholderWorksAt(response.data.worksAt);
                setPlaceholderLivesIn(response.data.livesIn);
                setPlaceholderFrom(response.data.from);
            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/user/update`,
                    {   
                        username,
                        worksAt,
                        livesIn,
                        from
                    }
                );
                if(response.data.success === true) {
                    navigate('/home');
                } else {
                    setError('Failed to update user information. Please try again.');
                }
            } catch (error) {
                setError(error.response.data.message);
            }
        }

        const handleSkip = () => {
            navigate('/home');
        };

    if(isLoading) return (<h2 className='loading-heading'>Loading...</h2>);

    return(
        <form className='signup-form form' onSubmit={handleSignUp}>
            <label>
                Username:
                <input
                type="text"
                placeholder={placeholderUsername}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                Works At:
                <input
                type="text"
                placeholder={placeholderWorksAt}
                value={worksAt}
                onChange={(e) => setWorksAt(e.target.value)}
                />
            </label>
            <label>
                Lives In:
                <input
                type='text'
                placeholder={placeholderLivesIn}
                value={livesIn}
                onChange={(e) => setLivesIn(e.target.value)}
                />
            </label>
            <label>
                From:
                <input
                type='text'
                placeholder={placeholderFrom}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                />
            </label>
                <button className='signup-button' type='submit'>Sign Up</button>
                <button className='skip-button' onClick={handleSkip}>Skip</button>
                <p className="error-message">{error}</p>
        </form>
    )
}

export default SignUpForm;