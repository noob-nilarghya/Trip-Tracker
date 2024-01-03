import styles from './Map.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation'; // custom hook
import Button from './Button';

function Map() {
    
    const [mapPos, setMapPos] = useState([23.0405844,88.8242893]); // state for curr map pos (default cooord to gandhipally)

    const {cities} = useCities(); // ⭐ 3) Consuming context (cities are needed in order to mark each city with marker on map)
    const {isLoading: isLoadingGeoLoc, position: positionGeoLoc, getPosition} =useGeolocation({}); // custom hook
    
    // Now basically we want to sync 'mapPos' with 'positionGeoLoc' whenever 'positionGeoLoc' changes. For this, useEffect is the best option
    useEffect(function(){ // sync 'mapPos' with geolocation coord
        if(Object.keys(positionGeoLoc).length !== 0) { setMapPos([positionGeoLoc.lat, positionGeoLoc.lng]); }
    }, [positionGeoLoc]);

    const [searchParams, setSearchParams] = useSearchParams(); // state that lets you read the current URL's query string [BTW this is global state (accessible to any component)]. NOTE: Its a state, so when query string changes, it will trigger a re-render
    const lat= searchParams.get("lat");  const lng= searchParams.get("lng");

    // And we can update the query string as well (using 'setSearchParams')
    // return (<button onClick={()=>setSearchParams({lat: 23, lng: 23})}></button>); // NOTE: This change will be reflected globally 

    // Now basically we want to sync 'mapPos' with 'lat, lng' whenever 'lat, lng' changes. For this, useEffect is the best option
    useEffect(function(){ // sync 'mapPos' with query-string coord
        if(lat && lng) { setMapPos([lat, lng]); }
        // as any CityItem is clicked 👉 query string changes 👉 lat, lng changes 👉 setMapPos ke karan mapPos changes 👉 trigger re-renders
    }, [lat, lng]);
    
    return (
        // <div className={styles.mapContainer} onClick={()=>{navigate("/app/form")}}>

        <div className={styles.mapContainer}>
            <Button type="position" onClick={getPosition}>{isLoadingGeoLoc ? "Loading..." : "Use your position"}</Button>
            <MapContainer center={mapPos} zoom={6} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city)=> (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                    <Popup> {city.cityName} </Popup>
                    </Marker>
                ))}
                <ChangeMapPos position={mapPos}></ChangeMapPos>
                <DetectMapClick></DetectMapClick>
            </MapContainer>
        </div>
    );
}

function ChangeMapPos({position}){ // custom component to change map position
    const map= useMap(); // hook provided by leaflet library to get current instance of map
    map.setView(position);

    return null; // as this is a component, we need to return some jsx compulsory (and here we returned null)
}

function DetectMapClick(){
    // So, we need to navigate to '/app/form' when we click on map div (which we can achieve using 'onClick={()=>{navigate("/app/form")}')[see commented]
    // But here we also need one more functionality. We need the coord where click happened on map, so that we can auto fill form location (for this we need leaflet hook). So thats why we need this Custom component
    // On clicking the map, we will store coord as query string like '/app/form?lat=40&lng=40', so that letter we can read coord from queryString in Form.jsx component and use that coord to autofill our form

    // See navigation using 'NavLink' or 'Link' is called declarative navigation (as we are not mentioning particularly when to navigate)
    // This is called programmatic navigation (i.e go to this url when this element get clicked)
    
    const navigate= useNavigate(); // navigate function is used to move any URL

    useMapEvents({
        click: (evt) => navigate(`/app/form?lat=${evt.latlng.lat}&lng=${evt.latlng.lng}`)
    });

    return null; // as this is the component, so we need to return some jsx compulsory (and here we returned null)
}

export default Map;
