import Adjacent from "./Adjacent";
import TopLink from "./TopLink";
import { useNavigate } from "react-router-dom";

const Footer = props => {
    const { type, tracks, previous, next } = props;

    let navigate = useNavigate();
    const topLinkSubmit = e => {
        e.preventDefault();
        return navigate(`/tracks/${e.target[0].value}/${type}`);
    }

    return (
        <footer className="track-footer">
            <div className="previous">
                <Adjacent type={type} seq={-1} previous={previous} />
            </div>
            <TopLink tracks={tracks} handleSubmit={topLinkSubmit} />
            <div className="next">
                <Adjacent type={type} seq={1} next={next} />
            </div>
        </footer>
    )
}

export default Footer;