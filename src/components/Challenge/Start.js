import Skeleton from "react-loading-skeleton";

const Start = props => {
    const { isLoading, solved, setAnswer, setStarted } = props;

    const handleSubmit = e => {
        e.preventDefault();
        setTimeout(() => {
            setAnswer(parseInt(e.target["challenge-answer"].value));
            setStarted(true);
        }, Math.floor(Math.random() * 3000));
    }

    const renderBody = () => {
        if (isLoading) return <Skeleton />;
        if (solved) return <p>The challenge has already been solved.</p>;
        
        return <>
            <p>How many lines on the album (in total) explicitly reference a fighting game?</p>
            <div className="input challenge">
                <input type="number" id="challenge-answer" min="1" required />
                <input type="submit" id="challenge-submit" value="Enter" />
            </div>
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