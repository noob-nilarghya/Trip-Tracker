import AppNav from "./AppNav";
import Logo from './Logo';
import Footer from './Footer';
import styles from './Sidebar.module.css'
import { Outlet } from "react-router-dom";

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo></Logo>
            <AppNav></AppNav>

            {/* <p>List of cities</p> */}
            {/* Where to display that child UI within parent UI in nested routing (see 'App.jsx', '/app' route) ? Here we use 'Outlet' tag. That 'CityList, City, CountryList, Form' component of nested route will be displayed here in Sidebar (in place of 'Outlet' tag) */}
            <Outlet></Outlet>  {/* Now here the child UI will be displayed */}
            

            <Footer></Footer>
        </div>
    );
}

export default Sidebar;
