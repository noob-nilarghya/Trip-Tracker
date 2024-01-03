
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";

// we are in this component, means user isAutheticated

function User() {
  const {user, logout} = useAuth();
  const navigate= useNavigate();
  console.log(user);

  function handleClick(evt) {
    evt.preventDefault();
    logout();
    navigate("/"); // programetticlly redirect to home route (as soon as user logout)
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
);
}

export default User;

/*
1) Add `AuthProvider` to `App.jsx`
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppMainContent.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
