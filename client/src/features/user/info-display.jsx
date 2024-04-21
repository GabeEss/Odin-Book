// eslint-disable-next-line react/prop-types
function InfoDisplay({ user }) {
    return (
        <div>
            <p>Works at: {user.worksAt}</p>
            <p>Lives in: {user.livesIn}</p>
            <p>From: {user.from}</p>
        </div>
    );
}

export default InfoDisplay;