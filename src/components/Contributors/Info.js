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

    const max = (tier = getTier(contributor.amount)) => {
        if (tier === "bronze") return 3;
        if (tier === "silver") return 5;
    };

    const displayVideo = () => {
        if (contributor.amount >= 2000) {
            let videoUrl = `${process.env.REACT_APP_AWS_CLOUDFRONT}/public/mp4/${contributor.id}.mp4`
            return (
                <div className="video">
                    <video controls>
                        <source src={videoUrl} type="video/mp4"></source>
                    </video>
                </div>
            )
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
            {displayVideo()}
            <Rewards tier={getTier(contributor.amount)} />
            <form className="rewards-claim">
                <TrackDownload tier={getTier(contributor.amount)} max={max} />
                <Footer tier={getTier(contributor.amount)} max={max} contributor={contributor} setContributor={setContributor} setType={setType} validUser={validUser} />
            </form>
        </>
    )
}

export default Info;