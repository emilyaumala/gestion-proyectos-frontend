import { useState } from "react";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        let loginSuccess = false;

        const usuarios = ["mario.baquero@constecoin.com", "victor.boccalon@constecoin.com", "dayana.herrera@constecoin.com",
            "cristian.manzano@constecoin.com", "juan.moran@constecoin.com", "pablo.pillajo@constecoin.com", "pedro.tulcan@constecoin.com",
            "ricardo.venegas@constecoin.com", "diana.zurita@constecoin.com"]

        const contrasenia = ["mario.baquero", "victor.boccalon", "dayana.herrera", "cristian.manzano", "juan.moran",
            "pablo.pillajo", "pedro.tulcan", "ricardo.venegas", "diana.zurita"]

        for (let i = 0; i < usuarios.length; i++) {
            console.log(username)
            console.log(password)
            console.log(usuarios[i])
            console.log(contrasenia[i])
            if (username === usuarios[i] && password === contrasenia[i]) {
                loginSuccess = true;
                onLogin(); // Llamas a tu función de inicio de sesión si las credenciales son correctas
                break;
            }
        }

        if (!loginSuccess) {
            alert("Credenciales incorrectas"); // Si no encontramos ninguna coincidencia
        }

    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                {/* Logo de la empresa */}
                <img
                    src="/logo.png"
                    alt="Logo de la empresa"
                    style={styles.logo}
                />
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
        maxWidth: "400px", // Ajusta el tamaño del formulario
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

