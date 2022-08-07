import data from "../../assets/data.json";

const TrackDownload = props => {
    const { tier } = props;

    const renderBody = () => {
        if (tier === "supporter") {
            return (
                <>
                    <label htmlFor="track-dropdown">Select a track to download:</label>
                    <select name="track-dropdown" id="track-dropdown">
                        {
                            data.tracks.map((track, i) => {
                                return <option key={i} value={parseInt(track.id)}>{track.title}</option>
                            })
                        }
                    </select>
                </>
            )
        }

        if (tier === "bronze" || tier === "silver") {
            const max = tier => {
                if (tier === "bronze") return 3;
                if (tier === "silver") return 5;
            };

            const checks = document.querySelectorAll(".checklist-wrapper input");
            checks.forEach(check => {
                const maxCheck = e => {
                    const checked = document.querySelectorAll(".checklist-wrapper input:checked");
                    if (checked.length >= max(tier) + 1) return false;
                }

                check.onclick = maxCheck;
            });

            return (
                <>
                    <p>Select up to {max(tier)} tracks to download:</p>
                    <div className="checklist-wrapper">
                        <ol>
                            {
                                data.tracks.filter(track => parseInt(track.id) <= 7).map((track, i) => {
                                    return (
                                        <li key={i} className="track-checkbox">
                                            <input type="checkbox" id={`track-${track.id}`} name={`track-${track.id}`} value={parseInt(track.id)}></input>
                                            <label htmlFor={`track-${track.id}`}>{track.title}</label>
                                        </li>
                                    )
                                })
                            }
                        </ol>
                        <ol start="8">
                            {
                                data.tracks.filter(track => parseInt(track.id) >= 8 && parseInt(track.id) <= 14).map((track, i) => {
                                    return (
                                        <li key={i} className="track-checkbox">
                                            <input type="checkbox" id={`track-${track.id}`} name={`track-${track.id}`} value={parseInt(track.id)}></input>
                                            <label htmlFor={`track-${track.id}`}>{track.title}</label>
                                        </li>
                                    )
                                })
                            }
                        </ol>
                        <ol start="15">
                            {
                                data.tracks.filter(track => parseInt(track.id) >= 15).map((track, i) => {
                                    return (
                                        <li key={i} className="track-checkbox">
                                            <input type="checkbox" id={`track-${track.id}`} name={`track-${track.id}`} value={parseInt(track.id)}></input>
                                            <label htmlFor={`track-${track.id}`}>{track.title}</label>
                                        </li>
                                    )
                                })
                            }
                        </ol>
                    </div>
                </>
            )
        }
    }

    const divClassName = "track-select " + (tier === "supporter" ? "dropdown" : "checklist");

    return (
        <div className={divClassName}>
            {renderBody()}
        </div>
    )

}

export default TrackDownload;