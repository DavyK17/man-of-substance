import { useState } from "react";
import Server from "../../api/Server";
import Start from "./Start";
import Result from "./Result";

const Challenge = props => {
    const { setFound } = props;
    const [answer, setAnswer] = useState();
    const [started, setStarted] = useState(false);

    const startSubmit = e => {
        e.preventDefault();
        document.getElementById("status").innerHTML = "Tulia kiambatasi…";

        setTimeout(() => {
            setAnswer(parseInt(e.target["challenge-answer"].value));
            setStarted(true);
        }, Math.floor(Math.random() * 3000));
    }

    const resultSubmit = async(e) => {
        e.preventDefault();
        document.getElementById("status").innerHTML = "Drum roll please…";

        try {
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
            if (response === 403) return document.getElementById("status").innerHTML = "Sorry! The challenge has already been completed.";

            setTimeout(() => {
                if (response.includes("Challenge completed")) {
                    document.getElementById("status").innerHTML = "Congratulations! You will receive your prize money shortly.";
                    setTimeout(() => {
                        setFound(false);
                    }, 1500);
                } else {
                    document.getElementById("status").innerHTML = "Your answer was wrong. Try again.";
                    setTimeout(() => {
                        setStarted(false);
                    }, 1500);
                }
            }, Math.floor(Math.random() * 3000));
        } catch (err) {
            console.log(err);
            document.getElementById("status").innerHTML = "An error occurred. Kindly try again.";
        }
    }

    if (started) return <Result handleSubmit={resultSubmit} />
    return <Start handleSubmit={startSubmit} />
}

export default Challenge;