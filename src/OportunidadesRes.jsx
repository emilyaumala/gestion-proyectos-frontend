import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Alert, MenuItem, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const API_URL = "https://crm.constecoin.com/apicrm";

function OportunidadesRes() {
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

    const [faseVenta, setFaseVenta] = useState(null);
    const [montoEstimado, setMontoEstimado] = useState("");
    const [codigoProyecto, setCodigoProyecto] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [respComercial, setRespComercial] = useState(null);
    const [respTecnico, setRespTecnico] = useState(null);
    const [probabilidadVenta, setProbabilidadVenta] = useState(null);

    const [fasesVentaList, setFasesVentaList] = useState([]);
    const [probabilidadesVentaList, setProbabilidadesVentaList] = useState([]);
    const [responsablesComerciales, setResponsablesComerciales] = useState([]);
    const [responsablesTecnicos, setResponsablesTecnicos] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const navigate = useNavigate();
    const [showActivityFields, setShowActivityFields] = useState(false); // Controla la visibilidad de los campos de actividad
    const [actividadDescripcion, setActividadDescripcion] = useState(""); // Descripción de la actividad
    const [horaInicio, setHoraInicio] = useState(""); // Hora de inicio
    const [horaFin, setHoraFin] = useState(""); // Hora de fin
    // Obtener usuario y roles de localStorage de manera segura
    const user = localStorage.getItem("user");
    let roles = [];
    let userId = null
    let nombreCompleto = '';


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
                setProyectos(proyectosRes.data);
                const proyectosFiltrados = proyectosRes.data.filter(
                    (proyecto) =>
                        proyecto.respComercial?.['_id'] === userId || proyecto.respTecnico?.['_id'] === userId
                );
                //console.log(user._id)
                setProyectosFiltrados(proyectosFiltrados);
                //console.log("Poryeco",proyectosFiltrados)

                const areasRes = await axios.get(`${API_URL}/areas`);
                setAreas(areasRes.data);

                const probabilidadesRes = await axios.get(`${API_URL}/probabilidad-venta`);
                setProbabilidadesVentaList(probabilidadesRes.data);

                const [fasesRes, comercialesRes, tecnicosRes] = await Promise.all([
                    axios.get(`${API_URL}/fasesVenta`),
                    axios.get(`${API_URL}/responsables`),
                    axios.get(`${API_URL}/responsables`),
                ]);

                setFasesVentaList(fasesRes.data);
                setResponsablesComerciales(comercialesRes.data);
                setResponsablesTecnicos(tecnicosRes.data);
                if (roles.includes("responsable")) {
                    setProyectosFiltrados(proyectosRes.data.filter(p => p.respComercial?.['_id'] === userId || p.respTecnico?.['_id'] === userId));
                }
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
                setError("Hubo un problema al cargar los datos.");
            }

        };

        fetchData();

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [userId]);

    const formatDateToMonthYear = (dateString) => {
        const [year, month] = dateString.split("T")[0].split("-");
        return `${year}-${month}`;
    };
    const handleProyectoChange = async (event) => {
        const selectedProyecto = proyectos.find((p) => p._id === event.target.value) || null;
        setProyectoSeleccionado(selectedProyecto);
        if (selectedProyecto) {
            try {
                const response = await axios.get(`${API_URL}/oportunidades/${selectedProyecto._id}`);
                const data = response.data;

                setOportunidad(data);
                setFaseVenta(data.faseVenta);
                setCodigoProyecto(data.codigoProyecto);
                setMontoEstimado(data.montoEstimado);
                setFechaInicio(formatDateToMonthYear(data.fechaInicio));
                setRespComercial(data.respComercial);
                setRespTecnico(data.respTecnico);
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

        // Combinamos la fecha con la hora de inicio y fin
        const fechaCompletaInicio = new Date(`${fechaInicio}T${horaInicio}:00`);
        const fechaCompletaFin = new Date(`${fechaInicio}T${horaFin}:00`);

        // Crear los datos de la oportunidad
        const oportunidadData = {
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
            nombreProyecto: parsedUser.nombreCompleto
        };

        // Crear los datos de la actividad
        const actividadData = showActivityFields
            ? {
                descripcion: actividadDescripcion,
                horaInicio: fechaCompletaInicio.toISOString(), // Enviamos fecha y hora completas
                horaFin: fechaCompletaFin.toISOString(), // Enviamos fecha y hora completas
                proyectoId: proyectoSeleccionado._id,
                nombreProyecto: parsedUser.nombreCompleto
            }
            : null;

        try {
            // Enviar tanto la oportunidad como la actividad en la misma solicitud
            const dataToSend = {
                oportunidad: oportunidadData,
                actividad: actividadData,
            };

            await axios.post(`${API_URL}/guardar1`, dataToSend);  // Usa la misma API para guardar ambos

            alert("Oportunidad y actividad guardadas exitosamente");

            // Redirigir después de guardar
            navigate("/actualizar-oportunidades");
            setError(null);
        } catch (error) {
            console.error("❌ Error al guardar la oportunidad y/o actividad:", error);
            setError("Hubo un problema al guardar los datos. Inténtalo de nuevo.");
        }
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
                    Oportunidad del Proyecto
                </Typography>
                <TextField
                    fullWidth
                    select
                    label="Seleccionar Proyecto"
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
                                    getOptionLabel={(option) => option.nombreCompleto}
                                    value={respComercial}
                                    onChange={(e, newValue) => setRespComercial(newValue)}
                                    renderInput={(params) => <TextField {...params} placeholder="Seleccionar Comercial" />}
                                />
                            ) : (
                                <TextField fullWidth value={oportunidad.respComercial.nombreCompleto} disabled />
                            )}
                        </Box>

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

                        {/* Cantidad Lapso 
                  <Box>
                    <Typography fontWeight="bold">Cantidad Lapso:</Typography>
                    <TextField
                      fullWidth
                      value={cantidadLapso}
                      disabled={!editable}
                      onChange={(e) => setCantidadLapso(e.target.value)}
                    />
                  </Box>
      
                  {/* Unidad Lapso 
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
                  </Box>*/}

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
                    // Botón + Actividad
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
                        <Typography fontWeight="bold">Descripción de la Actividad:</Typography>
                        <TextField
                            fullWidth
                            value={actividadDescripcion}
                            onChange={(e) => setActividadDescripcion(e.target.value)}
                            multiline
                            rows={4}
                            placeholder="Descripción de la actividad"
                        />

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight="bold">Fecha y Hora de Inicio:</Typography>
                                <TextField
                                    fullWidth
                                    type="datetime-local" // Combina fecha y hora
                                    value={fechaHoraInicio} // Guardamos tanto la fecha como la hora
                                    onChange={(e) => setFechaHoraInicio(e.target.value)} // Actualizamos la fecha y hora de inicio
                                    disabled={!showActivityFields}
                                />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight="bold">Fecha y Hora de Fin:</Typography>
                                <TextField
                                    fullWidth
                                    type="datetime-local" // Combina fecha y hora
                                    value={fechaHoraFin} // Guardamos tanto la fecha como la hora
                                    onChange={(e) => setFechaHoraFin(e.target.value)} // Actualizamos la fecha y hora de fin
                                    disabled={!showActivityFields}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}



                {proyectoSeleccionado && (
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button variant="contained" color="success" onClick={handleEnviar}>
                            Enviar
                        </Button>
                        <Button
                            type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                            onClick={() => window.location.href = `/`}
                        >
                            Regresar
                        </Button>
                    </Box>
                )}
            </Box>

        </Box>
    );

}

export default OportunidadesRes;