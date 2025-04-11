import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const API_URL = "https://crm.constecoin.com/apicrm/";

function NotificarOportunidad() {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [error, setError] = useState(null);
    const [clienteError, setClienteError] = useState("");
    const [areaError, setAreaError] = useState("");
    const [proyectosExistentes, setProyectosExistentes] = useState([]);
    const [numeroContacto, setNumerosContacto] = ("")

    const [clientes, setClientes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [fasesVenta, setFasesVenta] = useState([]);
    const [probabilidades, setProbabilidades] = useState([]);
    const [responsablesComerciales, setResponsablesComerciales] = useState([]);
    const [responsablesTecnicos, setResponsablesTecnicos] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [jefesDeArea, setJefesDeArea] = useState([]); // Estado para jefes de área
    const navigate = useNavigate(); // Inicializa navigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    clientesRes, areasRes, /*fasesVentaRes, probVentaRes,
                    respComercialRes, respTecnicoRes,responsablesRes,*/ proyectosRes
                ] = await Promise.all([
                    axios.get(`${API_URL}/clientes`),
                    axios.get(`${API_URL}/areas`),
                    //axios.get(`${API_URL}/fasesVenta`),
                    //axios.get(`${API_URL}/probabilidad-venta`),
                    //axios.get(`${API_URL}/responsables`),
                    //axios.get(`${API_URL}/responsables-comerciales`),
                    //axios.get(`${API_URL}/responsables-tecnicos`),
                    axios.get(`${API_URL}/proyectos`)
                ]);

                setClientes(clientesRes.data);
                setAreas(areasRes.data);
                //setFasesVenta(fasesVentaRes.data);
                //setProbabilidades(probVentaRes.data);
                //setResponsables(responsablesRes.data);
                //setResponsablesComerciales(respComercialRes.data);
                //setResponsablesTecnicos(respTecnicoRes.data);
                setProyectosExistentes(proyectosRes.data);
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
                setError("Hubo un problema al cargar los datos.");
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data) => {
        if (clienteError || areaError /*respComercialError || respTecnicoError*/) {
            alert("Corrige los errores antes de enviar el formulario.");
            return;
        }
        if (!data.correoContacto && !data.numeroContacto) {
            alert("⚠️ Debes ingresar al menos un correo electrónico o un número de contacto.");
            return;
        }


        //  const codigoExiste = proyectosExistentes.some(
        //      (proyecto) => proyecto.codigoProyecto.toLowerCase() === data.codigoProyecto.toLowerCase()
        //   );

        //  if (codigoExiste) {
        //     alert("⚠️ Ya existe un proyecto con ese código. Por favor, verifica el código del proyecto.");
        //      return;
        //   }

        const formattedData = {
            cliente: data.cliente,
            nombreProyecto: data.nombreProyecto,
            codigoProyecto: data.codigoProyecto,
            area: data.area,
            jefeArea: data.jefeArea,
            //montoEstimado: parseFloat(data.montoEstimado) || 0,
            //faseVenta: data.faseVenta,
            //probabilidadVenta: data.probabilidadVenta,
            //fechaInicio: data.fechaInicio,
            //respComercial: data.respComercial,
            //respTecnico: data.respTecnico,
            observaciones: data.observaciones || "Sin observaciones",
            //cantidadLapso: data.cantidadLapso,
            nombreContacto: data.nombreContacto || "No hay nombre del contacto",
            correoContacto: data.correoContacto || "No hay correo del contacto",
            numeroContacto: data.numeroContacto || "No hay celular del contacto",
            //unidadLapso: data.unidadLapso
        };

        try {
            const response = await axios.post(`${API_URL}/guardar-notOportunidad`, formattedData);
            console.log("✅ Respuesta del backend:", response.data);
            alert("Proyecto guardado exitosamente");
            navigate("/notificar-oportunidad");

            reset();
            setError(null);
            setClienteError("");
            setAreaError("");
            //setFaseVentaError("");
            //setRespComercialError("");
            //setRespTecnicoError("");
        } catch (error) {
            console.error("❌ Error al guardar el proyecto:", error);
            setError("Hubo un problema al guardar los datos. Inténtalo de nuevo.");
        }
    };

    const handleClienteChange = (event1, value) => {
        const clienteExiste = clientes.some(cliente => cliente.cliente.toLowerCase() === (value?.toLowerCase() || ""));

        if (value && !clienteExiste) {
            setClienteError(`El cliente '${value}' no existe, pídele al administrador que lo agregue.`);
        } else {
            setClienteError("");
        }

        setValue("cliente", value || "");
    };

    const handleAreaChange = async (event, value) => {
        if (value && value.id) {
            setValue("area", value.id);
            setAreaError("");

            // Llamada a la API para obtener jefes de área
            try {
                const response = await axios.get(`${API_URL}/responsables/${value.id}`);
                setJefesDeArea(response.data); // Guarda los jefes de área encontrados
            } catch (error) {
                console.error("❌ Error al obtener jefes de área:", error);
                setJefesDeArea([]); // Resetea la lista si hay error
            }
        } else {
            setAreaError("Selecciona un área válida de la lista.");
            setJefesDeArea([]); // Si el área no es válida, limpia los jefes de área
        }
    };
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100vw", backgroundColor: "#f9f9f9", padding: "20px" }}>
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "auto", maxWidth: "600px", backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: 3, margin: "0 auto" }}>
                    <Typography variant="h4" fontWeight="bold" color="#333333" sx={{ mb: 2, textAlign: "center" }}>Notificar Oportunidad</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Typography fontWeight="bold">Datos del cliente :</Typography>
                    {clienteError && <Alert severity="error" sx={{ mb: 2 }}>{clienteError}</Alert>}
                    <Autocomplete
                        freeSolo
                        options={clientes.map(cliente => ({ label: cliente.cliente, id: cliente._id }))}
                        onInputChange={(event1, newValue) => setValue("cliente", newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Cliente"
                                margin="normal"
                                error={Boolean(clienteError)}
                                helperText={clienteError}
                            />
                        )}
                        onChange={(event1, value) => {
                            if (value && value.id) {
                                setValue("cliente", value.id);
                                setClienteError("");
                            } else {
                                setClienteError("Selecciona un cliente válido de la lista o agrégalo correctamente.");
                            }
                        }}
                    />
                    {/* Nombre del Contacto */}
                    <TextField fullWidth label="Nombre del Contacto"  {...register("nombreContacto", { required: false })} margin="normal" />
                    {/* Nombre del Contacto */}
                    <TextField fullWidth label="Correo Electrónico del Contacto" {...register("correoContacto")} margin="normal" />
                    {/* Número del Contacto */}
                    <PhoneInput
                        international
                        defaultCountry="EC"
                        value={numeroContacto}
                        onChange={(value) => setValue("numeroContacto", value)}
                        style={{
                            width: "96%",
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    />                    <Typography fontWeight="bold">Datos de la Oportunidad :</Typography>


                    {/* Área */}
                    {areaError && <Alert severity="error" sx={{ mb: 2 }}>{areaError}</Alert>}
                    <Autocomplete
                        freeSolo
                        options={areas.map(area => ({ label: area.area, id: area._id }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Área"
                                margin="normal"
                                error={Boolean(areaError)}
                                helperText={areaError}
                            />
                        )}
                        onChange={handleAreaChange}
                    />

                    {/* Jefe de Área - Se muestra solo si hay jefes disponibles */}
                    {jefesDeArea.length > 0 && (
                        <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f5f5f5" }}>
                            <Typography fontWeight="bold" sx={{ mb: 1 }}>Seleccionar Jefe de Área:</Typography>
                            <Autocomplete
                                options={jefesDeArea.map(jefe => ({ label: jefe.nombreCompleto, id: jefe._id }))}
                                renderInput={(params) => <TextField {...params} label="Jefe de Área" margin="normal" />}
                                onChange={(event, value) => setValue("jefeArea", value?.id || "")}
                            />
                        </Box>
                    )}


                    {/* Nombre del Proyecto */}
                    <TextField fullWidth label="Nombre de la Oportunidad" {...register("nombreProyecto", { required: true })} margin="normal" />
                    {/* Código Oportunidad */}
                    <TextField fullWidth label="Código de Oportunidad AS2 (Opocional)" {...register("codigoProyecto")} margin="normal" placeholder="Solocitar el código de la oportunidad contador/a" />


                    {/* Observaciones */}
                    <TextField fullWidth multiline rows={3} label="Descripción de Oportunidad" {...register("observaciones")} margin="normal" />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Notificar Oportunidad
                    </Button>
                    <Button
                        type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                        onClick={() => window.location.href = `/`}
                    >
                        Regresar
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default NotificarOportunidad;

