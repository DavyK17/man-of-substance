const Start = props => {
    const { setAnswer, setStarted } = props;

    const handleSubmit = e => {
        e.preventDefault();
        document.getElementById("status").innerHTML = "Tulia kiambatasi…";

        setTimeout(() => {
            setAnswer(parseInt(e.target["challenge-answer"].value));
            setStarted(true);
        }, Math.floor(Math.random() * 3000));
    }

    const renderBody = () => {
        return <>
            <p>How many lines on the album (in total) explicitly reference a fighting game?</p>
            <div className="input challenge">
                <input type="number" id="challenge-answer" min="1" required />
                <input type="submit" id="challenge-submit" value="Enter" />
            </div>
            <p id="status">NOTICE: By clicking "Enter", you are consenting to the collection and use of your IP address by Ginton Entertainment to keep track of your challenge attempts. If you do not agree to this condition, please do not click "Enter".</p>
        </>
    }

    return (
        <form className="challenge start" onSubmit={handleSubmit} autoComplete="off">
            <h1>Secret Challenge</h1>
            {renderBody()}
        </form>
    )
}

export default Start;