import { Link } from "react-router-dom";
import Footer from "./Footer";

const Synopsis = props => {
    const { id, current, previous, next, tracks } = props;

    return (
        <>
            <div className="track-links">
                <div className="link-buttons">
                    <Link role="button" to={`/tracks/${id}/lyrics`}>
                        Lyrics
                    </Link>
                    <Link role="button" to={`/tracks/${id}/credits`}>
                        Credits
                    </Link>
                </div>
            </div>
            <div className="track-synopsis" dangerouslySetInnerHTML={{ __html: current.synopsis }}></div>
            <Footer type="synopsis" previous={previous} next={next} tracks={tracks}  />
        </>
    )
}

export default Synopsis;