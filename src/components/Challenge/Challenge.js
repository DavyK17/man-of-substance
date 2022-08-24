import { useState, useEffect } from "react";
import Server from "../../api/Server";
import Start from "./Start";
import Result from "./Result";

const Challenge = props => {
    const { setFound } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [answer, setAnswer] = useState();
    const [started, setStarted] = useState(false);
    const [solved, setSolved] = useState(false);

    const isSolved = async() => {
        try {
            let response = await Server.getCorrectAttempt();
            if (response) {
                setSolved(true);
            }
            
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        isSolved();
    }, [])

    if (started) return <Result answer={answer} setStarted={setStarted} setSolved={setSolved} setFound={setFound} />
    return <Start isLoading={isLoading} solved={solved} setAnswer={setAnswer} setStarted={setStarted} />
}

export default Challenge;