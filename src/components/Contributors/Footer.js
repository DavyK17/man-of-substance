import { Auth } from 'aws-amplify';

const Footer = props => {
    const { setContributor, setType, validUser } = props;
    
    const backToIntro = e => {
        e.preventDefault();
        setType("intro");
    }

    const awsSignOut = async () => {
        try {
            await Auth.signOut();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    
    const logout = async e => {
        e.preventDefault();

        let signedOut = await awsSignOut();
        if (signedOut) {
            setContributor();
            localStorage.removeItem("mos-contributor");
            localStorage.removeItem("mos-contributor-expiry");
    
            setType("login");
        }
    }
    const logoutButton = validUser ? <button onClick={logout}>Logout</button> : null;
    const submitButton = validUser ? <button type="submit">Claim rewards</button> : null;

    return (
        <div className="link-buttons">
            {submitButton}
            <button onClick={backToIntro}>Back to Intro</button>
            {logoutButton}
        </div>
    )
}

export default Footer;