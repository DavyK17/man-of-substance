const Start = props => {
    const { setStarted, setAnswer } = props;

    const handleSubmit = e => {
        e.preventDefault();
        setTimeout(() => {
            setAnswer(parseInt(e.target["challenge-answer"].value));
            setStarted(true);
        }, Math.floor(Math.random() * 3000));
    }

    return (
        <form className="challenge start" onSubmit={handleSubmit} autoComplete="off">
            <h1>Secret Challenge</h1>
            <p>How many lines on the album (in total) reference a fighting game?</p>
            <div className="input challenge">
                <input type="number" id="challenge-answer" min="1" required />
                <input type="submit" id="challenge-submit" value="Enter" />
            </div>
        </form>
    )
}

export default Start;