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
                <Adjacent type="lyrics" seq={-1} previous={props.previous} />
                <TopLink type="lyrics" />
                <Adjacent type="lyrics" seq={1} next={props.next} />
            </footer>
        </>
    )
}

export default Lyrics;