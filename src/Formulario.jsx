import { useForm } from "react-hook-form";
import { useState } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from "@mui/material";
import axios from "axios";

const API_URL = "https://gestion-proyectos-backend-qzye.onrender.com";

function Formulario() {
    const { register, handleSubmit, reset } = useForm();
    const [error, setError] = useState(null);

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
            setError(null);
        } catch (error) {
            console.error("❌ Error al guardar el proyecto:", error);
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
                overflow: "hidden", // Elimina el scroll horizontal
                padding: "20px",
            }}
        >
            <Container maxWidth="sm">
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        width: "100%",
                        maxWidth: "600px",
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        boxShadow: 3,
                        margin: "0 auto", // Centrado
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>
                        Gestión de Proyectos
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField fullWidth label="Nombre de la Oportunidad" {...register("nombre", { required: true })} margin="normal" />
                    <TextField select fullWidth label="Asesor Comercial" {...register("asesorComercial", { required: true })} margin="normal">
                        <MenuItem value="asesor1">Asesor 1</MenuItem>
                        <MenuItem value="asesor2">Asesor 2</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Asesor de Ventas" {...register("asesorVentas", { required: true })} margin="normal">
                        <MenuItem value="asesor1">Asesor 1</MenuItem>
                        <MenuItem value="asesor2">Asesor 2</MenuItem>
                    </TextField>
                    <TextField fullWidth label="Cliente" {...register("cliente", { required: true })} margin="normal" />
                    <TextField fullWidth label="Categoría de Ventas" {...register("categoriaVentas", { required: true })} margin="normal" />
                    <TextField fullWidth label="Cantidad Prevista" type="number" {...register("cantidadPrevista", { required: true })} margin="normal" />
                    <TextField fullWidth label="Fase de la Venta" {...register("faseVenta", { required: true })} margin="normal" />
                    <TextField fullWidth label="Probabilidad de Venta (%)" type="number" {...register("probabilidadVenta", { required: true })} margin="normal" />
                    <TextField fullWidth label="Cierre Probable" type="date" {...register("cierreProbable", { required: true })} margin="normal" InputLabelProps={{ shrink: true }} />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Guardar
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default Formulario;
