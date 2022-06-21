import { Link } from "react-router-dom";
import Footer from "./Footer";

const Credits = props => {
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
        if (props.current.credits.hasOwnProperty(type)) {
            if (type === "featuring") {
                return (
                    <div key={key} className="credit">
                        <h2>{titles[type]}</h2>
                        {
                            props.current.credits[type].map((name, i) => {
                                if (Array.isArray(props.current.credits[type][i + 1])) {
                                    return (
                                        <p key={i} className="group-name">{name}</p>
                                    )
                                }

                                if (Array.isArray(props.current.credits[type][i])) {
                                    return (
                                        <>
                                            {
                                                props.current.credits[type][i].map((sub, j) => {
                                                    return (
                                                        <p key={`${props.current.credits[type][i - 1]}-${j + 1}`} className="group-member">{sub}</p>
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
                    switch(type) {
                        case "additionalProducers":
                            return "Additional producer";
                            break;
                        case "producers":
                            return "Producer";
                            break;
                    }
                }

                return (
                    <div key={key} className="credit">
                        <h2>{props.current.credits[type].length > 1 ? titles[type] : singular()}</h2>
                        {
                            props.current.credits[type].map((name, i) => {
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
                            props.current.credits[type].map((name, i) => {
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
                            props.current.credits[type].map((name, i) => {
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
                        props.current.credits[type].map((name, i) => {
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
                    <Link role="button" to={`/tracks/${props.id}/synopsis`}>
                        Synopsis
                    </Link>
                    <Link role="button" to={`/tracks/${props.id}/lyrics`}>
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
            <Footer type="credits" previous={props.previous} next={props.next} />
        </>
    )
}

export default Credits;