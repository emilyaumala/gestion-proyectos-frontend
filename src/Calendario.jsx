import React, { useState, useEffect } from 'react';
import { Scheduler } from '@aldabil/react-scheduler'; // Importa el Scheduler
import Modal from 'react-modal'; // Modal para agregar eventos
import { jwtDecode } from "jwt-decode";
import { RESOURCES } from './events'; // Importa los recursos
import './Calendario.css'; // Tu archivo de estilos CSS
import axios from 'axios';
import moment from "moment-timezone"; // Asegúrate de instalar moment-timezone


const CalendarPage = () => {
    const [resources, setResources] = useState([]);
    const [date, setDate] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [events, setEvents] = useState([]); // Eventos que se mostrarán en el calendario
    const [form, setForm] = useState({ title: "", startTime: "", endTime: "" }); // Formulario para agregar o editar eventos

    // Función para formatear las fechas
    const formatDate = (utcDate) => {
        const date = new Date(utcDate);
        return date.toISOString().slice(11, 19).replace("T", " "); // "2025-03-31 10:29:00"
    };
    const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6InVzaVV4R1BSQmVsNkNqY1FtWklXdThHQ2U2WlhOdTNaMFhVZThqV3JOMUEiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hZjU1OTZmYi04YTMzLTQ3ZjItYTdmMy0xNTBjYjk3M2JlOTUvIiwiaWF0IjoxNzQzNjkwODI3LCJuYmYiOjE3NDM2OTA4MjcsImV4cCI6MTc0MzY5NTQwMCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhaQUFBQVBKSTBxKzVEazJRZ3o0NVpsSkFKNFh2THIzeWRteHUyMlZuZTgrZ3Y2K0JKUk9ubVp4VU1ia3dFV08veWUrWmgyMVp6R2hQMFEvN25aTk5rTG1rME1RPT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkNvbnN0ZWNvaW5DYWxlbmRhciIsImFwcGlkIjoiMDA3MTI5ZDYtNzA0Zi00MGY4LThkYjYtNzAyMDZkOTFhMGVkIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJWZW5lZ2FzIiwiZ2l2ZW5fbmFtZSI6Ikd1c3Rhdm8iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxNTcuMTAwLjE4LjE0OSIsIm5hbWUiOiJHdXN0YXZvIFZlbmVnYXMiLCJvaWQiOiJkZDIyNjk1NS1mZjNlLTQzZmEtYTQxMC03ODhhOWFmZWUxN2YiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDM3QkQ1NjhERCIsInJoIjoiMS5BVVVBLTVaVnJ6T0s4a2VuOHhVTXVYTy1sUU1BQUFBQUFBQUF3QUFBQUFBQUFBQkZBR0ZGQUEuIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWRXcml0ZSBVc2VyLlJlYWQgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzaWQiOiIwMDNkNWYwOS00NmI0LTE2NGQtMjNmMi0yNGU5YTk0ZjAxM2QiLCJzdWIiOiI1bzNOUnhGTHM3cVJFbXh0RmR1dnVEUzJiVGZROTJRTkl6cndZSGVEUmRjIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IlNBIiwidGlkIjoiYWY1NTk2ZmItOGEzMy00N2YyLWE3ZjMtMTUwY2I5NzNiZTk1IiwidW5pcXVlX25hbWUiOiJndXN0YXZvLnZlbmVnYXNAY29uc3RlY29pbi5jb20iLCJ1cG4iOiJndXN0YXZvLnZlbmVnYXNAY29uc3RlY29pbi5jb20iLCJ1dGkiOiJHOHFsMmFYSHYwLXdxR1hrdzBNV0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMjQgMSIsInhtc19zdCI6eyJzdWIiOiJHelFUSy1pUGltM2tDSjdac19fUjkxWnQ2cHVRVVJwRFdPVUo2SXk5cDU4In0sInhtc190Y2R0IjoxNTcxMzM0MDE4fQ.dlWyT4dGvkfNwReghg-Zt3gBsFMmOhKlWtA9UoEYywuyuLqdATPpqvTj8mVWVuVzX2FVK0TlIjCNhMYOSSoM2fM0ozGZgbBd4S2rz42aQlVMvi4aYwljjJr6FG4mc2o3s3YV3hRrStIyVkxpvSg4qDfQnZSe7SrGjbSPC_x52LTR-FUooovv_cFJbIFhaW21XAkzAnWflg36G3vqv5Oj_IYwwrKsRMJSqXGhJ_Qw6vXOJExGYW3bTJHCoqqAyG8G9u0oPbsitZM4b1auIs8nc0pNSrS2yPs7UWSxv_pp64-janFDWB5XwT-HUyd5KCUj0R5NNAEq_476Hs6LYW9d_Q"
    // Función para obtener los eventos desde el backend
    // Extraer datos del usuario desde el token
    const getUserFromToken = (accessToken) => {
        try {
            const decoded = jwtDecode(accessToken);
            return {
                admin_id: decoded.oid, // ID único del usuario (puede variar según el token)
                title: decoded.name, // Nombre del usuario
                email: decoded.upn, // Correo del usuario
                color: "#ab2d2d", // Color predeterminado
            };
        } catch (error) {
            console.error("Error decodificando token:", error);
            return null;
        }
    };

    // Obtener eventos desde la API
    const fetchEvents = async () => {
        try {
            const response = await axios.get("https://crm.constecoin.com/apicrm/calendar/events", {
                headers: {
                    Authorization: `${accessToken}`
                }
            });

            const data = response.data.value; // Ajusta según la estructura real de la API

            const formattedEvents = data.map(activity => ({
                event_id: activity.id,
                title: activity.subject,
                start: moment.utc(activity.start.dateTime).tz("America/Guayaquil").toDate(),
                end: moment.utc(activity.end.dateTime).tz("America/Guayaquil").toDate(),
                admin_id: activity.organizer?.emailAddress?.address, // Organizador del evento
                attendees: activity.attendees ? activity.attendees.map(a => a.emailAddress.address) : [], // Lista de asistentes
                color: "#00bcd4",
                editable: true,
                deletable: true,
                draggable: true
            }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error obteniendo eventos:", error);
        }
    };

    useEffect(() => {
        const user = getUserFromToken(accessToken);
        if (user) {
            setResources([user]); // Establecer el usuario actual como recurso
        }
        fetchEvents();
    }, []);

    // Función para abrir el modal de agregar o editar evento
    const openModal = (value) => {
        setDate(value);
        setModalIsOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setModalIsOpen(false);
        setForm({ title: "", startTime: "", endTime: "" });
    };

    // Función para manejar el cambio de los inputs en el formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Función para guardar la actividad
    const saveActivity = () => {
        if (!form.title || !form.startTime || !form.endTime) return;
        const newEvent = {
            event_id: events.length + 1, // Solo un ejemplo, lo ideal sería que tu backend genere el ID
            title: form.title,
            start: formatDate(startTime),
            end: formatDate(endTime),
            color: "#00bcd4", // Color predeterminado
            draggable: true,
            editable: true,
            deletable: true,
            allDay: false,
        };

        // Añadir el nuevo evento a los eventos existentes
        setEvents([...events, newEvent]);
        closeModal();
    };

    return (
        <div className="calendar-container">
            <h1>Calendario de Actividades</h1>

            {/* Componente Scheduler */}
            <Scheduler
                events={events}          // Pasamos los eventos obtenidos
                resources={RESOURCES}    // Pasamos los recursos (pueden ser los usuarios asignados)
                onDateChange={openModal}  // Abrir modal al cambiar de fecha
                editable={true}          // Permite editar eventos
                deletable={true}         // Permite eliminar eventos
                draggable={true}         // Permite arrastrar eventos
            />

            {/* Modal para agregar actividades */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
                <h2>Agregar Actividad</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={form.title}
                    onChange={handleChange}
                />
                <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                />
                <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                />
                <button onClick={saveActivity}>Guardar</button>
                <button onClick={closeModal} className="cancel">Cancelar</button>
            </Modal>

            <div className="activities">
                <h2>Actividades Guardadas</h2>
                {events.map((event, index) => (
                    <div key={index}>
                        <h3>{event.title}</h3>
                        <p>
                            <strong>Hora:</strong> {moment(event.start).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm")} -
                            {moment(event.end).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm")}
                        </p>
                        <p><strong>Organizador:</strong> {event.admin_id}</p>
                        <p><strong>Asistentes:</strong> {event.attendees.length > 0 ? event.attendees.join(", ") : "Ninguno"}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default CalendarPage;
