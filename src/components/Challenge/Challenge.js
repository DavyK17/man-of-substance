import { useState } from "react";
import Start from "./Start";
import Result from "./Result"

const Challenge = () => {
    const [answer, setAnswer] = useState();
    const [started, setStarted] = useState(false);

    if (started) return <Result answer={answer} setStarted={setStarted} />
    return <Start setAnswer={setAnswer} setStarted={setStarted} />
}

export default Challenge;