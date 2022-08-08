import Footer from "./Footer";
import Rewards from "./Rewards";
import TrackDownload from "./TrackDownload";

const Info = props => {
    const { contributor, setContributor, setType, validUser } = props;

    const getTier = amount => {
        if (amount >= 100 && amount <= 999) return "supporter";
        if (amount >= 1000 && amount <= 1999) return "bronze";
        if (amount >= 2000 && amount <= 3499) return "silver";
        if (amount >= 3500 && amount <= 4999) return "gold";
        if (amount >= 5000 && amount <= 49999) return "platinum";
        if (amount >= 50000) return "executive";
    }

    const handleSubmit = e => {
        e.preventDefault();
        const tier = getTier(contributor.amount);

        if (tier === "supporter") console.log(e.target[0].value);
        if (tier === "bronze" || tier === "silver") {
            let checked = [];

            document.querySelectorAll("form.rewards-claim input").forEach(input => {
                if (input.checked) checked.push(input);
            });

            checked.forEach(input => console.log(input.value));
        }
    }

    return (
        <>
            <header className="track-head">
                <h1 className="title">{contributor.name}</h1>
                <div className="info">
                    <p className="style">{getTier(contributor.amount).charAt(0).toUpperCase() + getTier(contributor.amount).slice(1)}</p>
                    <p className="writers">{contributor.email}</p>
                </div>
            </header>
            <Rewards tier={getTier(contributor.amount)} />
            <form className="rewards-claim" onSubmit={handleSubmit}>
                <TrackDownload tier={getTier(contributor.amount)} />
                <Footer setContributor={setContributor} setType={setType} validUser={validUser} />
            </form>
        </>
    )
}

export default Info;