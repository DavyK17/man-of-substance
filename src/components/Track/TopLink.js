import { useEffect } from "react";
import { useParams } from "react-router-dom";

const TopLink = props => {
    const { tracks, handleSubmit } = props;

    let params = useParams();
    const id = parseInt(params.id);

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
                <input type="number" id="track-number" min="1" max={tracks.length} defaultValue={id}></input>
            </form>
            <a href="#top">Back to Top</a>
        </div>
    )
}

export default TopLink;