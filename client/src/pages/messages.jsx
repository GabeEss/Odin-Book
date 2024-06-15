import MessageList from "../features/messages/message-list-display";
import HeaderComponent from "../features/header/header-component";

function MessagingPage() {
    return(
        <div className='messages-page page'>
            <HeaderComponent/>
            <MessageList modalUserId={null}/>
        </div>
    )
}

export default MessagingPage;