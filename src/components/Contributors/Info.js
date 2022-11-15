import { useState } from "react";
import { Auth } from "aws-amplify";

import data from "../../assets/data.json";
import Server from "../../api/Server";
import Files from "../../api/Files";

import Footer from "./Footer";
import Rewards from "./Rewards";
import TrackDownload from "./TrackDownload";

const Info = props => {
    const { contributor, setContributor, setType, validUser } = props;
    const [request, setRequest] = useState();

    const getTier = amount => {
        if (amount >= 100 && amount <= 999) return "supporter";
        if (amount >= 1000 && amount <= 1999) return "bronze";
        if (amount >= 2000 && amount <= 3499) return "silver";
        if (amount >= 3500 && amount <= 4999) return "gold";
        if (amount >= 5000 && amount <= 49999) return "platinum";
        if (amount >= 50000) return "executive";
    }
    let tier = getTier(contributor.amount);

    const max = tier => {
        if (tier === "bronze") return 3;
        if (tier === "silver") return 5;
    };

    const displayVideo = () => {
        if (contributor.amount >= 2000) {
            let videoUrl = `${process.env.REACT_APP_AWS_CLOUDFRONT}/public/mp4/${contributor.id}.mp4`
            return (
                <div className="video" data-testid="contributor-video">
                    <video controls>
                        <source src={videoUrl} type="video/mp4"></source>
                    </video>
                </div>
            )
        }
    }

    const claimRewards = async e => {
        e.preventDefault();
        if (request) Files.cancel(request);

        const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];
        if (tier === "supporter") {
            let filename = data.tracks[parseInt(e.target.form[0].value) - 1].filename + ".mp3";
            let key = "mp3/" + filename;

            let downloaded = await Files.download(key, filename, setRequest);
            if (!downloaded) return document.getElementById("status").innerHTML = "An error occurred. Kindly try again.";
        }

        if (tier === "bronze" || tier === "silver") {
            let checked = [];
            for (let i = 0; i < e.target.form.length; i++) if (e.target.form[i].checked) checked.push(e.target.form[i].value);

            let remaining = max(tier) - checked.length;
            if (remaining > 0) return document.getElementById("status").innerHTML = `Kindly select ${remaining} ${remaining === 5 ? " " : "more "}${remaining === 1 ? "song" : "songs"} to download.`;

            let tracks = [];
            let format = e.target.form[17].value;
            checked.map(id => {
                let filename = `${data.tracks[parseInt(id) - 1].filename}.${tier === "silver" ? format : "mp3"}`;
                let key = `${tier === "silver" ? format : "mp3"}/${filename}`;
                return tracks.push({ filename, key });
            });

            let downloaded = await Files.zip(tracks, tier, setRequest);
            if (!downloaded) return document.getElementById("status").innerHTML = "An error occurred. Kindly try again.";
        }

        if (tier === "gold") {
            let tracks = [];
            let format = e.target.form[0].value;
            data.tracks.map(track => {
                let filename = track.filename + `.${format}`;
                let key = `${format}/` + filename;
                return tracks.push({ filename, key });
            });

            let downloaded = await Files.zip(tracks, tier, setRequest);
            if (!downloaded) return document.getElementById("status").innerHTML = "An error occurred. Kindly try again.";
        }

        if (tier === "platinum" || tier === "executive") {
            let files = { music: [], commentary: [] };
            let { music, commentary } = files;
            let format = e.target.form[0].value;

            data.tracks.map(track => {
                let filename = track.filename + `.${format}`;
                let key = `${format}/` + filename;
                music.push({ filename, key });

                filename = track.filename + ".m4a";
                key = "m4a/" + filename;
                return commentary.push({ filename, key });
            });

            let downloaded = await Files.zip(files, tier, setRequest);
            if (!downloaded) return document.getElementById("status").innerHTML = "An error occurred. Kindly try again.";
        }

        document.getElementById("status").innerHTML = responses[Math.floor(Math.random() * responses.length)]
        await Server.claimRewards(contributor.email);

        let signedOut = await awsSignOut();
        if (signedOut) {
            setTimeout(() => {
                setContributor();
                localStorage.removeItem("mos-contributor");
                localStorage.removeItem("mos-contributor-expiry");
        
                setType("login");
            }, 2000);
        }
    }
    
    const backToIntro = e => {
        e.preventDefault();
        setType("intro");
    }

    const awsSignOut = async () => {
        try {
            await Auth.signOut();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    
    const logout = async (e, message = "Ndio kutoka sasa? Haya…") => {
        e.preventDefault();
        if (request) Files.cancel(request);
        document.getElementById("status").innerHTML = message;

        let signedOut = await awsSignOut();
        if (signedOut) {
            setContributor();
            localStorage.removeItem("mos-contributor");
            localStorage.removeItem("mos-contributor-expiry");
    
            setType("login");
        }
    }

    return (
        <>
            <header className="track-head" data-testid="contributor-info">
                <h1 className="title">{contributor.name}</h1>
                <div className="info">
                    <p className="style">{getTier(contributor.amount).charAt(0).toUpperCase() + getTier(contributor.amount).slice(1)}</p>
                    <p className="writers">{contributor.email}</p>
                </div>
            </header>
            {displayVideo()}
            <Rewards tier={getTier(contributor.amount)} />
            <form className="rewards-claim" data-testid="contributor-rewards-claim">
                <TrackDownload tier={getTier(contributor.amount)} max={max} />
                <Footer validUser={validUser} submitClick={claimRewards} introClick={backToIntro} logoutClick={logout} />
            </form>
        </>
    )
}

export default Info;