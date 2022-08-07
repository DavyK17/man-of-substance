const Footer = props => {
    const { contributor, setContributor, setType } = props;
    
    const backToIntro = e => {
        e.preventDefault();
        setType("intro");
    }
    
    const logout = e => {
        e.preventDefault();

        setContributor();
        localStorage.removeItem("mos-contributor");
        localStorage.removeItem("mos-contributor-expiry");

        setType("login");
    }
    const logoutButton = contributor ? <button onClick={logout}>Logout</button> : null;

    return (
        <div className="link-buttons">
            <button onClick={backToIntro}>Back to Intro</button>
            {logoutButton}
        </div>
    )
}

export default Footer;