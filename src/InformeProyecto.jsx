
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Input, Button, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
      
      const InformeProyecto = () => {
        const { id } = useParams();
        const [oportunidades, setOportunidades] = useState([]);
        const [loading, setLoading] = useState(true);
        const [filteredData, setFilteredData] = useState([]);
        const [nombreProyecto, setNombreProyecto] = useState("");
        const [montoEstimado, setMontoEstimado] = useState("");
        const [area, setArea] = useState("");
        const [faseVentaProyecto, setFaseVentaProyecto] = useState("");
        const [probabilidadVenta, setProbabilidadVenta] = useState("");
        const [fechaInicio, setFechaInicio] = useState("");
        const [respComercial, setRespComercial] = useState("");
        const [observaciones, setObservaciones] = useState("");
        const [respTecnico, setRespTecnico] = useState("");
        const [lapsoEjecucion, setLapsoEjecucion] = useState("");
        const [error, setError] = useState(null);
      
        useEffect(() => {
          axios
            .get(`https://gestion-proyectos-backend-qzye.onrender.com/informeOportunidad/${id}`)
            .then((response) => {
              console.log("📌 Respuesta del backend:", response.data);
        
              // Actualizamos el estado con los datos del proyecto y las oportunidades
              setNombreProyecto(response.data.nombreProyecto || "Nombre no disponible");
              setArea(response.data.area || "Área no disponible");
              setMontoEstimado(response.data.montoEstimado || "Monto no disponible");
              setFaseVentaProyecto(response.data.faseVentaProyecto || "Fase no disponible");
              setProbabilidadVenta(response.data.probabilidadVenta|| "Prob no disponible");
              setFechaInicio(response.data.fechaInicio ? new Date(response.data.fechaInicio).toLocaleDateString("es-ES") : "No disponible");
              setRespComercial(response.data.respComercial|| "Prob no disponible");
              setRespTecnico(response.data.respTecnico|| "Prob no disponible");
              setLapsoEjecucion(response.data.lapsoEjecucion|| "Prob no disponible");
              setObservaciones(response.data.observaciones|| "Prob no disponible");
              setOportunidades(response.data.oportunidades || []); // Aquí asignamos las oportunidades
              setFilteredData(response.data.oportunidades || []);  // Actualizamos filteredData también
              setLoading(false);
            })
            .catch((error) => {
              console.error("❌ Error al obtener el informe:", error);
              setError("No se pudo cargar la información del proyecto.");
              setLoading(false);
            });
        }, [id]); // Repetir cada vez que el `id` cambie
        
        const getColumnSearchProps = (dataIndex) => ({
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
              <Input
                autoFocus
                placeholder={`Buscar ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => confirm()}
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => confirm()}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Buscar
                </Button>
                <Button
                  onClick={() => clearFilters && clearFilters()}
                  size="small"
                  style={{ width: 90 }}
                >
                  Resetear
                </Button>
              </Space>
            </div>
          ),
          filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
          ),
          onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
          render: (text) => text || "No disponible",
        });
      
        const columnas = [
          {
            title: "Fase de Venta",
            dataIndex: "faseVenta",
            key: "faseVenta",
            ...getColumnSearchProps("faseVenta", "faseVenta"), // Acceder a la propiedad faseVenta dentro del objeto faseVenta
            render: (faseVenta) => faseVenta ? faseVenta.faseVenta : "No disponible",  // Renderiza "No disponible" si es null
          },
          {
            title: "Fecha Inicio",
            dataIndex: "fechaInicio",
            key: "fechaInicio",
            render: (fecha) => (fecha ? new Date(fecha).toLocaleDateString("es-ES") : "No disponible"),
          },
          {
            title: "Fecha Cierre",
            dataIndex: "fechaCierre",
            key: "fechaCierre",
            render: (fecha) => (fecha ? new Date(fecha).toLocaleDateString("es-ES") : "No disponible"),
          },
          {
            title: "Observaciones",
            dataIndex: "observaciones",
            key: "observaciones",
            render: (obs) => obs || "No disponible",
          },
        ];
      
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
              backgroundColor: "#f4f4f4",
            }}
          >
            <div
              style={{
                width: "90%",
                maxWidth: "1200px",
                height: "90vh",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
            <Typography.Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
              Informe de la Oportunidad : {nombreProyecto} 
            </Typography.Title>
            <Typography.Text><strong>Área:</strong> {area}</Typography.Text>
              <Typography.Text><strong>Monto Estimado:</strong> {montoEstimado}</Typography.Text>
              <Typography.Text><strong>Fase de Venta:</strong> {faseVentaProyecto}</Typography.Text>
              <Typography.Text><strong>Probabilidad de Venta:</strong> {probabilidadVenta}</Typography.Text>
              <Typography.Text><strong>Fecha de Inicio:</strong> {fechaInicio}</Typography.Text>
              <Typography.Text><strong>Responsable Comercial:</strong> {respComercial}</Typography.Text>
              <Typography.Text><strong>Responsable Técnico:</strong> {respTecnico}</Typography.Text>
              <Typography.Text><strong>Observaciones:</strong> {observaciones}</Typography.Text>
              <Typography.Text><strong>Lapso de Ejecución:</strong> {lapsoEjecucion}</Typography.Text><br />
              <Table
                columns={columnas}
                dataSource={filteredData}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        );
      };
      
      export default InformeProyecto;