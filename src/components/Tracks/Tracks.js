import { useEffect } from "react";
import { Link } from "react-router-dom";

const Tracks = props => {
    const { tracks, ver, setVer } = props;

    const displayTitle = id => {
        const track = tracks.filter(track => parseInt(track.id) === id);
        return track[0].title;
    }

    const part = n => {
        let first = -1;
        let last = -1;

        if (n === 1) {
            if (ver === "full" || ver === "base") last = 7;
            if (ver === "mixtape" || ver === "lite") last = 5;
            return tracks.filter(track => parseInt(track.id) <= last);
        }

        if (n === 2) {
            if (ver === "full" || ver === "base") {
                first = 8;
                last = 14;
            }
            if (ver === "mixtape" || ver === "lite") {
                first = 6;
                last = 10;
            };
            return tracks.filter(track => parseInt(track.id) >= first && parseInt(track.id) <= last);
        }

        if (n === 3) {
            if (ver === "base" || ver === "lite" ) return [];
            if (ver === "full") first = 15;
            if (ver === "mixtape") first = 11;
            return tracks.filter(track => parseInt(track.id) >= first);
        }
    }
    const parts = [part(1), part(2), part(3)];

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

    const renderBonus = () => {
        if (ver === "full" || ver === "mixtape") return (
            <div>
                <h2>Bonus</h2>
                <ol start={parts[2][0] ? parts[2][0].id : "0"}>
                    {displayTracks(3)}
                </ol>
            </div>
        )
    }

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
                    <ol start={parts[1][0].id}>
                        {displayTracks(2)}
                    </ol>
                </div>
                {renderBonus()}
            </div>
        </main>
    )
}

export default Tracks;