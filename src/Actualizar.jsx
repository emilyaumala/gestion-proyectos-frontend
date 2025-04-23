import React from "react";
import { Box, Button, Typography } from "@mui/material";

export default function Actualizar() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "#f9f9f9",
                padding: { xs: "16px", sm: "24px", md: "32px" },
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "500px",
                    backgroundColor: "white",
                    padding: { xs: "20px", sm: "30px" },
                    borderRadius: "24px",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="#333333"
                    sx={{ textAlign: "center" }}
                >
                    Actualizar Oportunidades
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, borderRadius: "12px" }}
                    onClick={() => window.location.href = "/actualizar-oportunidades-area"}
                >
                    Oportunidades por Área
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, borderRadius: "12px" }}
                    onClick={() => window.location.href = "/actualizar-oportunidades-res"}
                >
                    Oportunidades por Responsable
                </Button>
                <Button
                    type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                    onClick={() => window.location.href = `/`}
                >
                    Regresar
                </Button>
            </Box>
        </Box>
    );
}
