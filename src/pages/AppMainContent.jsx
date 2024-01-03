
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import styles from './AppMainContent.module.css'
import User from '../components/User';

function AppMainContent() {
    return (
        <div className={styles.app}>
            <Sidebar></Sidebar>
            <Map></Map>
            <User></User>
        </div>
    );
}

export default AppMainContent;
