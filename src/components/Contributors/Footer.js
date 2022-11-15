const Footer = props => {
    const { validUser, introClick, submitClick, logoutClick } = props;

    const logoutButton = validUser ? <button onClick={logoutClick}>Logout</button> : null;
    const submitButton = validUser ? <button type="submit" onClick={submitClick}>Claim rewards</button> : null;

    return (
        <div className="link-buttons">
            {submitButton}
            <button onClick={introClick}>Back to Intro</button>
            {logoutButton}
            <p id="status"></p>
        </div>
    )
}

export default Footer;