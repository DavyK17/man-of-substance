import { Link } from "react-router-dom";
import Footer from "./Footer";

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
            <Footer type="lyrics" previous={props.previous} next={props.next} />
        </>
    )
}

export default Lyrics;