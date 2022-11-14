const VersionSelect = props => {
    const { ver, handleChange } = props;

    return (
        <div className="version-select" data-testid="version-select">
            <label htmlFor="version" className="sr-only">Version</label>
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