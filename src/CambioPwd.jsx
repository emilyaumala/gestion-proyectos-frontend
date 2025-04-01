import { useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";

const API_URL = "https://crm.constecoin.com/apicrm";

function Cambiopwd({ onLogout }) { // Recibe onLogout como prop
  const [contraseniaActual, setContraseniaActual] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirPwd, setConfirPwd] = useState("");
  const [comparacionError, setComparacionError] = useState("");
  const [verifyPwdError, setVerifyPwdError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifyPwdError("");
    setComparacionError("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      setVerifyPwdError("El usuario no está autenticado. Inicie sesión.");
      return;
    }

    if (newPassword !== confirPwd) {
      setComparacionError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/cambiar-password`,
        { contraseniaActual, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Contraseña cambiada exitosamente. Redirigiendo...", {
        position: "top-right",
        autoClose: 3000, // Mensaje visible por 3 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setTimeout(() => {
        localStorage.removeItem("token"); // Elimina el token
        onLogout(); // Cierra sesión y redirige al login
      }, 3000);

    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setVerifyPwdError(error.response?.data?.error || "Error al cambiar la contraseña.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <button onClick={() => window.history.back()} style={styles.backButton}>
          ⬅ Volver
        </button>
        <h1 style={styles.title}>🔒 Cambio de contraseña</h1>
        <ToastContainer />
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={contraseniaActual}
            onChange={(e) => setContraseniaActual(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirPwd}
            onChange={(e) => setConfirPwd(e.target.value)}
            style={styles.input}
          />

          {comparacionError && <Alert severity="error">{comparacionError}</Alert>}
          {verifyPwdError && <Alert severity="error">{verifyPwdError}</Alert>}

          <button type="submit" style={styles.button}>✔ Cambiar contraseña</button>
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
    width: "100%",
    margin: "10px 0"
  },
  backButton: {
    background: "transparent",
    border: "none",
    color: "#007bff",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "5px"
}
};

export default Cambiopwd;
