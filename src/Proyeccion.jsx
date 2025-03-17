import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Proyeccion = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://gestion-proyectos-backend-qzye.onrender.com/forecast")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener la proyección:", error);
                setLoading(false);
            });
    }, []);

    const columns = [
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

    const chartData = {
        labels: data.map((item) => item.mes),
        datasets: [
            {
                label: "Forecast Mensual",
                data: data.map((item) => item.forecastMensual),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
            {
                label: "Forecast Acumulado",
                data: data.map((item) => item.forecastAcumulado),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📈 Proyección Financiera</h1>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="mes"
                loading={loading}
                pagination={{ pageSize: 5 }}
                style={{ width: "90%", marginBottom: "20px" }}
            />
            <div style={{ width: "80%", height: "400px" }}>
                <Line data={chartData} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
        textAlign: "center",
        padding: "20px",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    },
};

export default Proyeccion;
