import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../Redux/calendarActions';
import '../Assets/Css/Calendar.css';

// Function to get the day of the week (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfWeek = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  };
  
  // Function to generate an array of day names starting with the first day of the week
  const generateOrderedDayNames = (firstDayOfWeek) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];
  };
// Function to abbreviate day names
const abbreviateDayName = (fullDayName) => {
    const abbreviatedNames = {
      Sunday: 'Sun',
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
    };
  
    return abbreviatedNames[fullDayName] || fullDayName;
  };

const Calendar = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayOfWeek = getFirstDayOfWeek(firstDayOfMonth);
    const orderedDayNames = generateOrderedDayNames(firstDayOfWeek);
    const dispatch = useDispatch();
    const events = useSelector((state) => state.calendar.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Function to render events for a specific date
  const renderEvents = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const dateEvents = events[dateKey] || [];

    return dateEvents.map((event, index) => (
      <div key={index} className="event">
        <div className="event-title">{event.title}</div>
        <div className="event-time">{event.time}</div>
      </div>
    ));
  };

  // Function to render a single date cell
  const renderDateCell = (date) => {
    const currentDate = new Date();
    const isCurrentDay =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
  
    return (
      <div
        key={date.toISOString()}
        className={`date-cell ${isCurrentDay ? 'current-day' : ''}`}
      >
        <div className="date">{date.getDate()}</div>
        {renderEvents(date)}
      </div>
    );
  };  

  // Function to render the entire month
  const renderMonth = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const weeks = [];
  
    let currentDay = new Date(firstDayOfMonth);
  
    while (currentDay <= lastDayOfMonth) {
      const week = [];
  
      for (let i = 0; i < 7; i++) {
        if (currentDay <= lastDayOfMonth) {
          const dateKey = currentDay.toISOString().split('T')[0];
          const hasEvents = events[dateKey] && events[dateKey].length > 0;
          week.push(renderDateCell(currentDay, hasEvents));
          currentDay.setDate(currentDay.getDate() + 1);
        } else {
          // If we've reached the end of the month, push empty date cells
          week.push(<div key={`empty-${i}`} className="date-cell empty"></div>);
        }
      }
  
      weeks.push(
        <div key={currentDay.toISOString()} className="week">
          {week}
        </div>
      );
    }
  
    return weeks;
  };

  // State to manage the selected week's event details
  const [selectedWeekEvents, setSelectedWeekEvents] = useState([]); 

  return (
    <div className="calendar">
        <h1>Strypes Calendar</h1>
      <div className="header">  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
     <div className="days-of-week">
        {orderedDayNames.map((dayName) => (
         <div key={dayName} data-abbreviated-name={abbreviateDayName(dayName)}>
         {dayName}
       </div>
        ))}
      </div>
      {renderMonth()}
      <div className="event-details">
        {selectedWeekEvents.map((event, index) => (
          <div key={index} className="event-detail">
            <div className="event-title">{event.title}</div>
            <div className="event-time">{event.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;