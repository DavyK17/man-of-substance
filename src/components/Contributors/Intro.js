const Intro = props => {
    const { contributors, contributor, setType } = props;

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

    const handleClick = e => {
        e.preventDefault();
        contributor ? setType("info") : setType("login");
    }

    return (
        <>
            <div className="contributors-lead">
                <p>The making of this album included a crowdfunding campaign that yielded a portion of the funds used to create it. All contributors can claim their respective rewards by <a href="/contributors" onClick={handleClick}>clicking here</a>.</p>
                <p>A big thank you to everyone at the Supporter tier, as well as the following for their financial support:</p>
            </div>
            <div className="contributors-list">
                {renderList("bronze")}
                {renderList("silver")}
                {renderList("gold")}
                {renderList("platinum")}
                {renderList("executive")}
            </div>
        </>
    )

}

export default Intro;