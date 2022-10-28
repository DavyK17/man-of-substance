import { useState } from "react";
import { Auth, Storage } from "aws-amplify";
import data from "../../assets/data.json";
import Server from "../../api/Server";

import JSZip from "jszip";
import streamSaver from "streamsaver";

const Footer = props => {
    const { tier, max, contributor, setContributor, setType, validUser } = props;
    const [request, setRequest] = useState();

    const Files = {
        cancel: () => Storage.cancel(request, "Request cancelled"),

        download: async(key, filename) => {
            try {
                document.getElementById("status").innerHTML = "Preparing download…";
                let req = Storage.get(key, {
                    download: true,
                    expires: 3600,
                    progressCallback: progress => {
                        let percentage = Math.round((progress.loaded / progress.total) * 100);
                        document.getElementById("status").innerHTML = `Downloading: ${percentage}%`;
                    }
                });
                setRequest(req);
                
                let result = await req;
                let blob = result.Body;
                const fileStream = streamSaver.createWriteStream(filename);
                const readableStream = blob.stream();

                if (window.WritableStream && readableStream.pipeTo) await readableStream.pipeTo(fileStream);
                setRequest();
                return true;
            } catch (err) {
                if (Storage.isCancelError(err)) console.error(err.message)
                else console.log(err);
                return false;
            }
        },
    
        zip: async(files) => {
            try {
                let zip = new JSZip();

                document.getElementById("status").innerHTML = "Preparing download…";
                if (tier === "platinum" || tier === "executive") {
                    let musicZip = zip.folder("music");
                    let commentaryZip = zip.folder("commentary");

                    for (let i = 0; i < 17; i++) {
                        let { music, commentary } = files;

                        let filenameM = music[i].filename;
                        let keyM = music[i].key;

                        let filenameC = commentary[i].filename;
                        let keyC = commentary[i].key;
        
                        // Music
                        let req = Storage.get(keyM, {
                            download: true,
                            expires: 3600,
                            progressCallback: progress => {
                                let percentage = Math.round((progress.loaded / progress.total) * 100);
                                document.getElementById("status").innerHTML = `Downloading (${i + 1}/17): ${percentage}% (Music)`;
                            }
                        });
                        setRequest(req);

                        let result = await req;
                        musicZip.file(filenameM, result.Body);

                        // Commentary
                        req = Storage.get(keyC, {
                            download: true,
                            expires: 3600,
                            progressCallback: progress => {
                                let percentage = Math.round((progress.loaded / progress.total) * 100);
                                document.getElementById("status").innerHTML = `Downloading (${i + 1}/17): ${percentage}% (Commentary)`;
                            }
                        });
                        setRequest(req);

                        result = await req;
                        commentaryZip.file(filenameC, result.Body);
                    }
                } else {
                    for (let i = 0; i < files.length; i++) {
                        let { filename, key } = files[i];
        
                        let req = Storage.get(key, {
                            download: true,
                            expires: 3600,
                            progressCallback: progress => {
                                let percentage = Math.round((progress.loaded / progress.total) * 100);
                                document.getElementById("status").innerHTML = `Downloading (${i + 1}/${files.length}): ${percentage}%`;
                            }
                        });
                        setRequest(req);

                        let result = await req;
                        zip.file(filename, result.Body);
                    }
                }
    
                document.getElementById("status").innerHTML = "Preparing ZIP file…";
                let blob = await zip.generateAsync({ type: "blob" });
                const fileStream = streamSaver.createWriteStream("MOSrewards.zip");
                const readableStream = blob.stream();

                if (window.WritableStream && readableStream.pipeTo) await readableStream.pipeTo(fileStream);
                setRequest();
                return true;
            } catch (err) {
                if (Storage.isCancelError(err)) console.error(err.message)
                else console.log(err);
                return false;
            }
        },
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
        if (request) Files.cancel();
        document.getElementById("status").innerHTML = message;

        let signedOut = await awsSignOut();
        if (signedOut) {
            setContributor();
            localStorage.removeItem("mos-contributor");
            localStorage.removeItem("mos-contributor-expiry");
    
            setType("login");
        }
    }
    const logoutButton = validUser ? <button onClick={logout}>Logout</button> : null;

    const submit = async e => {
        e.preventDefault();
        if (request) Files.cancel();

        const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];
        if (tier === "supporter") {
            let filename = data.tracks[parseInt(e.target.form[0].value) - 1].filename + ".mp3";
            let key = "mp3/" + filename;

            let downloaded = await Files.download(key, filename);
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

            let downloaded = await Files.zip(tracks);
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

            let downloaded = await Files.zip(tracks);
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

            let downloaded = await Files.zip(files);
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
    const submitButton = validUser ? <button type="submit" onClick={submit}>Claim rewards</button> : null;

    return (
        <div className="link-buttons">
            {submitButton}
            <button onClick={backToIntro}>Back to Intro</button>
            {logoutButton}
            <p id="status"></p>
        </div>
    )
}

export default Footer;