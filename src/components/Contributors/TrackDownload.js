import { useEffect } from "react";
import data from "../../assets/data.json";

const TrackDownload = props => {
    const { tier, max } = props;

    const format = tier => {
        if (tier === "supporter" || tier === "bronze") return "MP3";
        return "MP3 or WAV";
    };

    const renderBody = () => {
        const formatDropdown = () => {
            if (tier === "supporter" || tier === "bronze") return null;
            return (
                <>
                    <label htmlFor="track-dropdown">Select your desired format:</label>
                    <select name="track-dropdown" id="track-dropdown">
                        <option value="mp3">MP3 (smaller size, recommended)</option>
                        <option value="wav">WAV (higher quality, large file size)</option>
                    </select>
                </>
            )
        };

        if (tier === "supporter") {
            return (
                <>
                    <label htmlFor="track-dropdown">Select a track to download ({format(tier)}):</label>
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
            return (
                <>
                    <p>Select tracks to download ({format(tier)}):</p>
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
                    {formatDropdown()}
                </>
            )
        }

        if (tier === "gold" || tier === "platinum" || tier === "executive") return formatDropdown();
    }

    const divClassName = "track-select " + (tier === "supporter" ? "dropdown" : "checklist");

    useEffect(() => {
        const checks = document.querySelectorAll(".track-checkbox input");
        checks.forEach(check => {
            const maxCheck = e => {
                const checked = document.querySelectorAll(".track-checkbox input:checked");
                if (checked.length >= max(tier) + 1) return false;
            }
            
            check.onclick = maxCheck;
        });
    });

    return (
        <div className={divClassName} data-testid="contributor-track-select">
            {renderBody()}
        </div>
    )

}

export default TrackDownload;