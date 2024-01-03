import styles from './CityList.module.css';
import Spinner from './Spinner';
import CitiItem from './CityItem';
import Message from './Message';

import { useCities } from '../contexts/CitiesContext';

function CityList() {
    const {cities, isLoading}= useCities(); // ⭐ 3) consumer

    if(isLoading===true){ return <Spinner></Spinner>; }
    if(!cities.length){
        return <Message message="Add your first city by clicking on a city on map"></Message>
    }
    return (
        <ul className={styles.cityList}>
            {cities.map((city)=> <CitiItem city={city} key={city.id}></CitiItem>)}
        </ul>
    );
}

export default CityList;
