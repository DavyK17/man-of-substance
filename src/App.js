import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Body/Layout";
import Home from "./components/Home/Home";
import Credits from "./components/Credits/Credits";
import Contributors from "./components/Contributors/Contributors";
import Rewards from "./components/Rewards/Rewards";
import Tracks from "./components/Tracks/Tracks";
import Track from "./components/Track/Track";
import NotFound from "./components/Body/NotFound";
import data from "./assets/data.json";

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
    
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route element={<Layout ver={ver} setVer={setVer} />}>
                <Route path="/contributors" element={<Contributors />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/tracks">
                    <Route path=":id/credits" element={<Track type="credits" tracks={tracks} />} />
                    <Route path=":id/lyrics" element={<Track type="lyrics" tracks={tracks} />} />
                    <Route path=":id/synopsis" element={<Track type="synopsis" tracks={tracks} />} />
                    <Route path=":id" element={<Track tracks={tracks} />} />
                    <Route path="" element={<Tracks tracks={tracks} setTracks={setTracks} ver={ver} setVer={setVer} />} />
                </Route>
                <Route path="/credits" element={<Credits />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
