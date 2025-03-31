import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Alert, Autocomplete, FormControl } from "@mui/material";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import bcrypt from "bcryptjs";

const API_URL = "https://crm.constecoin.com/apicrm";

function Responsable() {
    const { register, handleSubmit, reset, control } = useForm();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [rolesDisponibles] = useState([
        { label: "Responsable Técnico/Comercial", value: "responsable" },
        { label: "Jefe de Área", value: "jefeArea" },
        { label: "Administrador", value: "admin" }
    ]);
    const [areasDisponibles, setAreasDisponibles] = useState([]);
    const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
    const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get(`${API_URL}/areas`);
                setAreasDisponibles(response.data);
            } catch (err) {
                console.error("❌ Error al obtener áreas:", err);
            }
        };
        fetchAreas();
    }, []);

    const onSubmit = async (data) => {
        if (!data.roles || data.roles.length === 0) {
            setError("Selecciona al menos un rol.");
            return;
        }
    
        if (!data.telefono) {
            setError("Número de teléfono es obligatorio.");
            return;
        }
    
        // Si el usuario eligió "jefeArea", se guardan las áreas; si no, se envía un array vacío
        const areasFinales = rolesSeleccionados.some(role => role.value === "jefeArea") ? areasSeleccionadas : [];
    
        // Generar hash de la contraseña antes de enviarla
        const hashedPassword = await bcrypt.hash("crmconstecoin", 10);
    
        const formattedData = {
            nombreCompleto: data.nombreCompleto,
            telefono: data.telefono,
            correo: data.correo,
            cedula: data.cedula,
            roles: data.roles.map(rol => rol.value),
            areas: areasFinales.map(area => area),
            password: hashedPassword // Se envía la contraseña encriptada
        };
    
        console.log("📤 Enviando datos:", formattedData);
        try {
            await axios.post(`${API_URL}/guardar-responsables`, formattedData);
            setSuccess("Responsable agregado exitosamente.");
            setError(null);
            reset();
            setRolesSeleccionados([]);
            setAreasSeleccionadas([]);
        } catch (err) {
            console.error("❌ Error al guardar responsable:", err);
            setError("No se pudo guardar el responsable. Intenta de nuevo.");
            setSuccess(null);
        }
    };
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100vw", backgroundColor: "#f9f9f9", padding: "20px" }}>
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: 3 }}>
                    <Typography variant="h4" fontWeight="bold" color="#333" sx={{ mb: 2, textAlign: "center" }}>Agregar Responsable</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <TextField
                        fullWidth
                        label="Nombre Completo"
                        placeholder="Ej: JUAN PÉREZ"
                        {...register("nombreCompleto", { required: true })}
                        margin="normal"
                        onChange={(e) => e.target.value = e.target.value.toUpperCase()} // Convierte a mayúsculas
                    />

                    {/* Campo de Roles */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Controller
                            name="roles"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    multiple
                                    options={rolesDisponibles}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(event, value) => {
                                        field.onChange(value);
                                        setRolesSeleccionados(value);

                                        // Si se elimina "jefeArea", limpiar las áreas seleccionadas
                                        if (!value.some(role => role.value === "jefeArea")) {
                                            setAreasSeleccionadas([]);
                                        }
                                    }}
                                    value={field.value || []}
                                    renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Selecciona roles" />}
                                />
                            )}
                        />
                    </FormControl>

                    {/* Campo de Áreas (Solo si se selecciona "jefeArea") */}
                    {rolesSeleccionados.some(role => role.value === "jefeArea") && (
                        <Autocomplete
                            multiple
                            options={areasDisponibles}
                            getOptionLabel={(option) => option.area}
                            value={areasSeleccionadas}
                            onChange={(event, value) => setAreasSeleccionadas(value)}
                            renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Selecciona áreas" sx={{ mt: 2 }} />}
                        />
                    )}

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Controller
                            name="telefono"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    international
                                    defaultCountry="EC"
                                    {...field}
                                    onChange={(value) => field.onChange(value)}
                                    style={{ width: "98%", padding: "10px", fontSize: "16px" }}
                                />
                            )}
                        />
                    </FormControl>

                    <TextField fullWidth label="Correo Electrónico" type="email" {...register("correo", { required: true })} margin="normal" />
                    <TextField fullWidth label="Cédula" type="text" {...register("cedula", { required: true })} margin="normal" />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Guardar Responsable
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

export default Responsable;
