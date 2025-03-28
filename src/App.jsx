import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Formulario from "./Formulario";
import Proyectos from "./Proyectos";
import Oportunidades from "./Oportunidades";
import InformeProyecto from "./InformeProyecto";
import Proyeccion from "./Proyeccion";
import CambioPwd from "./CambioPwd";
import Responsable from "./Responsable";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem("isLoggedIn", "true");

            // Configurar temporizador de inactividad
            let logoutTimer = setTimeout(handleLogout, 600000); // 10 minutos

            // Reiniciar el temporizador en actividad del usuario
            const resetTimer = () => {
                clearTimeout(logoutTimer);
                logoutTimer = setTimeout(handleLogout, 600000);
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
        <div style={styles.globalStyles}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home onGoToForm={() => setShowForm(true)} onLogout={handleLogout} />} />
                    <Route path="/proyectos" element={<Proyectos />} />
                    <Route path="/formulario" element={<Formulario />} />
                    <Route path="/actualizar-oportunidades" element={<Oportunidades />} />
                    <Route path="/proyectos/:id/informe" element={<InformeProyecto />} />
                    <Route path="/forecast" element={<Proyeccion />} />
                    <Route path="/cambio-contrasenia" element={<CambioPwd />} />
                    <Route path="/responsable" element={<Responsable />} />
                </Routes>
            </Router>
        </div>
    );
}

const styles = {
    globalStyles: {
        colorScheme: "light",    // Forzar modo claro
        backgroundColor: "#f4f4f4",  // Fondo claro
        color: "#333",               // Texto oscuro
    },
};

export default App;
