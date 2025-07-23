import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { Main } from './pages/Main';
import { Alarm } from './pages/Alarm';
import { AppContextProvider } from './contexts/AppContextProvider';

export default function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/alarm" element={<Alarm />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}
