import { NavLink } from "react-router-dom";
import Logo from './Logo';

// But apart from 'Link', we also have 'NavLink'. 'NavLink' basically attach 'active' class with the link.
// Here 'NavLink' would be great as we can add styling to the link (depending on which page we are in)

import styles from './PageNav.module.css';

function PageNav() {
    return (
        <nav className={styles.nav}>
            <Logo></Logo>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/pricing">pricing</NavLink></li>
                <li><NavLink to="/Product">Product</NavLink></li>
                <li><NavLink to="/login" className={styles.ctaLink}>Login</NavLink></li>
            </ul>
        </nav>
    );
}

export default PageNav;
