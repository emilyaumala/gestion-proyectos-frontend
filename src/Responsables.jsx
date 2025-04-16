import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal } from "antd";
import axios from "axios";
import { SearchOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

const Responsables = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("https://crm.constecoin.com/apicrm/responsables-activos")
            .then((response) => {
                setFilteredData(response.data);
                console.log(response.data)
            })
            .catch((error) => console.error("Error al obtener responsables:", error));
    }, []);

    const showDelete = (id) => {
        console.log("haciendo clic", id);
        setCurrentId(id);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleConfirm = () => {
        eliminarResponsable(currentId);
        setModalVisible(false);
    };

    const eliminarResponsable = async (id) => {
        try {
            await axios.put(`https://crm.constecoin.com/apicrm/responsables/${id}`, {
                estadoActivo: false,
                contraseña: "" // o null, según tu backend
            });

            // Eliminar el responsable del listado actual (estado)
            setFilteredData(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error al eliminar responsable:", error);
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
            // Si el campo es un objeto, accedemos a la propiedad correcta
            if (objProperty && record[dataIndex] && record[dataIndex][objProperty]) {
                return record[dataIndex][objProperty]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
            }

            // Si no es un objeto, comparamos directamente el texto
            if (record[dataIndex]) {
                return record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
            }

            return false;
        },
        render: (text) => text || "No disponible",  // Si el valor es nulo, muestra "No disponible"
    });

    const columnas = [
        {
            title: "Cédula",
            dataIndex: "cedula",
            key: "cedula",
            ...getColumnSearchProps("cedula"), // Acceder a la propiedad cliente dentro del objeto cliente
            render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
        },
        {
            title: "Correo",
            dataIndex: "correo",
            key: "correo",
            ...getColumnSearchProps("correo"),
            render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
        },
        {
            title: "Nombres",
            dataIndex: "nombreCompleto",
            key: "nombreCompleto",
            ...getColumnSearchProps("nombreCompleto"),
            render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
        },
        {
            title: "Telefono",
            dataIndex: "telefono",
            key: "telefono",
            ...getColumnSearchProps("telefono"), // Acceder a la propiedad respComercial dentro del objeto respComercial
            render: (text) => text || "No disponible",  // Renderiza "No disponible" si es null
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDelete(record._id)}
                />

            ),
        }

    ];

    const irAgregarResponsable = () => {
        navigate("/agregar-responsable")
    }
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
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "1rem",
                    position: "relative",
                    flexDirection: isSmallScreen ? "column" : "row",
                    gap: "0.5rem",
                }}>
                    {/* Contenedor para el título */}
                    <div style={{
                        width: "100%",
                        textAlign: "center",
                        position: isSmallScreen ? "relative" : "absolute",
                        left: 0,
                        right: 0,
                        marginBottom: isSmallScreen ? "0rem" : 0
                    }}>
                        <h2 style={{
                            color: "#333333",
                            fontSize: "clamp(20px, 4vw, 28px)",
                            margin: 0,
                        }}>
                            Lista de responsables
                        </h2>
                    </div>

                    {/* Div vacío para mantener el espacio en la izquierda */}
                    {!isSmallScreen && <div style={{ width: "40px" }}></div>}

                    {/* Contenedor de botones alineado a la derecha en pantallas normales, centrado en pequeñas */}
                    <div style={{
                        display: "flex",
                        gap: "0.5rem",
                        zIndex: 1,
                        justifyContent: isSmallScreen ? "center" : "flex-end",
                        width: isSmallScreen ? "100%" : "auto",
                        marginTop: isSmallScreen ? "0rem" : 0
                    }}>
                        <Button
                            type="default"
                            onClick={() => navigate("/responsables-eliminados")}
                            style={{
                                height: "40px",
                                borderRadius: "8px",
                                padding: "0 12px",
                                fontSize: "14px",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Ver eliminados
                        </Button>

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
                                alignItems: "center"
                            }}
                        />
                    </div>
                </div>


                {/* Tabla con scroll horizontal si es necesario */}
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
                    onClick={() => window.location.href = `/`}
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
                <Modal
                    title="Confirmación"
                    open={modalVisible}
                    onOk={handleConfirm}
                    onCancel={handleCancel}
                    okText="Sí, eliminar"
                    cancelText="Cancelar"
                    okType="danger"
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '22px', marginRight: '16px' }} />
                        <span>¿Está seguro de eliminar este responsable? Esta acción no se puede deshacer.</span>
                    </div>
                </Modal>
            </div>

        </div>

    );
};
export default Responsables;