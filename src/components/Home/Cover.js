import { useState, useEffect } from "react";

import coverP from "../../assets/img/cover.png";
import coverW from "../../assets/img/cover.webp";

import mockP from "../../assets/img/placeholder.png";
import mockW from "../../assets/img/placeholder.webp";

const Cover = () => {
    const [locked, setLocked] = useState();

    // useEffect(() => {
    //     setLocked(Math.round(Date.now() / 1000) < 1667509200 ? true : false);
    // }, []);

    return (
        <picture>
            <source srcSet={locked ? mockW : coverW} type="image/webp"></source>
            <img className="cover-art" src={locked ? mockP : coverP} alt="Man of Substance cover art" />
        </picture>
    )
}

export default Cover;