import { useEffect } from "react";
import Server from "../../api/Server";
import Footer from "./Footer";

const Login = props => {
    const { contributor, setContributor, setType } = props;

    const handleSubmit = async e => {
        e.preventDefault();
        if (!e.target["rewards-email"].value || e.target["rewards-email"].value === "") return document.getElementById("status").innerHTML = "Please enter a valid email address";

        let data = await Server.getContributorByEmail(e.target["rewards-email"].value);
        if (!data) return document.getElementById("status").innerHTML = "This email does not exist in the database";
        if (data.rewardsClaimed) return document.getElementById("status").innerHTML = "Rewards have already been claimed for this user";

        setContributor(data);
    }

    useEffect(() => {
        const validState = contributor && Object.keys(contributor).length === 4 && (contributor.hasOwnProperty("name") && typeof contributor.name === "string") && (contributor.hasOwnProperty("email") && typeof contributor.email === "string") && (contributor.hasOwnProperty("amount") && typeof contributor.amount === "number") && (contributor.hasOwnProperty("rewardsClaimed") && typeof contributor.rewardsClaimed === "boolean");

        if (validState) setType("info");
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

            <Footer contributor={contributor} setType={setType} />
        </>
    )
}

export default Login;