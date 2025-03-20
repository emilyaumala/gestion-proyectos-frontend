import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Input, Button, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";



const InformeProyecto = () => {
  const { id } = useParams();
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [cliente, setCliente] = useState(""); // 🔹 Nuevo estado
  const [area, setArea] = useState("");
  const [codigoProyecto, setCodigoProyecto] = useState("");
  const [montoEstimado, setMontoEstimado] = useState("");
  const [faseVentaProyecto, setFaseVentaProyecto] = useState("");
  const [probabilidadVenta, setProbabilidadVenta] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [respComercial, setRespComercial] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [respTecnico, setRespTecnico] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://gestion-proyectos-backend-qzye.onrender.com/informeOportunidad/${id}`)
      .then((response) => {
        console.log("📌 Respuesta del backend:", response.data);

        setNombreProyecto(response.data.nombreProyecto || "Nombre no disponible");
        setCliente(response.data.cliente || "Cliente no disponible"); // 🔹 Cliente
        setArea(response.data.area || "Área no disponible");
        setCodigoProyecto(response.data.codigoProyecto || "Monto no disponible");
        setMontoEstimado(response.data.montoEstimado || "Monto no disponible");
        setFaseVentaProyecto(response.data.faseVentaProyecto || "Fase no disponible");
        setProbabilidadVenta(response.data.probabilidadVenta || "Prob no disponible");
        setFechaInicio(response.data.fechaInicio ? new Date(response.data.fechaInicio).toLocaleDateString("es-ES") : "No disponible");
        setRespComercial(response.data.respComercial || "No disponible");
        setRespTecnico(response.data.respTecnico || "No disponible");
        setObservaciones(response.data.observaciones || "No disponible");

        // Modificar oportunidades para incluir el lapsoEjecucion concatenado
        const oportunidadesConLapso = response.data.oportunidades.map((oportunidad) => ({
          ...oportunidad,
          lapsoEjecucion: `${oportunidad.cantidadLapso} ${oportunidad.unidadLapso}` || "Lapso no disponible",
        }));

        setOportunidades(oportunidadesConLapso);
        setFilteredData(oportunidadesConLapso);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error al obtener el informe:", error);
        setError("No se pudo cargar la información del proyecto.");
        setLoading(false);
      });
    }, [id]);
  

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
      title: "Fecha Actualización",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (fecha) => fecha ? new Date(fecha).toLocaleDateString("es-ES") : "No disponible",
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fechaInicio",
      key: "fechaInicio",
      render: (fecha) => {
        if (fecha) {
          // Usar toLocaleDateString para mostrar solo mes y año
          return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long" // Solo muestra el mes y el año
          });
        }
        return "No disponible";
      },
    },

    {
      title: "Fase de Venta",
      dataIndex: "faseVenta",
      key: "faseVenta",
      render: (faseVenta) => faseVenta?.faseVenta || "No disponible",
    },
    {
      title: "Monto Estimado",
      dataIndex: "montoEstimado",
      key: "montoEstimado",
      render: (monto) => monto ?? "No disponible",
    },
    {
      title: "Responsable Comercial",
      dataIndex: "respComercial",
      key: "respComercial",
      render: (respComercial) => respComercial?.respComercial || "No disponible",
    },
    {
      title: "Responsable Técnico",
      dataIndex: "respTecnico",
      key: "respTecnico",
      render: (respTecnico) => respTecnico?.respTecnico || "No disponible",
    },
    {
      title: "Probabilidad de Venta",
      dataIndex: "probabilidadVenta",
      key: "probabilidadVenta",
      render: (prob) => prob ?? "No disponible",
    },
    {
      title: "Lapso de Ejecución",
      dataIndex: "lapsoEjecucion",
      key: "lapsoEjecucion",
      render: (lapso) => lapso || "No disponible",
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      render: (obs) => obs || "No disponible",
    },
  ];
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" }); // Cambiar orientación a horizontal

    // Título
    doc.setFontSize(18);
    doc.text(`Informe del Proyecto: ${nombreProyecto}`, 10, 10);

    // Información general (solo Cliente y Área)
    doc.setFontSize(12);
    doc.text(`Cliente: ${cliente}`, 10, 20);
    doc.text(`Área: ${area}`, 10, 30);

    // Generar la tabla con autoTable
    autoTable(doc, {
      startY: 40, // donde empieza la tabla (justo debajo de la información general)
      head: [
        [
          "Fecha Actualización",
          "Fecha Inicio",
          "Fase de Venta",
          "Monto Estimado",
          "Responsable Comercial",
          "Responsable Técnico",
          "Probabilidad de Venta",
          "Lapso de Ejecución",
          "Observaciones"
        ]
      ],
      body: oportunidades.map((oportunidad) => [
        new Date(oportunidad.createdAt).toLocaleDateString("es-ES") || "No disponible", // Fecha Actualización
        new Date(oportunidad.fechaInicio).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long", // Solo muestra el mes y el año
        }) || "No disponible", // Fecha Inicio
        oportunidad.faseVenta.faseVenta || "No disponible", // Fase de Venta
        oportunidad.montoEstimado || "No disponible", // Monto Estimado
        oportunidad.respComercial.respComercial || "No disponible", // Responsable Comercial
        oportunidad.respTecnico.respTecnico || "No disponible", // Responsable Técnico
        oportunidad.probabilidadVenta || "No disponible", // Probabilidad de Venta
        `${oportunidad.cantidadLapso || "No disponible"} ${oportunidad.unidadLapso || ""}` || "No disponible", // Lapso de Ejecución
        oportunidad.observaciones || "No disponible", // Observaciones
      ]),
      theme: "striped", // Agregar un tema para la tabla
      columnStyles: {
        0: { cellWidth: 30 }, // Ajustar ancho de columnas
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 40 },
        5: { cellWidth: 40 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
        8: { cellWidth: 40 }, // Columna Observaciones más ancha
      },
      tableWidth: "auto", // Ajustar automáticamente el tamaño de la tabla
      margin: { top: 40, left: 10, right: 10, bottom: 20 }, // Márgenes ajustados
      pageSize: "a4", // Asegurarse de usar el tamaño de página A4
      didDrawPage: (data) => {
        // Ajustar la tabla para que quepa en la página horizontalmente
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const tableWidth = data.table.width;

        // Si la tabla es más ancha que la página, ajustar el tamaño de la fuente
        if (tableWidth > pageWidth - 20) {
          const scaleFactor = (pageWidth - 20) / tableWidth; // Factor de escala
          doc.setFontSize(10 * scaleFactor); // Reducir el tamaño de la fuente
        }
      }
    });

    // Descargar el PDF
    doc.save(`${nombreProyecto}_informe.pdf`);
  };


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
        margin: 0, // Asegura que no haya márgenes que desajusten el centrado
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          height: "auto", // Esto asegura que el contenido se ajuste al tamaño de la pantalla
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Alinea los elementos hacia el principio
          alignItems: "center",
        }}
      >
        <Typography.Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>
          Informe de Oportunidad: {nombreProyecto}
        </Typography.Title>
        <Space direction="vertical" size="middle" style={{ marginBottom: "30px" }}>
          <Typography.Text><strong>Cliente:</strong> {cliente}</Typography.Text>
          <Typography.Text><strong>Área:</strong> {area}</Typography.Text>
          <Typography.Text><strong>Código del Proyecto:</strong> {codigoProyecto}</Typography.Text>
        </Space>
        <Table
          columns={columnas}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          bordered
          style={{ width: "100%" }}
        />
        <Button
          type="primary"
          onClick={handleDownloadPDF}
          style={{
            marginTop: "20px",
            backgroundColor: "#808080", // Gris
            borderColor: "#808080", // Gris en el borde
            color: "white", // Color del texto
          }}
        >
          🖨️
        </Button>

      </div>
    </div>
  );
};

export default InformeProyecto;
