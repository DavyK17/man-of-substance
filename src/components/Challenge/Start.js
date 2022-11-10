const Start = props => {
    const { handleSubmit } = props;

    return (
        <form className="challenge start" onSubmit={handleSubmit} autoComplete="off" data-testid="challenge-start">
            <h1>Secret Challenge</h1>
            <p>How many lines on the album (in total) explicitly reference a fighting game?</p>
            <div className="input challenge">
                <label className="sr-only" htmlFor="challenge-answer">Answer</label>
                <input type="number" id="challenge-answer" min="1" required />
                <input type="submit" id="challenge-submit" value="Enter" />
            </div>
            <p id="status">NOTICE: By clicking "Enter", you are consenting to the collection and use of your IP address by Ginton Entertainment to keep track of your challenge attempts. If you do not agree to this condition, please do not click "Enter".</p>
        </form>
    )
}

export default Start;