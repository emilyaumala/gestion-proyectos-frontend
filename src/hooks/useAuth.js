import { useState, useEffect } from "react";

const useAuth = () => {
    const [rol, setRol] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setRol(user.rol);  // Suponiendo que el backend devuelve un objeto con { rol: "administrador" o "jefeArea" }
        }
    }, []);

    return rol;
};

export default useAuth;
