import env from "react-dotenv";

const Result = props => {
    const { answer, setStarted } = props;

    const handleSubmit = e => {
        e.preventDefault();
        
        setTimeout(() => {
            if (answer === parseInt(env.CHALLENGE_ANSWER)) {
                document.getElementById("status").innerHTML = "Congratulations!";
            } else {
                document.getElementById("status").innerHTML = "Your answer was wrong. Try again.";
                setTimeout(() => {
                    setStarted(false);
                }, 1500);
            }
        }, Math.floor(Math.random() * 3000));
    }

    return (
        <form className="challenge result" onSubmit={handleSubmit} autoComplete="off">
            <h1>Secret Challenge</h1>
            <p>Enter your details below:</p>
            <div className="input result">
                <input type="text" id="challenger-name" placeholder="Name" required />
                <input type="tel" id="challenger-phone" pattern="^0[0-9]{9}$" placeholder="M-Pesa number (i.e. 0xxxxxxxxx)" required />
            </div>
            <input type="submit" id="challenger-submit" value="Enter" />
            <p id="status"></p>
        </form>
    )
}

export default Result;