
import './App.css';
import { Provider } from 'react-redux';
import calendarStore from './Redux/calendarStore';
import Calendar from './Components/calendar';
function App() {
  return (
    <Provider store={calendarStore}>
    <Calendar />  
  </Provider>
  );
}

export default App;
