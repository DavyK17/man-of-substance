import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../../assets/data.json";
import Synopsis from "./Synopsis";
import Lyrics from "./Lyrics";
import Credits from "./Credits";

const Track = props => {
    let { type } = props;
    let params = useParams();
    let navigate = useNavigate();
    const id = parseInt(params.id);

    useEffect(() => {
        document.onkeydown = ({ code }) => {
            if (id === 17 || (id - 1) >= 1) {
                if (code === "ArrowLeft") return navigate(`/tracks/${id - 1}/${type}`);
            }
            if (id === 1 || (id + 1) <= 17) {
                if (code === "ArrowRight") return navigate(`/tracks/${id + 1}/${type}`);
            }
        }
    }, [id]);

    const current = data.tracks.filter(track => parseInt(track.id) === id)[0];
    const previous = data.tracks.filter(track => parseInt(track.id) === id - 1)[0];
    const next = data.tracks.filter(track => parseInt(track.id) === id + 1)[0];

    const writers = () => {
        if (current.credits.writers.length === 1) return current.credits.writers.join("");
        if (current.credits.writers.length === 2) return current.credits.writers.join(" and ");

        const arr = current.credits.writers.slice();
        const last = arr.pop();
        return arr.join(", ") + ", and " + last;
    }

    const runtime = time => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        const and = min === 0 || sec === 0 ? "" : " and ";
    
        const display = (unit, time) => {
            if (time === 0) return "";
    
            const pluraliser = () => {
                switch(unit) {
                    case "min":
                        return time > 1 ? "minutes" : "minute";
                        break;
                    case "sec":
                        return time > 1 ? "seconds" : "second";
                        break;
                    default:
                        return undefined;
                }
            }
    
            return `${time} ${pluraliser()}`;
        }
    
        return `${display("min", min)}${and}${display("sec", sec)}`;
    }

    const renderBody = type => {
        switch(type) {
            case "synopsis":
                return <Synopsis id={id} current={current} previous={previous} next={next} />
                break;
            case "lyrics":
                return <Lyrics id={id} current={current} previous={previous} next={next} />
                break;
            case "credits":
                return <Credits id={id} current={current} previous={previous} next={next} />
                break;
            default:
                return <Synopsis id={id} current={current} previous={previous} next={next} />
        }
    }
    
    return (
        <main>
            <header className="track-head">
                <h1 className="title">{current.title}</h1>
                <p className="writers">Written by {writers()}</p>
                <div className="info">
                    <p className="style">{current.style.join(" / ")}</p>
                    <p><strong>Runtime:</strong><span id="break"></span>{runtime(current.runtime)}</p>
                </div>
            </header>
            {renderBody(type)}
        </main>
    )
}

export default Track;