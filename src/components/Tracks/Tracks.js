import { useEffect } from "react";
import { Link } from "react-router-dom";
import VersionSelect from "./VersionSelect";

const Tracks = props => {
    const { passcode, tracks, ver, setVer } = props;

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

        let tracks = ["Straight Bars", "Simama Kando", "Combi"];
        for (let item of document.querySelectorAll(".tracklist a")) {
            tracks.forEach(track => {
                if (item.innerHTML === track) item.classList.add("challenge-clue");
            });
        }
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

    const changeVer = ({ target }) => {
        setVer(target.value);
    }

    const renderBody = () => {
        if (passcode === process.env.REACT_APP_PASSCODE || Date.now() > 1667422800000) return (
            <>
                <div className="tracklist-lead" data-testid="tracklist-lead">
                    <p className="head">Select a track to view details.</p>
                    <p>Use the dropdown below to follow the evolution of the tracklist.</p>
                    <VersionSelect ver={ver} handleChange={changeVer} />
                </div>
                <div className="tracklist" data-testid="tracklist-list">
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
        ) 
        
        return <p className="locked">This content will be available on the eve of release day.</p>;
    }

    return (
        <main data-testid="tracklist">
            {renderBody()}
        </main>
    )
}

export default Tracks;