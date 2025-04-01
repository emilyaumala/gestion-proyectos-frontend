import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, Autocomplete, FormControl } from "@mui/material";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { NumericFormat } from "react-number-format";

const API_URL = "https://crm.constecoin.com/apicrm/";

function Formulario() {
    const { register, handleSubmit, reset, setValue, watch, control, formState: { errors }, } = useForm();
    const correoContacto = watch("correoContacto");
    const numeroContacto = watch("numeroContacto");
    const [error, setError] = useState(null);
    const [clienteError, setClienteError] = useState("");
    const [areaError, setAreaError] = useState("");
    const [faseVentaError, setFaseVentaError] = useState("");
    const [respComercialError, setRespComercialError] = useState("");
    const [respTecnicoError, setRespTecnicoError] = useState("");
    const [responsableError, setResponsableError] = useState("");
    const [proyectosExistentes, setProyectosExistentes] = useState([]);

    const [clientes, setClientes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [fasesVenta, setFasesVenta] = useState([]);
    const [probabilidades, setProbabilidades] = useState([]);
    const [responsablesComerciales, setResponsablesComerciales] = useState([]);
    const [responsablesTecnicos, setResponsablesTecnicos] = useState([]);
    const [responsables, setResponsables] = useState([]);

    const navigate = useNavigate(); // Inicializa navigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    clientesRes, areasRes, fasesVentaRes, probVentaRes,
                   /* respComercialRes, respTecnicoRes,*/responsablesRes, proyectosRes
                ] = await Promise.all([
                    axios.get(`${API_URL}/clientes`),
                    axios.get(`${API_URL}/areas`),
                    axios.get(`${API_URL}/fasesVenta`),
                    axios.get(`${API_URL}/probabilidad-venta`),
                    axios.get(`${API_URL}/responsables`),
                    //axios.get(`${API_URL}/responsables-comerciales`),
                    //axios.get(`${API_URL}/responsables-tecnicos`),
                    axios.get(`${API_URL}/proyectos`)
                ]);

                setClientes(clientesRes.data);
                setAreas(areasRes.data);
                setFasesVenta(fasesVentaRes.data);
                setProbabilidades(probVentaRes.data);
                setResponsables(responsablesRes.data);
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
        if (clienteError || areaError || faseVentaError || responsableError /*respComercialError || respTecnicoError*/) {
            alert("Corrige los errores antes de enviar el formulario.");
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
            codigoProyecto: data.codigoProyecto || "No existe codigo del poryecto",
            area: data.area,
            montoEstimado: data.montoEstimado ? parseFloat(data.montoEstimado) : null,  // Evita 0 si es vacío
            faseVenta: data.faseVenta,
            probabilidadVenta: data.probabilidadVenta,
            fechaInicio: data.fechaInicio,
            respComercial: data.respComercial,
            respTecnico: data.respTecnico,
            observaciones: data.observaciones || "Sin observaciones",
            //cantidadLapso: data.cantidadLapso,
            nombreContacto: data.nombreContacto || "No hay nombre del contacto",
            correoContacto: data.correoContacto || "No hay correo del contacto",
            numeroContacto: data.numeroContacto || "No hay celular del contacto",
            //unidadLapso: data.unidadLapso
        };

        try {
            const response = await axios.post(`${API_URL}/guardar`, formattedData);
            console.log("✅ Respuesta del backend:", response.data);
            alert("Proyecto guardado exitosamente");
            navigate("/formulario");

            reset();
            setError(null);
            setClienteError("");
            setAreaError("");
            setFaseVentaError("");
            setRespComercialError("");
            setRespTecnicoError("");
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

    const handleAreaChange = (event2, value) => {
        const areaExiste = areas.some(area => area.area.toLowerCase() === (value?.toLowerCase() || ""));

        if (value && !areaExiste) {
            setAreaError(`El area '${value}' no existe, pídele al administrador que lo agregue.`);
        } else {
            setAreaError("");
        }

        setValue("area", value || "");
    };
    const handleFaseVentaChange = (event3, value) => {
        const faseVentaExiste = fasesVenta.some(faseVenta => faseVenta.faseVenta.toLowerCase() === (value?.toLowerCase() || ""));

        if (value && !faseVentaExiste) {
            setFaseVentaError(`La fase de venta '${value}' no existe, pídele al administrador que lo agregue.`);
        } else {
            setFaseVentaError("");
        }

        setValue("faseVenta", value || "");
    };
    const handleRespComercialChange = (event4, value) => {
        const respComercialExiste = responsablesComerciales.some(respComercial => respComercial.respComercial.toLowerCase() === (value?.toLowerCase() || ""));

        if (value && !respComercialExiste) {
            setRespComercialError(`El responsable comercial '${value}' no existe, pídele al administrador que lo agregue.`);
        } else {
            setRespComercialError("");
        }

        setValue("respComercial", value || "");
    };
    const handleRespTecnicoChange = (event5, value) => {
        const respTecnicoExiste = responsablesTecnicos.some(respTecnico => respTecnico.respTecnico.toLowerCase() === (value?.toLowerCase() || ""));

        if (value && !respTecnicoExiste) {
            setRespTecnicoError(`El responsable técnico '${value}' no existe, pídele al administrador que lo agregue.`);
        } else {
            setRespTecnicoError("");
        }

        setValue("respTecnico", value || "");
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100vw", backgroundColor: "#f9f9f9", padding: "20px" }}>
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "auto", maxWidth: "600px", backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: 3, margin: "0 auto" }}>
                    <Typography variant="h4" fontWeight="bold" color="#333333" sx={{ mb: 2, textAlign: "center" }}>Agregar Oportunidad</Typography>

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
                                setClienteError("Selecciona un cliente válido o pidele  al administrador que lo agregue.");
                            }
                        }}
                    />
                    {/* Nombre del Contacto */}
                    <TextField fullWidth label="Nombre del Contacto"  {...register("nombreContacto", { required: false })} margin="normal" />


<TextField
    fullWidth
    label="Correo Electrónico del Contacto"
    {...register("correoContacto", {
        required: !numeroContacto ? "Debe ingresar un correo o un número de contacto" : false,
    })}
    margin="normal"
    error={Boolean(errors.correoContacto)}
    helperText={errors.correoContacto?.message}
/>

<FormControl fullWidth sx={{ mt: 2 }}>
    <Controller
        name="numeroContacto"
        control={control}
        rules={{
            required: !correoContacto ? "Debe ingresar un número o un correo de contacto" : false,
        }}
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
    {errors.numeroContacto && <Alert severity="error">{errors.numeroContacto.message}</Alert>}
</FormControl>


                    {/* Area */}
                    {areaError && <Alert severity="error" sx={{ mb: 2 }}>{areaError}</Alert>}
                    <Autocomplete
                        freeSolo
                        options={areas.map(area => ({ label: area.area, id: area._id }))}
                        onInputChange={(event2, newValue) => setValue("area", newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Área"
                                margin="normal"
                                error={Boolean(areaError)}
                                helperText={areaError}
                            />
                        )}
                        onChange={(event2, value) => {
                            if (value && value.id) {
                                setValue("area", value.id);
                                setAreaError("");
                            } else {
                                setAreaError("Selecciona un área válido de la lista o agrégalo correctamente.");
                            }
                        }}
                    />


                    {/* Nombre del Proyecto */}
                    <TextField fullWidth label="Nombre del Proyecto" {...register("nombreProyecto", { required: true })} margin="normal" />
                    {/* Código Oportunidad */}
                    <TextField fullWidth label="Código de Oportunidad AS2 (Opocional)" {...register("codigoProyecto")} margin="normal" placeholder="Solocitar el código de la oportunidad contador/a" />
                    {/* Fase de Venta */}
                    {faseVentaError && <Alert severity="error" sx={{ mb: 2 }}>{faseVentaError}</Alert>}
                    <Box>
                        <Autocomplete
                            freeSolo
                            options={fasesVenta.map(faseVenta => ({ label: faseVenta.faseVenta, id: faseVenta._id }))}
                            onInputChange={(event3, newValue) => setValue("faseVenta", newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Fase de Venta"
                                    margin="normal"
                                    error={Boolean(faseVentaError)}
                                    helperText={faseVentaError}
                                />
                            )}
                            onChange={(event3, value) => {
                                if (value && value.id) {
                                    setValue("faseVenta", value.id);
                                    setFaseVentaError("");
                                } else {
                                    setFaseVentaError("Selecciona una fase de venta válida de la lista o agrégalo correctamente.");
                                }
                            }}
                        />
                    </Box>
                    {/* Monto Estimado */}
                    <Controller
                        name="montoEstimado"
                        control={control}
                        rules={{ min: 0 }}
                        render={({ field: { onChange, value } }) => (
                            <NumericFormat
                                value={value}
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={2}
                                allowNegative={false}
                                prefix="$ "
                                customInput={TextField}
                                fullWidth
                                label="Monto Estimado (USD)"
                                margin="normal"
                                onValueChange={(values) => onChange(values.floatValue)} // Solo envía el número
                            />
                        )}
                    />

                    {/* Probabilidad de Venta */}
                    <TextField select fullWidth label="Probabilidad de Venta" {...register("probabilidadVenta", { required: true })} margin="normal">
                        {probabilidades.map((prob, index) => <MenuItem key={index} value={prob}>{prob}</MenuItem>)}
                    </TextField>

                    {/* Fecha de Inicio */}
                    <TextField
                        fullWidth
                        label="Fecha Probable de Cierre"
                        type="month"
                        {...register("fechaInicio", { required: true })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />


                    {/* Lapso de Ejecución 
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                        {/* Cuadro para ingresar el valor numérico (ej. 1, 12, 365) 
                        <TextField
                            fullWidth
                            label="Lapso de Ejecución (Cantidad)"
                            type="number"
                            {...register("cantidadLapso", { required: false, min: 1 })}
                            margin="normal"
                        />
                        {/* Selector de Unidad de Tiempo (Días, Meses, Años)
                        <TextField
                            select
                            label="Unidad de Tiempo"
                            fullWidth
                            {...register("unidadLapso", { required: false })}
                            margin="normal"
                        >
                            <MenuItem value="días">Día(s)</MenuItem>
                            <MenuItem value="meses">Mes(es)</MenuItem>
                            <MenuItem value="años">Año(s)</MenuItem>
                        </TextField>
                    </div>*/}

                    {/* Responsable Comercial */}
                    {/* <TextField select fullWidth label="Responsable Comercial" {...register("respComercial", { required: true })} margin="normal">
                        {responsablesComerciales.map((resp, index) => <MenuItem key={index} value={resp}>{resp}</MenuItem>)}
                        </TextField>*/}

                    {respComercialError && <Alert severity="error" sx={{ mb: 2 }}>{respComercialError}</Alert>}
                    <Autocomplete
                        freeSolo
                        options={responsables.map(responsable => ({ label: responsable.nombreCompleto, id: responsable._id }))}
                        onInputChange={(event4, newValue) => setValue("respComercial", newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Responsable Comercial"
                                margin="normal"
                                error={Boolean(respComercialError)}
                                helperText={respComercialError}
                            />
                        )}
                        onChange={(event4, value) => {
                            if (value && value.id) {
                                setValue("respComercial", value.id);
                                setRespComercialError("");
                            } else {
                                setRespComercialError("Selecciona un responsable comercial válido de la lista o agrégalo correctamente.");
                            }
                        }}
                    />
                    {/* Responsable Técnico */}
                    {/*<TextField select fullWidth label="Responsable Técnico" {...register("respTecnico", { required: true })} margin="normal">
                            {responsablesTecnicos.map((resp, index) => <MenuItem key={index} value={resp}>{resp}</MenuItem>)}
                        </TextField>*/}

                    {respTecnicoError && <Alert severity="error" sx={{ mb: 2 }}>{respTecnicoError}</Alert>}
                    <Autocomplete
                        freeSolo
                        options={responsables.map(responsable => ({ label: responsable.nombreCompleto, id: responsable._id }))}
                        onInputChange={(event5, newValue) => setValue("respTecnico", newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Responsable Técnico"
                                margin="normal"
                                error={Boolean(respTecnicoError)}
                                helperText={respTecnicoError}
                            />
                        )}
                        onChange={(event5, value) => {
                            if (value && value.id) {
                                setValue("respTecnico", value.id);
                                setRespTecnicoError("");
                            } else {
                                setRespTecnicoError("Selecciona un responsable técnico válido de la lista o agrégalo correctamente.");
                            }
                        }}
                    />

                    {/* Observaciones */}
                    <TextField fullWidth multiline rows={3} label="Descripción de Oportunidad" {...register("observaciones")} margin="normal" />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Guardar Oportunidad
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

export default Formulario;

