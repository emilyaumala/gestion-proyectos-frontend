import { useState } from "react";
import axios from "axios";

function Formulario() {
    const { register, handleSubmit, reset } = useForm();
    const [form, setForm] = useState({
      nombre_oportunidad: "",
      asesor_comercial: "",
      asesor_ventas: "",
      cliente: "",
      categoria_ventas: "",
      cantidad_prevista: "",
      fase_venta: "",
      probabilidad_venta: "",
      cierre_probable: "",
    });

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
          await axios.post(`https://gestion-proyectos-backend-qzye.onrender.com/guardar`, formattedData);
          alert("Proyecto guardado exitosamente");
          reset();
        } catch (error) {
          alert("Error al guardar el proyecto");
          console.error(error);
        }
      };
    
      return (
        <Container maxWidth="sm">
          <Box textAlign="center" my={4}>
            <Typography variant="h4" fontWeight="bold">CONSTECOIN</Typography>
            <Typography variant="h5" fontStyle="italic">Project Management</Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre de la Oportunidad */}
            <TextField
              fullWidth
              label="Nombre de la Oportunidad"
              {...register("nombre", { required: true })}
              margin="normal"
            />
            
            {/* Asesor Comercial */}
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
    
            {/* Asesor de Ventas */}
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
    
            {/* Cliente */}
            <TextField
              fullWidth
              label="Cliente"
              {...register("cliente", { required: true })}
              margin="normal"
            />
    
            {/* Categoría de Ventas */}
            <TextField
              fullWidth
              label="Categoría de Ventas"
              {...register("categoriaVentas", { required: true })}
              margin="normal"
            />
            
            {/* Cantidad Prevista */}
            <TextField
              fullWidth
              label="Cantidad Prevista"
              type="number"
              {...register("cantidadPrevista", { required: true })}
              margin="normal"
            />
            
            {/* Fase de la Venta */}
            <TextField
              fullWidth
              label="Fase de la Venta"
              {...register("faseVenta", { required: true })}
              margin="normal"
            />
            
            {/* Probabilidad de Venta */}
            <TextField
              fullWidth
              label="Probabilidad de Venta (%)"
              type="number"
              {...register("probabilidadVenta", { required: true })}
              margin="normal"
            />
            
            {/* Cierre Probable */}
            <TextField
              fullWidth
              label="Cierre Probable"
              type="date"
              {...register("cierreProbable", { required: true })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
    
            {/* Botón Guardar */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Guardar
            </Button>
          </form>
        </Container>
      );
    }
export default Formulario;

