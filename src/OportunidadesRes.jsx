
import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Alert, MenuItem, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import PhoneInput from "react-phone-number-input";

const API_URL = "https://crm.constecoin.com/apicrm";

function OportunidadesRes() {
  const [proyectos, setProyectos] = useState([]);
  const [actualizaciones, setActualizaciones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [proyectosFiltrados, setProyectosFiltrados] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [oportunidad, setOportunidad] = useState(null);
  const [error, setError] = useState(null);
  const [editable, setEditable] = useState(false);
  const [buttonText, setButtonText] = useState("Editar");
  const [observaciones, setObservaciones] = useState("");
  const [clientes, setClientes] = useState([]);
  const [faseVenta, setFaseVenta] = useState(null);
  const [montoEstimado, setMontoEstimado] = useState("");
  const [codigoProyecto, setCodigoProyecto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [respComercial, setRespComercial] = useState(null);
  const [respTecnico, setRespTecnico] = useState(null);
  const [probabilidadVenta, setProbabilidadVenta] = useState(null);
  const [nombreContacto, setNombreContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [numeroContacto, setNumeroContacto] = useState("");
  const [cliente, setCliente] = useState(null);

  const [fasesVentaList, setFasesVentaList] = useState([]);
  const [probabilidadesVentaList, setProbabilidadesVentaList] = useState([]);
  const [responsablesComerciales, setResponsablesComerciales] = useState([]);
  const [responsablesTecnicos, setResponsablesTecnicos] = useState([]);
  const [colaboradoresActividad, setColaboradoresActividad] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const navigate = useNavigate();
  const [showActivityFields, setShowActivityFields] = useState(false); // Controla la visibilidad de los campos de actividad
  const [tituloActividad, setTituloActividad] = useState("");
  const [descripcionActividad, setDescripcionActividad] = useState(""); // Descripción de la actividad
  const [colaboradorActividad, setColaboradorActividad] = useState([]);
  const [horaInicio, setHoraInicio] = useState(""); // Hora de inicio
  const [horaFin, setHoraFin] = useState(""); // Hora de fin
  // Obtener usuario y roles de localStorage de manera segura
  const user = localStorage.getItem("user");
  let roles = [];
  let userId = null
  let nombreCompleto = "";


  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      //console.log(parsedUser._id)
      roles = parsedUser.roles || [];
      userId = parsedUser._id;
      nombreCompleto = parsedUser.nombreCompleto;
      //console.log("useis",userId)

    } catch (error) {
      console.error("Error al parsear el objeto 'user' desde localStorage:", error);
    }
  }
  useEffect(() => {
    const handlePopState = (event) => {
      navigate("/");
    };
    window.addEventListener("popstate", handlePopState);

    const fetchData = async () => {
      try {
        const proyectosRes = await axios.get(`${API_URL}/proyectos`);
        const actualizacionesRes = await axios.get(`${API_URL}/actualizaciones/ultimas`)
        setProyectos(proyectosRes.data);
        setActualizaciones(actualizacionesRes.data)
        // Crear un diccionario con la última actualización de cada proyecto
        const ultimasActualizaciones = {};
        actualizacionesRes.data.forEach((item) => {
          const actualizacion = item.ultimaActualizacion; // Ajuste: Acceder al objeto anidado
          ultimasActualizaciones[item._id] = actualizacion;
        });

        // Filtrar proyectos donde el usuario es responsable en la última actualización
        const proyectosFiltrados = proyectosRes.data.filter((proyecto) => {
          const ultimaActualizacion = ultimasActualizaciones[proyecto._id];

          return (
            ultimaActualizacion?.respComercial === userId ||
            ultimaActualizacion?.respTecnico === userId
          );
        });
        const clientesRes = await axios.get(`${API_URL}/clientes`);
        setClientes(clientesRes.data);
        setProyectosFiltrados(proyectosFiltrados);
        console.log("Proyectos filtrados: ", proyectosFiltrados)
        const areasRes = await axios.get(`${API_URL}/areas`);
        setAreas(areasRes.data);

        const probabilidadesRes = await axios.get(`${API_URL}/probabilidad-venta`);
        setProbabilidadesVentaList(probabilidadesRes.data);

        const [fasesRes, comercialesRes, tecnicosRes, colaboradoresRes] = await Promise.all([
          axios.get(`${API_URL}/fasesVenta`),
          axios.get(`${API_URL}/responsables`),
          axios.get(`${API_URL}/responsables`),
          axios.get(`${API_URL}/responsables`),
        ]);

        setFasesVentaList(fasesRes.data);
        setResponsablesComerciales(comercialesRes.data);
        setResponsablesTecnicos(tecnicosRes.data);
        setColaboradoresActividad(colaboradoresRes.data)
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        setError("Hubo un problema al cargar los datos.");
      }

    };

    fetchData();

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      localStorage.setItem("outlookToken", accessToken);
      setToken(accessToken);
      setShowActivityFields(true); // Mostrar los campos después del login
      window.history.replaceState({}, document.title, window.location.pathname); // Eliminar el token de la URL
    }
  }, []);


  const formatDateToMonthYear = (dateString) => {
    const [year, month] = dateString.split("T")[0].split("-");
    return `${year}-${month}`;
  };
  const handleToggleActivity = () => {
    setShowActivityFields(!showActivityFields); // Muestra/oculta los campos de actividad
  };
  const handleProyectoChange = async (event) => {
    const selectedProyecto = proyectos.find((p) => p._id === event.target.value) || null;
    setProyectoSeleccionado(selectedProyecto);
    if (selectedProyecto) {
      const ultimaActualizacion = actualizaciones.find((a) => a._id === selectedProyecto._id)?.ultimaActualizacion;
      try {
        const response = await axios.get(`${API_URL}/oportunidades/${ultimaActualizacion.proyectoId}`);
        const data = response.data;
console.log(data)
        setOportunidad(data);
        setCliente(data.cliente);
        setFaseVenta(data.faseVenta);

        // Si el cliente es "CONSTECOIN", establece los valores a null
        if (data.cliente.cliente === "CONSTECOIN") {
          setNombreContacto(null);
          setCorreoContacto(null);
          setNumeroContacto(null);
          setMontoEstimado(null);
          setRespComercial(null);
          setProbabilidadVenta(null);
        } else {
          setNombreContacto(data.nombreContacto);
          setCorreoContacto(data.correoContacto);
          setNumeroContacto(data.numeroContacto);
          setMontoEstimado(data.montoEstimado);
          setRespComercial(data.respComercial);
          setProbabilidadVenta(data.probabilidadVenta);
        }

        setFechaInicio(formatDateToMonthYear(data.fechaInicio));
        setRespTecnico(data.respTecnico);
      } catch (error) {
        console.error("❌ Error al obtener oportunidad:", error);
        setError("Hubo un problema al cargar la oportunidad.");
      }
    }
  };
  const handleEnviar = async (route) => {
    if (!proyectoSeleccionado) {
      setError("Selecciona un proyecto antes de enviar.");
      return;
    }
    const formattedData = {
      cliente,
      nombreProyecto: proyectoSeleccionado.nombreProyecto,
      proyectoId: proyectoSeleccionado._id,
      faseVenta,
      codigoProyecto: proyectoSeleccionado.codigoProyecto,
      montoEstimado: parseFloat(montoEstimado) || 0,
      fechaInicio: fechaInicio,
      respComercial,
      respTecnico,
      probabilidadVenta,
      observaciones: observaciones || "Sin observaciones",
      tituloActividad,
      descripcionActividad,
      colaboradorActividad: colaboradorActividad.map(colaborador => ({
        nombre: colaborador.nombreCompleto,
        correo: colaborador.correo
    })),
          horaInicio: horaInicio,  // Recibimos la fecha y hora de inicio combinadas
      horaFin: horaFin,    // Recibimos la fecha y hora de fin combinadas
      nombreContacto: nombreContacto,
      numeroContacto: numeroContacto,
      correoContacto: correoContacto,
      nombreUsuario: nombreCompleto
    };

    try {
      const response = await axios.post(`${API_URL}/guardar1`, formattedData);
      const formattedDataString = encodeURIComponent(JSON.stringify(formattedData))
      window.location.href = `https://crm.constecoin.com/apicrm/auth/outlook?redirect=${route}&data=${formattedDataString}`
      alert("Actualización guardada exitosamente");
      navigate("/actualizar-oportunidades");
      setError(null);
    } catch (error) {
      console.error("❌ Error al guardar el proyecto:", error);
      setError("Hubo un problema al guardar los datos. Inténtalo de nuevo.");
    }
  };
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9f9f9",
        padding: { xs: "16px", sm: "24px", md: "32px" },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          padding: { xs: "20px", sm: "30px" },
          borderRadius: "24px",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#333333"
          sx={{ mb: 2, textAlign: "center", fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          Actualizar Oportunidad
        </Typography>
        <TextField
          fullWidth
          select
          label="Seleccionar Oportunidad"
          onChange={handleProyectoChange}
          value={proyectoSeleccionado ? proyectoSeleccionado._id : ""}
          margin="normal"
        >
          {proyectosFiltrados.map((proyecto) => (
            <MenuItem key={proyecto._id} value={proyecto._id}>
              {proyecto.nombreProyecto}
            </MenuItem>
          ))}
        </TextField>
        {/* Datos Oportunidad */}
        {/* Datos Oportunidad */}
        {proyectoSeleccionado && oportunidad && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (editable) {
                  setOportunidad(prev => ({
                    ...prev,
                    faseVenta,
                    montoEstimado,
                    fechaInicio,
                    respComercial,
                    respTecnico,
                    nombreContacto,
                    numeroContacto,
                    correoContacto,
                    //cantidadLapso,
                    //unidadLapso,
                    probabilidadVenta,
                  }));
                  setEditable(false);
                  setButtonText("Editar");
                } else {
                  setEditable(true);
                  setButtonText("Guardar");
                }
              }}
              sx={{
                alignSelf: "center",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {buttonText}
            </Button>

            {/* Campos */}
            <Box>
              <Typography fontWeight="bold">Cliente:</Typography>
              {editable ? (
                <Autocomplete
                  fullWidth
                  options={clientes}
                  getOptionLabel={(option) => option.cliente}
                  value={cliente}
                  onChange={(e, newValue) => setCliente(newValue)}
                  renderInput={(params) => <TextField {...params} placeholder="Seleccionar Cliente" />}
                />
              ) : (
                <TextField fullWidth value={oportunidad.cliente.cliente} disabled />
              )}
            </Box>
  
            {/* Nombre y Correo de Contacto */}
            {!cliente || cliente.cliente !== "CONSTECOIN" ? (
              <>
                <Box>
                  <Typography fontWeight="bold">Nombre Contacto:</Typography>
                  <TextField
                    fullWidth
                    value={nombreContacto || ""}
                    disabled={!editable}
                    onChange={(e) => setNombreContacto(e.target.value)}
                  />
                </Box>
  
                <Box>
                  <Typography fontWeight="bold">Correo Contacto:</Typography>
                  <TextField
                    fullWidth
                    value={correoContacto}
                    disabled={!editable}
                    onChange={(e) => setCorreoContacto(e.target.value)}
                  />
                </Box>
  
                <Box>
                  <Typography fontWeight="bold">Número de Contacto:</Typography>
                  {editable ? (
                    <PhoneInput
                      international
                      defaultCountry="EC"
                      value={numeroContacto}
                      onChange={setNumeroContacto}
                      style={{
                        width: "97%",
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <TextField fullWidth value={numeroContacto} disabled />
                  )}
                </Box>
  
                <Box>
                  <Typography fontWeight="bold">Fase de Venta:</Typography>
                  {editable ? (
                    <Autocomplete
                      fullWidth
                      options={fasesVentaList}
                      getOptionLabel={(option) => option.faseVenta}
                      value={faseVenta}
                      onChange={(e, newValue) => setFaseVenta(newValue)}
                      renderInput={(params) => <TextField {...params} placeholder="Seleccionar Fase" />}
                    />
                  ) : (
                    <TextField fullWidth value={oportunidad.faseVenta.faseVenta} disabled />
                  )}
                </Box>
  
                <Box>
                  <Typography fontWeight="bold">Monto Estimado:</Typography>
                  {editable ? (
                    <NumericFormat
                      value={montoEstimado}
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      allowNegative={false}
                      prefix="$ "
                      customInput={TextField}
                      fullWidth
                      label="Monto Estimado (USD)"
                      margin="normal"
                      onValueChange={(values) => setMontoEstimado(values.floatValue)} // Solo se pasa el número
                    />
                  ) : (
                    <TextField
                      fullWidth
                      value={formatCurrency(montoEstimado)} // Mostrar monto formateado si no está en modo de edición
                      disabled
                    />
                  )}
                </Box>
              </>
            ) : null}
  
            {/* Fecha de Inicio */}
            <Box>
              <Typography fontWeight="bold">Fecha de Cierre Probable:</Typography>
              <TextField
                fullWidth
                value={fechaInicio}
                disabled={!editable}
                onChange={(e) => setFechaInicio(e.target.value)}
                type="month"
              />
            </Box>
  
            {/* Responsable Comercial */}
            {!(cliente && cliente.cliente === "CONSTECOIN") && (
              <Box>
                <Typography fontWeight="bold">Responsable Comercial:</Typography>
                {editable ? (
                  <Autocomplete
                    fullWidth
                    options={responsablesComerciales}
                    getOptionLabel={(option) => option.nombreCompleto}
                    value={respComercial}
                    onChange={(e, newValue) => setRespComercial(newValue)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccionar Comercial" />}
                  />
                ) : (
                  <TextField fullWidth value={oportunidad.respComercial.nombreCompleto} disabled />
                )}
              </Box>
            )}
  
            {/* Responsable Técnico */}
            <Box>
              <Typography fontWeight="bold">Responsable Técnico:</Typography>
              {editable ? (
                <Autocomplete
                  fullWidth
                  options={responsablesTecnicos}
                  getOptionLabel={(option) => option.nombreCompleto}
                  value={respTecnico}
                  onChange={(e, newValue) => setRespTecnico(newValue)}
                  renderInput={(params) => <TextField {...params} placeholder="Seleccionar Técnico" />}
                />
              ) : (
                <TextField fullWidth value={oportunidad.respTecnico.nombreCompleto} disabled />
              )}
            </Box>
  
            {/* Probabilidad de Venta */}
            {!cliente || cliente.cliente !== "CONSTECOIN" ? (
              <Box>
                <Typography fontWeight="bold">Probabilidad de Venta:</Typography>
                {editable ? (
                  <Autocomplete
                    fullWidth
                    options={probabilidadesVentaList}
                    value={probabilidadVenta}
                    onChange={(e, newValue) => setProbabilidadVenta(newValue)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccionar Probabilidad" />}
                  />
                ) : (
                  <TextField fullWidth value={oportunidad.probabilidadVenta} disabled />
                )}
              </Box>
            ) : null}
  
            {/* Observaciones */}
            <Box>
              <Typography fontWeight="bold">Observaciones:</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Escribe tus observaciones aquí..."
              />
            </Box>
  
            {/* Actividad */}
            {proyectoSeleccionado && (
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleToggleActivity}
                  sx={{ mb: 2 }}
                >
                  + Actividad
                </Button>
              </Box>
            )}
  
            {proyectoSeleccionado && showActivityFields && (
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography fontWeight="bold">Titulo de la Actividad:</Typography>
                  <TextField
                    fullWidth
                    value={tituloActividad}
                    onChange={(e) => setTituloActividad(e.target.value)}
                  />
                </Box>
                <Typography fontWeight="bold">Descripción de la Actividad:</Typography>
                <TextField
                  fullWidth
                  value={descripcionActividad}
                  onChange={(e) => setDescripcionActividad(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Descripción de la actividad"
                />
                <Box>
                  <Typography fontWeight="bold">Colaboradores:</Typography>
                  <Autocomplete
                    multiple
                    fullWidth
                    options={Array.isArray(colaboradoresActividad) ? colaboradoresActividad : []} // Evita errores si es undefined
                    getOptionLabel={(option) => option?.nombreCompleto || "Desconocido"} // Evita errores si option es undefined
                    value={Array.isArray(colaboradorActividad) ? colaboradorActividad : []} // Asegura que siempre sea un array
                    onChange={(e, newValue) => setColaboradorActividad(newValue || [])} // Si newValue es null, usa []
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Seleccionar Colaboradores" />
                    )}
                  />
                </Box>
  
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold">Fecha y Hora de Inicio:</Typography>
                    <TextField
                      fullWidth
                      type="datetime-local" // Combina fecha y hora
                      value={horaInicio} // Guardamos tanto la fecha como la hora
                      onChange={(e) => setHoraInicio(e.target.value)} // Actualizamos la fecha y hora de inicio
                      disabled={!showActivityFields}
                    />
                  </Box>
  
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold">Fecha y Hora de Fin:</Typography>
                    <TextField
                      fullWidth
                      type="datetime-local" // Combina fecha y hora
                      value={horaFin} // Guardamos tanto la fecha como la hora
                      onChange={(e) => setHoraFin(e.target.value)} // Actualizamos la fecha y hora de fin
                      disabled={!showActivityFields}
                    />
                  </Box>
                </Box>
              </Box>
            )}
  
            {/* Botones Finales */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button variant="contained" color="success" onClick={() => handleEnviar('home')}>
                Enviar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => window.location.href = `/`}
              >
                Regresar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
} 


export default OportunidadesRes;