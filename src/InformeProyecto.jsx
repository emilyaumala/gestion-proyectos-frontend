import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Input, Button, Space, Typography, Modal, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { format } from 'date-fns';


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
  const [actividades, setActividades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreContacto, setNombreContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [numeroContacto, setNumeroContacto] = useState("");


  useEffect(() => {
    axios
      .get(`https://crm.constecoin.com/apicrm/informeOportunidad/${id}`)
      .then((response) => {
        console.log("📌 Respuesta del backend:", response.data);

        setNombreProyecto(response.data.nombreProyecto || "Nombre no disponible");
        setCliente(response.data.cliente || "Cliente no disponible"); // 🔹 Cliente
        setArea(response.data.area || "Área no disponible");
        setCodigoProyecto(response.data.codigoProyecto || "Monto no disponible");
        setMontoEstimado(response.data.montoEstimado || "Monto no disponible");
        setFaseVentaProyecto(response.data.faseVentaProyecto || "Fase no disponible");
        setProbabilidadVenta(response.data.probabilidadVenta || "Prob no disponible");
        setFechaInicio(response.data.fechaInicio || "No disponible");
        setRespComercial(response.data.respComercial || "No disponible");
        setRespTecnico(response.data.respTecnico || "No disponible");
        setObservaciones(response.data.observaciones || "No disponible");

        // Modificar oportunidades para incluir el lapsoEjecucion concatenado
        const oportunidadesConLapso = response.data.oportunidades.map((oportunidad) => ({
          ...oportunidad,
          lapsoEjecucion: `${oportunidad.cantidadLapso} ${oportunidad.unidadLapso}` || "Lapso no disponible",
        }));
        setActividades(response.data.actividades);  // 🔹 Guardamos las actividades
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

  const fetchClienteDetails = async () => {
    try {
      const response = await axios.get(`https://crm.constecoin.com/apicrm/oportunidades/${id}`);
      const data = response.data;
      setNombreContacto(data.nombreContacto || "No disponible");
      setCorreoContacto(data.correoContacto || "No disponible");
      setNumeroContacto(data.numeroContacto || "No disponible");
      setModalVisible(true);
    } catch (error) {
      console.error("❌ Error al obtener detalles del cliente:", error);
    }
  };
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
    onFilter: (value, record) => {
      // Si el valor es un objeto, usamos la propiedad faseVenta
      if (typeof record[dataIndex] === 'object') {
        return record[dataIndex]?.faseVenta?.toLowerCase().includes(value.toLowerCase());
      }
      // Si es un string, hacemos la comparación directamente
      return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
    },
    render: (text) => text || "No disponible",
  });

  const getColumnSearchProps2 = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => {
      const lapsoTexto = `${record.cantidadLapso} ${record.unidadLapso}`.toLowerCase();
      return lapsoTexto.includes(value.toLowerCase()); // Filtra correctamente por texto
    },
  });


  const formatFechaHora = (fecha) => {
    return format(new Date(fecha), 'yyyy-MM-dd/HH:mm');
  };

  const columnas = [
    {
      title: "Fecha Actualización",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (fecha) =>
        fecha
          ? new Date(fecha).toLocaleString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24 horas, opcional
          })
          : "No disponible",
    },

    {
      title: "Fecha Cierre Probable",
      dataIndex: "fechaInicio",
      key: "fechaInicio",
      //...getColumnSearchProps("fechaInicio","fechaInicio"),
      render: (text) => {
        const [year, month] = text.split("T")[0].split("-");
        const meses = [
          "enero", "febrero", "marzo", "abril", "mayo", "junio",
          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const nombreMes = meses[parseInt(month, 10) - 1];
        return `${nombreMes} ${year}`;
      }

    },
    {
      title: "Fase de Venta",
      dataIndex: "faseVenta",
      key: "faseVenta",
      ...getColumnSearchProps("faseVenta"), // Solo pasas el nombre del campo
      render: (faseVenta) => {
        // Si faseVenta es un objeto que tiene una propiedad `faseVenta` dentro de él
        if (faseVenta && typeof faseVenta === 'object') {
          return faseVenta.faseVenta || "No disponible";
        }
        // Si faseVenta es un string directamente
        return faseVenta || "No disponible";
      }
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
      render: (respComercial) => respComercial ? respComercial.nombreCompleto : "No disponible",
    },
    {
      title: "Responsable Técnico",
      dataIndex: "respTecnico",
      key: "respTecnico",
      render: (respTecnico) => respTecnico ? respTecnico.nombreCompleto : "No disponible",
    },
    {
      title: "Probabilidad de Venta",
      dataIndex: "probabilidadVenta",
      key: "probabilidadVenta",
      render: (prob) => prob ?? "No disponible",
    },
    /* {
       title: "Lapso de Ejecución",
       dataIndex: "lapsoEjecucion",
       key: "lapsoEjecucion",
       render: (lapso) => lapso || "No disponible",
     },*/
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      render: (obs) => obs || "No disponible",
    },
    {
      title: "Actividad",
      dataIndex: "actividad",
      key: "actividad",
      render: (_, record) => {
        const actividad = actividades.find(act => act.actualizacionId === record._id);
        return actividad ? (
          <div>
            <strong>{actividad.descripcionActividad}</strong>
            <br />
            🕒 {formatFechaHora(actividad.horaInicio)} - {formatFechaHora(actividad.horaFin)}
          </div>
        ) : "Sin actividad";  // 🔹 Si no hay actividad, muestra "Sin actividad"
      }
    }


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
          "Observaciones",
          "Actividad"

        ]
      ],
      body: oportunidades.map((oportunidad) => {
        const actividad = actividades.find(act => act.actualizacionId === oportunidad._id);
        return [
          new Date(oportunidad.createdAt).toLocaleDateString("es-ES") || "No disponible", // Fecha Actualización
          new Date(oportunidad.fechaInicio).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long", // Solo muestra el mes y el año
          }) || "No disponible", // Fecha Inicio
          oportunidad.faseVenta.faseVenta || "No disponible", // Fase de Venta
          oportunidad.montoEstimado || "No disponible", // Monto Estimado
          oportunidad.respComercial.nombreCompleto || "No disponible", // Responsable Comercial
          oportunidad.respTecnico.nombreCompleto || "No disponible", // Responsable Técnico
          oportunidad.probabilidadVenta || "No disponible", // Probabilidad de Venta
          /*`${oportunidad.cantidadLapso || "No disponible"} ${oportunidad.unidadLapso || ""}` || "No disponible", // Lapso de Ejecución*/
          oportunidad.observaciones || "No disponible", // Observaciones
          actividad ? `${actividad.descripcionActividad} (${format(new Date(actividad.horaInicio), "yyyy-MM-dd/HH:mm")} - ${format(new Date(actividad.horaFin), "yyyy-MM-dd/HH:mm")})` : "Sin actividad"
        ]
      }),
      theme: "striped", // Agregar un tema para la tabla
      columnStyles: {
        0: { cellWidth: 30 }, // Ajustar ancho de columnas
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
        /* 7: { cellWidth: 20 },*/
        7: { cellWidth: 40 }, // Columna Observaciones más ancha
        8: { cellWidth: 35 }
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
        padding: "4vw", // Espaciado adaptable
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "white",
          padding: "clamp(16px, 4vw, 32px)", // Padding adaptable a la pantalla
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: "clamp(16px, 4vw, 30px)", // Margen adaptable
            fontSize: "clamp(20px, 4vw, 28px)",
          }}
        >
          Informe de Oportunidad: {nombreProyecto}
        </Typography.Title>


        <Space
          direction="vertical"
          size="middle"
          style={{ marginBottom: "clamp(16px, 4vw, 30px)", width: "100%" }}
        >

          <Row justify="space-between" align="middle">
            <Col>
              <Typography.Text>
                <strong>Cliente:</strong> {cliente}
              </Typography.Text>
            </Col>
            <Col>
              <Button type="primary" onClick={fetchClienteDetails} size="small">
                Mostrar Detalles Cliente
              </Button>
            </Col>
          </Row>
          <Typography.Text>
            <strong>Área:</strong> {area}
          </Typography.Text>
          <Typography.Text>
            <strong>Código del Proyecto:</strong> {codigoProyecto}
          </Typography.Text>
        </Space>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table
            columns={columnas}
            dataSource={filteredData}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            bordered
            style={{ minWidth: "600px" }} // Asegura scroll lateral en móvil
          />
        </div>

        <Button
  type="primary"
  onClick={handleDownloadPDF}
  style={{
    marginTop: "auto",
    backgroundColor: "#808080",
    borderColor: "#808080",
    color: "white",
    fontSize: "15px", // Reducir el tamaño del texto
    padding: "4px 12px", // Reducir el padding para hacerlo más pequeño
    height: "auto", // Ajustar la altura automáticamente al contenido
    width: "auto", // Ajustar el ancho automáticamente al contenido
  }}
  size="small"
>
  🖨️
</Button>

<Button
  type="submit"
  variant="contained"
  color="primary"
  fullWidth
  sx={{ mt: 2 }}
  onClick={() => window.location.href = `/proyectos`}
  size="small"
  style={{
    fontSize: "15px", // Reducir el tamaño del texto
    padding: "4px 8px", // Reducir el padding
    height: "auto", // Ajustar la altura automáticamente al contenido
    width: "auto", // Ajustar el ancho automáticamente al contenido
  }}
>
  Regresar
</Button>


      </div>
      <Modal
        title="Detalles del Cliente"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p><strong>Nombre:</strong> {nombreContacto}</p>
        <p><strong>Correo:</strong> {correoContacto}</p>
        <p><strong>Teléfono:</strong> {numeroContacto}</p>
      </Modal>
    </div>
  );

};

export default InformeProyecto;
