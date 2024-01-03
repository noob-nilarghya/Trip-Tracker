import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

// Basically to protect our application from unauthentic user, we will create a wrapper component.

function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(function(){
        if(isAuthenticated===false) { navigate("/"); } // if not authenticated -> redirect to home route
    }, [isAuthenticated, navigate]);

    // authenticated user
    return (isAuthenticated===true) ? children : null;
}

export default ProtectedRoute;
