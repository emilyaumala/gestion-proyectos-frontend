import { useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";

const API_URL = "https://crm.constecoin.com/apicrm";

function Cambiopwd() {
  const [contraseniaActual, setContraseniaActual] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirPwd, setConfirPwd] = useState("");
  const [comparacionError, setComparacionError] = useState("");
  const [verifyPwdError, setVerifyPwdError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');  // Recupera el token del localStorage

    if (!token) {
      console.error("Token no encontrado. El usuario no está autenticado.");
      setVerifyPwdError("El usuario no está autenticado. Inicie sesión.");
      return;
    }

    // Verifica que las contraseñas coincidan antes de enviar la solicitud
    if (newPassword !== confirPwd) {
      setComparacionError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/cambiar-password`,  // URL correcta
        { contraseniaActual, newPassword },  // Asegúrate de enviar los datos correctos
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Aquí se está enviando el token correctamente en el encabezado
          },
        }
      );
      //console.log(response.data);  // Procesa la respuesta correctamente
      setVerifyPwdError("");  // Limpia el error si la respuesta es exitosa
      alert("Contraseña cambiada exitosamente");  // Notificación de éxito
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      if (error.response && error.response.status === 401) {
        setVerifyPwdError("Token inválido o expirado. Inicie sesión nuevamente.");
      } else {
        setVerifyPwdError("Hubo un error al cambiar la contraseña. Intente nuevamente.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>🔒 Cambio de contraseña</h1>
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
};

export default Cambiopwd;
