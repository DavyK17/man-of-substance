import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import Contributors from "./components/Contributors/Contributors";
import Tracks from "./components/Tracks/Tracks";
import Track from "./components/Track/Track";
import Layout from "./components/Body/Layout";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route element={<Layout />}>
                    <Route path="/contributors" element={<Contributors />} />
                    <Route path="/tracks/:id" element={<Track />} />
                    <Route path="/tracks" element={<Tracks />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
