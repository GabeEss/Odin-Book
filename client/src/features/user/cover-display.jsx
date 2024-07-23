function CoverDisplay({user}) {
    return(
        <div className="cover-display" style={{backgroundColor: user.coverColor, filter: 'brightness(40%)'}}/>
    )
}

export default CoverDisplay;