import { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Grid, Alert, MenuItem, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://crm.constecoin.com/apicrm/";

function Oportunidades() {
    const [proyectos, setProyectos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [proyectosFiltrados, setProyectosFiltrados] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [oportunidad, setOportunidad] = useState(null);
    const [error, setError] = useState(null);
    const [editable, setEditable] = useState(false);
    const [buttonText, setButtonText] = useState("Editar");
    const [observaciones, setObservaciones] = useState("");


    // Estados locales editables
    const [faseVenta, setFaseVenta] = useState(null);
    const [montoEstimado, setMontoEstimado] = useState("");
    const [codigoProyecto, setCodigoProyecto] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [respComercial, setRespComercial] = useState(null);
    const [respTecnico, setRespTecnico] = useState(null);
    const [cantidadLapso, setCantidadLapso] = useState("");
    const [unidadLapso, setUnidadLapso] = useState("");
    const [probabilidadVenta, setProbabilidadVenta] = useState(null);

    // Datos para Autocomplete
    const [fasesVentaList, setFasesVentaList] = useState([]);
    const [probabilidadesVentaList, setProbabilidadesVentaList] = useState([]);
    const [responsablesComerciales, setResponsablesComerciales] = useState([]);
    const [responsablesTecnicos, setResponsablesTecnicos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = (event) => {
            navigate("/");
        };
        window.addEventListener("popstate", handlePopState);
    
        const fetchData = async () => {
            try {
                const proyectosRes = await axios.get(`${API_URL}/proyectos`);
                setProyectos(proyectosRes.data);
    
                const areasRes = await axios.get(`${API_URL}/areas`);
                console.log("Áreas recibidas desde la API:", areasRes.data);
                setAreas(areasRes.data);  // <<--- AQUÍ SE CARGAN LAS ÁREAS
    
                const probabilidadesRes = await axios.get(`${API_URL}/probabilidad-venta`);
                setProbabilidadesVentaList(probabilidadesRes.data);
    
                const [fasesRes, comercialesRes, tecnicosRes] = await Promise.all([
                    axios.get(`${API_URL}/fasesVenta`),
                    axios.get(`${API_URL}/responsables-comerciales`),
                    axios.get(`${API_URL}/responsables-tecnicos`)
                ]);
    
                setFasesVentaList(fasesRes.data);
                setResponsablesComerciales(comercialesRes.data);
                setResponsablesTecnicos(tecnicosRes.data);
    
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
                setError("Hubo un problema al cargar los datos.");
            }
        };
    
        fetchData();  // <<--- ESTA LÍNEA FALTABA, LLAMAR A fetchData
    
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);
    
    const formatDateToMonthYear = (dateString) => {
        const [year, month] = dateString.split("T")[0].split("-");
        return `${year}-${month}`; // Ej: 2025-03
    };
    
    

    const handleAreaChange = (event) => {
        const selectedArea = areas.find(a => a._id === event.target.value);
        setAreaSeleccionada(selectedArea);
        const proyectosFiltrados = proyectos.filter(proyecto => proyecto.area._id === event.target.value);

        setProyectosFiltrados(proyectosFiltrados);
        setProyectoSeleccionado(null); // Resetear el proyecto seleccionado
    };
    const handleProyectoChange = async (event) => {
        const selectedProyecto = proyectos.find(p => p._id === event.target.value);
        setProyectoSeleccionado(selectedProyecto);

        if (selectedProyecto) {
            try {
                const response = await axios.get(`${API_URL}/oportunidades/${selectedProyecto._id}`);
                const data = response.data;

                setOportunidad(data);

                // Prellenar estados editables
                setFaseVenta(data.faseVenta);
                setCodigoProyecto(data.codigoProyecto);
                setMontoEstimado(data.montoEstimado);
                setFechaInicio(formatDateToMonthYear(data.fechaInicio)); // Formatear y asignar la fecha
                setRespComercial(data.respComercial);
                setRespTecnico(data.respTecnico);
                setCantidadLapso(data.cantidadLapso);
                setUnidadLapso(data.unidadLapso);
                setProbabilidadVenta(data.probabilidadVenta);

            } catch (error) {
                console.error("❌ Error al obtener oportunidad:", error);
                setError("Hubo un problema al cargar la oportunidad.");
            }
        }
    };
    const handleEnviar = async () => {
        if (!proyectoSeleccionado) {
            setError("Selecciona un proyecto antes de enviar.");
            return;
        }

        const formattedData = {
            nombreProyecto: proyectoSeleccionado.nombreProyecto,
            proyectoId: proyectoSeleccionado._id, // 👈 Asegúrate de enviarlo
            faseVenta,
            codigoProyecto: proyectoSeleccionado.codigoProyecto,
            montoEstimado: parseFloat(montoEstimado) || 0,
            fechaInicio: fechaInicio, // ya está en formato YYYY-MM
            respComercial,
            respTecnico,
            cantidadLapso,
            unidadLapso,
            probabilidadVenta,
            observaciones: observaciones || "Sin observaciones" // 👈 ahora sí mandas observaciones
        };

        console.log("📤 Enviando al backend:", formattedData); // DEBUG

        try {
            const response = await axios.post(`${API_URL}/guardar1`, formattedData);
            console.log("✅ Respuesta del backend:", response.data);
            alert("Proyecto guardado exitosamente");
            navigate("/actualizar-oportunidades");
            setError(null);
        } catch (error) {
            console.error("❌ Error al guardar el proyecto:", error.response?.data || error.message);
            setError("Hubo un problema al guardar los datos. Inténtalo de nuevo.");
        }
    };


    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
    };

    return (
        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",  // Alto completo de pantalla
          width: "100vw",
          backgroundColor: "#f9f9f9",
          padding: { xs: "16px", sm: "24px", md: "32px" },
          boxSizing: "border-box",
        }}
        >
          <Box
      sx={{
        width: "100%",
        maxWidth: "600px", // Ajusta el tamaño máximo del cuadro (ajustable)
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
        sx={{
          mb: 2,
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        Oportunidad del Proyecto
      </Typography>
      
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
              {/* Área */}
              <TextField
                fullWidth
                select
                label="Seleccionar Área"
                onChange={handleAreaChange}
                value={areaSeleccionada ? areaSeleccionada._id : ""}
                margin="normal"
              >
                {areas.map(area => (
                  <MenuItem key={area._id} value={area._id}>
                    {area.area}
                  </MenuItem>
                ))}
              </TextField>
      
              {/* Proyecto */}
              {areaSeleccionada && (
                <TextField
                  fullWidth
                  select
                  label="Seleccionar Proyecto"
                  onChange={handleProyectoChange}
                  margin="normal"
                >
                  {proyectosFiltrados.map(proyecto => (
                    <MenuItem key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombreProyecto}
                    </MenuItem>
                  ))}
                </TextField>
              )}
      
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
                          cantidadLapso,
                          unidadLapso,
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
                  {/* Fase de Venta */}
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
      
                  {/* Monto Estimado */}
                  <Box>
                    <Typography fontWeight="bold">Monto Estimado:</Typography>
                    <TextField
                      fullWidth
                      value={montoEstimado}
                      disabled={!editable}
                      onChange={(e) => setMontoEstimado(e.target.value)}
                    />
                  </Box>
      
                  {/* Fecha de Inicio */}
                  <Box>
                    <Typography fontWeight="bold">Fecha de Inicio:</Typography>
                    <TextField
                      fullWidth
                      value={fechaInicio}
                      disabled={!editable}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      type="month"
                    />
                  </Box>
      
                  {/* Responsable Comercial */}
                  <Box>
                    <Typography fontWeight="bold">Responsable Comercial:</Typography>
                    {editable ? (
                      <Autocomplete
                        fullWidth
                        options={responsablesComerciales}
                        getOptionLabel={(option) => option.respComercial}
                        value={respComercial}
                        onChange={(e, newValue) => setRespComercial(newValue)}
                        renderInput={(params) => <TextField {...params} placeholder="Seleccionar Comercial" />}
                      />
                    ) : (
                      <TextField fullWidth value={oportunidad.respComercial.respComercial} disabled />
                    )}
                  </Box>
      
                  {/* Responsable Técnico */}
                  <Box>
                    <Typography fontWeight="bold">Responsable Técnico:</Typography>
                    {editable ? (
                      <Autocomplete
                        fullWidth
                        options={responsablesTecnicos}
                        getOptionLabel={(option) => option.respTecnico}
                        value={respTecnico}
                        onChange={(e, newValue) => setRespTecnico(newValue)}
                        renderInput={(params) => <TextField {...params} placeholder="Seleccionar Técnico" />}
                      />
                    ) : (
                      <TextField fullWidth value={oportunidad.respTecnico.respTecnico} disabled />
                    )}
                  </Box>
      
                  {/* Cantidad Lapso */}
                  <Box>
                    <Typography fontWeight="bold">Cantidad Lapso:</Typography>
                    <TextField
                      fullWidth
                      value={cantidadLapso}
                      disabled={!editable}
                      onChange={(e) => setCantidadLapso(e.target.value)}
                    />
                  </Box>
      
                  {/* Unidad Lapso */}
                  <Box>
                    <Typography fontWeight="bold">Unidad Lapso:</Typography>
                    <TextField
                      fullWidth
                      select
                      value={unidadLapso}
                      disabled={!editable}
                      onChange={(e) => setUnidadLapso(e.target.value)}
                    >
                      <MenuItem value="días">Día(s)</MenuItem>
                      <MenuItem value="meses">Mes(es)</MenuItem>
                      <MenuItem value="años">Año(s)</MenuItem>
                    </TextField>
                  </Box>
      
                  {/* Probabilidad de Venta */}
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
                </Box>
              )}
      
              {proyectoSeleccionado && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button variant="contained" color="success" onClick={handleEnviar}>
                    Enviar
                  </Button>
                </Box>
              )}
            </Box>
            
        </Box>
      );
      
}

export default Oportunidades;