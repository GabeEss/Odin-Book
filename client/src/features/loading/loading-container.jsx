function LoadingDotsContainer() { 
 return (
        <div className="loading-container">
            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}

function LoadingSpinnerContainer() {
    return(
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    )
}


export { LoadingDotsContainer, LoadingSpinnerContainer };