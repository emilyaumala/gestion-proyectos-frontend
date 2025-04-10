import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import axios from "axios";
import {
    SearchOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ResponsablesEliminados = () => {
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("https://crm.constecoin.com/apicrm/responsables-eliminados") // Asegúrate que esta ruta solo devuelva los con estadoActivo: false
            .then((response) => {
                setFilteredData(response.data);
            })
            .catch((error) =>
                console.error("Error al obtener responsables eliminados:", error)
            );
    }, []);

    const recuperarResponsable = async (id) => {
        try {
            const res = await fetch(
                `https://crm.constecoin.com/apicrm/responsables/reactivar/${id}`,
                {
                    method: "PATCH",
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert("Responsable restaurado correctamente");
                window.location.reload();
            } else {
                alert(data.mensaje || "Error al restaurar");
            }
        } catch (error) {
            console.error("Error al restaurar responsable:", error);
        }
    };

    const getColumnSearchProps = (dataIndex, objProperty) => ({
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
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
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

    const columnas = [
        {
            title: "Cédula",
            dataIndex: "cedula",
            key: "cedula",
            ...getColumnSearchProps("cedula"),
        },
        {
            title: "Correo",
            dataIndex: "correo",
            key: "correo",
            ...getColumnSearchProps("correo"),
        },
        {
            title: "Nombres",
            dataIndex: "nombreCompleto",
            key: "nombreCompleto",
            ...getColumnSearchProps("nombreCompleto"),
        },
        {
            title: "Teléfono",
            dataIndex: "telefono",
            key: "telefono",
            ...getColumnSearchProps("telefono"),
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => recuperarResponsable(record._id)}
                >
                    Agregar
                </Button>
            ),
        },
    ];

    const irAgregarResponsable = () => {
        navigate("/agregar-responsable");
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
                padding: "4vw",
                boxSizing: "border-box",
                margin: 0,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    backgroundColor: "#ffffff",
                    padding: "clamp(16px, 4vw, 32px)",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            left: 0,
                            right: 0,
                        }}
                    >
                        <h2
                            style={{
                                color: "#333333",
                                fontSize: "clamp(20px, 4vw, 28px)",
                                margin: 0,
                            }}
                        >
                            Responsables eliminados
                        </h2>
                    </div>

                    <div style={{ width: "40px" }}></div>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={irAgregarResponsable}
                        style={{
                            backgroundColor: "#1890ff",
                            borderColor: "#1890ff",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1,
                        }}
                    />
                </div>

                <div style={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        columns={columnas}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        style={{ minWidth: "600px" }}
                    />
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = `/responsables`}
                    size="small"
                    style={{
                        fontSize: "15px", // Reducir el tamaño del texto
                        padding: "4px 8px", // Reducir el padding
                        height: "auto", // Ajustar la altura automáticamente al contenido
                        width: "80px", // Ajustar el ancho automáticamente al contenido
                    }}
                >
                    Regresar
                </Button>
            </div>
        </div>

    );
};

export default ResponsablesEliminados;
