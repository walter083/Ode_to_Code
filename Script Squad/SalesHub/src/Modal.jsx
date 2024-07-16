import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Make sure this path is correct
import "./Modal.css"

const Modal = ({ show, onClose, selectedDate, onSubmit, selectedRole, availableSlots }) => {
  const [appointment, setAppointment] = useState({
    role: selectedRole,
    date: selectedDate,
    time: '',
    employeeName: '',
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      setAppointment((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    setAppointment((prev) => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, 'Employee-Details');
      const querySnapshot = await getDocs(employeesRef);
      const employeeList = querySnapshot.docs.map(doc => doc.data().Employee_Name);
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add appointment to Firebase
    try {
      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, {
        ...appointment,
        date: appointment.date
      });
      alert('Appointment scheduled successfully.');
      onSubmit(appointment);
      onClose();
    } catch (error) {
      console.error("Error adding appointment: ", error);
      alert('An error occurred while scheduling the appointment.');
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h3>{selectedDate ? selectedDate.toDateString() : ''}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Role:
            <input type="text" value={selectedRole} readOnly />
          </label>
          <label>
            Date: 
            <input type="text" value={selectedDate ? selectedDate.toDateString() : ''} readOnly />
          </label>
          <label>
            Time:
            <select name="time" value={appointment.time} onChange={handleChange} required>
              <option value="">Select a time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </label>
          <label>
            Employee:
            <select name="employeeName" value={appointment.employeeName} onChange={handleChange} required>
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>{employee}</option>
              ))}
            </select>
          </label>
          <button type="submit">Schedule Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;