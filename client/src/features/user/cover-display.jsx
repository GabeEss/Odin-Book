function CoverDisplay({user}) {
    return(
        <div>
            <div className="cover-display" style={{backgroundColor: user.coverColor}}></div>
        </div>
    )
}

export default CoverDisplay;