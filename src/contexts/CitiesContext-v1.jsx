
import { createContext, useState, useEffect, useContext } from "react";


/* Context API is implemented basically in 3 steps: 
  1)create context component, 
  2)Provider: gives child component all the Value that we want to make available, 
  3)consumers: all child components of provider that read provided context value
*/
const CitiesContext= createContext(); // ⭐ 1) creating context component 

async function fetchCities(setIsLoading, setCities){ // fetching all cities
    try{
        setIsLoading(true);
        const res= await fetch('http://localhost:8000/cities');
        const data= await res.json();
        
        setCities(data);
        setIsLoading(false);
    } catch(err){
        alert("There is an error loading data... ");
        setCities({});
        setIsLoading(false);
    }
}


function CitiesProvider({children}){ // custom context provider 
    const [cities, setCities]= useState([]);
    const [isLoading, setIsLoading] =useState(false);

    const [currentCity, setCurrentCity] = useState({}); // single city implementation

    useEffect(function(){
        fetchCities(setIsLoading, setCities);
    },[setIsLoading, setCities]);

    async function fetchCurrentCity(id){ // fetching particular city with that id
        try{
            setIsLoading(true);
            const res= await fetch(`http://localhost:8000/cities/${id}`);
            const data= await res.json();
            
            setCurrentCity(data);
            setIsLoading(false);
        } catch(err){
            alert("There is an error loading data... ");
            setCurrentCity({});
            setIsLoading(false);
        }
    }

    async function addCityToList(newCity){
        // we will make a POST request to our fake API server
        try{
            setIsLoading(true);
            const res= await fetch(`http://localhost:8000/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {"Content-Type": "application/json"}
            });
            const data= await res.json();
            setCities((oldList)=> [data, ...oldList]); // This is exactly what we call: ["keeping UI state in sync with Remote state"]
            // React-Query is specialised for this task (we will learn React-Query letter)
            setIsLoading(false);
        } catch(err){
            alert("There is an error posting city... ");
            setIsLoading(false);
        }
    }

    async function deleteCityFromList(id){
        try{
            setIsLoading(true);
            const res= await fetch(`http://localhost:8000/cities/${id}`, {
                method: "DELETE"
            });
            setCities((oldList)=> oldList.filter((city)=> city.id !== id)); //keeping UI state in sync with Remote state
            setIsLoading(false);
        } catch(err){
            alert("There is an error deleting city... ");
            setIsLoading(false);
        }
    }

    // ⭐ 2) context Provider
    return (
        <CitiesContext.Provider value={{ 
            cities: cities,
            isLoading: isLoading,
            currentCity: currentCity,
            fetchCurrentCity: fetchCurrentCity,
            addCityToList: addCityToList,
            deleteCityFromList: deleteCityFromList
        }}> {children} </CitiesContext.Provider>
    );
}

function useCities(){ // custom context hook
    const context= useContext(CitiesContext);  // ⭐ 3) consumer
    if(context === undefined){ throw new Error("context hook is being used outside of context provider"); }
    return context;
}

export {CitiesProvider, useCities}; 