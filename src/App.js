import { Routes, Route } from "react-router-dom";
import Layout from "./components/Body/Layout";
import Home from "./components/Home/Home";
import Contributors from "./components/Contributors/Contributors";
import Tracks from "./components/Tracks/Tracks";
import Track from "./components/Track/Track";

const App = () => {
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route element={<Layout />}>
                <Route path="/contributors" element={<Contributors />} />
                <Route path="/tracks/:id/credits" element={<Track type="credits" />} />
                <Route path="/tracks/:id/lyrics" element={<Track type="lyrics" />} />
                <Route path="/tracks/:id/synopsis" element={<Track type="synopsis" />} />
                <Route path="/tracks/:id" element={<Track type="synopsis" />} />
                <Route path="/tracks" element={<Tracks />} />
            </Route>
        </Routes>
    );
}

export default App;
