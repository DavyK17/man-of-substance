import { Link } from "react-router-dom";
import data from "../../assets/data.json";

const Tracks = () => {
    const displayTitle = id => {
        const track = data.tracks.filter(track => parseInt(track.id) === id);
        return track[0].title;
    }

    return (
        <main>
            <p className="tracklist-lead">Select a track to view details.</p>
            <div className="tracklist">
                <div>
                    <h2>Substance</h2>
                    <ol>
                        <li>
                            <Link to="/tracks/1">
                                {displayTitle(1)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/2">
                                {displayTitle(2)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/3">
                                {displayTitle(3)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/4">
                                {displayTitle(4)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/5">
                                {displayTitle(5)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/6">
                                {displayTitle(6)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/7">
                                {displayTitle(7)}
                            </Link>
                        </li>
                    </ol>
                </div>
                <div>
                    <h2>Sippin' and Trippin'</h2>
                    <ol start="8">
                        <li>
                            <Link to="/tracks/8">
                                {displayTitle(8)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/9">
                                {displayTitle(9)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/10">
                                {displayTitle(10)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/11">
                                {displayTitle(11)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/12">
                                {displayTitle(12)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/13">
                                {displayTitle(13)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/14">
                                {displayTitle(14)}
                            </Link>
                        </li>
                    </ol>
                </div>
                <div>
                    <h2>Bonus</h2>
                    <ol start="15">
                        <li>
                            <Link to="/tracks/15">
                                {displayTitle(15)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/16">
                                {displayTitle(16)}
                            </Link>
                        </li>
                        <li>
                            <Link to="/tracks/17">
                                {displayTitle(17)}
                            </Link>
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    )
}

export default Tracks;