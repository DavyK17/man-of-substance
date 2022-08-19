import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Tracks = props => {
    const { tracks, ver } = props;
    const [locked, setLocked] = useState();

    // useEffect(() => {
    //     setLocked(Math.round(Date.now() / 1000) < 1667422800 ? true : false);
    // }, []);

    const displayTitle = id => {
        const track = tracks.filter(track => parseInt(track.id) === id);
        return track[0].title;
    }

    const part = n => {
        let first = -1;
        let last = -1;

        if (n === 1) {
            if (ver === "full" || ver === "expanded") last = 7;
            if (ver === "mixtape" || ver === "base") last = 5;
            return tracks.filter(track => parseInt(track.id) <= last);
        }

        if (n === 2) {
            if (ver === "full" || ver === "expanded") {
                first = 8;
                last = 14;
            }
            if (ver === "mixtape" || ver === "base") {
                first = 6;
                last = 10;
            };
            return tracks.filter(track => parseInt(track.id) >= first && parseInt(track.id) <= last);
        }

        if (n === 3) {
            if (ver === "expanded" || ver === "base" ) return [];
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

    const renderBody = () => {
        if (locked) return <p className="locked">This content will be available on the eve of release day.</p>;
        return <>
                    <div className="tracklist-lead">
                        <p className="head">Select a track to view details.</p>
                        <p>Use the dropdown in the menu to follow the evolution of the tracklist.</p>
                    </div>
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
                </>
    }

    return (
        <main data-testid="tracklist">
            {renderBody()}
        </main>
    )
}

export default Tracks;