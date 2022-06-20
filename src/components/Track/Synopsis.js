import { Link } from "react-router-dom";
import TopLink from "./TopLink";

const Synopsis = props => {
    const footer = seq => {
        if (seq === -1 && props.previous) {
            return (
                <>
                    <h2>Previous</h2>
                    <p>
                        <Link to={`/tracks/${props.previous.id}`}>
                            {props.previous.title}
                        </Link>
                    </p>
                </>
            )
        }

        if (seq === 1 && props.next) {
            return (
                <>
                    <h2>Next</h2>
                    <p>
                        <Link to={`/tracks/${props.next.id}`}>
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
                    <Link role="button" to={`/tracks/${props.id}/lyrics`}>
                        Lyrics
                    </Link>
                    <Link role="button" to={`/tracks/${props.id}/credits`}>
                        Credits
                    </Link>
                </div>
            </div>
            <div className="track-synopsis" dangerouslySetInnerHTML={{ __html: props.current.synopsis }}></div>
            <footer className="track-footer">
                <div className="previous">
                    {footer(-1)}
                </div>
                <TopLink type="synopsis" current={props.current} />
                <div className="next">
                    {footer(1)}
                </div>
            </footer>
        </>
    )
}

export default Synopsis;