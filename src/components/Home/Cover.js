import coverP from "../../assets/img/cover.jpg";
import coverW from "../../assets/img/cover.webp";

import mockP from "../../assets/img/placeholder.png";
import mockW from "../../assets/img/placeholder.webp";

const Cover = props => {
    const { passcode } = props;
    const unlocked = passcode === process.env.REACT_APP_PASSCODE || Date.now() > 1667509200000;

    return (
        <picture>
            <source srcSet={unlocked ? coverW : mockW} type="image/webp"></source>
            <img className="cover-art" src={unlocked ? coverP : mockP} alt="Man of Substance cover art" />
        </picture>
    )
}

export default Cover;