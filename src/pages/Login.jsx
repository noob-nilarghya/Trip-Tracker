
// See what will we do in authentication. ⭐isAuthenticated⭐ is the main variable:

// We have a ProtectedRoute component which will check wheather user is authenticated or not. If not, it will redirect user to Homepage ('/). This is mainly for restricting unauthorized user to access ('/app') route directly (say he typed '/app' directly in his browser)
// On Homepage, we have a cta btn which redirect us to Login page ('/login)
// On login page, we have login button which on click will try to call login() from FakeAuthContext Hook, which set isAuthenticated to true
// One more thing, as soon as we enter in login page, we first check wheather isAuthenticated is true or not, if true, we will redirect user to our main functional page AppMainContent ('/app'). Where we render 3 component, Sidebar, Map, and User
// If we are in User component, then it means we are already in '/app' route (or user isAuthenticated)
// In User, we will get a button which on click will try to call logout() from FakeAuthContext Hook, which set isAuthenticated to false, and we will immediately navigate to Homepage ('/'), right from where it all started

import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {login, isAuthenticated} = useAuth();

  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const navigate = useNavigate();

  // we will straightaway redirect user to our main functional '/app' route [AppMainContent] (as soon as 'isAuthenticated' is true)
  useEffect(function(){
    if(isAuthenticated === true){ navigate('/app', {replace: true}); } // see the explanation of 'replace' in 'React.18.Lec20'
    // Basically it will replace all the url from the history stack
  }, [isAuthenticated, navigate]);


  function handleSubmit(evt){
    evt.preventDefault();
    if(!email || !password) { return; }
    login(email, password);
  }

  return (
    <main className={styles.login} onSubmit={handleSubmit}>
      <PageNav></PageNav>
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
