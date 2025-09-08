import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from "./use-conversations-hook";
import { GuestContext } from '../guest/guestid-context';
import { GuestInitializeContext } from '../guest/guest-initialize-context';

function ConversationsComponent() {
    const { getAccessTokenSilently, } = useAuth0();
    const {guest} = useContext(GuestContext);
    const {guestInit} = useContext(GuestInitializeContext);
    const {data, error, isLoading, refetch} = useConversations(getAccessTokenSilently, guest, guestInit);
    const nav = useNavigate();
    const [convos, setConvos] = useState([]);

    useEffect(() => {
        if(data) {
            const sortConvos = [...data.users].sort((a, b) => a.username.localeCompare(b.username));
            setConvos(sortConvos);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [location]);

    const handleMessageClick = (convo) => {
        nav(`/messages/${convo.id}`);
    };

    return(
        <div className='home-sidebar'>
            <h1>Conversations</h1>
            <div className='convo-list'>
                {isLoading ? <div>Loading...</div> : error ? <div>Error fetching convos...</div> : convos.length < 1
                ? <div>No one has messaged you.</div> : 
                convos.map((convo, index) => 
                    <div
                        key={index}
                        className='convo'
                        role='button'
                        onClick={() => handleMessageClick(convo)}
                    >
                        {convo.username}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConversationsComponent;