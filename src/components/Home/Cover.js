import coverP from "../../assets/img/cover.jpg";
import coverW from "../../assets/img/cover.webp";

import mockP from "../../assets/img/placeholder.png";
import mockW from "../../assets/img/placeholder.webp";

const Cover = props => {
    const { passcode } = props;

    return (
        <picture>
            <source srcSet={passcode === process.env.REACT_APP_PASSCODE ? coverW : mockW} type="image/webp"></source>
            <img className="cover-art" src={passcode === process.env.REACT_APP_PASSCODE ? coverP : mockP} alt="Man of Substance cover art" />
        </picture>
    )
}

export default Cover;