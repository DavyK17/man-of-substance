import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Lyrics = props => {
    const { id, current, previous, next, tracks, setFound } = props;

    // const openChallenge = e => {
    //     e.preventDefault();
    //     setFound(true);
    // }

    // useEffect(() => {
    //     let easterEgg = [];
    //     document.querySelectorAll(".track-lyrics p").forEach(line => easterEgg.push(line));
    //     easterEgg = easterEgg.filter(line => line.innerHTML.includes("Now we making money"));
        
    //     if (easterEgg.length > 0) {
    //         easterEgg[0].onmouseover = () => easterEgg[0].style.cursor = "pointer";
    //         easterEgg[0].onclick = openChallenge
    //     };
    // });

    return (
        <>
            <div className="track-links">
                <div className="link-buttons">
                    <Link role="button" to={`/tracks/${id}/synopsis`}>
                        Synopsis
                    </Link>
                    <Link role="button" to={`/tracks/${id}/credits`}>
                        Credits
                    </Link>
                </div>
            </div>
            <div className="track-lyrics" dangerouslySetInnerHTML={{ __html: current.lyrics }}></div>
            <Footer type="lyrics" previous={previous} next={next} tracks={tracks} />
        </>
    )
}

export default Lyrics;