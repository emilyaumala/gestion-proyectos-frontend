// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Formulario from "./Formulario";
import Proyectos from "./Proyectos";
import Oportunidades from "./Oportunidades";
import InformeProyecto from "./InformeProyecto";
import Proyeccion from "./Proyeccion";
import CambioPwd from "./CambioPwd";
import Responsable from "./AgregarResponsable";
import ListResponsables from "./Responsables"
import OlvideContra from "./OlvideContrasenia";
import ListaClientes from "./Clientes"
import AddCliente from "./AgregarCliente"

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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowForm(false);
    };

    return (
        <Router>
            <div style={styles.globalStyles}>
                <Routes>
                    <Route 
                        path="/login" 
                        element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
                    />
                    <Route path="/olvide-contrasenia" element={<OlvideContra />} />

                    {isLoggedIn ? (
                        <>
                            <Route path="/" element={<Home onGoToForm={() => setShowForm(true)} onLogout={handleLogout} />} />
                            <Route path="/proyectos" element={<Proyectos />} />
                            <Route path="/formulario" element={<Formulario />} />
                            <Route path="/actualizar-oportunidades" element={<Oportunidades />} />
                            <Route path="/proyectos/:id/informe" element={<InformeProyecto />} />
                            <Route path="/forecast" element={<Proyeccion />} />
                            <Route path="/cambio-contrasenia" element={<CambioPwd />} />
                            <Route path="/responsables" element={<ListResponsables />} />
                            <Route path="/clientes" element={<ListaClientes />} />
                            <Route path="/agregar-responsable" element={<Responsable />} />
                            <Route path="/agregar-cliente" element={<AddCliente />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

const styles = {
    globalStyles: {
        colorScheme: "light",
        backgroundColor: "#f4f4f4",
        color: "#333",
    },
};

export default App;