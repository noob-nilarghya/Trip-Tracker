// component to be displaed when we click one of the 'CityItem' from 'CityList'

import { useParams } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import Button from "./Button";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const {id} = useParams(); // hook for accessing the id from url [BTW this is global state (accessible to any component)]

  // just for demonstration purpose, we will use 'lat,lng' in 'Map.jsx'
  const [searchParams, setSearchParams] = useSearchParams(); // hook that lets you read the current URL's query string [BTW this is global state (accessible to any component)]
  const lat= searchParams.get("lat");  const lng= searchParams.get("lng");

  const {currentCity, fetchCurrentCity, isLoading} = useCities();

  useEffect(function() {
    fetchCurrentCity(id);
  }, [id, fetchCurrentCity]);

  const navigate= useNavigate(); // navigate function is used to move any URL
  function go1StepBack(evt){
    evt.preventDefault();
    navigate(-1); // this is the number of step we need to go back
  }

  if(isLoading===true){ return <Spinner></Spinner>; }
  
  const { cityName, emoji, date, notes } = currentCity;


  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a href={`https://en.wikipedia.org/wiki/${cityName}`} target="_blank" rel="noreferrer"> Check out {cityName} on Wikipedia &rarr;</a>
      </div>

      <div><Button type="back" onClick={go1StepBack}>&larr; Back</Button></div>
    </div>
  );
}

export default City;
