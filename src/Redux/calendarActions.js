export const FETCH_EVENTS = 'FETCH_EVENTS';

export const fetchEvents = () => ({
  type: FETCH_EVENTS,
  payload: require('../Events/events.json'),
});