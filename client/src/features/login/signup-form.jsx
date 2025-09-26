import { useState, useEffect, useContext } from 'react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { GuestInitializeContext } from '../guest/guest-initialize-context';
import { GuestContext } from '../guest/guestid-context';
import { LoadingDotsContainer } from '../loading/loading-container';

function SignUpForm () {
    const {
        getAccessTokenSilently,
        logout,
        isAuthenticated,
    } = useAuth0();
    const [isLoading, setIsLoading] = useState(true);
    const { guestInit, setGuestInit } = useContext(GuestInitializeContext);
    const { guest, setGuest } = useContext(GuestContext);

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [worksAt, setWorksAt] = useState('');
    const [livesIn, setLivesIn] = useState('');
    const [from, setFrom] = useState('');

    const [placeholderUsername, setPlaceholderUsername] = useState('Username');
    const [placeholderWorksAt, setPlaceholderWorksAt] = useState('Works At');
    const [placeholderLivesIn, setPlaceholderLivesIn] = useState('Lives In');
    const [placeholderFrom, setPlaceholderFrom] = useState('From');
    const [displayColor, setDisplayColor] = useState('blue');
    const [coverColor, setCoverColor] = useState('yellow');

    const navigate = useNavigate();

    useEffect(() => {
        const renderUserInfo = async () => {
            setIsLoading(true);
            await getCurrentUserInfo();
            setIsLoading(false);
        }

        renderUserInfo();
    }, []);

    const getCurrentUserInfo = async () => {
        try {
            let guestId = "";

            if(guestInit) {
                guestId = guest;
            }

            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/user/update`,
                {},
                guestId,
                guestInit
            );
            if(response.data.success === true) {
                setPlaceholderUsername(response.data.username);
                setPlaceholderWorksAt(response.data.worksAt);
                setPlaceholderLivesIn(response.data.livesIn);
                setPlaceholderFrom(response.data.from);
                setDisplayColor(response.data.displayColor);
                setCoverColor(response.data.coverColor);
            } else console.log(response.data.message);
        } catch (error) {
            console.error('error', error);
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
            try {
                console.log("Sign up sent");
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/user/update`,
                    {   
                        username,
                        worksAt,
                        livesIn,
                        from,
                        displayColor,
                        coverColor
                    },
                    guest,
                    guestInit
                );
                if(response.data.success === true) {
                    navigate('/home');
                }
            } catch (error) {
                if(error.response.status === 400) {
                    setError(`Failed to update with username: ${username}`);
                } else if (error.response.status === 500) {
                    setError('Failed to update user information.');
                } else {
                    setError(`Failed to connect to user update.`);
                }   
            }
        }

        const handleSkip = () => {
            navigate('/home');
        };

        const handleDelete = async () => {
            const verify = confirm("Do you want to delete this user?");
            if(verify) {
                try {
                    const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'delete',
                    `${import.meta.env.VITE_API_URL}/user`,
                    {   
                        username,
                        worksAt,
                        livesIn,
                        from,
                        displayColor,
                        coverColor
                    },
                    guest,
                    guestInit
                );

                if(response.data.success === true) {
                    if(isAuthenticated) {
                        logout({ returnTo: window.location.origin });
                    }
                    if(guestInit) {
                        setGuestInit(false);
                        setGuest("");
                        nav('/');
                    }
                } else {
                    setError(`Failed to delete user.`);
                }
                } catch (error) {
                    console.error('error', error);
                    setError(`Failed to connect to user delete.`);
                }
            }
        }

    if(isLoading) return <LoadingDotsContainer/>;

    return(
        <form className='signup-form form' onSubmit={handleSignUp}>
            <label className='signup-field'>
            <p className='signup-label'>Username:</p>
                <input
                maxLength={20}
                className='signup-input'
                type="text"
                placeholder={placeholderUsername}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label className='signup-field'>
                <p className='signup-label'>Works At:</p>
                <input
                maxLength={40}
                className='signup-input'
                type="text"
                placeholder={placeholderWorksAt}
                value={worksAt}
                onChange={(e) => setWorksAt(e.target.value)}
                />
            </label>
            <label className='signup-field'>
                <p className='signup-label'>Lives In:</p>
                <input
                maxLength={40}
                className='signup-input'
                type='text'
                placeholder={placeholderLivesIn}
                value={livesIn}
                onChange={(e) => setLivesIn(e.target.value)}
                />
            </label>
            <label className='signup-field'>
                <p className='signup-label'>From:</p>
                <input
                maxLength={40}
                className='signup-input'
                type='text'
                placeholder={placeholderFrom}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                />
            </label>
            <label className='signup-field'>
                <p className='signup-label'>Profile Color:</p>
                <select className='signup-input' value={displayColor} onChange={(e) => setDisplayColor(e.target.value)}>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                </select>
            </label>
            <label className='signup-field'>
                <p className='signup-label'>Cover Color:</p>
                <select className='signup-input' value={coverColor} onChange={(e) => setCoverColor(e.target.value)}>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                </select>
            </label>
                <div className='signup-submit-buttons'>
                    <button className='signup-button' type='submit'>Update Information</button>
                    <button className='skip-button' onClick={handleSkip}>Skip</button>
                    <button className='delete-button' onClick={handleDelete}>Delete</button>
                </div>
                <p className="error-message">{error}</p>
        </form>
    )
}

export default SignUpForm;