
const Result = props => {
    const { handleSubmit } = props;

    return (
        <form className="challenge result" onSubmit={handleSubmit} autoComplete="off" data-testid="challenge-result">
            <h1>Secret Challenge</h1>
            <p>Enter your details below:</p>
            <div className="input result">
                <label className="sr-only" htmlFor="challenger-name">Name</label>
                <input type="text" id="challenger-name" placeholder="Name" required />
                <label className="sr-only" htmlFor="challenger-name">M-Pesa number</label>
                <input type="tel" id="challenger-phone" pattern="^254(11[0-5]|7(([0-2]|9)\d|4([0-6]|8)|5[7-9]|6[8-9]))\d{6}$" placeholder="M-Pesa number (i.e. 254xxxxxxxxx)" required />
            </div>
            <input type="submit" id="challenger-submit" value="Enter" />
            <p id="status"></p>
        </form>
    )
}

export default Result;