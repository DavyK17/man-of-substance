const Rewards = props => {
    const { tier } = props;

    const rewards = [
        {
            name: "Single track",
            perks: ["One track of your choice"],
            tiers: ["supporter"]
        },
        {
            name: "Triple pack",
            perks: ["3 tracks of your choice"],
            tiers: ["bronze"]
        },
        {
            name: "Personalised pack",
            perks: ["Personalised \"thank you\" video (shown above)", "5 tracks of your choice"],
            tiers: ["silver", "gold", "platinum", "executive"]
        },
        {
            name: "Early bird download",
            perks: ["Full album"],
            tiers: ["gold", "platinum", "executive"]
        },
        {
            name: "Project commentary",
            perks: ["Album concept", "Subject matter", "Production", "Videography (where applicable)", "Potentially obscure lyrics"],
            tiers: ["platinum", "executive"]
        },
        {
            name: "Executive producer credit",
            perks: ["Executive producer credit", "Special mention in the project commentary", "Exclusive online album listening session", "Signed physical copy of the album"],
            tiers: ["executive"]
        }
    ]

    const renderRewards = () => {
        let items = rewards.filter(reward => reward.tiers.includes(tier));
        
        return items.map(({ name, perks }, i) => {
            return (
                <div key={i} className="reward">
                    <h3>{name}</h3>
                    <ul>
                        {
                            perks.map((perk, i) => {
                                return (
                                    <li key={i}>{perk}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            )
        });
    }

    return (
        <div className="rewards-head" data-testid="contributor-rewards">
            <h2 className="sr-only">Your rewards</h2>
            <div className="rewards-list">
                {renderRewards()}
            </div>
        </div>
    )
}

export default Rewards;