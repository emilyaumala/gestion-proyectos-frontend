import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Box, Typography, Button } from "@mui/material";

const localizer = momentLocalizer(moment);

const OutlookCalendar = ({ }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6ImVHQ1diOVcyS1UweTFQUkp4a3IzVlBzQkRjV0IwZjF0c0Z1aHNDMzlxQkEiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hZjU1OTZmYi04YTMzLTQ3ZjItYTdmMy0xNTBjYjk3M2JlOTUvIiwiaWF0IjoxNzQzNDQ2MDcyLCJuYmYiOjE3NDM0NDYwNzIsImV4cCI6MTc0MzQ1MDMyMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhaQUFBQWhsWGpOQjlSeHErQUl5MFFTWUJPRHdGNjgrQkxBRlRYcTQrLzRGOVhlYVZLeis5NGtuSmhrbzdHNy9YR1R0SzZyUWYvNWIrYWV6Y2lXZHBBNFgrUDRnPT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkNvbnN0ZWNvaW5DYWxlbmRhciIsImFwcGlkIjoiMDA3MTI5ZDYtNzA0Zi00MGY4LThkYjYtNzAyMDZkOTFhMGVkIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJWZW5lZ2FzIiwiZ2l2ZW5fbmFtZSI6Ikd1c3Rhdm8iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxODYuNC4xODYuNDQiLCJuYW1lIjoiR3VzdGF2byBWZW5lZ2FzIiwib2lkIjoiZGQyMjY5NTUtZmYzZS00M2ZhLWE0MTAtNzg4YTlhZmVlMTdmIiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAzN0JENTY4REQiLCJyaCI6IjEuQVVVQS01WlZyek9LOGtlbjh4VU11WE8tbFFNQUFBQUFBQUFBd0FBQUFBQUFBQUJGQUdGRkFBLiIsInNjcCI6IkNhbGVuZGFycy5SZWFkV3JpdGUgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lkIjoiMDAzMjg5OTktYjgxNy0yMTk3LTM3OTgtYWE0MzE5MjA0ZWUxIiwic3ViIjoiNW8zTlJ4RkxzN3FSRW14dEZkdXZ1RFMyYlRmUTkyUU5JenJ3WUhlRFJkYyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJTQSIsInRpZCI6ImFmNTU5NmZiLThhMzMtNDdmMi1hN2YzLTE1MGNiOTczYmU5NSIsInVuaXF1ZV9uYW1lIjoiZ3VzdGF2by52ZW5lZ2FzQGNvbnN0ZWNvaW4uY29tIiwidXBuIjoiZ3VzdGF2by52ZW5lZ2FzQGNvbnN0ZWNvaW4uY29tIiwidXRpIjoiakllN3VPLVFyMC1qa0N6NjBaQVJBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19pZHJlbCI6IjIgMSIsInhtc19zdCI6eyJzdWIiOiJHelFUSy1pUGltM2tDSjdac19fUjkxWnQ2cHVRVVJwRFdPVUo2SXk5cDU4In0sInhtc190Y2R0IjoxNTcxMzM0MDE4fQ.dcY0380IykYRB5qEZsQgDPISpCjd5ftOvnXUH-OjW6PZBpbwVgFYhN0KFZBK2YTD7_ygtbiZNMkvzLV1ZTDoipqaHgmsH6MpMblBjT0RDvPWJuwKmzvIk87YAStSYin3c3MrKeK7RS9ksKhgQDq0XLLgnZUrACczo1rgc9irrlGtsZnzzfOlOj5mgV1nU78EUe9UQlf6_V4Fy5mVOteh9kTLntETwQgVYjVjzy1X4fSOnfOOYMn-_smltFqzW3oK2217Kr2tYVO-1E3HTdCPq4RUzPqi6avQvJas9VIBEBOH2Nfx50oArJQ9u30Is7Ria8MgC2tM8VSc1VhWtsjiDQ"

    useEffect(() => {
        if (!accessToken) return;

        axios.get("https://crm.constecoin.com/apicrm/calendar/events", {
            headers: { Authorization: accessToken },
        })
        .then((response) => {
            const formattedEvents = response.data.value.map((event) => ({
                id: event.id,
                title: event.subject,
                start: new Date(event.start.dateTime),
                end: new Date(event.end.dateTime),
                location: event.location.displayName || "No especificado",
                organizer: event.organizer.emailAddress.name,
                description: event.bodyPreview, // Descripción corta del evento
            }));
            setEvents(formattedEvents);
        })
        .catch((error) => console.error("Error obteniendo eventos:", error));
    }, [accessToken]);

    // Función para abrir el modal con la información del evento seleccionado
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setOpenModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div>
            <h2>Mi Calendario de Outlook</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={["month", "week", "day", "agenda"]}
                defaultView="month"
                toolbar={true}
                popup={true}
                selectable={true}
                onSelectEvent={handleSelectEvent} // Detecta clic en evento
            />

            {/* Modal con Material UI */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" component="h2" color="black">
                        {selectedEvent?.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Inicio:</strong> {selectedEvent?.start.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="black">
                        <strong>Fin:</strong> {selectedEvent?.end.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="black">
                        <strong>Ubicación:</strong> {selectedEvent?.location}
                    </Typography>
                    <Typography variant="body2" color="black">
                        <strong>Organizador:</strong> {selectedEvent?.organizer}
                    </Typography>
                    <Typography variant="body2" color="black">
                        <strong>Descripción:</strong> {selectedEvent?.description}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleCloseModal}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default OutlookCalendar;
