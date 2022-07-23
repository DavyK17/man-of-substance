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
            if (ver === "main" || ver === "base") last = 7;
            if (ver === "mixtape" || ver === "mixtapeBase") last = 5;
            return tracks.filter(track => parseInt(track.id) <= last);
        }

        if (n === 2) {
            if (ver === "main" || ver === "base") {
                first = 8;
                last = 14;
            }
            if (ver === "mixtape" || ver === "mixtapeBase") {
                first = 6;
                last = 10;
            };
            return tracks.filter(track => parseInt(track.id) >= first && parseInt(track.id) <= last);
        }

        if (n === 3) {
            if (ver === "base" || ver === "mixtapeBase" ) return [];
            if (ver === "main") first = 15;
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
        if (ver === "main" || ver === "mixtape") return (
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
            <button onClick={() => setVer("main")}>Main Edition</button>
            <button onClick={() => setVer("base")}>Base Edition</button>
            <button onClick={() => setVer("mixtape")}>Mixtape Edition</button>
            <button onClick={() => setVer("mixtapeBase")}>Mixtape Base Edition</button>
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