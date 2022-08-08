const Challenge = () => {
    const handleSubmit = event => {
        event.preventDefault();
    }

    return (
        <form class="challenge" onSubmit={handleSubmit}>
            <h1>Secret Challenge</h1>
            <p>How many lines on the album (in total) reference a fighting game?</p>
            <div class="input">
                <input type="number" id="challenge-answer" min="1" />
                <input type="submit" id="challenge-submit" value="Enter" />
            </div>
        </form>
    )
}

export default Challenge;