import { useState } from "react";
import axios from "axios";

function Formulario() {
    const [form, setForm] = useState({
        nombre_oportunidad: "",
        asesor_comercial: "",
        asesor_ventas: "",
        cliente: "",
        categoria_ventas: "",
        cantidad_prevista: "",
        fase_venta: "",
        probabilidad_venta: "",
        cierre_probable: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/guardar", form);
            console.log(response.data); 
            alert("Datos guardados correctamente");
            setForm({ 
                nombre_oportunidad: "", asesor_comercial: "", asesor_ventas: "",
                cliente: "", categoria_ventas: "", cantidad_prevista: "",
                fase_venta: "", probabilidad_venta: "", cierre_probable: ""
            });
        } catch (err) {
            console.error('Error al guardar los datos:', err);
            alert("Hubo un error al guardar los datos");
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input name="nombre_oportunidad" placeholder="Nombre de la Oportunidad" value={form.nombre_oportunidad} onChange={handleChange} />
            <input name="asesor_comercial" placeholder="Asesor Comercial" value={form.asesor_comercial} onChange={handleChange} />
            <input name="cliente" placeholder="Cliente" value={form.cliente} onChange={handleChange} />
            <input name="categoria_ventas" placeholder="Categoría de Ventas" value={form.categoria_ventas} onChange={handleChange} />
            <input name="cantidad_prevista" placeholder="Cantidad Prevista" value={form.cantidad_prevista} onChange={handleChange} />
            <input name="fase_venta" placeholder="Fase de Venta" value={form.fase_venta} onChange={handleChange} />
            <input name="probabilidad_venta" placeholder="Probabilidad de Venta" value={form.probabilidad_venta} onChange={handleChange} />
            <input name="cierre_probable" placeholder="Cierre Probable" value={form.cierre_probable} onChange={handleChange} />
            <button type="submit">Guardar</button>
        </form>
    );
}

export default Formulario;

