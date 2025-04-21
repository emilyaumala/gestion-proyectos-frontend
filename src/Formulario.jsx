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
    const [cliente, setCliente] = useState("");


    const [clientes, setClientes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [fasesVenta, setFasesVenta] = useState([]);
    const [probabilidades, setProbabilidades] = useState([]);
    const [responsablesComerciales, setResponsablesComerciales] = useState([]);
    const [responsablesTecnicos, setResponsablesTecnicos] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [esOtroCliente, setEsOtroCliente] = useState(false);
    const otroCliente = clientes.find(c => c.cliente.trim().toUpperCase() === "OTRO CLIENTE");
    const otroClienteId = otroCliente?._id;
    const [esConstecoin, setEsConstecoin] = useState(false);


    const navigate = useNavigate(); // Inicializa navigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    clientesRes, areasRes, fasesVentaRes, probVentaRes,
                    responsablesRes, proyectosRes
                ] = await Promise.all([
                    axios.get(`${API_URL}/clientes`),
                    axios.get(`${API_URL}/areas`),
                    axios.get(`${API_URL}/fasesVenta`),
                    axios.get(`${API_URL}/probabilidad-venta`),
                    axios.get(`${API_URL}/responsables`),
                    axios.get(`${API_URL}/proyectos`)
                ]);

                // Ordenar para que "OTRO CLIENTE" esté primero
                const clientesOrdenados = [...clientesRes.data].sort((a, b) => {
                    if (a.cliente.trim().toUpperCase() === "OTRO CLIENTE") return -1;
                    if (b.cliente.trim().toUpperCase() === "OTRO CLIENTE") return 1;
                    return a.cliente.localeCompare(b.cliente);
                });

                setClientes(clientesOrdenados);
                setAreas(areasRes.data);
                setFasesVenta(fasesVentaRes.data);
                setProbabilidades(probVentaRes.data);
                setResponsables(responsablesRes.data);
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
            montoEstimado: esConstecoin ? null : (data.montoEstimado ? parseFloat(data.montoEstimado) : null),
            faseVenta: esConstecoin ? null : data.faseVenta,
            probabilidadVenta: esConstecoin ? null : data.probabilidadVenta,
            fechaInicio: data.fechaInicio,
            respComercial: esConstecoin ? null : data.respComercial,
            respTecnico: data.respTecnico,
            observaciones: data.observaciones || "Sin observaciones",
            nombreContacto: esConstecoin ? "NA" : (data.nombreContacto || "No hay nombre del contacto"),
            correoContacto: esConstecoin ? "NA" : (data.correoContacto || "No hay correo del contacto"),
            numeroContacto: esConstecoin ? "NA" : (data.numeroContacto || "No hay celular del contacto"),
        };


        try {
            const response = await axios.post(`${API_URL}/guardar`, formattedData);
            console.log("✅ Respuesta del backend:", response.data);
            alert("Oportunidad guardada exitosamente");
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
                        options={[
                            ...clientes.map(cliente => ({
                                label: cliente.cliente,
                                id: cliente._id
                            }))
                        ]}
                        onInputChange={(event1, newValue) => setValue("cliente", newValue)}
                        onChange={(event1, value) => {
                            const nombreCliente = value?.label?.trim().toUpperCase();
                            if (nombreCliente === "OTRO CLIENTE") {
                                setEsOtroCliente(true);
                                setEsConstecoin(false);
                                setClienteError("");
                                setCliente("");
                                setValue("cliente", otroClienteId);
                            } else if (value?.id) {
                                setEsOtroCliente(false);
                                setCliente(value.label);
                                setClienteError("");
                                setValue("cliente", value.id);
                                setEsConstecoin(nombreCliente === "CONSTECOIN");
                            } else {
                                setEsOtroCliente(false);
                                setEsConstecoin(false);
                                setClienteError("Selecciona un cliente válido o pídele al administrador que lo agregue.");
                            }
                        }}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Cliente"
                                margin="normal"
                                error={Boolean(clienteError)}
                                helperText={clienteError}
                            />
                        )}
                    />



                    {!esOtroCliente && !esConstecoin && (
                        <>
                            <TextField
                                fullWidth
                                label="Nombre del Contacto"
                                {...register("nombreContacto", { required: false })}
                                margin="normal"
                            />

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
                        </>
                    )}


                    <Typography fontWeight="bold">Datos de la Oportunidad :</Typography>

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
                    <TextField fullWidth label="Nombre de la Oportunidad" {...register("nombreProyecto", { required: true })} margin="normal" />
                    {/* Código Oportunidad */}
                    <TextField fullWidth label="Código de Oportunidad AS2 (Opocional)" {...register("codigoProyecto")} margin="normal" placeholder="Solocitar el código de la oportunidad contador/a" />

                    {!esConstecoin && (
                        <>
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

                        </>
                    )}

                    {/* Fecha de Inicio */}
                    <TextField
                        fullWidth
                        label="Fecha Probable de Cierre"
                        type="month"
                        {...register("fechaInicio", { required: true })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    {!esConstecoin && (
                        <>
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
                        </>
                    )}



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

