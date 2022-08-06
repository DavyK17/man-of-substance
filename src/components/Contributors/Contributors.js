import { useState, useEffect } from "react";
import Server from "../../api/Server";

const Contributors = () => {
    const [contributors, setContributors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            let { bronze, silver, gold, platinum, executive } = await Server.getContributors();
            setContributors({ bronze, silver, gold, platinum, executive });
        }

        fetchData();
    }, []);

    const renderList = tier => {
        if (Object.keys(contributors).length === 0 || contributors[tier].length === 0) return;

        return (
            <div>
                <h2>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h2>
                <ul>
                    {
                        contributors[tier].map(({ name }, i) => {
                            return <li key={i}>{name}</li>
                        })
                    }
                </ul>
            </div>
        )
    }

    return (
        <main>
            <div className="contributors-lead">
                <p>The making of this album included a crowdfunding campaign that yielded a portion of the funds used to create it. All contributors can claim their respective rewards by <a href="#rewards">clicking here</a>.</p>
                <p>A big thank you to everyone at the Supporter tier, as well as the following for their financial support:</p>
            </div>
            <div className="contributors">
                {renderList("bronze")}
                {renderList("silver")}
                {renderList("gold")}
                {renderList("platinum")}
                {renderList("executive")}
            </div>
        </main>
    )
}

export default Contributors;