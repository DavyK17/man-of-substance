const VersionSelect = props => {
    const { ver, setVer, menuToggle } = props;

    const handleChange = ({ target }) => {
        setVer(target.value);
        menuToggle(-1);
    }

    return (
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