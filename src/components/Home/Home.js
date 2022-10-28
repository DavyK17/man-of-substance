import { Link } from "react-router-dom";
import Cover from "./Cover";

const Home = props => {
    const { passcode, setPasscode } = props;

    const skipUnlock = () => setPasscode(1);
    const handleSubmit = e => {
        e.preventDefault();
        if (e.target[0].value === process.env.REACT_APP_PASSCODE) {
            localStorage.setItem("mos-passcode", e.target[0].value);
            return setPasscode(e.target[0].value);
        }

        return document.getElementById("status").innerHTML = "The passcode you entered was incorrect. Kindly try again.";
    }

    const renderHome = () => {
        if (!passcode && Date.now() > 1667059200000 && Date.now() < 1667070000000) return (
            <main className="contributors">
                <form className="challenge passcode" onSubmit={handleSubmit} autoComplete="off">
                    <h1>Listening party</h1>
                    <p>Enter the passcode to unlock all content:</p>
                    <div className="input rewards">
                        <input type="text" id="rewards-email" name="passcode-entry" pattern="\d+" placeholder="Numbers only" />
                        <input type="submit" id="challenge-submit" name="passcode-submit" value="Enter" />
                    </div>
                </form>
    
                <div className="link-buttons">
                    <button onClick={skipUnlock}>Skip</button>
                    <p id="status"></p>
                </div>
            </main>
        )

        return (
            <main className="home">
                <header className="home-synopsis">
                    <h1 className="date">4 November 2022</h1>
                    <p>Hi there! My name is Davy, and this is my debut studio album <em>Man of Substance</em>, released under my pseudonym DVK. It's a hip hop project I'm extremely proud to have embarked on and released, and the second extended project on my catalogue
                        after my debut EP <em><a href="https://bit.ly/NotARapperEP" target="blank" rel="noreferrer">Not a Rapper</a></em>.</p>
                    <p>As my first full-length project, I felt it fitting to lay out <em>Man of Substance</em> as an introduction to me as a person and as a musician, with the tracklist divided into 3 different parts that seek to achieve that goal. The title of the album captures my self-image and how I would like to portray myself to
                        others.</p>
                    <p>The album begins with <em>Substance</em> (Part I), which acts as a window into my background, my personality, and my musical tastes. The tracks here explore different aspects of my life and worldview in order to give the listener an idea of
                        the kind of person I am.</p>
                    <p>The main presentation closes with <em>Sippin' and Trippin'</em> (Part II), which showcases my storytelling ability as a musician and as a comedian. It tells the story of a young man named Christopher, who enjoys a night out with his friends
                        and gets arrested on his way home. Upon being released, he realises the police have swindled him out of his cash; he resorts to finding a “sugar mommy” to help him with his financial trouble in exchange for some sexual gratification, while
                        compromising his sexual health in the process.</p>
                    <p>The album ends with the bonus section (Part III), which consists of two previously released tracks that I'd like to reintroduce to new listeners (because I love them so much), as well as another new track.</p>
                    <p>My hope is that this album fosters a continued interest in my music and my comedy (as well as the larger Nairobi stand-up comedy scene, which I've been a part of for over 18 months now). I hope you have as much fun listening to this album
                        as I did making it, and if it resonates with you, I hope you also share it with your friends and family.</p>
                    <p>Feel free to browse through this website I made (yes, I'm also a <a href="https://davyk17.github.io" target="_blank" rel="noreferrer">web developer</a>) to allow listeners to read through the lyrics to each song and discover all the wonderful people that made
                        this album possible. I appreciate you for supporting me on my journey as an artist; there's plenty more to come.</p>
                    <p className="signature">Davy Kamanzi / DVK</p>
                </header>
                <div className="home-links">
                    <Cover passcode={passcode} />
                    <div className="link-buttons">
                        {
                            Date.now() < 1667509200000 ? null : (
                                <a role="button" target="_blank" href="https://bit.ly/stream-mos" rel="noreferrer">
                                    Stream the album
                                </a>
                            )
                        }
                        <Link role="button" to="/contributors">
                            Contributors
                        </Link>
                        <Link role="button" to="/tracks">
                            Tracklist
                        </Link>
                        <Link role="button" to="/credits">
                            Album credits
                        </Link>
                        <a role="button" target="_blank" href="https://linktr.ee/davykamanzi" rel="noreferrer">
                            Follow DVK
                        </a>
                    </div>
                </div>
            </main>
        )
    }

    return renderHome();
}

export default Home;