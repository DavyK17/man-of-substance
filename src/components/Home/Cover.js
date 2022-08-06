import png from "../../assets/img/cover.png";
import webp from "../../assets/img/cover.webp";

const Cover = () => {
    return (
        <picture>
            <source srcSet={webp} type="image/webp"></source>
            <img className="cover-art" src={png} alt="Man of Substance cover art" />
        </picture>
    )
}

export default Cover;