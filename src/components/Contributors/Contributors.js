import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import moment from "moment";
import Server from "../../api/Server";
import Intro from "./Intro";
import Login from "./Login";
import Info from "./Info";

const Contributors = () => {
    const [contributors, setContributors] = useState({});
    const [contributor, setContributor] = useState();
    const [type, setType] = useState("intro");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("mos-contributor")) setContributor(JSON.parse(localStorage.getItem("mos-contributor")));

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const url = `${Server.url}/contributors`;
                let response = await fetch(url);

                if (response.ok) {
                    response = await response.json();

                    let { bronze, silver, gold, platinum, executive } = response;
                    setContributors({ bronze, silver, gold, platinum, executive });
                }
            } catch (err) {
                setError(err);
                console.log(err);
            }
            
            setIsLoading(false);
        }

        fetchData();
    }, []);

    const validUser = contributor && Object.keys(contributor).length === 6 && (contributor.hasOwnProperty("id") && typeof contributor.name === "string")  && (contributor.hasOwnProperty("name") && typeof contributor.name === "string") && (contributor.hasOwnProperty("email") && typeof contributor.email === "string") && (contributor.hasOwnProperty("amount") && typeof contributor.amount === "number") && (contributor.hasOwnProperty("rewardsClaimed") && typeof contributor.rewardsClaimed === "boolean") && (contributor.hasOwnProperty("signedIn") && contributor.signedIn);

    const loginClick = e => {
        e.preventDefault();
        validUser ? setType("info") : setType("login");
    }

    const awsSignIn = async () => {
        const username = process.env.REACT_APP_AWS_USER;
        const password = process.env.REACT_APP_AWS_PASS;

        try {
            const user = await Auth.signIn(username, password);
            if (user.attributes.email === process.env.REACT_APP_AWS_USER) return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const loginSubmit = async e => {
        e.preventDefault();
        if (!e.target["rewards-email"].value || e.target["rewards-email"].value === "") return document.getElementById("status").innerHTML = "Please enter a valid email address";

        document.getElementById("status").innerHTML = "Tulia kiambatasi…";

        let data = await Server.getContributorByEmail(e.target["rewards-email"].value);
        if (!data) return document.getElementById("status").innerHTML = "This email does not exist in the database";
        if (data.rewardsClaimed) return document.getElementById("status").innerHTML = "Rewards have already been claimed for this user";
        if (data.amount) {
            if (data.amount >= 100 && data.amount <= 1999 && Date.now() < 1667509200000)
                return document.getElementById("status").innerHTML = `Your rewards will be available ${moment(1667509200000).fromNow()}`;
            if (data.amount >= 2000 && data.amount <= 49999 && Date.now() < 1667250000000)
                return document.getElementById("status").innerHTML = `Your rewards will be available ${moment(1667250000000).fromNow()}`;
            if (data.amount >= 50000 && Date.now() < 1666904400000)
                return document.getElementById("status").innerHTML = `Your rewards will be available ${moment(1666904400000).fromNow()}`;
        }

        let signedIn = await awsSignIn();
        if (!signedIn) return document.getElementById("status").innerHTML = "Login failed. Kindly check your Internet connection and try again.";

        let user = { ...data, signedIn };
        localStorage.setItem("mos-contributor", JSON.stringify(user));
        localStorage.setItem("mos-contributor-expiry", Date.now() + 86400);
        setContributor(JSON.parse(localStorage.getItem("mos-contributor")));
    }

    const renderBody = type => {
        let body;
        let defaultBody = <Intro contributors={contributors} isLoading={isLoading} error={error} loginClick={loginClick} />;
        switch (type) {
            case "login":
                body = <Login setType={setType} validUser={validUser} handleSubmit={loginSubmit} />
                break;
            case "info":
                body = <Info contributor={contributor} setContributor={setContributor} setType={setType} validUser={validUser} />
                break;
            case "intro":
            default:
                body = defaultBody;
        }

        return body;
    }

    return (
        <main className="contributors" data-testid="contributors">
            {renderBody(type)}
        </main>
    )
}

export default Contributors;