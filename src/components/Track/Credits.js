import { Link } from "react-router-dom";
import Footer from "./Footer";

const Credits = props => {
    const { id, current, previous, next, tracks } = props;

    const titles = {
        featuring: "Featuring",
        producers: "Producers",
        arrangement: "Arrangement",
        guitar: "Guitar",
        additionalProducers: "Additional producers",
        additionalVocals: "Additional vocals",
        mixMaster: "Mixing and mastering",
        recorded: "Recorded at",
        interpolates: "Interpolates",
        samples: "Samples"
    }

    const credit = (type, key) => {
        if (current.credits.hasOwnProperty(type)) {
            if (type === "featuring") {
                return (
                    <div key={key} className="credit">
                        <h2>{titles[type]}</h2>
                        {
                            current.credits[type].map((name, i) => {
                                if (Array.isArray(current.credits[type][i + 1])) {
                                    return (
                                        <p key={i} className="group-name">{name}</p>
                                    )
                                }

                                if (Array.isArray(current.credits[type][i])) {
                                    return (
                                        <>
                                            {
                                                current.credits[type][i].map((sub, j) => {
                                                    return (
                                                        <p key={`${current.credits[type][i - 1]}-${j + 1}`} className="group-member">{sub}</p>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                }

                                return (
                                    <p key={i}>{name}</p>
                                )
                            })
                        }
                    </div>
                )
            }

            if (type === "additionalProducers" || type === "producers") {
                const singular = () => {
                    let label;
                    switch(type) {
                        case "additionalProducers":
                            label = "Additional producer";
                            break;
                        case "producers":
                            label = "Producer";
                            break;
                        default:
                            label = undefined;
                    }
                    return label;
                }

                return (
                    <div key={key} className="credit">
                        <h2>{current.credits[type].length > 1 ? titles[type] : singular()}</h2>
                        {
                            current.credits[type].map((name, i) => {
                                return (
                                    <p key={i}>{name}</p>
                                )
                            })
                        }
                    </div>
                )
            }

            if (type === "recorded") {
                return (
                    <div key={key} className="credit">
                        <h2>{titles[type]}</h2>
                        {
                            current.credits[type].map((name, i) => {
                                return (
                                    <p className="location" key={i}>
                                        <span className="studio">{name.studio}</span>
                                        <span className="city">{name.city}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                )
            }

            if (type === "samples" || type === "interpolates") {
                return (
                    <div key={key} className="credit">
                        <h2>{titles[type]}</h2>
                        {
                            current.credits[type].map((name, i) => {
                                return (
                                    <p className="location" key={i}>
                                        <span className="studio">{name.title}</span>
                                        <span className="city" dangerouslySetInnerHTML={{ __html: name.info }}></span>
                                    </p>
                                )
                            })
                        }
                    </div>
                )
            }

            return (
                <div key={key} className="credit">
                    <h2>{titles[type]}</h2>
                    {
                        current.credits[type].map((name, i) => {
                            return (
                                <p key={i}>{name}</p>
                            )
                        })
                    }
                </div>
            )
        }
        return null;
    }

    return (
        <>
            <div className="track-links">
                <div className="link-buttons">
                    <Link role="button" to={`/tracks/${id}/synopsis`}>
                        Synopsis
                    </Link>
                    <Link role="button" to={`/tracks/${id}/lyrics`}>
                        Lyrics
                    </Link>
                </div>
            </div>
            <div className="track-credits">
                {
                    Object.keys(titles).map((name, i) => {
                        return credit(name, i)
                    })
                }
            </div>
            <Footer type="credits" previous={previous} next={next} tracks={tracks} />
        </>
    )
}

export default Credits;