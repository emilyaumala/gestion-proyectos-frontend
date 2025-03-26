import { useNavigate } from "react-router-dom";

function Home({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenido a Constecoin</h1>
      <p style={styles.subtitle}>Selecciona una opción:</p>
      
      <div style={styles.buttonContainer}>
        <div style={styles.rowButton}>
          <button style={styles.button} onClick={() => navigate("/formulario")}>
            📋 Agregar Oportunidad
          </button>

          <button style={styles.button} onClick={() => navigate("/actualizar-oportunidades")}>
            📋 Actualizar Oportunidad
          </button>
          <button style={styles.button} onClick={() => navigate("/proyectos")}>
            📊 Ver Oportunidades
          </button>
        </div>

        <div style={styles.rowButton}>
          <button style={styles.button} onClick={() => navigate("/forecast")}>
            📊 Proyección
          </button>
          <button style={styles.button} onClick={() => navigate("/cambio-contrasenia")}>
            🔒 Cambio contraseña
          </button>
        </div>

        <div style={styles.rowButton}>
          <button style={styles.logoutButton} onClick={onLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
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
    padding: "20px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "clamp(16px, 3vw, 20px)",
    color: "#666",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "800px",
    alignItems: "center",
  },
  rowButton: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    width: "100%",
    
  },
  button: {
    padding: "14px 20px",
    fontSize: "clamp(14px, 2.5vw, 18px)",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#7d9bc9",
    color: "#fff",
    transition: "0.3s",
    minWidth: "180px",
    textAlign: "center",
    fontWeight: "bold",
    flex: "1",
    maxWidth: "250px",
  },
  logoutButton: {
    padding: "14px 20px",
    fontSize: "clamp(14px, 2.5vw, 18px)",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#dc3545",
    color: "#fff",
    transition: "0.3s",
    minWidth: "180px",
    textAlign: "center",
    fontWeight: "bold",
    flex: "1",
    maxWidth: "250px",
  },
};

export default Home;
