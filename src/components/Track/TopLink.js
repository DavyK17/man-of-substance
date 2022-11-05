import { useEffect } from "react";

const TopLink = props => {
    const { id, tracks, handleSubmit } = props;

    const changeTrackNum = id => {
        const input = document.getElementById("track-number");
        input.value = id;
    }

    useEffect(() => {
        changeTrackNum(id);
    }, [id]);

    return (
        <div className="top-link">
            <form className="track-spinnerbox" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="track-number">Track number</label>
                <input type="number" id="track-number" min="1" max={tracks.length} defaultValue={id}></input>
            </form>
            <a href="#top">Back to Top</a>
        </div>
    )
}

export default TopLink;