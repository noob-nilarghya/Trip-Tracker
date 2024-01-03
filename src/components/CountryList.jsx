
import styles from './CountryList.module.css'
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';


function CountryList() {
    const {cities, isLoading} = useCities();

    if(isLoading===true){ return <Spinner></Spinner>; }
    if(!cities.length){
        return <Message message="Add your first city by clicking on a city on map"></Message>
    }
    
    const countries=[]; // To store unique countries among the cities array
    for(let i=0; i<cities.length; i++){
        let isPresent=false;
        for(let j=0; j<countries.length; j++){
            if(countries[j].country === cities[i].country ){ isPresent=true; break; }
        }
        if(isPresent===false){ countries.push({country: cities[i].country, emoji: cities[i].emoji}); }
    }

    return (
        <ul className={styles.countryList}>
            {countries.map((country)=> <CountryItem country={country} key={country.country}></CountryItem>)}
        </ul>
    );
}

export default CountryList;
