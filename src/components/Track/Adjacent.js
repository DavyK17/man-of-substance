import { Link } from "react-router-dom";

const Adjacent = props => {
    if (props.seq === -1 && props.previous) {
        return (
            <div className="previous">
                <h2>Previous</h2>
                <p>
                    <Link to={`/tracks/${props.previous.id}/${props.type}`}>
                        {props.previous.title}
                    </Link>
                </p>
            </div>
        )
    }

    if (props.seq === 1 && props.next) {
        return (
            <div className="next">
                <h2>Next</h2>
                <p>
                    <Link to={`/tracks/${props.next.id}/${props.type}`}>
                        {props.next.title}
                    </Link>
                </p>
            </div>
        )
    }
}

export default Adjacent;