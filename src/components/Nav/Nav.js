import { NavLink, Routes, Route } from "react-router-dom";
import VersionSelect from "./VersionSelect";

const Nav = props => {
    const { ver, setVer } = props;

    const menuToggle = (dir = 0) => {
        const body = document.getElementsByTagName("body")[0];
        const menu = document.getElementsByClassName("menu")[0];
        const isOpen = menu.classList.contains("open") && body.classList.contains("menu-open");

        const open = () => {
            menu.classList.add("open");
            body.classList.add("menu-open");
        }
        const close = () => {
            menu.classList.remove("open");
            body.classList.remove("menu-open");
        }

        if (dir === 1 && !isOpen) return open();
        if (dir === -1 && isOpen) return close();
        return isOpen ? close() : open();
    }
    let activeClassName = "active";
    
    return (
        <nav>
            <div id="mobile-menu-open" onClick={menuToggle}>
                <svg>
                    <path
                        d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"
                        id="path2"
                    />
                </svg>
            </div>
            <div className="menu">
                <div id="mobile-menu-close" onClick={menuToggle}>
                    <svg>
                        <path
                           d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
                           id="path2"
                        />
                    </svg>
                </div>
                <ul>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} onClick={() => menuToggle(-1)} to="/">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} onClick={() => menuToggle(-1)} to="/contributors">
                            Contributors
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} onClick={() => menuToggle(-1)} to="/tracks">
                            Tracklist
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} onClick={() => menuToggle(-1)} to="/credits">
                            Credits
                        </NavLink>
                    </li>
                    <li>
                        <a href="https://bit.ly/stream-mos" target="_blank" rel="noreferrer">
                            Stream
                        </a>
                    </li>
                </ul>
                <Routes>
                    <Route path="tracks" element={<VersionSelect ver={ver} setVer={setVer} menuToggle={menuToggle} />} />
                </Routes>
            </div>
        </nav>
    )
}

export default Nav;