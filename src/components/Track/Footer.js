import Adjacent from "./Adjacent";
import TopLink from "./TopLink";

const Footer = props => {
    return (
        <footer className="track-footer">
            <div className="previous">
                <Adjacent type={props.type} seq={-1} previous={props.previous} />
            </div>
            <TopLink type={props.type} tracks={props.tracks} />
            <div className="next">
                <Adjacent type={props.type} seq={1} next={props.next} />
            </div>
        </footer>
    )
}

export default Footer;