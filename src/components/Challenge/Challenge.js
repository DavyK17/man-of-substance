import { useState } from "react";
import Start from "./Start";
import Result from "./Result";

const Challenge = props => {
    const { setFound } = props;
    const [answer, setAnswer] = useState();
    const [started, setStarted] = useState(false);

    if (started) return <Result answer={answer} setStarted={setStarted} setFound={setFound} />
    return <Start setAnswer={setAnswer} setStarted={setStarted} />
}

export default Challenge;