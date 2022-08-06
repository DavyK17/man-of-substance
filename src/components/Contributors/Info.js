import Footer from "./Footer";

const Info = props => {
    const { contributor, setContributor, setType } = props;

    const tier = amount => {
        if (amount >= 100 && amount <= 999) return "supporter";
        if (amount >= 1000 && amount <= 1999) return "bronze";
        if (amount >= 2000 && amount <= 3499) return "silver";
        if (amount >= 3500 && amount <= 4999) return "gold";
        if (amount >= 5000 && amount <= 49999) return "platinum";
        if (amount >= 50000) return "executive";
    }

    return (
        <>
            <header className="track-head">
                <h1 className="title">{contributor.name}</h1>
                <div className="info">
                    <p className="style">{tier(contributor.amount).charAt(0).toUpperCase() + tier(contributor.amount).slice(1)}</p>
                    <p className="writers">{contributor.email}</p>
                </div>
            </header>
            
            <Footer contributor={contributor} setContributor={setContributor} setType={setType} />
        </>
    )
}

export default Info;