import { Link } from "react-router-dom";
import Adjacent from "./Adjacent";
import TopLink from "./TopLink";

const Credits = props => {
    const titles = {
        additionalProducers: "Additional producers",
        additionalVocals: "Additional vocals",
        arrangement: "Arrangement",
        featuring: "Featuring",
        guitar: "Guitar",
        interpolates: "Interpolates",
        mixMaster: "Mixing and mastering",
        producers: "Producers",
        recorded: "Recorded at",
        samples: "Samples"
    }

    const credit = type => {
        if (props.current.credits.hasOwnProperty(type)) {
            if (type === "featuring") {
                return (
                    <div className="credit">
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
                    <div className="credit">
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
                    <div className="credit">
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
                    <div className="credit">
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
                <div className="credit">
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
                {credit("featuring")}
                {credit("producers")}
                {credit("arrangement")}
                {credit("guitar")}
                {credit("additionalProducers")}
                {credit("additionalVocals")}
                {credit("mixMaster")}
                {credit("recorded")}
                {credit("samples")}
                {credit("interpolates")}
            </div>
            <footer className="track-footer">
                <div className="previous">
                    <Adjacent type="credits" seq={-1} previous={props.previous} />
                </div>
                <TopLink type="credits" />
                <div className="next">
                    <Adjacent type="credits" seq={1} next={props.next} />
                </div>
            </footer>
        </>
    )
}

export default Credits;