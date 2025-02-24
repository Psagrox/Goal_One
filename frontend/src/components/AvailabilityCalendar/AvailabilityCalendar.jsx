import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = ({ occupiedDates, onDateSelect }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  // Convertir fechas ocupadas a formato de evento
  const events = occupiedDates.map(date => ({
    title: 'Ocupado',
    start: new Date(date),
    end: new Date(date),
    allDay: true,
  }));

  // Manejar la selección de fechas
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.start;
    const isOccupied = occupiedDates.some(date => moment(date).isSame(selectedDate, 'day'));

    if (!isOccupied) {
      const newSelectedDates = [...selectedDates, selectedDate];
      setSelectedDates(newSelectedDates);
      onDateSelect(newSelectedDates); // Notificar al componente padre
    } else {
      alert('Esta fecha no está disponible.');
    }
  };

  return (
    <div className="availability-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: 500 }}
        selectable={true} // Permitir selección de fechas
        onSelectSlot={handleSelectSlot} // Manejar la selección de fechas
      />
    </div>
  );
};

export default AvailabilityCalendar;