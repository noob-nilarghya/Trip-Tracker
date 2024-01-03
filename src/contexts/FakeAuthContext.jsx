import { createContext, useContext, useReducer } from "react";

const AuthContext= createContext();
const initialState= {
    user: null,
    isAuthenticated: false
};

function reducer(state, action){
    if(action.type==="login"){
        return {...state, user: action.payload, isAuthenticated: true};
    }
    if(action.type==='logout'){
        return {...state, user: null, isAuthenticated: false};
        // return {initialState};
    }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz"
};

function AuthProvider({children}){
    const [state, dispatch] = useReducer(reducer, initialState);
    const {user, isAuthenticated} = state; // isAuthenticated is the main variable which allow or deny user to enter a page (we'll see it)

    function login(email, password){
        if(email === FAKE_USER.email && password === FAKE_USER.password){
            dispatch({type: "login", payload: FAKE_USER});
        }
    }
    function logout(){
        dispatch({type: "logout"});
    }

    return (
        <AuthContext.Provider value={{
            user: user,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined){ throw new Error("context hook is being used outside of context provider"); }
    return context;
}

export {AuthProvider, useAuth};