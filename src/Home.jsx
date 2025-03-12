function Home({ onGoToForm, onLogout }) {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Bienvenido a Constecoin</h1>
            <p style={styles.subtitle}>Selecciona una opción:</p>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={onGoToForm}>
                    📋 Ir al Formulario
                </button>
                <button style={styles.button}>
                    🔍 Ver Proyectos
                </button>
                <button style={styles.button}>
                    ⚙️ Configuración
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
        flexDirection: "row", // 🟢 Ahora los botones estarán en fila (horizontal)
        gap: "20px", // Espacio entre botones
        justifyContent: "center",
    },
    button: {
        padding: "18px 30px", // 🟢 Aumentamos el tamaño de los botones
        fontSize: "18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "#fff",
        transition: "0.3s",
        minWidth: "220px", // 🟢 Hace que todos los botones tengan un ancho uniforme
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
