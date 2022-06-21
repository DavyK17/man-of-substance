import { useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../../assets/data.json";

const Tracks = () => {
    const displayTitle = id => {
        const track = data.tracks.filter(track => parseInt(track.id) === id);
        return track[0].title;
    }

    const parts = [
        data.tracks.filter(track => parseInt(track.id) <= 7),
        data.tracks.filter(track => parseInt(track.id) >= 8 && parseInt(track.id) <= 14),
        data.tracks.filter(track => parseInt(track.id) >= 15)
    ]

    const displayTracks = part => {
        return parts[part - 1].map((track, i) => {
            return (
                <li key={i}>
                    <Link to={`/tracks/${parseInt(track.id)}`}>
                        {displayTitle(parseInt(track.id))}
                    </Link>
                </li>
            )
        })
    }

    useEffect(() => {
        document.onkeydown = null;
    });

    return (
        <main>
            <p className="tracklist-lead">Select a track to view details.</p>
            <div className="tracklist">
                <div>
                    <h2>Substance</h2>
                    <ol>
                        {displayTracks(1)}
                    </ol>
                </div>
                <div>
                    <h2>Sippin' and Trippin'</h2>
                    <ol start="8">
                        {displayTracks(2)}
                    </ol>
                </div>
                <div>
                    <h2>Bonus</h2>
                    <ol start="15">
                        {displayTracks(3)}
                    </ol>
                </div>
            </div>
        </main>
    )
}

export default Tracks;