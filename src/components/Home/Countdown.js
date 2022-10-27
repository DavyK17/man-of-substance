const Countdown = () => {
    const timer = () => {
        const date = new Date(1666904400000);
        let interval = setInterval(() => {
            let now = new Date();
            let timeLeft = date - now;

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)).toLocaleString("en-KE", { minimumIntegerDigits: 2 });
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toLocaleString("en-KE", { minimumIntegerDigits: 2 });
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toLocaleString("en-KE", { minimumIntegerDigits: 2 });
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toLocaleString("en-KE", { minimumIntegerDigits: 2 });
            
            let text = document.getElementById("timer");
            if (text) text.innerHTML = `${days}:${hours}:${minutes}:${seconds}`;

            if (timeLeft < 0) clearInterval(interval);
        }, [1000]);
    }

    return (
        <main className="countdown">
            <header className="track-head">
                <h1 className="title sr-only">Man of Substance</h1>
            </header>
            <p id="timer">{timer()}</p>
        </main>
    )
}

export default Countdown;