import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Body/Layout";
import Home from "./components/Home/Home";
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
                <Route path="/contributors" element={<Contributors />} />
                <Route path="/tracks/:id/credits" element={<Track type="credits" />} />
                <Route path="/tracks/:id/lyrics" element={<Track type="lyrics" />} />
                <Route path="/tracks/:id/synopsis" element={<Track type="synopsis" />} />
                <Route path="/tracks/:id" element={<Track />} />
                <Route path="/tracks" element={<Tracks />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
