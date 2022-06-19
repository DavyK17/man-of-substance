import { BrowserRouter as Router, Routes, Route, matchPath } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";

const App = () => {
    const match = matchPath({ path: "/", exact: true }, "/");
    
    return (
        <Router>
            {!match ? <Nav /> : null}
            <Routes>
                <Route path="/" exact element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
