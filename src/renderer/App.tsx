import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { Main } from './pages/Main';
import { Alarm } from './pages/Alarm';
import { AppContextProvider } from './contexts/AppContextProvider';
import { ModalsManager } from './components/ModalsManager';
import { ModalsContextProvider } from './contexts/ModalsContextProvider';

export default function App() {
  return (
    <AppContextProvider>
      <ModalsContextProvider>
        <ModalsManager />
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/alarm" element={<Alarm />} />
          </Routes>
        </Router>
      </ModalsContextProvider>
    </AppContextProvider>
  );
}
