import { useState, useEffect } from "react";
import Login from "./Login";
import Home from "./Home";
import Formulario from "./Formulario";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem("isLoggedIn", "true");

            // Configurar temporizador de inactividad
            let logoutTimer = setTimeout(handleLogout, 300000); // 5 minutos

            // Reiniciar el temporizador en actividad del usuario
            const resetTimer = () => {
                clearTimeout(logoutTimer);
                logoutTimer = setTimeout(handleLogout, 300000);
            };

            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keydown", resetTimer);

            return () => {
                clearTimeout(logoutTimer);
                window.removeEventListener("mousemove", resetTimer);
                window.removeEventListener("keydown", resetTimer);
            };
        }
    }, [isLoggedIn]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        setShowForm(false);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    if (showForm) {
        return <Formulario />;
    }

    return <Home onGoToForm={() => setShowForm(true)} onLogout={handleLogout} />;
}

export default App;
