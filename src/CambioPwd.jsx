import { useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const API_URL = "https://crm.constecoin.com/apicrm";

function Cambiopwd({ onLogout }) { // Recibe onLogout como prop
  const [contraseniaActual, setContraseniaActual] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirPwd, setConfirPwd] = useState("");
  const [comparacionError, setComparacionError] = useState("");
  const [verifyPwdError, setVerifyPwdError] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

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
          <div style={styles.inputContainerStyle}>
            <input
              type={showPassword1 ? "text" : "password"}
              placeholder="Contraseña actual"
              value={contraseniaActual}
              onChange={(e) => setContraseniaActual(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              style={styles.eyeIconStyle}
            >
              {showPassword1 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>

          <div style={styles.inputContainerStyle}>
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              style={styles.eyeIconStyle}
            >
              {showPassword2 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>

          <div style={styles.inputContainerStyle}>
            <input
              type={showPassword3 ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirPwd}
              onChange={(e) => setConfirPwd(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword3(!showPassword3)}
              style={styles.eyeIconStyle}
            >
              {showPassword3 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>

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
  form: {
    width: "100%",
  },
  inputContainerStyle: {
    position: 'relative',
    width: '100%',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    paddingRight: '40px', // Espacio para el icono
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
  },
  eyeIconStyle: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#666',
    zIndex: 1,
    background: 'transparent',
    border: 'none',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    border: 'none',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none', 
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
  },
};

export default Cambiopwd;