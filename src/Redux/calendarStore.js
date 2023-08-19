import { createStore, combineReducers } from 'redux';
import calendarReducer from './calendarReducer';

const rootReducer = combineReducers({
  calendar: calendarReducer,
});

const store = createStore(rootReducer);

export default store;