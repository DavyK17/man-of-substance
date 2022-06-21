import data from "../../assets/data.json";

const Credits = () => {
    const titles = {
        execProducers: "Executive producers",
        photography: "Photography",
        graphics: "Graphic design",
        website: "Website"
    }

    const credit = (type, key) => {
        if (data.credits.hasOwnProperty(type)) {
            if (type === "execProducers") {
                return (
                    <div key={key} className="credit">
                        <h2>{data.credits[type].length > 1 ? titles[type] : "Executive producer"}</h2>
                        {
                            data.credits[type].map((name, i) => {
                                return (
                                    <p key={i}>{name}</p>
                                )
                            })
                        }
                    </div>
                )
            }

            return (
                <div key={key} className="credit">
                    <h2>{titles[type]}</h2>
                    {
                        data.credits[type].map((name, i) => {
                            return (
                                <p key={i}>{name}</p>
                            )
                        })
                    }
                </div>
            )
        }
        return null;
    }

    return (
        <main>
            <header class="track-head">
                <h1 class="title">Album credits</h1>
            </header>
            <div class="track-credits">
                {
                    Object.keys(titles).map((name, i) => {
                        return credit(name, i)
                    })
                }
            </div>
        </main>
    )
}

export default Credits;