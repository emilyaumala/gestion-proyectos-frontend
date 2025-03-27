import { useState } from "react";
import axios from "axios";

const API_URL = "https://crm.constecoin.com/apicrm";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Asegúrate de que username y password contienen los valores correctos
        try {
            const response = await axios.post(`${API_URL}/login`, {
                correo: username, // Asegúrate de que 'username' contiene el correo
                password: password // Asegúrate de que 'password' contiene la contraseña ingresada
            });
            localStorage.setItem("user", JSON.stringify(userData)); 
            // Guardar token en localStorage
            localStorage.setItem("token", response.data.token);
            // Llamar a la función de login sin alertas
            onLogin(response.data.usuario);
        } catch (error) {
            console.error(error);  // Log para ver detalles del error
            alert("❌ Correo o contraseña incorrectos");
        }
    };
    

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <img src="/logo.png" alt="Logo de la empresa" style={styles.logo} />
                <h2 style={styles.title}>Constecoin</h2>
                <h3 style={styles.subtitle}>Gestión de Oportunidades</h3>

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
