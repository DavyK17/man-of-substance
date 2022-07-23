import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav";

const Layout = props => {
    const { ver, setVer } = props;
    
    return (
        <>
            <Nav ver={ver} setVer={setVer} />
            <Outlet />
        </>
    )
}

export default Layout;