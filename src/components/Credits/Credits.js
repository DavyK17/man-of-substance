import data from "../../assets/data.json";

const Credits = props => {
    const { passcode } = props;
    const titles = {
        execProducers: "Executive producers",
        photography: "Photography",
        styling: "Styling",
        artwork: "Artwork",
        trailer: "Trailer",
        visualiser: "Visualiser",
        website: "Website"
    }

    const credit = (type, key) => {
        if (data.credits.hasOwnProperty(type)) {
            if (type === "copyright") return null;

            if (type === "execProducers") {
                return (
                    <div key={key} className="credit" data-testid={type}>
                        <h2>{data.credits[type].length > 1 ? titles[type] : "Executive producer"}</h2>
                        {
                            data.credits[type].map((name, i) => {
                                return (
                                    <p role="paragraph" key={i}>{name}</p>
                                )
                            })
                        }
                    </div>
                )
            }

            return (
                <div key={key} className="credit" data-testid={type}>
                    <h2>{titles[type]}</h2>
                    {
                        data.credits[type].map((name, i) => {
                            return (
                                <p role="paragraph" key={i}>{name}</p>
                            )
                        })
                    }
                </div>
            )
        }
        return null;
    }

    const renderBody = () => {
        if (passcode === process.env.REACT_APP_PASSCODE || Date.now() > 1667509200000) return (
            <>
                <header className="track-head" data-testid="credits-head">
                    <h1 className="title">Album credits</h1>
                </header>
                <div className="track-credits" data-testid="credits-body">
                    {
                        Object.keys(titles).map((name, i) => {
                            return credit(name, i)
                        })
                    }
                </div>
                <p role="note" className="copyright">&copy; &#8471; {data.credits.copyright[0]}</p>
            </>
        )

        return <p className="locked">This content will be available on release day.</p>
    }

    return (
        <main data-testid="credits">
            {renderBody()}
        </main>
    )
}

export default Credits;