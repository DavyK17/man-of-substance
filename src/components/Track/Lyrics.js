import { Link } from "react-router-dom";
import Adjacent from "./Adjacent";
import TopLink from "./TopLink";

const Lyrics = props => {
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
                    <Adjacent type="lyrics" seq={-1} previous={props.previous} />
                </div>
                <TopLink type="lyrics" />
                <div className="next">
                    <Adjacent type="lyrics" seq={1} next={props.next} />
                </div>
            </footer>
        </>
    )
}

export default Lyrics;