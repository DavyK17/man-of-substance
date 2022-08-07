import { useState, useEffect } from "react";
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

    const validUser = contributor && Object.keys(contributor).length === 4 && (contributor.hasOwnProperty("name") && typeof contributor.name === "string") && (contributor.hasOwnProperty("email") && typeof contributor.email === "string") && (contributor.hasOwnProperty("amount") && typeof contributor.amount === "number") && (contributor.hasOwnProperty("rewardsClaimed") && typeof contributor.rewardsClaimed === "boolean");

    const renderBody = type => {
        let body;
        let defaultBody = <Intro contributors={contributors} setType={setType} isLoading={isLoading} error={error} validUser={validUser} />;
        switch (type) {
            case "login":
                body = <Login contributor={contributor} setContributor={setContributor} setType={setType} validUser={validUser} />
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
        <main className="contributors">
            {renderBody(type)}
        </main>
    )
}

export default Contributors;