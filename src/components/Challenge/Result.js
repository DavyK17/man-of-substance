import Server from "../../api/Server";

const Result = props => {
    const { answer, setStarted, setFound } = props;

    const handleSubmit = async(e) => {
        e.preventDefault();

        let response = await Server.getAttempts();
        if (response.length >= 2) {
            let timestamps = response.map(attempt => Date.parse(attempt.createdAt));
            let unlockTime = Math.max(...timestamps) + 86400000;

            if (unlockTime >= Date.now()) {
                document.getElementById("status").innerHTML = "You've attempted the challenge enough times today. Come back tomorrow.";
                setTimeout(() => {
                    setStarted(false);
                    setFound(false);
                }, 3000);
            }
            return;
        }
        
        response = await Server.attemptChallenge(e.target["challenger-name"].value, e.target["challenger-phone"].value, answer);
        setTimeout(() => {
            if (answer === parseInt(process.env.REACT_APP_CHALLENGE_ANSWER)) {
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