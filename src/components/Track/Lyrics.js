import { Link } from "react-router-dom";
import TopLink from "./TopLink";

const Lyrics = props => {
    const footer = seq => {
        if (seq === "prev" && props.previous) {
            return (
                <>
                    <h2>Previous</h2>
                    <p>
                        <Link to={`/tracks/${props.previous.id}/lyrics`}>
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
                        <Link to={`/tracks/${props.next.id}/lyrics`}>
                            {props.next.title}
                        </Link>
                    </p>
                </>
            )
        }
    }

    return (
        <>
            <div className="track-links">
                <div className="link-buttons">
                    <Link role="button" to={`/tracks/${props.id}/synopsis`}>
                        Synopsis
                    </Link>
                    <Link role="button" to={`/tracks/${props.id}/credits`}>
                        Credits
                    </Link>
                </div>
            </div>
            <div className="track-lyrics" dangerouslySetInnerHTML={{ __html: props.current.lyrics }}></div>
            <footer className="track-footer">
                <div className="previous">
                    {footer("prev")}
                </div>
                <TopLink type="lyrics" current={props.current} />
                <div className="next">
                    {footer("next")}
                </div>
            </footer>
        </>
    )
}

export default Lyrics;