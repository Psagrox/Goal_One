import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = ({ occupiedDates }) => {
  const events = occupiedDates.map(date => ({
    title: 'Ocupado',
    start: new Date(date),
    end: new Date(date),
    allDay: true,
  }));

  return (
    <div className="availability-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default AvailabilityCalendar;