import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../Redux/calendarActions';
import '../Assets/Css/Calendar.css';

// Function to get the day of the week, we going to use to in order to have right name of the days
const getFirstDayOfWeek = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
};

// Function to generate an array of day names starting with the first day of the week
const generateOrderedDayNames = (firstDayOfWeek) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];
};
// Function to abbreviate day names (typically we will use them for mobile view..)
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
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Function to render events for a specific date
  const renderEvents = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const dateEvents = events[dateKey] || [];
    return dateEvents.map((event, index) => (
      <div
        key={index}
        className="event"
        onClick={(e) => {
          const clickedEvent = dateEvents[index];
          setSelectedDateEvents([clickedEvent]);
          const dateCell = e.currentTarget.getBoundingClientRect();
          setPopupPosition({
            bottom: dateCell.bottom + 10,
            left: dateCell.left,
          });
          setPopUpOpen(true);
        }}
      >
        <div className="event-title">{event.title}</div>
        <div className="event-time">{event.time}</div>
      </div>
    ));
  };

  // Function to render a single date cell
  const renderDateCell = (date) => {
    const isCurrentDay =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
    // Debugging the event day
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() + 1);
  
    return (
      <div
        key={date.toISOString()}
        className={`date-cell ${isCurrentDay ? 'current-day' : ''}`}
      >
        <div className="date">{date.getDate()}</div>
        {/* Rendering 1 day backwards to have the correct dates of the events :/ */}
        {renderEvents(previousDay)}
      </div>
    );
  };

  // Function to render the entire month
  const renderMonth = () => {
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const weeks = [];
    let currentDay = new Date(firstDayOfMonth);
    // Fulfill the days in the calendar
    while (currentDay <= lastDayOfMonth) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateToRender = new Date(currentDay);
        const dateKey = dateToRender.toISOString().split('T')[0];
        const hasEvents = events[dateKey] && events[dateKey].length > 0;
        // To be calendar for only 1 month we will use only the days within it.
        // Check if the day is within the current month
        if (dateToRender.getMonth() === currentDate.getMonth()) {
          week.push(renderDateCell(dateToRender, hasEvents));
        } else {
          // If the day is outside the current month, render an empty cell
          week.push(
            <div
              key={dateToRender.toISOString()}
              className="date-cell empty-cell"
            >
            </div>
          );
        }

        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(
        <div key={currentDay.toISOString()} className="week">
          {week}
        </div>
      );
    }
    return weeks;
  };

  return (
    <div className="calendar">
      <h1>Strypes Calendar</h1>
      <div className="header">
        {/* To get the correct month/year! */}
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </div>
      <div className="days-of-week">
        {orderedDayNames.map((dayName) => (
          <div key={dayName} data-abbreviated-name={abbreviateDayName(dayName)}>
            {dayName}
          </div>
        ))}
      </div>

      {renderMonth()}
      {isPopUpOpen && (
        
        <div className="popup" style={{ top: popupPosition.bottom, left: popupPosition.left - 50 }}>
          <div className="triangle-up"></div>
          <div className="popup-content">
            <button className="popup-close-button" onClick={() => setPopUpOpen(false)}>
             X
            </button>
            {selectedDateEvents.map((event, index) => (
              <div key={index} className="event-detail">
                <h4>{event.title}</h4>
                <p>Time: {event.time}</p>
                <div className="event-description">{event.description}</div>
              </div>
            ))}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;