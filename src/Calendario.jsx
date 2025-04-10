import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scheduler } from '@aldabil/react-scheduler';
import Modal from 'react-modal';
import { jwtDecode } from 'jwt-decode';
import { RESOURCES } from './events'; // Puedes adaptarlo según sea necesario
import './Calendario.css';
import axios from 'axios';
import moment from 'moment-timezone';

const Calendario = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', startTime: '', endTime: '' });

  // Manejar token desde URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      console.log('Token guardado:', accessToken);
      navigate('/calendario', { replace: true }); // Redirige limpiando la URL
    }
  }, [navigate]);

  // Obtener token desde localStorage
  const accessToken = localStorage.getItem('accessToken');

  const getUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        admin_id: decoded.oid,
        title: decoded.name,
        email: decoded.upn,
        color: '#ab2d2d',
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://crm.constecoin.com/apicrm/calendar/events', {
        headers: { Authorization: `${accessToken}` },
      });

      const data = response.data.value;
      const formatted = data.map((activity) => ({
        event_id: activity.id,
        title: activity.subject,
        start: moment.utc(activity.start.dateTime).tz('America/Guayaquil').toDate(),
        end: moment.utc(activity.end.dateTime).tz('America/Guayaquil').toDate(),
        admin_id: activity.organizer?.emailAddress?.address,
        attendees: activity.attendees?.map(a => a.emailAddress.address) || [],
        color: '#00bcd4',
        editable: true,
        deletable: true,
        draggable: true,
      }));

      setEvents(formatted);
    } catch (error) {
      console.error('Error obteniendo eventos:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      const user = getUserFromToken(accessToken);
      if (user) setResources([user]);
      fetchEvents();
    } else {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const openModal = (value) => {
    setDate(value);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setForm({ title: '', startTime: '', endTime: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveActivity = () => {
    if (!form.title || !form.startTime || !form.endTime) return;

    const startDate = new Date(date);
    const endDate = new Date(date);
    const [startH, startM] = form.startTime.split(':');
    const [endH, endM] = form.endTime.split(':');
    startDate.setHours(startH, startM);
    endDate.setHours(endH, endM);

    const newEvent = {
      event_id: events.length + 1,
      title: form.title,
      start: startDate,
      end: endDate,
      color: '#00bcd4',
      draggable: true,
      editable: true,
      deletable: true,
      allDay: false,
    };

    setEvents([...events, newEvent]);
    closeModal();
  };

  return (
    <div className="calendar-container">
      <h1>Calendario de Actividades</h1>

      <Scheduler
        events={events}
        resources={resources}
        onDateChange={openModal}
        editable
        deletable
        draggable
      />

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
              <strong>Hora:</strong> {moment(event.start).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm')} - 
              {moment(event.end).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm')}
            </p>
            <p><strong>Organizador:</strong> {event.admin_id}</p>
            <p><strong>Asistentes:</strong> {event.attendees?.join(', ') || 'Ninguno'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;