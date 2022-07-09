import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Body/Layout";
import Home from "./components/Home/Home";
import Credits from "./components/Credits/Credits";
import Contributors from "./components/Contributors/Contributors";
import Tracks from "./components/Tracks/Tracks";
import Track from "./components/Track/Track";
import NotFound from "./components/Body/NotFound";

const App = () => {
    let location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route element={<Layout />}>
                <Route path="/credits" element={<Credits />} />
                <Route path="/contributors" element={<Contributors />} />
                <Route path="/tracks">
                    <Route path=":id/credits" element={<Track type="credits" />} />
                    <Route path=":id/lyrics" element={<Track type="lyrics" />} />
                    <Route path=":id/synopsis" element={<Track type="synopsis" />} />
                    <Route path=":id" element={<Track />} />
                    <Route path="" element={<Tracks />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
