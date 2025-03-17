import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://gestion-proyectos-backend-qzye.onrender.com";

function Oportunidades() {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [error, setError] = useState(null);
    const [faseVentaError, setFaseVentaError] = useState(""); 

    const [proyectos, setProyectos] = useState([]);
    const [fasesVenta, setFasesVenta] = useState([]);

    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [proyectosRes, fasesVentaRes] = await Promise.all([
                    axios.get(`${API_URL}/proyectos`), // Cambiar según la ruta correcta para obtener proyectos
                    axios.get(`${API_URL}/fasesVenta`)
                ]);

                setProyectos(proyectosRes.data);
                setFasesVenta(fasesVentaRes.data);
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
                setError("Hubo un problema al cargar los datos.");
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data) => {
        if (faseVentaError) {
            alert("Corrige los errores antes de enviar el formulario.");
            return;
        }

        const formattedData = {
            nombreProyecto: data.nombreProyecto,
            faseVenta: data.faseVenta,
            fechaInicio: data.fechaInicio,
            fechaCierre: data.fechaCierre,
            observaciones: data.observaciones || "Sin observaciones"
        };

        try {
            const response = await axios.post(`${API_URL}/guardar1`, formattedData);
            console.log("✅ Respuesta del backend:", response.data);
            alert("Oportunidad guardada exitosamente");

            navigate("/actualizar-oportunidades"); 

            reset();
            setError(null);
            setFaseVentaError("");
        } catch (error) {
            console.error("❌ Error al guardar la oportunidad:", error);
            setError("Hubo un problema al guardar los datos. Inténtalo de nuevo.");
        }
    };

    const handleFaseVentaChange = (event, value) => {
        const faseVentaExiste = fasesVenta.some(faseVenta => faseVenta.faseVenta.toLowerCase() === (value?.toLowerCase() || ""));

        if (value && !faseVentaExiste) {
            setFaseVentaError(`La fase de venta '${value}' no existe, pídele al administrador que lo agregue.`);
        } else {
            setFaseVentaError("");  
        }

        setValue("faseVenta", value || "");  
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100vw", backgroundColor: "#f9f9f9", padding: "20px" }}>
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: 3, margin: "0 auto" }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>Agregar Oportunidad</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {faseVentaError && <Alert severity="error" sx={{ mb: 2 }}>{faseVentaError}</Alert>} 
                    
                    {/* Nombre del Proyecto */}
                    <Autocomplete
                        freeSolo
                        options={proyectos.map(proyecto => ({ label: proyecto.nombreProyecto, id: proyecto._id }))}
                        onInputChange={(event, newValue) => setValue("nombreProyecto", newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nombre del Proyecto"
                                margin="normal"
                            />
                        )}
                        onChange={(event, value) => {
                            if (value && value.id) {
                                setValue("nombreProyecto", value.id);
                            }
                        }}
                    />     

                    {/* Fase de Venta */}
                    {faseVentaError && <Alert severity="error" sx={{ mb: 2 }}>{faseVentaError}</Alert>} 
                    <Autocomplete
                        freeSolo
                        options={fasesVenta.map(faseVenta => ({ label: faseVenta.faseVenta, id: faseVenta._id }))}
                        onInputChange={(event, newValue) => setValue("faseVenta", newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Fase de Venta"
                                margin="normal"
                                error={Boolean(faseVentaError)}
                                helperText={faseVentaError}
                            />
                        )}
                        onChange={(event, value) => {
                            if (value && value.id) {
                                setValue("faseVenta", value.id);
                                setFaseVentaError("");
                            } else {
                                setFaseVentaError("Selecciona una fase de venta válida de la lista.");
                            }
                        }}
                    />

                    {/* Fecha de Inicio */}
                    <TextField fullWidth label="Fecha de Inicio" type="date" {...register("fechaInicio", { required: true })} margin="normal" InputLabelProps={{ shrink: true }} />

                    {/* Fecha de Cierre */}
                    <TextField fullWidth label="Fecha de Cierre" type="date" {...register("fechaCierre", { required: true })} margin="normal" InputLabelProps={{ shrink: true }} />

                    {/* Observaciones */}
                    <TextField fullWidth multiline rows={3} label="Observaciones" {...register("observaciones")} margin="normal" />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Guardar Oportunidad
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default Oportunidades;

