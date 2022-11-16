import { Storage } from "aws-amplify";
import JSZip from "jszip";
import streamSaver from "streamsaver";

const Files = {
    cancel: request => Storage.cancel(request, "Request cancelled"),

    download: async(key, filename, setRequest) => {
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

    zip: async(files, tier, setRequest) => {
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

export default Files;