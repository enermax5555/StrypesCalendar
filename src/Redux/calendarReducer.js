import { FETCH_EVENTS } from './calendarActions';

const initialState = {
  events: {},
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EVENTS:
      return {
        ...state,
        events: action.payload,
      };
    default:
      return state;
  }
};

export default calendarReducer;