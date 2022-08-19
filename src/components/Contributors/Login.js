import { useEffect } from "react";
import Server from "../../api/Server";
import Footer from "./Footer";

const Login = props => {
    const { setContributor, setType, validUser } = props;

    const handleSubmit = async e => {
        e.preventDefault();
        if (!e.target["rewards-email"].value || e.target["rewards-email"].value === "") return document.getElementById("status").innerHTML = "Please enter a valid email address";

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

        localStorage.setItem("mos-contributor", JSON.stringify(data));
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
                <p id="status"></p>
            </form>

            <Footer setType={setType} validUser={validUser} />
        </>
    )
}

export default Login;