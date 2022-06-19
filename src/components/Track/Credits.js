import { Link } from "react-router-dom";

const Credits = props => {
    const footer = seq => {
        if (seq === "prev" && props.previous) {
            return (
                <>
                    <h2>Previous</h2>
                    <p>
                        <Link to={`/tracks/${props.previous.id}/credits`}>
                            {props.previous.title}
                        </Link>
                    </p>
                </>
            )
        }

        if (seq === "next" && props.next) {
            return (
                <>
                    <h2>Next</h2>
                    <p>
                        <Link to={`/tracks/${props.next.id}/credits`}>
                            {props.next.title}
                        </Link>
                    </p>
                </>
            )
        }
    }

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
                    {footer("prev")}
                </div>
                <div className="top-link">
                    <a href="#top">Back to Top</a>
                </div>
                <div className="next">
                    {footer("next")}
                </div>
            </footer>
        </>
    )
}

export default Credits;