import { Link } from "react-router-dom";
import Footer from "./Footer";

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
            <Footer type="synopsis" previous={props.previous} next={props.next} />
        </>
    )
}

export default Synopsis;