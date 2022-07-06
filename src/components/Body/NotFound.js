import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
    let location = useLocation();
    let navigate = useNavigate();

    const goBack = event => {
        event.preventDefault();
        navigate(-1);
    }

    return (
        <main>
            <div className="not-found" data-testid="not-found">
                <div className="head">
                    <h1>Not found</h1>
                    <p className="link">{location.pathname}</p>
                </div>
                <p>You came for this link, nikasema, "No".</p>
                <p>Ukaamua <a href="/#" onClick={goBack}>ku-click</a> ndio urudi nyuma, yo.</p>
            </div>
        </main>
    )
}

export default NotFound;