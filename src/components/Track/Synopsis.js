import { Link } from "react-router-dom";
import Adjacent from "./Adjacent";
import TopLink from "./TopLink";

const Synopsis = props => {
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
                <Adjacent type="synopsis" seq={-1} previous={props.previous} />
                <TopLink type="synopsis" />
                <Adjacent type="synopsis" seq={1} next={props.next} />
            </footer>
        </>
    )
}

export default Synopsis;