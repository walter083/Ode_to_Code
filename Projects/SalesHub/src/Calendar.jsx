import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { BsCalendarX } from 'react-icons/bs';
import Modal from './Modal';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Make sure this path is correct
import "./Calendar.css";
import ChatBot from './ChatBot';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showYearInput, setShowYearInput] = useState(false);
  const [yearInput, setYearInput] = useState(currentDate.getFullYear().toString());
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (selectedRole) {
      fetchAppointments(selectedRole);
    }
  }, [selectedRole]);

  const fetchAppointments = async (role) => {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('role', '==', role));
    const querySnapshot = await getDocs(q);
    const fetchedAppointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
    setEvents(fetchedAppointments);
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getAvailableSlots = (date) => {
    const dayEvents = events.filter((event) => event.date.toDateString() === date.toDateString());
    const slots = [];
    for (let hour = 10; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!dayEvents.some(event => event.time === slotTime)) {
          slots.push(slotTime);
        }
      }
    }
    return slots;
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter((event) => event.date.toDateString() === date.toDateString());

      days.push(
        <div
          key={day}
          className={`calendar-day ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''} ${isToday(date) ? 'today' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            const slots = getAvailableSlots(date);
            setAvailableSlots(slots);
            if (slots.length > 0) {
              setShowModal(true);
            } else {
              alert('No available slots for this day.');
            }
          }}
        >
          <span>{day}</span>
          {dayEvents.length > 0 && <div className="event-dot"></div>}
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearClick = () => {
    setShowYearInput(true);
  };

  const handleYearChange = (e) => {
    setYearInput(e.target.value);
  };

  const handleYearSubmit = (e) => { 
    e.preventDefault();
    const year = parseInt(yearInput, 10);
    if (!isNaN(year) && year >= 1 && year <= 9999) {
      setCurrentDate(new Date(year, currentDate.getMonth(), 1));
      setShowYearInput(false);
    } else {
      setYearInput(currentDate.getFullYear().toString());
    }
  };

  const handleAppointmentSubmit = (appointment) => {
    const newAppointment = {
      id: Date.now(),
      date: appointment.date,
      title: 'Scheduled Appointment',
      description: `Appointment with ${selectedRole}`,
      time: appointment.time,
      role: selectedRole,
      employeeName: appointment.employeeName,
    };
    setEvents([...events, newAppointment]);
    setShowModal(false);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const renderSidebarEvents = () => {
    const selectedDateEvents = events.filter(
      (event) => selectedDate && event.date.toDateString() === selectedDate.toDateString()
    );

    if (selectedDateEvents.length === 0) {
      return (
        <div className="no-events">
          <BsCalendarX size={48} />
          <p>No events on this day</p>
        </div>
      );
    }

    return (
      <div className='sidebar-container'>
        <h3>{selectedDate ? selectedDate.toDateString() : 'Select a date'}</h3>
        {selectedDateEvents.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event) => (
          <div key={event.id} className="sidebar-event">
            <h3>{event.title}</h3>
            <p>Time: {event.time}</p>
            <p>Role: {event.role}</p>
            <p>Employee: {event.employeeName}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <div className="role-selector">
          <select value={selectedRole} onChange={handleRoleChange}>
            <option value="">Select Role</option>
            <option value="CEO">CEO</option>
            <option value="CTO">CTO</option>
            <option value="MD">MD</option>
          </select>
        </div>
        <div className="calendar-main">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}><FaChevronLeft /></button>
            {showYearInput ? (
              <form onSubmit={handleYearSubmit}>
                <input
                  type="number"
                  className="year-input"
                  value={yearInput}
                  onChange={handleYearChange}
                  onBlur={() => setShowYearInput(false)}
                  autoFocus
                />
              </form>
            ) : (
              <h2 onClick={handleYearClick}>
                <FaCalendarAlt /> {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
            )}
            <button onClick={handleNextMonth}><FaChevronRight /></button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-day-header">Su</div>
            <div className="calendar-day-header">Mo</div>
            <div className="calendar-day-header">Tu</div>
            <div className="calendar-day-header">We</div>
            <div className="calendar-day-header">Th</div>
            <div className="calendar-day-header">Fr</div>
            <div className="calendar-day-header">Sa</div>
            {renderCalendar()}
          </div>
        </div>
        <div className="calendar-sidebar">
          {renderSidebarEvents()}
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedDate={selectedDate}
        onSubmit={handleAppointmentSubmit}
        selectedRole={selectedRole}
        availableSlots={availableSlots}
      />
      <ChatBot/>
    </div>
  );
};

export default Calendar;
