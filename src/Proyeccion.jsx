import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Proyeccion = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://gestion-proyectos-backend-qzye.onrender.com/forecast")
      .then((response) => {
        setProyectos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los proyectos:", error);
        setLoading(false);
      });
  }, []);

  // Modificado: Función de cálculo del pronóstico ponderado basado en monto estimado y probabilidad de venta
  const calcularPronosticoPonderado = (montoEstimado, probabilidadVenta) => {
    const probabilidades = {
      Alta: 0.7,
      Mediana: 0.5,
      Baja: 0.3,
    };
    const ponderacion = probabilidades[probabilidadVenta] || 0;
    return montoEstimado * ponderacion; // Multiplicamos monto estimado por ponderación
  };

  const obtenerMesAnio = (index, anioInicio) => {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const mes = meses[index];
    const mesAnio = new Date(anioInicio).setMonth(index);
    return `${mes} ${new Date(mesAnio).getFullYear()}`;
  };

  const mesesTableData = proyectos.reduce((acc, proyecto) => {
    proyecto.forecastMensual.forEach((forecast, index) => {
      const mesAnio = obtenerMesAnio(index, proyecto.fechaInicio);
      const existingMonth = acc.find(item => item.mes === mesAnio);
      if (existingMonth) {
        existingMonth.forecastMensual += forecast;
        existingMonth.forecastAcumulado += proyecto.forecastAcumulado[index];
      } else {
        acc.push({
          key: mesAnio,
          mes: mesAnio,
          forecastMensual: forecast,
          forecastAcumulado: proyecto.forecastAcumulado[index],
        });
      }
    });
    return acc;
  }, []);

  // 🎯 Preparar datos del gráfico
  const chartData = {
    labels: mesesTableData.map(item => item.mes),
    datasets: [
      {
        label: "Forecast Mensual",
        data: mesesTableData.map(item => item.forecastMensual),
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Rosado
      },
      {
        label: "Forecast Acumulado",
        data: mesesTableData.map(item => item.forecastAcumulado),
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Morado
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const columnsProyecto = [
    {
      title: "Proyecto",
      dataIndex: "nombreProyecto",
      key: "nombreProyecto",
    },
    {
      title: "Cliente",
      dataIndex:  "cliente",
      key: "cliente",
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fechaInicio",
      key: "fechaInicio",
    },
    {
      title: "Monto Estimado",
      dataIndex: "montoEstimado",
      key: "montoEstimado",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: "Probabilidad de Venta",
      dataIndex: "probabilidadVenta",
      key: "probabilidadVenta",
    },
    {
      title: "Pronóstico Ponderado",
      key: "pronosticoPonderado",
      render: (text, record) => {
        const pronosticoPonderado = calcularPronosticoPonderado(
          record.montoEstimado,
          record.probabilidadVenta
        );
        return `$${pronosticoPonderado.toLocaleString()}`;
      },
    },
  ];

  const columnsMeses = [
    {
      title: "Mes",
      dataIndex: "mes",
      key: "mes",
    },
    {
      title: "Forecast Mensual",
      dataIndex: "forecastMensual",
      key: "forecastMensual",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: "Forecast Acumulado",
      dataIndex: "forecastAcumulado",
      key: "forecastAcumulado",
      render: (value) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📈 Proyección de Proyectos</h1>
  
      {/* Tabla de Proyectos */}
      <div style={styles.responsiveBox}>
        <h3 style={styles.sectionTitle}>Pronóstico por Proyecto</h3>
        <div style={styles.scrollWrapper}>
          <Table
            columns={columnsProyecto}
            dataSource={proyectos}
            pagination={false}
            scroll={{ y: 300, x: 'max-content' }}  // Ajuste para scroll horizontal
          />
        </div>
      </div>
  
      {/* Tabla de Forecast Mensual y Acumulado */}
      <div style={styles.responsiveBox}>
        <h3 style={styles.sectionTitle}>Pronóstico Mensual y Acumulado</h3>
        <div style={styles.scrollWrapper}>
          <Table
            columns={columnsMeses}
            dataSource={mesesTableData}
            pagination={false}
            scroll={{ y: 300, x: 'max-content' }}  // Ajuste para scroll horizontal
          />
        </div>
      </div>
  
      {/* Gráfico de Barras */}
      <div style={styles.chartWrapper}>
        <h3 style={styles.sectionTitle}>Gráfico de Forecast Mensual vs Acumulado</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
  
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",       // Centra todo el contenido horizontalmente
      justifyContent: "flex-start",
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f4f4f4",
      padding: "5vw",            // Uso de unidades relativas
      boxSizing: "border-box",
    },
    title: {
      fontSize: "3vw",           // Uso de unidades relativas
      fontWeight: "bold",
      color: "#333",
      marginBottom: "2vw",       // Margen relativo
      textAlign: "center",       // Centra el título principal
    },
    responsiveBox: {
      width: "100%",
      maxWidth: "95%",           // Se ajusta al 95% del ancho de la pantalla
      marginBottom: "3vw",       // Margen relativo
      backgroundColor: "#fff",
      padding: "4vw",            // Uso de unidades relativas
      borderRadius: "1vw",       // Bordes redondeados con tamaño relativo
      boxShadow: "0 0.5vw 1vw rgba(0, 0, 0, 0.1)",  // Sombra con tamaños relativos
      boxSizing: "border-box",
    },
    sectionTitle: {
      color: "#333333",
      marginBottom: "1vw",       // Margen relativo
      fontSize: "2vw",           // Fuente con tamaño relativo
      textAlign: "center",       // Centra todos los títulos de las secciones
    },
    scrollWrapper: {
      width: "100%",
      overflowX: "auto",    // Habilita scroll horizontal
      overflowY: "auto",    // Scroll solo si la tabla es más ancha que el contenedor
    },
    chartWrapper: {
      display: "flex",              // Usamos flexbox para centrar el gráfico
      flexDirection: "column",
      alignItems: "center",         // Centra el gráfico horizontalmente
      justifyContent: "center",     // Centra el gráfico verticalmente
      width: "100%",
      minHeight: "30vw",            // Ajuste dinámico para gráficos
      marginBottom: "3vw",          // Margen relativo
    },
  };
  

export default Proyeccion;
