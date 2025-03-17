import { useNavigate } from "react-router-dom";  // Importa el hook useNavigate

function Home({ onLogout }) {
    const navigate = useNavigate();  // Usa el hook para la navegación

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Bienvenido a Constecoin</h1>
            <p style={styles.subtitle}>Selecciona una opción:</p>
            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onClick={() => navigate("/formulario")}  // Usamos navigate para redirigir al formulario
                >
                    📋 Agregar Oportunidad
                </button>

                <button
                    style={styles.button}
                    onClick={() => navigate("/proyectos")}  // Usa navigate para redirigir a proyectos
                >
                    📊 Ver Oportunidades
                </button>
                <button style={styles.button}
                onClick={() => navigate("/actualizar-oportunidades")}>
                    📋 Actualizar Oportunidad
                </button> 

                <button style={styles.button}
                onClick={() => navigate("/forecast")}>
                    📊 Proyección
                </button> 
                <button style={styles.logoutButton} onClick={onLogout}>
                    🚪 Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    },
    subtitle: {
        fontSize: "20px",
        color: "#666",
        marginBottom: "30px",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        justifyContent: "center",
    },
    button: {
        padding: "18px 30px",
        fontSize: "18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#7d9bc9",
        color: "#fff",
        transition: "0.3s",
        minWidth: "220px",
        textAlign: "center",
        fontWeight: "bold",
    },
    logoutButton: {
        padding: "18px 30px",
        fontSize: "18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#dc3545",
        color: "#fff",
        transition: "0.3s",
        minWidth: "220px",
        textAlign: "center",
        fontWeight: "bold",
    },
};

export default Home;
