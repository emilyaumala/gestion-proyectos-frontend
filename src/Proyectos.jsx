import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button, Space } from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clientes, setClientes] = useState([]); // Estado para almacenar los clientes únicos
  const [areas, setAreas] = useState([]);
  const [probs, setProbs] = useState([]);
  const [oports, setOports] = useState([]);



  useEffect(() => {
    axios
      .get("https://crm.constecoin.com/apicrm/proyectos")
      .then((response) => {
        setProyectos(response.data);
        setFilteredData(response.data);
        console.log(response.data)
        const clientesUnicos = [...new Set(response.data.map((proyecto) => proyecto.cliente?.cliente))];
        setClientes(clientesUnicos); // Guardamos los clientes únicos en el estado
        const areasUnicas = [...new Set(response.data.map((proyecto) => proyecto.area?.area))];
        setAreas(areasUnicas); // Guardamos los clientes únicos en el estado
        const probsUnicas = [...new Set(response.data.map((proyecto) => proyecto.probabilidadVenta))];
        setProbs(probsUnicas); // Guardamos los clientes únicos en el estado
        const oportsUnicas = [...new Set(response.data.map((proyecto) => proyecto.nombreProyecto))];
        setOports(oportsUnicas); // Guardamos los clientes únicos en el estado
      })
      .catch((error) => console.error("Error al obtener proyectos:", error));
  }, []);

  const getColumnSearchProps = (dataIndex, objProperty, options = []) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Select
          showSearch // Habilita la búsqueda dentro del Select
          optionFilterProp="children" // Permite que la búsqueda funcione en base a los textos de las opciones
          autoFocus
          style={{ width: 188, marginBottom: 8, display: "block" }}
          value={selectedKeys[0]}
          onChange={(value) => setSelectedKeys(value ? [value] : [])}
          onBlur={() => confirm()}
          placeholder="Buscar..."
          allowClear // Agrega un botón para limpiar la selección
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))
          ) : (
            <Select.Option value="" disabled>
              No hay opciones disponibles
            </Select.Option>
          )}
        </Select>
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
            onClick={() => {
              clearFilters && clearFilters();
              confirm();
            }}
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
      if (objProperty && record[dataIndex] && record[dataIndex][objProperty]) {
        return record[dataIndex][objProperty]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      if (record[dataIndex]) {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return false;
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
            onClick={() => {
              clearFilters && clearFilters();
              confirm();
            }}
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



  const columnas = [
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      ...getColumnSearchProps("cliente", "cliente", clientes), // Usamos los clientes únicos para el filtro desplegable
      render: (cliente) => cliente ? cliente.cliente : "No disponible", // Renderiza "No disponible" si es null
    },
    {
      title: "Área",
      dataIndex: "area",
      key: "area",
      ...getColumnSearchProps("area", "area", areas),
      render: (area) => area ? area.area : "No disponible",  // Renderiza "No disponible" si es null
    },
    {
      title: "Oportunidad",
      dataIndex: "nombreProyecto",
      key: "nombreProyecto",
      ...getColumnSearchProps("nombreProyecto", "nombreProyecto", oports),
      render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
    },
    /*{
      title: "Monto Estimado",
      dataIndex: "montoEstimado",
      key: "montoEstimado",
      ...getColumnSearchProps("montoEstimado"),
      render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
    },
    {
      title: "Fase de Venta",
      dataIndex: "faseVenta",
      key: "faseVenta",
      ...getColumnSearchProps("faseVenta", "faseVenta"), // Acceder a la propiedad faseVenta dentro del objeto faseVenta
      render: (faseVenta) => faseVenta ? faseVenta.faseVenta : "No disponible",  // Renderiza "No disponible" si es null
    },*/
    {
      title: "Probabilidad de Venta",
      dataIndex: "probabilidadVenta",
      key: "probabilidadVenta",
      ...getColumnSearchProps("probabilidadVenta", "probabilidadVenta", probs),
      render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
    },
    /*  {
        title: "Fecha Inicio",
        dataIndex: "fechaInicio",
        key: "fechaInicio",
        render: (text) => 
          text 
            ? new Date(text).toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              }) 
            : "No disponible",  // Si no tiene fecha, muestra "No disponible"
        ...getColumnSearchProps("fechaInicio"),
      },
      {
          title: "Lapso de Ejecución",
          dataIndex: "lapsoEjecucion", // O el índice que estés usando para los datos
          key: "lapsoEjecucion",
          render: (text, record) => {
            const cantidad = record.cantidadLapso;
            const unidad = record.unidadLapso;
            const lapsoTexto = cantidad && unidad ? `${cantidad} ${unidad}` : "No disponible";
            return lapsoTexto;
          },
          ...getColumnSearchProps2("lapsoEjecucion") // Utiliza el filtro aquí
        },  
  
      {
        title: "Responsable Comercial",
        dataIndex: "respComercial",
        key: "respComercial",
        ...getColumnSearchProps("respComercial", "nombreCompleto"), // Acceder a la propiedad respComercial dentro del objeto respComercial
        render: (respComercial) => respComercial ? respComercial.nombreCompleto : "No disponible",  // Renderiza "No disponible" si es null
      },
      {
        title: "Responsable Técnico",
        dataIndex: "respTecnico",
        key: "respTecnico",
        ...getColumnSearchProps("respTecnico", "nombreCompleto"), // Acceder a la propiedad respTecnico dentro del objeto respTecnico
        render: (respTecnico) => respTecnico ? respTecnico.nombreCompleto : "No disponible",  // Muestra "No disponible" si es null
      },
      /* {
         title: "Observaciones",
         dataIndex: "observaciones",
         key: "observaciones",
         ...getColumnSearchProps("observaciones"),
         render: (text) => text || "No disponible",  // Si no hay observaciones, muestra "No disponible"
       },*/
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => window.location.href = `/proyectos/${record._id}/informe`}
        >
          Ver Informe
        </Button>
      ),
    }

  ];

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setFilteredData(
      proyectos.filter((proyecto) =>
        Object.keys(filtros).every((key) =>
          proyecto[key]?.toString().toLowerCase().includes(selectedKeys[0]?.toLowerCase() || "")
        )
      )
    );
  };

  const handleReset = () => {
    setFilteredData(proyectos);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
        padding: "4vw", // Espaciado responsive
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#ffffff",
          padding: "clamp(16px, 4vw, 32px)", // Escala según pantalla
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden", // Previene scroll innecesario en el div principal
        }}
      >
        <h2 style={{
          textAlign: "center",
          color: "#333333",
          fontSize: "clamp(20px, 4vw, 28px)", // Escala en móvil/desktop
          marginBottom: "1rem",
        }}>
          Lista de Oportunidades
        </h2>

        {/* Tabla con scroll horizontal si es necesario */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table
            columns={columnas}
            dataSource={filteredData}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            onChange={(pagination, filters, sorter) => {
              // lógica para ordenar
            }}
            style={{ minWidth: "600px" }} // Asegura legibilidad en pantallas chicas con scroll lateral
          />
        </div>
        <Button
          type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
          onClick={() => window.location.href = `/`}
        >
          Regresar
        </Button>
      </div>
    </div>
  );

};
export default Proyectos;
