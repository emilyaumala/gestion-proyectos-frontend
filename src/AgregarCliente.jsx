import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { TextField, Button, Container, Typography, Box, FormControl, Select, MenuItem, Alert } from "@mui/material";
import axios from "axios";

const API_URL = "https://crm.constecoin.com/apicrm";

function Responsable() {
    const { register, handleSubmit, control } = useForm();
    const [tipoIdentificacion, setTipoIdentificacion] = useState("")
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = async (data) => {
        setError("")
        console.log(data)
        const isEmpty = Object.values(data).some(value => value === "" || value === undefined);

        if (isEmpty) {
            setError("Todos los campos son obligatorios")
            return;
        }

        try{
            await axios.post(`${API_URL}/guardar-clientes`, data);
            setSuccess("Cliente creado correctamente")
        }catch(error){
            console.log(error)
            if(error.response.status == 400){
                setError(error.response.data.error)
            }else{
                setError("Ocurrió un error intentalo nuevamente")
            }
        }
    };
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100vw", backgroundColor: "#f9f9f9", padding: "20px" }}>
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: 3 }}>
                    <Typography variant="h4" fontWeight="bold" color="#333" sx={{ mb: 2, textAlign: "center" }}>Agregar Cliente</Typography>

                    <TextField
                        fullWidth
                        label="Nombre cliente"
                        {...register("cliente", { required: true })}
                        margin="normal"
                        onChange={(e) => e.target.value = e.target.value.toUpperCase()} // Convierte a mayúsculas
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Controller
                            name="tipoIdentificacion"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={tipoIdentificacion}
                                    onChange={(e) => {
                                        setTipoIdentificacion(e.target.value);
                                        field.onChange(e.target.value);
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Seleccione tipo de identificación</MenuItem>
                                    <MenuItem value="RUC">RUC</MenuItem>
                                    <MenuItem value="CI">Cédula de Identidad</MenuItem>
                                    <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    {tipoIdentificacion && (
                        <TextField
                            fullWidth
                            label={`Ingrese ${tipoIdentificacion}`}
                            {...register("identificacion", { required: true })}
                            margin="normal"
                        />
                    )}

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Guardar cliente
                    </Button>
                </Box>
            </Container >
        </Box >
    );
}

export default Responsable;
