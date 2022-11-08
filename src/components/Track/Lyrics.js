import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Lyrics = props => {
    const { id, current, previous, next, tracks, setFound } = props;

    const openChallenge = e => {
        e.preventDefault();
        setFound(true);
    }

    useEffect(() => {
        let easterEgg = [];
        document.querySelectorAll(".track-lyrics p").forEach(line => easterEgg.push(line));
        easterEgg = easterEgg.filter(line => line.innerHTML.includes(process.env.REACT_APP_CHALLENGE_LYRIC));
        
        if (easterEgg.length > 0) {
            let timeout;
            easterEgg[0].onmouseover = () => {
                timeout = setTimeout(() => {
                    easterEgg[0].style.cursor = "pointer";
                }, 4000);
            };
            easterEgg[0].onmouseout = () => {
                clearTimeout(timeout);
                easterEgg[0].style.cursor = "auto";
            };
            easterEgg[0].onclick = openChallenge;
        };
    });

    return (
        <>
            <div className="track-links" data-testid="track-links">
                <div className="link-buttons">
                    <Link role="button" to={`/tracks/${id}/synopsis`}>
                        Synopsis
                    </Link>
                    <Link role="button" to={`/tracks/${id}/credits`}>
                        Credits
                    </Link>
                </div>
            </div>
            <div className="track-lyrics" data-testid="track-lyrics" dangerouslySetInnerHTML={{ __html: current.lyrics }}></div>
            <Footer type="lyrics" previous={previous} next={next} tracks={tracks} />
        </>
    )
}

export default Lyrics;