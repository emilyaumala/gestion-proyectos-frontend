import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";

const API_URL = "https://crm.constecoin.com/apicrm";

function OlvideContrasenia() {
    const [correo, setCorreo] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCatgando] = useState("");

    const mensaje = "Tú nueva contraseña está en el email indicado. Por favor actualizarla."
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        if (correo == "") {
            setError("Por favor, ingresa un correo electrónico")
            return;
        }

        setCatgando(true)
        try {
            await axios.post(`${API_URL}/recuperar-password`, { correo: correo });
            toast.success("📩 ¡Correo enviado! Revisa tu bandeja de entrada.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setCorreo("")
        } catch (e) {
            console.log("error al recuperar contraseña", e.response.data.error)
            setError(e.response.data.error)
        } finally {
            setCatgando(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1 style={styles.title}>📤 Restablecer contraseña</h1>
                <ToastContainer/>
                <form onSubmit={handleSubmit}>
                    <div>Ingrese su correo electrónico para recibir una nueva contraseña</div>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        style={styles.input}
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                    <button type="submit" style={styles.button} disabled={cargando}>
                        {cargando ? <CircularProgress size={20} color="inherit" /> : "✔ Restablecer contraseña"}
                    </button>
                </form>
                <Link to="/" style={styles.forgotPassword}>
                    🔙 Volver al login
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
        backgroundColor: "#f8f9fa",
    },
    loginBox: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "90%",
        maxWidth: "400px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    },
    input: {
        width: "90%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px"
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        width: "70%",
        margin: "10px 0"
    },
    forgotPassword: {
        display: "block",
        color: "#007bff",
        fontSize: "14px",
        marginTop: "5px",
        cursor: "pointer",
        textDecoration: "none",
    }
};

export default OlvideContrasenia;
