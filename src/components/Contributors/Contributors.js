import { useState, useEffect } from "react";
import Server from "../../api/Server";
import Intro from "./Intro";
import Login from "./Login";
import Info from "./Info";

const Contributors = props => {
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

    const renderBody = type => {
        let body;
        switch (type) {
            case "intro":
                body = <Intro contributors={contributors} contributor={contributor} setType={setType} isLoading={isLoading} error={error} />
                break;
            case "login":
                body = <Login contributor={contributor} setContributor={setContributor} setType={setType} />
                break;
            case "info":
                body = <Info contributor={contributor} setContributor={setContributor} setType={setType} />
                break;
            default:
                body = <Intro contributors={contributors} setType={setType} />
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