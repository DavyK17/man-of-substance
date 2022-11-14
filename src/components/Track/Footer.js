import Adjacent from "./Adjacent";
import TopLink from "./TopLink";
import { useNavigate, useParams } from "react-router-dom";

const Footer = props => {
    const { type, tracks, previous, next } = props;

    let navigate = useNavigate();
    const topLinkSubmit = e => {
        e.preventDefault();
        return navigate(`/tracks/${e.target[0].value}/${type}`);
    }

    let params = useParams();
    const id = parseInt(params.id);

    return (
        <footer className="track-footer" data-testid="track-footer">
            <div className="previous">
                <Adjacent type={type} seq={-1} previous={previous} />
            </div>
            <TopLink id={id} tracks={tracks} handleSubmit={topLinkSubmit} />
            <div className="next">
                <Adjacent type={type} seq={1} next={next} />
            </div>
        </footer>
    )
}

export default Footer;