import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = ({ occupiedDates, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Convertir fechas ocupadas a eventos
  const occupiedEvents = occupiedDates.map(date => ({
    title: 'Ocupado',
    start: new Date(date),
    end: new Date(date),
    allDay: true,
    type: 'occupied',
  }));

  // Convertir fecha seleccionada a evento
  const selectedEvent = selectedDate ? [{
    title: 'Seleccionado',
    start: selectedDate,
    end: selectedDate,
    allDay: true,
    type: 'selected',
  }] : [];

  const allEvents = [...occupiedEvents, ...selectedEvent];

  // Manejar selección de fechas
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).startOf('day');
    const isOccupied = occupiedDates.some(date => moment(date).isSame(selectedDate, 'day'));

    if (!isOccupied) {
      setSelectedDate(selectedDate.toDate());
      onDateSelect(selectedDate.toDate()); // Notificar al padre con la fecha seleccionada
    } else {
      alert('Esta fecha no está disponible.');
    }
  };

  // Aplicar estilos a eventos
  const eventStyleGetter = (event) => {
    let style = {
      borderRadius: '10px',
      color: 'black',
      border: '1px solid',
      textAlign: 'center',
      padding: '5px',
    };

    if (event.type === 'occupied') {
      style.backgroundColor = '#ffcccc';
      style.borderColor = '#ff0000';
    } else if (event.type === 'selected') {
      style.backgroundColor = '#ccffcc';
      style.borderColor = '#00aa00';
    }

    return { style };
  };

  return (
    <div className="availability-calendar">
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: 500 }}
        selectable
        popup
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter} // Aplicar estilos a eventos
      />

      {/* Mostrar la fecha seleccionada */}
      <div style={{ marginTop: 20 }}>
        <h3>Fecha seleccionada:</h3>
        {selectedDate && <p>{moment(selectedDate).format('DD/MM/YYYY')}</p>}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;