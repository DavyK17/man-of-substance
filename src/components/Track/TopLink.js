import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TopLink = props => {
    let navigate = useNavigate();
    let params = useParams();
    const id = parseInt(params.id);

    const changeTrackNum = id => {
        const input = document.getElementById("track-number");
        input.value = id;
    }

    useEffect(() => {
        changeTrackNum(id);
    }, [id]);

    const handleSubmit = event => {
        event.preventDefault();
        const value = event.target[0].value;

        return navigate(`/tracks/${value}/${props.type}`);
    }

    return (
        <div className="top-link">
            <form className="track-spinnerbox" onSubmit={handleSubmit}>
                <input type="number" id="track-number" min="1" max="17" defaultValue={id}></input>
            </form>
            <a href="#top">Back to Top</a>
        </div>
    )
}

export default TopLink;