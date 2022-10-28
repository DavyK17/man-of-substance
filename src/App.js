import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Body/Layout";
import Home from "./components/Home/Home";
import Countdown from "./components/Home/Countdown";
import Credits from "./components/Credits/Credits";
import Contributors from "./components/Contributors/Contributors";
import Tracks from "./components/Tracks/Tracks";
import Track from "./components/Track/Track";
import NotFound from "./components/Body/NotFound";
import data from "./assets/data.json";

import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const App = () => {
    let location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const [ver, setVer] = useState("full");
    const filterTracks = () => {
        let filtered;

        if (ver === "full") filtered = data.tracks;
        if (ver === "expanded") filtered = data.tracks.filter(track => !track.hasOwnProperty("missingFrom") || (track.hasOwnProperty("missingFrom") && !track.missingFrom.includes("expanded")));
        if (ver === "mixtape") filtered = data.tracks.filter(track => !track.hasOwnProperty("missingFrom") || (track.hasOwnProperty("missingFrom") && !track.missingFrom.includes("mixtape")));
        if (ver === "base") filtered = data.tracks.filter(track => !track.hasOwnProperty("missingFrom"));

        return filtered.map((item, i) => {
            let copy = { ...item };
            copy.id = (i + 1).toString();
            return copy;
        });
    };
    const [tracks, setTracks] = useState(filterTracks());

    useEffect(() => {
        setTracks(filterTracks());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    const [locked, setLocked] = useState(true);
    useEffect(() => {
        setLocked(Date.now() < 1666904400000 ? true : false);
    }, []);

    const [passcode, setPasscode] = useState();
    useEffect(() => {
        if (localStorage.getItem("mos-passcode") && Date.now() > 1667059200000 && Date.now() < 1667070000000) setPasscode(localStorage.getItem("mos-passcode"))
        else if (localStorage.getItem("mos-passcode")) return localStorage.removeItem("mos-passcode");
    }, []);

    const renderApp = () => {
        if (locked) return <Countdown />;

        return (
            <Routes>
                <Route path="/" exact element={<Home passcode={passcode} setPasscode={setPasscode} />} />
                <Route path="/*" element={<Layout ver={ver} setVer={setVer} />}>
                    <Route path="contributors" element={<Contributors />} />
                    <Route path="tracks">
                        <Route path=":id/credits" element={<Track passcode={passcode} type="credits" tracks={tracks} />} />
                        <Route path=":id/lyrics" element={<Track passcode={passcode} type="lyrics" tracks={tracks} />} />
                        <Route path=":id/synopsis" element={<Track passcode={passcode} type="synopsis" tracks={tracks} />} />
                        <Route path=":id" element={<Track passcode={passcode} tracks={tracks} />} />
                        <Route path="" element={<Tracks passcode={passcode} tracks={tracks} setTracks={setTracks} ver={ver} setVer={setVer} />} />
                    </Route>
                    <Route path="credits" element={<Credits passcode={passcode} />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        )
    }
    
    return renderApp();
}

export default App;
