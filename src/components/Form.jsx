// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

async function reverseGeoLocation(lat, lng, setIsLoadingRevGeo, setRevGeoError, setCityName, setCountry, setEmoji){
  try{
    setIsLoadingRevGeo(true);
    const res= await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
    const data= await res.json();
    if(!data.countryCode){ throw new Error("Click on a valid location ... 🙃"); }

    setCityName(data.city || data.locality || "");
    setCountry(data.countryName);
    setEmoji(convertToEmoji(data.countryCode));
    setIsLoadingRevGeo(false);
    setRevGeoError("");
  } catch(err) {
    setCityName("");
    setCountry("");
    setEmoji("");
    setIsLoadingRevGeo(false);
    setRevGeoError(err.message);
  }
}

function Form() {
  // Reading the coordinate from query-string of URL
  const [searchParams, setSearchParams] = useSearchParams(); // state that lets you read the current URL's query string [BTW this is global state (accessible to any component)]. NOTE: Its a state, so when query string changes, it will trigger a re-render
  const lat= searchParams.get("lat");  const lng= searchParams.get("lng");
  // console.log(lat, lng);

  const [isLoadingRevGeo, setIsLoadingRevGeo] = useState(false);
  const [revGeoError, setRevGeoError] = useState("");
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const {addCityToList} = useCities();

  useEffect(function(){
    if(!lat && !lng){ return; } // let suppose user directly headed over the url '/app/form', then we will have no 'lat\lng'
    reverseGeoLocation(lat, lng, setIsLoadingRevGeo, setRevGeoError, setCityName, setCountry, setEmoji);
  }, [lat, lng]);

  const navigate= useNavigate(); // navigate function is used to move any URL
  function go1StepBack(evt){
    evt.preventDefault();
    navigate(-1); // this is the number of step we need to go back
  }

  async function handleSubmit(evt){
    evt.preventDefault();
    if(!cityName || !date) return;

    const newCity= {
      cityName: cityName,
      country: country,
      emoji: emoji,
      date: date,
      notes: notes,
      position: {lat: lat, lng: lng}
    }

    // console.log(newCity);
    await addCityToList(newCity);
    navigate('/app/cities');  // Rediect to CityList page
  }

  if(!lat && !lng){ return (<Message message="Start by clicking somewhere on the map😑"></Message>); } // let suppose user directly headed over the url '/app/form', then we will have no 'lat\lng'
  if(isLoadingRevGeo) { return (<Spinner></Spinner>); }
  if(revGeoError){ return (<Message message={revGeoError}></Message>); }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input id="cityName" value={cityName} onChange={(e) => setCityName(e.target.value)}/>
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input id="date" value={date} onChange={(e) => setDate(e.target.value)}/> */}
        <DatePicker id="date" onChange={(date)=> setDate(date)} selected={date} dateFormat="dd/MM/yyyy"></DatePicker>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button type="back" onClick={go1StepBack}>&larr; Back</Button> 
      </div>
    </form>
  );
}

export default Form;
