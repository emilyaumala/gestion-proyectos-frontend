import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Calendario = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Intentar obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      // Almacenar el token en localStorage
      localStorage.setItem('accessToken', accessToken);

      // Redirigir a la página principal o a la que desees después de almacenar el token
      navigate('/calendario');
    } else {
      // Si no hay token en la URL, redirigir al login o página de error
      navigate('/');
    }
  }, [navigate]);

  return <div>Bienvenido al Dashboard</div>;
};

export default Calendario;
