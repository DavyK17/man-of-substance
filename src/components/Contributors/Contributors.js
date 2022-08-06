import { useState, useEffect } from "react";
import Server from "../../api/Server";
import Intro from "./Intro";
import Login from "./Login";
import Info from "./Info";

const Contributors = props => {
    const [contributors, setContributors] = useState({});
    const [contributor, setContributor] = useState();
    const [type, setType] = useState("intro");

    useEffect(() => {
        const fetchData = async () => {
            let { bronze, silver, gold, platinum, executive } = await Server.getContributors();
            setContributors({ bronze, silver, gold, platinum, executive });
        }

        fetchData();
    }, []);

    const renderBody = type => {
        let body;
        switch (type) {
            case "intro":
                body = <Intro contributors={contributors} contributor={contributor} setType={setType} />
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