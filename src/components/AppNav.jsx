import { NavLink } from 'react-router-dom';
import styles from './AppNav.module.css';

function AppNav() {
    return (
        <nav className={styles.nav}>
            <ul>
                {/* Nested Routes (see 'App.jsx', '/app' route and 'Sidebar.jsx', 'Outlet' tag) */}
                <li> <NavLink to="/app/cities">Cities</NavLink> </li>
                <li> <NavLink to="/app/countries">Countries</NavLink></li>
            </ul> 
        </nav>
    );
}

export default AppNav;
