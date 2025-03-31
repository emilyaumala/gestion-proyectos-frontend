import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";

const API_URL = "https://crm.constecoin.com/apicrm";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/login`, {
                correo: username,
                password: password
            });

            if (response.data && response.data.usuario) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.usuario));

                onLogin();
                navigate("/"); // Navegar a la página de inicio después del login
            } else {
                console.error("El objeto 'usuario' no está presente en la respuesta:", response.data);
                alert("❌ Error al obtener datos de usuario.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            toast.error("Error credenciales incorrectas", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <img src="/logo.png" alt="Logo de la empresa" style={styles.logo} />
                <h2 style={styles.title}>Constecoin</h2>
                <h3 style={styles.subtitle}>Gestión de Oportunidades</h3>
                <ToastContainer />
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>
                        Ingresar
                    </button>
                </form>
                <Link to="/olvide-contrasenia" style={styles.forgotPassword}>
                    ¿Olvidaste la contraseña?
                </Link>
            </div>
        </div>
    );
}
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f0f2f5",
    },
    loginBox: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "100%",
        maxWidth: "400px",
    },
    logo: {
        width: "100px",
        marginBottom: "10px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "20px",
    },
    input: {
        width: "90%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "50px",
        border: "1px solid #ccc",
        fontSize: "16px"
    },
    forgotPassword: {
        display: "block",
        color: "#007bff",
        fontSize: "14px",
        marginTop: "5px",
        cursor: "pointer",
        textDecoration: "none",
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        width: "40%",
        margin: "10px 0"
    },
};

export default Login;
