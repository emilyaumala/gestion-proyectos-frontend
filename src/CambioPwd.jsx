import { useState } from "react";
import { Alert } from "@mui/material";

function Cambiopwd() {
  const [contrasenia, setContrasenia] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirPwd, setConfirPwd] = useState("");
  const [comparacionError, setComparacionError] = useState("")
  const [verifyPwdError, setVerifyPwdError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const response = await axios.get("");
      //const hashedPassword = response.data.password; 
      //const isMatch = await bcrypt.compare(contrasenia, hashedPassword);

      if (contrasenia != "1234") {
        setVerifyPwdError("❌ Contraseña incorrecta, intente nuevamente");
        setComparacionError("")
        setContrasenia("")
        setNewPassword("")
        setConfirPwd("")
        return;
      }

      if (newPassword !== confirPwd) {
        setComparacionError("❌ Las contraseñas no coinciden");
        setNewPassword("")
        setConfirPwd("")
        return;
      }

      setComparacionError("");

      // const salt = await bcrypt.genSalt(10);
      // const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // await axios.post("", {
      //   newPassword: hashedNewPassword,
      // });

      setContrasenia("");
      setNewPassword("");
      setConfirPwd("");
      alert("✅ Contraseña cambiada exitosamente");
    } catch (error) {
      console.error("❌ Error al cambiar la contraseña", error);
      alert("⚠ Ocurrió un error, inténtelo más tarde");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>🔒 Cambio de contraseña</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              type={"password"}
              placeholder="Contraseña actual"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <input
              type={"password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <input
              type={"password"}
              placeholder="Confirmación contraseña"
              value={confirPwd}
              onChange={(e) => setConfirPwd(e.target.value)}
              style={styles.input}
            />
          </div>

          {comparacionError && <Alert severity="error" sx={{ mb: 2 }}>{comparacionError}</Alert>}
          {verifyPwdError && <Alert severity="error" sx={{ mb: 2 }}>{verifyPwdError}</Alert>}

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
    padding: "clamp(15px, 5vw, 30px)",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
    minWidth: "280px",
    boxSizing: "border-box",
    margin: "auto",
  },
  title: {
    fontSize: "clamp(24px, 5vw, 24px)",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
    width: "100%"
  },
  inputContainer: {
    position: "relative",
    width: "90%",

  },
  input: {
    width: "100%",
    maxWidth: "100%",
    padding: "14px",
    fontSize: "clamp(14px, 2.5vw, 18px)",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#fff",
    color: "#000",
    caretColor: "#000",
    boxSizing: "border-box",
  },
  iconButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
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
    fontWeight: "bold",
    width: "100%",
    maxWidth: "250px",
  },
};

export default Cambiopwd;
