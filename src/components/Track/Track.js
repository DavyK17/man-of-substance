import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import Synopsis from "./Synopsis";
import Lyrics from "./Lyrics";
import Credits from "./Credits";
import Challenge from "../Challenge/Challenge";
import NotFound from "../Body/NotFound";

const Track = props => {
    let { passcode, tracks, type = "synopsis" } = props;
    const [found, setFound] = useState(false);
    const unlocked = passcode === process.env.REACT_APP_PASSCODE || Date.now() > 1667509200000;

    let params = useParams();
    let location = useLocation();
    let navigate = useNavigate();
    const id = parseInt(params.id);

    useEffect(() => {
        document.onkeydown = ({ code, altKey, ctrlKey, metaKey, shiftKey}) => {
            if (location.pathname !== "/tracks" && location.pathname.includes("/tracks")) {
                if (altKey || ctrlKey || metaKey || shiftKey) return null;

                if (id === tracks.length || (id - 1) >= 1) if (code === "ArrowLeft") return navigate(`/tracks/${id - 1}/${type}`);
                if (id === 1 || (id + 1) <= tracks.length) if (code === "ArrowRight") return navigate(`/tracks/${id + 1}/${type}`);
    
                if (code === "KeyC") return navigate(`/tracks/${id}/credits`);
                if (code === "KeyL") return navigate(`/tracks/${id}/lyrics`);
                if (code === "KeyS") return navigate(`/tracks/${id}/synopsis`);
    
                if (code === "Home") return navigate(`/tracks`);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, type]);

    const current = tracks.filter(track => parseInt(track.id) === id)[0];
    const previous = tracks.filter(track => parseInt(track.id) === id - 1)[0];
    const next = tracks.filter(track => parseInt(track.id) === id + 1)[0];

    const writers = () => {
        if (current.credits.writers.length === 1) return current.credits.writers.join("");
        if (current.credits.writers.length === 2) return current.credits.writers.join(" and ");

        const arr = current.credits.writers.slice();
        const last = arr.pop();
        return arr.join(", ") + " and " + last;
    }

    const runtime = time => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        const and = min === 0 || sec === 0 ? "" : " and ";
    
        const display = (unit, time) => {
            if (time === 0) return "";
    
            const pluraliser = () => {
                let label;
                switch(unit) {
                    case "min":
                        label = time > 1 ? "minutes" : "minute";
                        break;
                    case "sec":
                        label = time > 1 ? "seconds" : "second";
                        break;
                    default:
                        label = undefined;
                }
                return label;
            }
    
            return `${time} ${pluraliser()}`;
        }
    
        return `${display("min", min)}${and}${display("sec", sec)}`;
    }

    const renderBody = type => {
        let body;
        let defaultBody = <Synopsis id={id} current={current} previous={previous} next={next} tracks={tracks} />;

        switch(type) {
            case "synopsis":
                body = <Synopsis id={id} current={current} previous={previous} next={next} tracks={tracks} />
                break;
            case "lyrics":
                body = <Lyrics id={id} current={current} previous={previous} next={next} tracks={tracks} setFound={setFound} />
                break;
            case "credits":
                body = <Credits id={id} current={current} previous={previous} next={next} tracks={tracks} />
                break;
            default:
                body = defaultBody;
        }

        let lockedText = <p className="locked">This content will be available on release day.</p>
        return !unlocked ? lockedText : body;
    }

    const renderComponent = () => {
        if (found) return <Challenge setFound={setFound} />;
        if (id < 1 || id > tracks.length || isNaN(id)) return <NotFound />;

        let info = !unlocked ? null : (
            <div className="info">
                <p className="style">{current.style.join(" / ")}</p>
                <p><strong>Runtime:</strong><span id="break"></span>{runtime(current.runtime)}</p>
            </div>
        )

        let head = !(passcode === process.env.REACT_APP_PASSCODE || Date.now() > 1667422800000) ? null : (
            <header className="track-head">
                <h1 className="title">{current.title}</h1>
                <p className="writers">Written by {writers()}</p>
                {info}
            </header>
        )
                                    
        return (
            <>
                {head}
                {renderBody(type)}
            </>
        ) 
    }

    const swipeHandlers = useSwipeable({
        onSwiped: ({ dir, absY, deltaX }) => {
            if (dir === "Up" || dir === "Down" || absY > 100) return null;
            if (deltaX < 0) if (id === 1 || (id + 1) <= tracks.length) return navigate(`/tracks/${next.id}/${type}`);
            if (deltaX > 0) if (id === tracks.length || (id - 1) >= 1) return navigate(`/tracks/${previous.id}/${type}`);
        },
        delta: 50,
        swipeDuration: 250,
        preventScrollOnSwipe: true
    });
    
    return (
        <main {...swipeHandlers}>
            {renderComponent()}
        </main>
    );
}

export default Track;