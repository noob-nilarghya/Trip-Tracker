// This is implementation of Context API with useReducer hook
// As we have a lot of state, so its is a better and common choice to implement context API with useReducer hook
import { createContext, useState, useEffect, useContext, useReducer, useCallback } from "react";


/* Context API is implemented basically in 3 steps: 
  1)create context component, 
  2)Provider: gives child component all the Value that we want to make available, 
  3)consumers: all child components of provider that read provided context value
*/
const CitiesContext= createContext(); // ⭐ 1) creating context component 

const initialState= {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
};
function reducer(state, action){
    if(action.type==='loading'){ 
        return {...state, isLoading:true}; 
    }
    if(action.type==='cities/loaded'){
        return {...state, isLoading: false, cities: action.payload};
    }
    if(action.type==='city/loaded'){
        return {...state, isLoading: false, currentCity: action.payload};
    }
    if(action.type==='city/created'){
        return {...state, isLoading: false, cities: [...state.cities, action.payload]};
    }
    if(action.type==='city/deleted'){
        return {...state, isLoading: false, cities: state.cities.filter((city)=> city.id !== action.payload)};
    }
    if(action.type==='cities/rejected'){
        return {...state, cities: {}, isLoading: false, error: action.payload}
    }
    if(action.type==='city/rejected'){
        return {...state, currentCity: {}, isLoading: false, error: action.payload}
    }
    if(action.type==='create-delete/error'){
        return {...state, isLoading: false, error: action.payload};
    }
} 


function CitiesProvider({children}){ // custom context provider 
    
    // const [cities, setCities]= useState([]);
    // const [isLoading, setIsLoading] =useState(false);
    // const [currentCity, setCurrentCity] = useState({}); // single city implementation

    const [state, dispatch] = useReducer(reducer, initialState);
    const {cities, isLoading, currentCity} = state;

    useEffect(function(){
        async function fetchCities(){ // fetching all cities
            try{
                // setIsLoading(true);
                dispatch({type:"loading"});
                
                const res= await fetch('http://localhost:8000/cities');
                const data= await res.json();
                
                // setCities(data);
                // setIsLoading(false);
                dispatch({type: "cities/loaded", payload: data});
            } 
            catch(err){
                // alert("There is an error loading data... ");
                // setCities({});
                // setIsLoading(false);
                dispatch({type:"cities/rejected", payload: "There is an error loading data... "});
            }
        }

        fetchCities();
    },[]); // run on initial mount only

    // See, 'City.jsx'. we have our useEffect inside which we called this function. So, dependency array has [id, fetchCurrentCity]. 
    /* But here comes the serious problem. Understand the flow: 
    👉1) We called fetchCurrentCity(id) in 'City.jsx', which execute this fn right below. 
    👉2) On fetching data, it dispatch an action 'city/loaded' (see below). 
    👉3) This result in context update and re-render 'CitiesProvider' component. 
    👉4) A new instance of 'fetchCurrentCity' will form which trigger useEffect of 'City.jsx', coz this fn is there in depenedency arr. 
    👉5) This result in infinite re-renders.
    */

    // We can fix this right at step 4, by stop creating new instance of 'fetchCurrentCity'. 👉 Memoize 'fetchCurrentCity' using useCallback.
    const fetchCurrentCity= useCallback(
        async function fetchCurrentCity(id){ // fetching particular city with that id
            try{
                // setIsLoading(true);
                dispatch({type:"loading"});

                const res= await fetch(`http://localhost:8000/cities/${id}`);
                const data= await res.json();
                
                // setCurrentCity(data);
                // setIsLoading(false);
                dispatch({type: "city/loaded", payload: data});
            } 
            catch(err){
                // alert("There is an error loading data... ");
                // setCurrentCity({});
                // setIsLoading(false);
                dispatch({type:"city/rejected", payload: "There is an error loading data... "});
            }
        },
        [currentCity.id]
    );

    async function addCityToList(newCity){
        try{
            // setIsLoading(true);
            dispatch({type:"loading"});

            const res= await fetch(`http://localhost:8000/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {"Content-Type": "application/json"}
            });
            const data= await res.json();

            // setCities((oldList)=> [data, ...oldList]);
            // setIsLoading(false);
            dispatch({type: "city/created", payload: data});
        } 
        catch(err){
            // alert("There is an error posting city... ");
            // setIsLoading(false);
            dispatch({type: "create-delete/error", payload: "There is an error posting city... "});
        }
    }

    async function deleteCityFromList(id){
        try{
            // setIsLoading(true);
            dispatch({type:"loading"});

            const res= await fetch(`http://localhost:8000/cities/${id}`, {
                method: "DELETE"
            });

            // setCities((oldList)=> oldList.filter((city)=> city.id !== id)); //keeping UI state in sync with Remote state
            // setIsLoading(false);
            dispatch({type: "city/deleted", payload: id});
        } 
        catch(err){
            // alert("There is an error deleting city... ");
            // setIsLoading(false);
            dispatch({type: "create-delete/error", payload: "There is an error deleting city... "});
        }
    }

    // ⭐ 2) context Provider
    return (
        <CitiesContext.Provider value={{ 
            cities: cities,
            isLoading: isLoading,
            currentCity: currentCity,
            fetchCurrentCity: fetchCurrentCity, // fetchCurrentCity(id)
            addCityToList: addCityToList, // addCityToList(newCity)
            deleteCityFromList: deleteCityFromList // deleteCityFromList(id)
        }}> 
            {children} 
        </CitiesContext.Provider>
    );
}

function useCities(){ // custom context hook
    const context= useContext(CitiesContext);  // ⭐ 3) consumer
    if(context === undefined){ throw new Error("context hook is being used outside of context provider"); }
    return context;
}

export {CitiesProvider, useCities}; 