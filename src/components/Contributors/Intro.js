import Skeleton from "react-loading-skeleton";

const Intro = props => {
    const { contributors, isLoading, error, loginClick } = props;

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

    const renderBody = () => {
        const list = () => {
            if (isLoading) return <Skeleton />;
            if (error) return <p id="error">An error occurred loading the list of contributors. Kindly refresh the page and try again.</p>;
    
            return (
                <>
                    {renderList("bronze")}
                    {renderList("silver")}
                    {renderList("gold")}
                    {renderList("platinum")}
                    {renderList("executive")}
                </>
            )
        }

        const listIntro = !isLoading && !error ? <p>A big thank you to everyone at the Supporter tier, as well as the following for their financial support:</p> : null;

        return (
            <>
                <div className="contributors-lead" data-testid="contributors-lead">
                    <p>The making of this album included a crowdfunding campaign that yielded a portion of the funds used to create it. All contributors can claim their respective rewards by <a href="/contributors" onClick={loginClick}>clicking here</a>.</p>
                    {listIntro}
                </div>
                <div className="contributors-list" data-testid="contributors-list">
                    {list()}
                </div>
            </>
        )
    }

    return renderBody();
}

export default Intro;