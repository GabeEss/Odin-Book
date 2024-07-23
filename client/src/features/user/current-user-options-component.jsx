import { useNavigate } from "react-router-dom";

function CurrentUserOptions() {
    const nav = useNavigate();

    const handleUpdateClick = () => {
        nav('/signup');
    }

    const handleFriendClick = () => {
        nav('/friends');
    }

    return (
        <div className="user-options">
            <button className='signup-nav' onClick={handleUpdateClick}>Update Information</button>
            <button className="friends-nav" onClick={handleFriendClick}>Friends</button>
        </div>
    );
}

export default CurrentUserOptions;