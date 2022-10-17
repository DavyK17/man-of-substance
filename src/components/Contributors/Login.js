import { useEffect } from "react";
import { Auth } from 'aws-amplify';
import Server from "../../api/Server";
import Footer from "./Footer";

const Login = props => {
    const { setContributor, setType, validUser } = props;

    const awsSignIn = async () => {
        const username = process.env.REACT_APP_AWS_USER;
        const password = process.env.REACT_APP_AWS_PASS;

        try {
            const user = await Auth.signIn(username, password);
            if (user.username === process.env.REACT_APP_AWS_ID) return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (!e.target["rewards-email"].value || e.target["rewards-email"].value === "") return document.getElementById("status").innerHTML = "Please enter a valid email address";

        document.getElementById("status").innerHTML = "Tulia kiambatasi…";

        let data = await Server.getContributorByEmail(e.target["rewards-email"].value);
        if (!data) return document.getElementById("status").innerHTML = "This email does not exist in the database";
        if (data.rewardsClaimed) return document.getElementById("status").innerHTML = "Rewards have already been claimed for this user";
        // if (data.amount) {
        //     if (data.amount >= 100 && data.amount <= 1999 && Math.round(Date.now() / 1000) < 1667509200)
        //         return document.getElementById("status").innerHTML = "Your rewards will be available on release day";
        //     if (data.amount >= 2000 && data.amount <= 49999 && Math.round(Date.now() / 1000) < 1667250000)
        //         return document.getElementById("status").innerHTML = "Your rewards will be available three days to release day";
        //     if (data.amount >= 50000 && Math.round(Date.now() / 1000) < 1666904400)
        //         return document.getElementById("status").innerHTML = "Your rewards will be available one week to release day";
        // }

        let signedIn = await awsSignIn();
        if (!signedIn) return document.getElementById("status").innerHTML = "Login failed. Kindly check your Internet connection and try again.";

        let user = { ...data, signedIn };
        localStorage.setItem("mos-contributor", JSON.stringify(user));
        localStorage.setItem("mos-contributor-expiry", Date.now() + 86400);
        setContributor(JSON.parse(localStorage.getItem("mos-contributor")));
    }

    useEffect(() => {
        if (validUser) setType("info");
    });

    return (
        <>
            <form className="challenge" onSubmit={handleSubmit} autoComplete="off">
                <h1>Contributor Rewards</h1>
                <p>Enter the email address you provided (on WhatsApp) after making your contribution:</p>
                <div className="input rewards">
                    <input type="email" id="rewards-email" name="rewards-email" />
                    <input type="submit" id="challenge-submit" name="rewards-submit" value="Enter" />
                </div>
            </form>

            <Footer setType={setType} validUser={validUser} />
        </>
    )
}

export default Login;