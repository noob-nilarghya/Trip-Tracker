
import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext';

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));

function CityItem({city}) {

    const {cityName, emoji, date, id, position} = city;
    const {currentCity, deleteCityFromList} = useCities();
    const isCurrCityActive= (currentCity.id === id);

    function handleRemoveCity(evt){
      evt.preventDefault();
      deleteCityFromList(id);
    }

    return (
      // Ecah city item is a link. On clicking the link, we will redirect to URL where we pass 'id' as params, and 'lat,lng' as query string.
      // So that we catch that end point (/cities:id) from 'App.jsx' and render 'City.jsx' component to display that particular city detail (that user clicked).
      // In 'City.jsx', we grab 'id' from URL and call 'fetchCurrentCity(id)' func from 'useCities' context hook to get that city info, and will use that 'lat,lng' info in 'Map.jsx'
        <li>
          <Link className={`${styles.cityItem} ${(isCurrCityActive) ? styles['cityItem--active'] : ""}`} 
          to={`/app/cities/${id}?lat=${position.lat}&lng=${position.lng}`}> {/*see App.js [path="cities/:id]*/}

            <span className={styles.emoji}>{emoji}</span>
            <h3 className={styles.name}>{cityName}</h3>
            <time className={styles.date}>{formatDate(date)}</time>
            <button className={styles.deleteBtn} onClick={handleRemoveCity}>&times;</button>
          </Link>
        </li>
    );
}

export default CityItem;
