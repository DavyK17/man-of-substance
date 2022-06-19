import { useParams } from "react-router-dom";
import data from "../../assets/data.json";
import Synopsis from "./Synopsis";
import Lyrics from "./Lyrics";
import Credits from "./Credits";

const Track = props => {
    let { type } = props;
    let params = useParams();
    const id = parseInt(params.id);

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

    const style = () => {
        const arr = current.style.map(el => el.toLowerCase());
        const str = arr[0].charAt(0).toUpperCase() + arr[0].slice(1);

        arr[0] = str;
        return arr.join(", ");
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
                    <p><strong>Runtime:</strong><span id="break"></span>{runtime(current.runtime)}</p>
                    <p><strong>Style:</strong><span id="break"></span>{style()}</p>
                </div>
            </header>
            {renderBody(type)}
        </main>
    )
}

export default Track;