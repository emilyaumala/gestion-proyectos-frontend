import { useForm } from "react-hook-form";
import { useState } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from "@mui/material";
import axios from "axios";

const API_URL = "https://gestion-proyectos-backend-qzye.onrender.com"; // ✅ Verifica que sea la URL correcta

function Formulario() {
    const { register, handleSubmit, reset } = useForm();
    const [error, setError] = useState(null); // ✅ Manejo de errores

    const onSubmit = async (data) => {
        const formattedData = {
            nombre_oportunidad: data.nombre,
            asesor_comercial: data.asesorComercial,
            asesor_ventas: data.asesorVentas,
            cliente: data.cliente,
            categoria_ventas: data.categoriaVentas,
            cantidad_prevista: parseFloat(data.cantidadPrevista) || 0,
            fase_venta: data.faseVenta,
            probabilidad_venta: parseFloat(data.probabilidadVenta) || 0,
            cierre_probable: data.cierreProbable,
        };

        try {
            const response = await axios.post(`${API_URL}/guardar`, formattedData);
            console.log("✅ Respuesta del backend:", response.data);
            alert("Proyecto guardado exitosamente");
            reset();
            setError(null); // ✅ Limpiar el error si el guardado fue exitoso
        } catch (error) {
            console.error("❌ Error al guardar el proyecto:", error);
            setError("Hubo un problema al guardar los datos. Inténtalo de nuevo.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" my={4}>
                <Typography variant="h4" fontWeight="bold">CONSTECOIN</Typography>
                <Typography variant="h5" fontStyle="italic">Project Management</Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>} {/* ✅ Mostrar errores en la UI */}

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Nombre de la Oportunidad"
                    {...register("nombre", { required: true })}
                    margin="normal"
                />

                <TextField
                    select
                    fullWidth
                    label="Asesor Comercial"
                    {...register("asesorComercial", { required: true })}
                    margin="normal"
                >
                    <MenuItem value="asesor1">Asesor 1</MenuItem>
                    <MenuItem value="asesor2">Asesor 2</MenuItem>
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Asesor de Ventas"
                    {...register("asesorVentas", { required: true })}
                    margin="normal"
                >
                    <MenuItem value="asesor1">Asesor 1</MenuItem>
                    <MenuItem value="asesor2">Asesor 2</MenuItem>
                </TextField>

                <TextField
                    fullWidth
                    label="Cliente"
                    {...register("cliente", { required: true })}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Categoría de Ventas"
                    {...register("categoriaVentas", { required: true })}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Cantidad Prevista"
                    type="number"
                    {...register("cantidadPrevista", { required: true })}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Fase de la Venta"
                    {...register("faseVenta", { required: true })}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Probabilidad de Venta (%)"
                    type="number"
                    {...register("probabilidadVenta", { required: true })}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Cierre Probable"
                    type="date"
                    {...register("cierreProbable", { required: true })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Guardar
                </Button>
            </form>
        </Container>
    );
}

export default Formulario;

