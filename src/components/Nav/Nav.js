import { NavLink } from "react-router-dom";

const Nav = () => {
    const menuToggle = () => {
        const menu = document.getElementsByClassName("menu")[0];
        const isOpen = menu.classList.contains("open");

        return isOpen ? menu.classList.remove("open") : menu.classList.add("open");
    }

    window.onload = () => {
        const menuOpen = document.getElementById("mobile-menu-open");
        menuOpen.addEventListener("click", menuToggle);
        
        const menuClose = document.getElementById("mobile-menu-close");
        menuClose.addEventListener("click", menuToggle);
    }
    
    return (
        <nav>
            <div id="mobile-menu-open">
                <svg>
                    <path
                        d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"
                        id="path2"
                    />
                </svg>
            </div>
            <div className="menu">
                <div id="mobile-menu-close">
                    <svg>
                        <path
                           d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
                           id="path2"
                        />
                    </svg>
                </div>
                <ul>
                    <li>
                        <NavLink activeClassName="active" to="/">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to="/contributors">
                            Contributors
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to="/tracks">
                            Tracklist
                        </NavLink>
                    </li>
                    <li>
                        <a href="https://bit.ly/stream-mos" target="_blank" rel="noreferrer">
                            Stream
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav;