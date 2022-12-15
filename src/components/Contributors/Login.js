import { useEffect } from "react";
import Footer from "./Footer";

const Login = props => {
    const { setType, validUser, handleSubmit, introClick } = props;

    useEffect(() => {
        if (validUser) setType("info");
    });

    return (
        <>
            <form className="challenge" onSubmit={handleSubmit} autoComplete="off" data-testid="contributor-login">
                <h1>Contributor Rewards</h1>
                <p>Enter the email address you provided after making your contribution:</p>
                <div className="input rewards">
                    <input type="email" id="rewards-email" name="rewards-email" />
                    <input type="submit" id="challenge-submit" name="rewards-submit" value="Enter" />
                </div>
            </form>

            <Footer setType={setType} validUser={validUser} introClick={introClick} />
        </>
    )
}

export default Login;