
// Basically in this App, we will work with routing in React usinng 3rd party library called 'react-router'
// Concept of React is to build a single page application. But at the same time we want to implement routing for different endpoints
// Here 'react-router' library came into play. It will allow us to jump from one to another route without page reload

// 3rd party/ Native import
import { Suspense, lazy } from "react"; // for lazy loading and suspense action
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context/Wrapper import
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from './pages/ProtectedRoute';

// Custom Component import
import CityList from './components/CityList';
import CountryList from "./components/CountryList";
import City from './components/City';
import Form from './components/Form';
import SpinnerFullPage from './components/SpinnerFullPage';

// 👉 VERY IMPORTANT TO REDUCE APP LOADING TIME (Performance Optimization):
// Bundler like Vite/Webpack, bundle everything in one big JS file, which might require time to load. So we should split this big JS file into smaller chunks. So that whenever it needed the content, it just download that small chunk (unlike downloading the whole big JS file at once)
// This is called lazy loading, and we implement this with 'lazy' library of react as follows:

// -------- Pages import --------
// import Homepage from './pages/Homepage';
// import Product from './pages/Product';
// import Pricing from './pages/Pricing';
// import Login from './pages/Login';
// import AppMainContent from './pages/AppMainContent';
// import PageNotFound from './pages/PageNotFound';

const Homepage= lazy(()=> import('./pages/Homepage'));
const Product= lazy(()=> import('./pages/Product'));
const Pricing= lazy(()=> import('./pages/Pricing'));
const Login= lazy(()=> import('./pages/Login'));
const AppMainContent= lazy(()=> import('./pages/AppMainContent'));
const PageNotFound= lazy(()=> import('./pages/PageNotFound'));



function App() {
  // Extracted all the state logic to 'CitiesContext.jsx'

  return (
    <AuthProvider> {/* Adding provider in top level so that whole app can access login authentication credentials */}
      <CitiesProvider> {/* Adding this provider in top level so that whole app can access city related credentials */}

        <BrowserRouter> {/* wrapper component provided by react-router */}
        {/* As we are implementing lazy loading, In the mean time during rendering while we require some chunks, we can suspend application till that chunk downloads. We can do that using inbuit 'Suspense' component */}
          <Suspense fallback={ <SpinnerFullPage></SpinnerFullPage> }>
            <Routes>
              <Route path="/" element={<Homepage></Homepage>}></Route>
              <Route path="/product" element={<Product></Product>}></Route>
              <Route path="/pricing" element={<Pricing></Pricing>}></Route>
              <Route path="/login" element={<Login></Login>}></Route> {/* Isko ekdam last mein revise karna. Start with 'FakeAuthContext.jsx', then revise 'Login.jsx', then revise 'User.jsx', and lastly to 'ProtectedRoute.jsx' */}

              {/* This is how we from nested route (req when we want to display different child UI within the same parent based on route) */}
              {/* For example here parent UI is 'AppMainContent' (route: /app), and we want to display child UI for route '/app/cities', then we use nested routing */}
              <Route path="/app" element={
                // This is the way how we protect a part of application '/app' from unauthorized access (by wrapping it in a wrapper component [see ProtectedRoute]
                <ProtectedRoute> 
                  <AppMainContent></AppMainContent>
                </ProtectedRoute>
              }>
                <Route index element={<CityList></CityList>}></Route> {/* Default one */}
                <Route path="cities" element={<CityList></CityList>}></Route>
                <Route path="cities/:id" element={<City></City>}></Route> {/* [Partcular city detail component] Params in URL(here params is 'id'). Note: Its global, any component can access it (see CityItem.jsx)*/}
                <Route path="countries" element={<CountryList></CountryList>}></Route>
                {/* Now before jumping into form, first revise Map.jsx */}
                <Route path="form" element={<Form></Form>}></Route>
              </Route>
              
              <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
            </Routes>
          </Suspense>
        </BrowserRouter>

      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
