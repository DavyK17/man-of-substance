import { useState, useEffect } from "react";

const VersionSelect = props => {
    const { ver, setVer, menuToggle } = props;
    const [locked, setLocked] = useState();

    // useEffect(() => {
    //     setLocked(Math.round(Date.now() / 1000) < 1667509200 ? true : false);
    // }, []);

    const handleChange = ({ target }) => {
        setVer(target.value);
        menuToggle(-1);
    }

    return locked ? null : (
        <div className="version-select">
            <label htmlFor="version">Version</label>
            <select name="version" id="version" onChange={handleChange} defaultValue={ver}>
                <option value="base">Base</option>
                <option value="mixtape">Mixtape</option>
                <option value="expanded">Expanded</option>
                <option value="full">Full</option>
            </select>
        </div>
    )
}

export default VersionSelect;