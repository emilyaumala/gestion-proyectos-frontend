import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Formulario from "./Formulario";
import Proyectos from "./Proyectos"; // Asegúrate de importar el componente Proyecto
import Oportunidades from "./Oportunidades"; // Asegúrate de importar el componente Proyectos
import InformeProyecto from "./InformeProyecto";

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

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home onGoToForm={() => setShowForm(true)} onLogout={handleLogout} />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/formulario" element={<Formulario />} />
                <Route path="/actualizar-oportunidades" element={<Oportunidades />} />
                <Route path="/proyectos/:id/informe" element={<InformeProyecto />} />
            </Routes>
        </Router>
    );
}

export default App;
